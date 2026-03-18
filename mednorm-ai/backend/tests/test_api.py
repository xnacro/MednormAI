"""
MedNorm AI — Backend Tests
Run with: pytest backend/tests/ -v
"""

import pytest
from fastapi.testclient import TestClient

from backend.main import app
from backend.services.clinical_nlp import ClinicalNLP
from backend.services.field_mapper import FieldMapper

client = TestClient(app)

# ─── Health ──────────────────────────────────────────────────────────────────

def test_health():
    r = client.get("/api/health")
    assert r.status_code == 200
    assert r.json()["status"] == "ok"

# ─── Records ─────────────────────────────────────────────────────────────────

def test_list_records():
    r = client.get("/api/notes")
    assert r.status_code == 200
    data = r.json()
    assert "records" in data
    assert data["total"] >= 3  # at least the 3 demo records

def test_get_record():
    r = client.get("/api/notes/rec_001")
    assert r.status_code == 200
    rec = r.json()
    assert rec["id"] == "rec_001"
    assert "extracted" in rec
    assert "billing" in rec

def test_get_record_not_found():
    r = client.get("/api/notes/nonexistent_id")
    assert r.status_code == 404

def test_list_records_filter_by_type():
    r = client.get("/api/notes?doc_type=lab_report")
    assert r.status_code == 200
    data = r.json()
    for rec in data["records"]:
        assert rec["type"] == "lab_report"

def test_list_records_search():
    r = client.get("/api/notes?search=Rajesh")
    assert r.status_code == 200
    data = r.json()
    assert data["total"] >= 1

# ─── Stats ───────────────────────────────────────────────────────────────────

def test_stats():
    r = client.get("/api/stats")
    assert r.status_code == 200
    data = r.json()
    assert "total_records" in data
    assert "avg_confidence" in data
    assert "total_charges_inr" in data
    assert data["total_records"] >= 3

# ─── Billing ─────────────────────────────────────────────────────────────────

def test_get_billing():
    r = client.get("/api/notes/rec_001/billing")
    assert r.status_code == 200
    data = r.json()
    assert "billing" in data

def test_submit_claim():
    r = client.post("/api/notes/rec_001/submit-claim")
    assert r.status_code == 200
    assert r.json()["claims_status"] == "submitted"

# ─── Demo Pipeline ───────────────────────────────────────────────────────────

def test_demo_case_1():
    r = client.post("/api/demo/1/process")
    assert r.status_code == 200
    data = r.json()
    assert data["status"] == "ok"
    assert "record" in data

def test_demo_case_invalid():
    r = client.post("/api/demo/99/process")
    assert r.status_code == 404

# ─── NLP Processing ──────────────────────────────────────────────────────────

def test_process_text_lab_report():
    sample_text = """
    Patient: Amit Verma, 45 years, Male
    UHID: TEST-001
    Date: 2025-12-01

    CBC Report:
    Haemoglobin: 9.5 g/dL (Ref: 13.5-17.5)
    WBC Count: 8.2 K/uL (Ref: 4.5-11.0)
    Glucose (Fasting): 210 mg/dL (Ref: 70-100)
    HbA1c: 8.2%

    Diagnosis: Type 2 Diabetes mellitus, Anaemia
    Rx: Metformin 500mg BD, Ferrous Sulphate 200mg TDS
    """
    r = client.post("/api/process", json={"text": sample_text, "document_type": "lab_report"})
    assert r.status_code == 200
    data = r.json()
    assert data["document_type"] == "lab_report"
    assert len(data["diagnoses"]) > 0
    assert len(data["lab_values"]) > 0

def test_process_text_no_document_type():
    r = client.post("/api/process", json={"text": "Patient has hypertension and is on amlodipine 5mg."})
    assert r.status_code == 200
    data = r.json()
    assert "diagnoses" in data
    assert "medications" in data

# ─── Clinical NLP Unit Tests ─────────────────────────────────────────────────

class TestClinicalNLP:
    def setup_method(self):
        self.nlp = ClinicalNLP()

    def test_extract_patient_name(self):
        text = "Patient Name: Priya Sharma, Age: 34, Female"
        result = self.nlp._extract_patient(text)
        assert result.get("age") == 34
        assert result.get("gender") == "Female"

    def test_extract_diagnoses_diabetes(self):
        text = "Diagnosis: Type 2 diabetes mellitus with hyperglycemia"
        diagnoses = self.nlp._extract_diagnoses(text)
        codes = [d["code"] for d in diagnoses]
        assert "E11.9" in codes

    def test_extract_diagnoses_hypertension(self):
        text = "Patient has hypertension (HTN), BP 160/100 mmHg"
        diagnoses = self.nlp._extract_diagnoses(text)
        codes = [d["code"] for d in diagnoses]
        assert "I10" in codes

    def test_extract_lab_values(self):
        text = "Haemoglobin: 10.2 g/dL\nGlucose: 215 mg/dL\nCreatinine: 1.3 mg/dL"
        labs = self.nlp._extract_lab_values(text)
        names = [l["name"] for l in labs]
        assert "Hemoglobin" in names
        assert any("Glucose" in n for n in names)

    def test_lab_status_high(self):
        text = "HbA1c: 9.5%"
        labs = self.nlp._extract_lab_values(text)
        hba1c = next((l for l in labs if "HbA1c" in l["name"]), None)
        if hba1c:
            assert hba1c["status"] == "high"

    def test_lab_status_low(self):
        text = "Haemoglobin: 8.2 g/dL"
        labs = self.nlp._extract_lab_values(text)
        hb = next((l for l in labs if l["name"] == "Hemoglobin"), None)
        assert hb is not None
        assert hb["status"] == "low"

    def test_extract_medications(self):
        text = "Rx: Tab Metformin 500mg BD, Tab Atorvastatin 10mg HS"
        meds = self.nlp._extract_medications(text)
        names = [m["name"] for m in meds]
        assert any("Metformin" in n for n in names)

    def test_extract_vitals(self):
        text = "BP: 140/90 mmHg, HR: 88 bpm, Temp: 37.2°C, SpO2: 97%"
        vitals = self.nlp._extract_vitals(text)
        names = [v["name"] for v in vitals]
        assert "Blood Pressure" in names
        assert "Heart Rate" in names

    def test_detect_doc_type_lab(self):
        text = "Lab Report: CBC, Glucose, HbA1c, Pathology Department"
        assert self.nlp._detect_doc_type(text) == "lab_report"

    def test_detect_doc_type_bill(self):
        text = "Hospital Bill - Total Amount Due: Rs. 45,000"
        assert self.nlp._detect_doc_type(text) == "hospital_bill"

    def test_detect_doc_type_discharge(self):
        text = "Discharge Summary: Patient was admitted on 10/01 and discharged on 12/01"
        assert self.nlp._detect_doc_type(text) == "discharge_summary"


# ─── Field Mapper Unit Tests ─────────────────────────────────────────────────

class TestFieldMapper:
    def setup_method(self):
        self.mapper = FieldMapper()

    def test_map_diagnoses(self):
        entities = {
            "document_type": "lab_report",
            "confidence": 0.9,
            "diagnoses": [{"code": "E11.9", "description": "T2DM", "confidence": 0.95}],
            "procedures": [], "medications": [], "lab_values": [], "vitals": [],
        }
        result = self.mapper.map(entities)
        assert len(result["diagnoses"]) == 1
        assert result["diagnoses"][0]["system"] == "ICD-10-CM"

    def test_fhir_bundle_structure(self):
        structured = {
            "document_type": "lab_report",
            "patient": {"name": "Test Patient", "uhid": "TEST-001", "gender": "Male"},
            "diagnoses": [{"code": "I10", "system": "ICD-10-CM", "description": "Hypertension", "confidence": 0.9}],
            "medications": [{"code": "17767", "system": "RxNorm", "name": "Amlodipine 5mg", "dose": "OD", "route": "Oral"}],
            "lab_values": [],
            "procedures": [],
            "vitals": [],
        }
        bundle = self.mapper.to_fhir(structured)
        assert bundle["resourceType"] == "Bundle"
        assert bundle["type"] == "document"
        assert len(bundle["entry"]) >= 3  # Patient + Encounter + Condition

        resource_types = [e["resource"]["resourceType"] for e in bundle["entry"]]
        assert "Patient" in resource_types
        assert "Encounter" in resource_types
        assert "Condition" in resource_types
        assert "MedicationRequest" in resource_types

    def test_fhir_bundle_observations(self):
        structured = {
            "patient": {"name": "Test"},
            "diagnoses": [],
            "medications": [],
            "procedures": [],
            "vitals": [],
            "lab_values": [
                {"code": "718-7", "system": "LOINC", "name": "Hemoglobin", "value": "9.5", "unit": "g/dL", "status": "low"}
            ],
        }
        bundle = self.mapper.to_fhir(structured)
        resource_types = [e["resource"]["resourceType"] for e in bundle["entry"]]
        assert "Observation" in resource_types


# ─── Patient Name Extraction Tests ───────────────────────────────────────────

class TestPatientNameExtraction:
    def setup_method(self):
        self.nlp = ClinicalNLP()

    def test_extract_patient_name_valid(self):
        text = "Patient Name: Priya Sharma\nAge: 34\nGender: Female"
        result = self.nlp._extract_patient(text)
        assert result.get("name") == "Priya Sharma"
        assert result.get("name_confidence", 0) >= 0.8

    def test_extract_patient_name_rejects_generic(self):
        text = "Patient Information\nAge: 42 years\nGender: Male\nUHID: TEST-001"
        result = self.nlp._extract_patient(text)
        name = result.get("name")
        assert name != "Information", f"Should not extract 'Information' as name, got: {name}"

    def test_extract_patient_name_heuristic(self):
        text = "Lab Report\nRajesh Kumar\nAge: 42 years, Male\nHaemoglobin: 9.5 g/dL"
        result = self.nlp._extract_patient(text)
        name = result.get("name")
        assert name is not None, "Should extract a name heuristically"
        assert "Rajesh" in name or "Kumar" in name

    def test_extract_patient_name_colon_format(self):
        text = "Name: Amit Verma, 45 years, Male\nUHID: TEST-001"
        result = self.nlp._extract_patient(text)
        assert result.get("name") == "Amit Verma"

    def test_extract_patient_name_pt_format(self):
        text = "Pt Name: Sunita Devi\nAge: 62\nGender: Female"
        result = self.nlp._extract_patient(text)
        assert result.get("name") == "Sunita Devi"


# ─── Billing Extraction Tests ────────────────────────────────────────────────

class TestBillingExtraction:
    def setup_method(self):
        self.nlp = ClinicalNLP()

    def test_extract_billing_items_with_amounts(self):
        text = """Hospital Bill
        Consultation Charges - Rs. 1500
        Lab Investigations - Rs. 3200
        Pharmacy - Rs. 850
        Total - Rs. 5550"""
        items = self.nlp._extract_billing_items(text)
        assert len(items) >= 2, f"Expected at least 2 billing items, got {len(items)}"
        amounts = [item["amount"] for item in items]
        assert all(a > 0 for a in amounts), "All amounts should be positive"

    def test_extract_billing_no_items(self):
        text = "Patient: Amit Verma\nAge: 45\nDiagnosis: Hypertension\nRx: Amlodipine 5mg OD"
        items = self.nlp._extract_billing_items(text)
        assert len(items) == 0, f"Expected 0 billing items from non-billing text, got {len(items)}"

    def test_extract_billing_inr_symbol(self):
        text = """Itemized Bill
        Blood Test          ₹1200
        X-Ray Chest         ₹800
        Doctor Consultation ₹500
        Total               ₹2500"""
        items = self.nlp._extract_billing_items(text)
        assert len(items) >= 2, f"Expected at least 2 items, got {len(items)}"

