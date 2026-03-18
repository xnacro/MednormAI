"""
MedNorm AI — Pydantic v2 Data Models
=====================================
Defines all request/response schemas for the FastAPI API.

Models follow the HL7 FHIR R4 data conventions where applicable:
- DiagnosisCode    → system: ICD-10-CM
- ProcedureCode    → system: CPT
- MedicationCode   → system: RxNorm
- LabValue         → system: LOINC
"""

from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List, Dict, Any



class DiagnosisCode(BaseModel):
    """An ICD-10-CM coded diagnosis extracted from the document."""
    model_config = ConfigDict(json_schema_extra={
        "example": {
            "code": "E11.65", "system": "ICD-10-CM",
            "description": "Type 2 diabetes mellitus with hyperglycemia", "confidence": 0.96,
        }
    })
    code: str = Field(..., description="ICD-10-CM code")
    system: str = Field(default="ICD-10-CM")
    description: str
    confidence: float = Field(ge=0.0, le=1.0)


class ProcedureCode(BaseModel):
    """A CPT-coded clinical procedure."""
    model_config = ConfigDict(json_schema_extra={
        "example": {"code": "27447", "system": "CPT", "description": "Total Knee Arthroplasty", "amount": 85000.0}
    })
    code: str = Field(..., description="CPT procedure code")
    system: str = Field(default="CPT")
    description: str
    amount: Optional[float] = None


class MedicationCode(BaseModel):
    """A medication identified by RxNorm CUI."""
    model_config = ConfigDict(json_schema_extra={
        "example": {"code": "860975", "system": "RxNorm", "name": "Metformin 500mg", "dose": "1 tablet BD", "route": "Oral"}
    })
    code: str = Field(..., description="RxNorm CUI")
    system: str = Field(default="RxNorm")
    name: str
    dose: Optional[str] = None
    route: Optional[str] = None


class LabValue(BaseModel):
    """A laboratory test result identified by LOINC code."""
    model_config = ConfigDict(json_schema_extra={
        "example": {
            "code": "718-7", "system": "LOINC", "name": "Hemoglobin",
            "value": "9.8", "unit": "g/dL", "ref_range": "13.5-17.5", "status": "low",
        }
    })
    code: str = Field(..., description="LOINC code")
    system: str = Field(default="LOINC")
    name: str
    value: str
    unit: str
    ref_range: Optional[str] = None
    status: Optional[str] = Field(default=None, description="high | low | normal")


class VitalSign(BaseModel):
    """A patient vital sign measurement."""
    name: str
    value: str
    unit: str
    note: Optional[str] = None


class PatientInfo(BaseModel):
    """Demographic information extracted from the document."""
    name: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    dob: Optional[str] = None
    uhid: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None


class BillingLineItem(BaseModel):
    """A single line item on a hospital bill."""
    code: str = Field(..., description="CPT or custom billing code")
    description: str
    amount: float


class BillingInfo(BaseModel):
    """Aggregated billing and claims information."""
    total_charges: float = 0.0
    currency: str = "INR"
    line_items: List[BillingLineItem] = Field(default_factory=list)
    payer_name: Optional[str] = None
    policy_number: Optional[str] = None
    pre_auth: Optional[str] = None
    claims_status: str = "pending"


class ProcessRequest(BaseModel):
    """Request body for the /api/process endpoint."""
    model_config = ConfigDict(json_schema_extra={
        "example": {
            "text": "Patient: Priya Sharma, 34F. Diagnosis: Type 2 Diabetes. HbA1c: 8.2%. Rx: Metformin 500mg BD.",
            "document_type": "lab_report",
        }
    })
    text: str = Field(..., description="Raw document text to process", min_length=10)
    document_type: Optional[str] = Field(
        default=None,
        description="Hint for document type: lab_report | hospital_bill | discharge_summary",
    )
    source: Optional[str] = None


class ProcessResponse(BaseModel):
    """Structured extraction result from clinical NLP + code mapping."""
    document_type: str
    confidence: float
    processing_time_s: float = 0.0
    patient: Optional[PatientInfo] = None
    diagnoses: List[DiagnosisCode] = Field(default_factory=list)
    procedures: List[ProcedureCode] = Field(default_factory=list)
    medications: List[MedicationCode] = Field(default_factory=list)
    lab_values: List[LabValue] = Field(default_factory=list)
    vitals: List[VitalSign] = Field(default_factory=list)
    billing: Optional[BillingInfo] = None
    raw_entities: Optional[Dict[str, Any]] = Field(
        default=None,
        description="Raw NLP output before mapping (debug use)",
    )


class FHIRRequest(BaseModel):
    """Request body for standalone FHIR bundle generation."""
    structured_data: Dict[str, Any] = Field(
        ...,
        description="Structured clinical data (output of /api/process)",
    )
    patient_id: Optional[str] = Field(
        default=None,
        description="Optional patient UUID to use in the bundle",
    )


class FHIRResponse(BaseModel):
    """FHIR R4 Bundle generation response."""
    status: str
    bundle: Dict[str, Any] = Field(..., description="HL7 FHIR R4 Bundle JSON")


class NoteResponse(BaseModel):
    """A persisted clinical record (full representation)."""
    id: str
    title: str
    type: str
    status: str
    confidence: float
    processing_time_s: float
    patient: Optional[PatientInfo] = None
    extracted: Optional[Dict[str, Any]] = None
    billing: Optional[Dict[str, Any]] = None
    fhir: Optional[Dict[str, Any]] = None


class NoteListResponse(BaseModel):
    """Paginated list of clinical records."""
    total: int
    records: List[NoteResponse]
    limit: int
    offset: int
