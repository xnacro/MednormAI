"""
MedNorm AI — PDF & Document Parser
=====================================
Parses uploaded documents (PDF, image, plain text) into raw extracted text
for downstream Clinical NLP processing.

Parsing strategy (in order of preference):
  1. pdfplumber   — native PDF text + table extraction (best quality)
  2. pypdf         — fallback PDF reader (faster, less accurate on tables)
  3. pytesseract   — OCR fallback for scanned PDFs and image files (eng+hin)
  4. Raw text      — last-resort decoding with multi-encoding support

Handles all common Indian hospital document formats:
  - Native digital PDFs (most hospital systems)
  - Scanned printed reports (OPD slips, handwritten forms)
  - Image files (PNG, JPG, TIFF) of documents
  - Plain text exports
"""

import io
import re
import logging
from typing import Dict, Any

logger = logging.getLogger(__name__)



class PDFParser:
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
            try:
                return self._parse_pdf(content)
            except Exception:
                return self._parse_text(content)

    def _parse_pdf(self, content: bytes) -> Dict[str, Any]:
        try:
            import pdfplumber
        except ImportError:
            fallback = self._parse_pdf_pypdf(content)
            if fallback:
                return fallback
            return {"text": "[PDF parser not available]", "pages": 0, "metadata": {"parser": "unavailable"}}

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

            if not full_text.strip():
                pypdf_result = self._parse_pdf_pypdf(content)
                if pypdf_result:
                    return pypdf_result
                ocr_result = self._ocr_pdf_pages(content)
                if ocr_result:
                    return ocr_result

            return {"text": self._clean_text(full_text), "pages": len(text_pages), "metadata": {"parser": "pdfplumber"}}
        except Exception as exc:
            fallback = self._parse_pdf_pypdf(content)
            if fallback:
                return fallback
            try:
                raw_text = self._decode_text(content)
                import string
                printable = set(string.printable)
                cleaned = ''.join(c if c in printable else ' ' for c in raw_text)
                cleaned = self._clean_text(cleaned)
                if len(cleaned) > 50:
                    return {"text": cleaned, "pages": 1, "metadata": {"parser": "raw-text-fallback"}}
            except Exception:
                pass
            return {"text": f"[PDF parsing failed: {exc}]", "pages": 0, "metadata": {"parser": "pdfplumber", "error": str(exc)}}

    def _parse_pdf_pypdf(self, content: bytes) -> Dict[str, Any] | None:
        try:
            from pypdf import PdfReader
            reader = PdfReader(io.BytesIO(content))
            text_pages = [page.extract_text() or "" for page in reader.pages]
            full_text = "\n\n".join(text_pages)
            if full_text.strip():
                return {"text": self._clean_text(full_text), "pages": len(text_pages), "metadata": {"parser": "pypdf"}}
        except Exception:
            pass
        return None

    def _ocr_pdf_pages(self, content: bytes) -> Dict[str, Any] | None:
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
                return {"text": self._clean_text(full_text), "pages": len(text_pages), "metadata": {"parser": "pdfplumber+ocr"}}
        except Exception:
            pass
        return None

    def _extract_tables(self, page) -> str:
        try:
            tables = page.extract_tables()
            rows = []
            for table in (tables or []):
                for row in (table or []):
                    cells = [str(c or "").strip() for c in row]
                    if any(cells):
                        rows.append(" | ".join(cells))
            return "\n".join(rows)
        except Exception:
            return ""

    def _parse_image(self, content: bytes) -> Dict[str, Any]:
        try:
            from PIL import Image
            import pytesseract
            img = Image.open(io.BytesIO(content))
            try:
                text = pytesseract.image_to_string(img, lang="eng+hin")
            except pytesseract.TesseractNotFoundError:
                raise RuntimeError("Tesseract not installed")
            except Exception:
                text = pytesseract.image_to_string(img, lang="eng")
            return {"text": self._clean_text(text), "pages": 1, "metadata": {"parser": "tesseract-ocr"}}
        except ImportError:
            return {"text": "[OCR not available]", "pages": 1, "metadata": {"parser": "unavailable"}}

    def _parse_text(self, content: bytes) -> Dict[str, Any]:
        text = self._decode_text(content)
        return {"text": self._clean_text(text), "pages": 1, "metadata": {"parser": "plain-text"}}

    def _decode_text(self, content: bytes) -> str:
        if content[:2] in (b"\xff\xfe", b"\xfe\xff"):
            try:
                return content.decode("utf-16")
            except UnicodeDecodeError:
                pass
        if content[:3] == b"\xef\xbb\xbf":
            try:
                return content.decode("utf-8-sig")
            except UnicodeDecodeError:
                pass
        try:
            return content.decode("utf-8")
        except UnicodeDecodeError:
            pass
        if len(content) > 10:
            null_ratio = content.count(b"\x00") / len(content)
            if null_ratio > 0.3:
                for enc in ("utf-16-le", "utf-16-be"):
                    try:
                        return content.decode(enc)
                    except UnicodeDecodeError:
                        continue
        return content.decode("latin-1", errors="ignore")

    def _clean_text(self, text: str) -> str:
        text = re.sub(r"[ \t]+", " ", text)
        text = re.sub(r"\n{3,}", "\n\n", text)
        return text.strip()
