"""
MedNorm AI — Stats & Billing Controller
=========================================
Endpoints:
  GET  /api/stats                         → Dashboard statistics
  GET  /api/notes/{id}/billing            → Record billing + claims data
  POST /api/notes/{id}/submit-claim       → Mark a claim as submitted
"""

from fastapi import APIRouter, HTTPException

from backend.store import records_store

router = APIRouter(prefix="/api", tags=["Stats"])


@router.get(
    "/stats",
    summary="Dashboard statistics",
    response_description="Aggregated stats across all records",
)
def get_stats():
    """
    Returns aggregated statistics for the dashboard:
    - Total records processed
    - Average confidence score
    - Total billed amount (INR)
    - Breakdown by document type (lab_report, hospital_bill, discharge_summary)
    - Claims status summary (ready, submitted, approved, denied)
    """
    records = list(records_store.values())
    total_charges = sum(r.get("billing", {}).get("totalCharges", 0) for r in records)
    avg_confidence = (
        sum(r.get("confidence", 0) for r in records) / len(records) if records else 0
    )
    return {
        "total_records": len(records),
        "avg_confidence": round(avg_confidence, 2),
        "total_charges_inr": total_charges,
        "by_type": {
            t: len([r for r in records if r.get("type") == t])
            for t in ["lab_report", "hospital_bill", "discharge_summary"]
        },
        "claims_summary": {
            s: len([r for r in records if r.get("billing", {}).get("claimsStatus") == s])
            for s in ["ready", "submitted", "approved", "denied"]
        },
    }


@router.get(
    "/notes/{record_id}/billing",
    summary="Get billing data for a record",
    response_description="Billing line items, payer info, and claims status",
)
def get_billing(record_id: str):
    """
    Retrieve detailed billing and claims information for a specific record.
    Includes line items (CPT codes + amounts), payer/TPA info, and current claims status.
    """
    if record_id not in records_store:
        raise HTTPException(status_code=404, detail="Record not found")
    return {"record_id": record_id, "billing": records_store[record_id].get("billing", {})}


@router.post(
    "/notes/{record_id}/submit-claim",
    summary="Submit an insurance claim",
    response_description="Updated claims status",
)
def submit_claim(record_id: str):
    """
    Mark a clinical record's claim as submitted to the insurer/TPA.
    Updates the claimsStatus from 'ready' → 'submitted'.
    """
    if record_id not in records_store:
        raise HTTPException(status_code=404, detail="Record not found")
    records_store[record_id]["billing"]["claimsStatus"] = "submitted"
    return {"status": "ok", "claims_status": "submitted"}
