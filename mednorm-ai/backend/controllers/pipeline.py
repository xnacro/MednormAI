"""
MedNorm AI — Pipeline Controller
===================================
Core document processing pipeline endpoints.

Endpoints:
  POST /api/process            → Run Clinical NLP on raw text (no file upload)
  POST /api/pipeline           → Full end-to-end: upload file → parse → NLP → FHIR → store
  POST /api/demo/{id}/process  → Trigger processing of a pre-loaded demo case (1, 2, or 3)

The /api/pipeline endpoint is the primary entry point for document processing.
It runs the full 5-stage pipeline and returns a persisted record with all extracted data.
"""

from fastapi import APIRouter, UploadFile, File, HTTPException
import time
import logging

from backend.services.pdf_parser import PDFParser
from backend.services.clinical_nlp import ClinicalNLP
from backend.services.field_mapper import FieldMapper
from backend.models import ProcessRequest, ProcessResponse
from backend.store import records_store

router = APIRouter(prefix="/api", tags=["Pipeline"])
logger = logging.getLogger(__name__)


pdf_parser = PDFParser()
clinical_nlp = ClinicalNLP()
field_mapper = FieldMapper()


def _infer_doc_type(text: str, filename: str) -> str:
    text_lower = text.lower()
    if any(k in text_lower for k in ["lab report", "pathology", "haemoglobin", "glucose", "lft", "cbc"]):
        return "lab_report"
    if any(k in text_lower for k in ["bill", "invoice", "charges", "amount due", "itemized"]):
        return "hospital_bill"
    if any(k in text_lower for k in ["discharge", "admitted", "discharged on", "final diagnosis"]):
        return "discharge_summary"
    return "unknown"


@router.post("/process", response_model=ProcessResponse)
async def process_document(req: ProcessRequest):
    try:
        start = time.time()
        entities = clinical_nlp.extract(req.text, req.document_type)
        structured = field_mapper.map(entities, req.document_type)
        structured["processing_time_s"] = round(time.time() - start, 3)
        return ProcessResponse(**structured)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/pipeline")
async def full_pipeline(file: UploadFile = File(...)):
    try:
        content = await file.read()
        filename = file.filename or "document"
        content_type = file.content_type or "application/octet-stream"
        start = time.time()

        parsed = pdf_parser.parse(content, filename, content_type)
        text = parsed.get("text", "")

        doc_type = _infer_doc_type(text, filename)
        entities = clinical_nlp.extract(text, doc_type)
        structured = field_mapper.map(entities, doc_type)
        fhir_bundle = field_mapper.to_fhir(structured)

        record_id = f"rec_{int(time.time())}"
        confidence_raw = structured.get("confidence", 0.8)
        confidence_pct = round(confidence_raw * 100, 1) if confidence_raw <= 1.0 else round(confidence_raw, 1)
        billing_raw = structured.get("billing", {})

        record = {
            "id": record_id,
            "title": filename,
            "type": doc_type,
            "status": "done",
            "confidence": confidence_pct,
            "processing_time_s": round(time.time() - start, 2),
            "processingTime": f"{round(time.time() - start, 1)}s",
            "raw_text": text,
            "patient": structured.get("patient") or {},
            "billing": {
                "totalCharges": billing_raw.get("total_charges", 0),
                "currency": billing_raw.get("currency", "INR"),
                "lineItems": [
                    {"cpt": item.get("code", ""), "description": item.get("description", ""), "amount": item.get("amount", 0)}
                    for item in billing_raw.get("line_items", [])
                ],
                "payerInfo": {
                    "name": billing_raw.get("payer_name") or "Not detected",
                    "policyNo": billing_raw.get("policy_number") or "—",
                    "preAuth": billing_raw.get("pre_auth") or "—",
                },
                "claimsStatus": billing_raw.get("claims_status", "ready"),
            },
            "extracted": {
                "diagnoses": structured.get("diagnoses", []),
                "procedures": structured.get("procedures", []),
                "medications": structured.get("medications", []),
                "lab_values": structured.get("lab_values", []),
                "labValues": structured.get("lab_values", []),
                "vitals": structured.get("vitals", []),
            },
            "fhir": fhir_bundle,
            "document": {
                "source": "Uploaded document",
                "date": structured.get("document_date") or "",
                "reportId": record_id,
                "type": doc_type.replace("_", " ").title(),
                "pages": parsed.get("pages", 1),
            },
        }
        records_store[record_id] = record
        return {"status": "ok", "record_id": record_id, **record}

    except Exception as e:
        logger.error("Pipeline error for %s: %s", file.filename, e, exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/demo/{case_id}/process")
def process_demo_case(case_id: str):
    case_map = {"1": "rec_001", "2": "rec_002", "3": "rec_003"}
    record_id = case_map.get(case_id)
    if not record_id or record_id not in records_store:
        raise HTTPException(status_code=404, detail="Demo case not found")
    return {"status": "ok", "record": records_store[record_id]}
