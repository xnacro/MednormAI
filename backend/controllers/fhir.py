"""
MedNorm AI — FHIR Controller
==============================
Endpoints for HL7 FHIR R4 bundle generation and retrieval.

Endpoints:
  POST /api/fhir               → Generate FHIR R4 bundle from structured data
  GET  /api/notes/{id}/fhir    → Retrieve pre-generated FHIR bundle for a record
"""

from fastapi import APIRouter, HTTPException

from backend.services.field_mapper import FieldMapper
from backend.models import FHIRRequest
from backend.store import records_store

router = APIRouter(prefix="/api", tags=["FHIR"])
field_mapper = FieldMapper()


@router.post(
    "/fhir",
    summary="Generate FHIR R4 bundle",
    response_description="HL7 FHIR R4 Bundle JSON",
)
async def generate_fhir(req: FHIRRequest):
    """
    Generate a complete HL7 FHIR R4 Bundle from structured clinical data.

    The bundle includes the following FHIR resources:
    - **Patient** — demographics, UHID identifier
    - **Encounter** — AMB (ambulatory) or IMP (inpatient) class
    - **Condition** — per diagnosis, coded with ICD-10-CM
    - **MedicationRequest** — per medication, coded with RxNorm CUI
    - **Observation** — per lab value, coded with LOINC (H/L/N interpretation)
    - **Procedure** — per procedure, coded with CPT

    Pass the output of `/api/process` as `structured_data`.
    """
    try:
        bundle = field_mapper.to_fhir(req.structured_data)
        return {"status": "ok", "bundle": bundle}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get(
    "/notes/{record_id}/fhir",
    summary="Get pre-generated FHIR bundle for a record",
    response_description="HL7 FHIR R4 Bundle JSON",
)
def get_fhir_for_record(record_id: str):
    """
    Retrieve the pre-generated FHIR R4 bundle stored with a specific record.
    The bundle was generated automatically during the pipeline run.
    """
    if record_id not in records_store:
        raise HTTPException(status_code=404, detail="Record not found")
    rec = records_store[record_id]
    if not rec.get("fhir"):
        raise HTTPException(status_code=404, detail="FHIR bundle not generated for this record")
    return {"status": "ok", "bundle": rec["fhir"]}
