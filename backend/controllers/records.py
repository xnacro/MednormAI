"""
MedNorm AI — Records Controller
==================================
CRUD endpoints for clinical records stored in the in-memory record store.

Endpoints:
  GET    /api/notes               → List all records (with optional filter + search)
  GET    /api/notes/{id}          → Get a specific record
  DELETE /api/notes/{id}          → Delete a record
"""

from fastapi import APIRouter, HTTPException

from backend.store import records_store

router = APIRouter(prefix="/api", tags=["Records"])


@router.get(
    "/notes",
    summary="List all clinical records",
    response_description="Paginated list of records with optional filtering",
)
def list_records(
    doc_type: str = None,
    search: str = None,
    limit: int = 50,
    offset: int = 0,
):
    """
    List all processed clinical records.

    **Query Parameters:**
    - `doc_type`: Filter by document type (`lab_report` | `hospital_bill` | `discharge_summary`)
    - `search`: Full-text search across title and patient name
    - `limit`: Max records to return (default: 50)
    - `offset`: Pagination offset (default: 0)
    """
    records = list(records_store.values())

    if doc_type:
        records = [r for r in records if r.get("type") == doc_type]
    if search:
        q = search.lower()
        records = [
            r for r in records
            if q in r.get("title", "").lower()
            or q in (r.get("patient", {}).get("name", "") or "").lower()
        ]

    total = len(records)
    records = records[offset: offset + limit]
    return {"total": total, "records": records, "limit": limit, "offset": offset}


@router.get(
    "/notes/{record_id}",
    summary="Get a specific clinical record",
    response_description="Full record with extracted data, billing, and FHIR bundle",
)
def get_record(record_id: str):
    """
    Retrieve a complete clinical record by ID.

    Returns all extracted data:
    - Patient demographics
    - Diagnoses (ICD-10-CM)
    - Medications (RxNorm)
    - Lab values (LOINC)
    - Procedures (CPT)
    - Billing line items
    - FHIR R4 bundle
    """
    if record_id not in records_store:
        raise HTTPException(status_code=404, detail="Record not found")
    return records_store[record_id]


@router.delete(
    "/notes/{record_id}",
    summary="Delete a clinical record",
    response_description="Deletion confirmation",
)
def delete_record(record_id: str):
    """Delete a clinical record from the store by ID."""
    if record_id not in records_store:
        raise HTTPException(status_code=404, detail="Record not found")
    del records_store[record_id]
    return {"status": "ok", "deleted": record_id}
