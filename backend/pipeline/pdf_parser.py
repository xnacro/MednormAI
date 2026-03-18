import io
import re
import logging
from typing import Dict, Any

logger = logging.getLogger(__name__)


class PDFParser:
    """
    Multi-format document parser.
    Returns: { text: str, pages: int, metadata: dict }
    """

    def parse(self, content: bytes, filename: str, content_type: str) -> Dict[str, Any]:
        ext = filename.lower().rsplit(".", 1)[-1] if "." in filename else ""
        ct = content_type.lower()

        if ct == "application/pdf" or ext == "pdf":
            return self._parse_pdf(content)
        elif ct.startswith("image/") or ext in ("png", "jpg", "jpeg", "tiff", "tif", "bmp"):
            return self._parse_image(content)
        elif ct == "text/plain" or ext == "txt":
            return self._parse_text(content)
        else:
            # Best-effort: try PDF, fall back to text
            try:
                return self._parse_pdf(content)
            except Exception:
                return self._parse_text(content)

    def _parse_pdf(self, content: bytes) -> Dict[str, Any]:
        try:
            import pdfplumber
        except ImportError:
            logger.warning("pdfplumber not installed — trying pypdf directly")
            fallback = self._parse_pdf_pypdf(content)
            if fallback:
                return fallback
            return {
                "text": "[PDF parser not available — install pdfplumber]",
                "pages": 0,
                "metadata": {"parser": "unavailable"},
            }

        try:
            text_pages = []
            with pdfplumber.open(io.BytesIO(content)) as pdf:
                for page in pdf.pages:
                    page_text = page.extract_text() or ""
                    table_text = self._extract_tables(page)
                    combined = page_text
                    if table_text:
                        combined += "\n" + table_text
                    text_pages.append(combined)

            full_text = "\n\n".join(text_pages)

            # If pdfplumber returned no text at all, the PDF may be
            # scanned-image-only.  Fall back to OCR if available.
            if not full_text.strip():
                logger.info("pdfplumber returned no text — attempting pypdf fallback")
                pypdf_result = self._parse_pdf_pypdf(content)
                if pypdf_result:
                    return pypdf_result
                logger.info("pypdf also empty — attempting OCR fallback")
                ocr_result = self._ocr_pdf_pages(content)
                if ocr_result:
                    return ocr_result

            return {
                "text": self._clean_text(full_text),
                "pages": len(text_pages),
                "metadata": {"parser": "pdfplumber"},
            }
        except Exception as exc:
            logger.warning("pdfplumber failed: %s — trying pypdf fallback", exc)
            # Attempt pypdf as a secondary fallback
            fallback = self._parse_pdf_pypdf(content)
            if fallback:
                return fallback
            # Last resort: try to decode the raw bytes as text
            logger.warning("pypdf fallback also failed — trying raw text extraction")
            try:
                raw_text = self._decode_text(content)
                # Strip PDF binary headers and control chars for readable text
                import string
                printable = set(string.printable)
                cleaned = ''.join(c if c in printable else ' ' for c in raw_text)
                cleaned = self._clean_text(cleaned)
                if len(cleaned) > 50:
                    return {
                        "text": cleaned,
                        "pages": 1,
                        "metadata": {"parser": "raw-text-fallback"},
                    }
            except Exception:
                pass
            return {
                "text": f"[PDF parsing failed: {exc}]",
                "pages": 0,
                "metadata": {"parser": "pdfplumber", "error": str(exc)},
            }

    def _parse_pdf_pypdf(self, content: bytes) -> Dict[str, Any] | None:
        """Secondary PDF parser using pypdf (handles some PDFs that pdfplumber can't)."""
        try:
            from pypdf import PdfReader

            reader = PdfReader(io.BytesIO(content))
            text_pages = []
            for page in reader.pages:
                text_pages.append(page.extract_text() or "")

            full_text = "\n\n".join(text_pages)
            if full_text.strip():
                return {
                    "text": self._clean_text(full_text),
                    "pages": len(text_pages),
                    "metadata": {"parser": "pypdf"},
                }
        except Exception as exc:
            logger.debug("pypdf fallback also failed: %s", exc)
        return None

    def _ocr_pdf_pages(self, content: bytes) -> Dict[str, Any] | None:
        """OCR fallback for scanned PDFs (image-only pages)."""
        try:
            from PIL import Image
            import pytesseract
            import pdfplumber

            text_pages = []
            with pdfplumber.open(io.BytesIO(content)) as pdf:
                for page in pdf.pages:
                    pil_image = page.to_image(resolution=300).original
                    try:
                        page_text = pytesseract.image_to_string(pil_image, lang="eng+hin")
                    except Exception:
                        page_text = pytesseract.image_to_string(pil_image, lang="eng")
                    text_pages.append(page_text)

            full_text = "\n\n".join(text_pages)
            if full_text.strip():
                return {
                    "text": self._clean_text(full_text),
                    "pages": len(text_pages),
                    "metadata": {"parser": "pdfplumber+ocr"},
                }
        except Exception as exc:
            logger.debug("OCR fallback for PDF failed: %s", exc)
        return None

    def _extract_tables(self, page) -> str:
        """Convert PDF tables to pipe-separated text rows."""
        try:
            tables = page.extract_tables()
            rows = []
            for table in (tables or []):
                for row in (table or []):
                    cells = [str(c or "").strip() for c in row]
                    # Only include rows that have at least one non-empty cell
                    if any(cells):
                        rows.append(" | ".join(cells))
            return "\n".join(rows)
        except Exception:
            return ""

    def _parse_image(self, content: bytes) -> Dict[str, Any]:
        """OCR using pytesseract (Tesseract must be installed on system)."""
        try:
            from PIL import Image
            import pytesseract

            img = Image.open(io.BytesIO(content))

            # Use Hindi + English language models if available
            try:
                text = pytesseract.image_to_string(img, lang="eng+hin")
            except pytesseract.TesseractNotFoundError:
                raise RuntimeError(
                    "Tesseract is not installed. "
                    "Install it with: sudo apt install tesseract-ocr tesseract-ocr-hin  (Linux) "
                    "or: brew install tesseract  (macOS)"
                )
            except Exception:
                text = pytesseract.image_to_string(img, lang="eng")

            return {
                "text": self._clean_text(text),
                "pages": 1,
                "metadata": {"parser": "tesseract-ocr", "image_size": img.size},
            }
        except ImportError:
            return {
                "text": "[OCR not available — run: pip install pytesseract Pillow]",
                "pages": 1,
                "metadata": {"parser": "unavailable"},
            }

    def _parse_text(self, content: bytes) -> Dict[str, Any]:
        """Parse plain text with automatic encoding detection."""
        text = self._decode_text(content)
        return {
            "text": self._clean_text(text),
            "pages": 1,
            "metadata": {"parser": "plain-text"},
        }

    def _decode_text(self, content: bytes) -> str:
        """
        Auto-detect encoding: UTF-16 (BOM), UTF-8 (BOM or plain), then latin-1 fallback.
        Handles the common case of Windows-generated UTF-16 LE files.
        """
        # Check for UTF-16 BOM (LE: FF FE, BE: FE FF)
        if content[:2] in (b"\xff\xfe", b"\xfe\xff"):
            try:
                return content.decode("utf-16")
            except UnicodeDecodeError:
                pass

        # Check for UTF-8 BOM
        if content[:3] == b"\xef\xbb\xbf":
            try:
                return content.decode("utf-8-sig")
            except UnicodeDecodeError:
                pass

        # Standard UTF-8
        try:
            return content.decode("utf-8")
        except UnicodeDecodeError:
            pass

        # Detect UTF-16 without BOM (heuristic: lots of \x00 bytes in ASCII text)
        if len(content) > 10:
            null_ratio = content.count(b"\x00") / len(content)
            if null_ratio > 0.3:
                for enc in ("utf-16-le", "utf-16-be"):
                    try:
                        return content.decode(enc)
                    except UnicodeDecodeError:
                        continue

        # Final fallback
        return content.decode("latin-1", errors="ignore")

    def _clean_text(self, text: str) -> str:
        """Remove excessive whitespace while preserving line breaks."""
        text = re.sub(r"[ \t]+", " ", text)
        text = re.sub(r"\n{3,}", "\n\n", text)
        text = text.strip()
        return text
