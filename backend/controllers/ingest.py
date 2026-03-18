"""
MedNorm AI — Ingest Controller
================================
Raw document ingestion endpoint — extracts text from a document without NLP processing.
Useful for previewing raw text before running the full pipeline.

Endpoints:
  POST /api/ingest   → Upload a document and receive raw extracted text
"""

from fastapi import APIRouter, UploadFile, File, HTTPException
import time
import logging

from backend.services.pdf_parser import PDFParser

router = APIRouter(prefix="/api", tags=["Ingest"])
logger = logging.getLogger(__name__)
pdf_parser = PDFParser()


@router.post(
    "/ingest",
    summary="Ingest and parse a document",
    response_description="Raw extracted text, page count, and parse metadata",
)
async def ingest_document(file: UploadFile = File(...)):
    """
    Upload a document (PDF, image, or text file) and extract its raw text.

    **Supported formats:**
    - `.pdf` — Native PDF text extraction via pdfplumber (fallback: pypdf)
    - `.png`, `.jpg`, `.jpeg`, `.tiff`, `.bmp` — OCR via pytesseract (eng+hin)
    - `.txt` — Plain text with multi-encoding support

    Returns the raw extracted text. To run the full NLP pipeline,
    use `/api/pipeline` instead.
    """
    try:
        content = await file.read()
        filename = file.filename or "document"
        content_type = file.content_type or "application/octet-stream"

        start = time.time()
        parsed = pdf_parser.parse(content, filename, content_type)
        elapsed = round(time.time() - start, 3)

        return {
            "status": "ok",
            "filename": filename,
            "pages": parsed.get("pages", 1),
            "text_length": len(parsed.get("text", "")),
            "parser_used": parsed.get("metadata", {}).get("parser", "unknown"),
            "raw_text": parsed.get("text", ""),
            "parse_time_s": elapsed,
        }
    except Exception as e:
        logger.error("Ingest error for %s: %s", file.filename, e, exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))
