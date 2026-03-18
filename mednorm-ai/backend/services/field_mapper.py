"""
MedNorm AI — Field Mapper & FHIR R4 Bundle Generator
=======================================================
Two responsibilities:

1. **Field Mapping** (`map()`):
   Normalizes raw NLP output (from clinical_nlp.py) into clean structured dicts,
   attaching standard system labels (ICD-10-CM, CPT, RxNorm, LOINC) to each entity.

2. **FHIR R4 Bundle Generation** (`to_fhir()`):
   Converts structured data into a full HL7 FHIR R4 document bundle containing:
   - Patient          — demographics, UHID identifier (system: https://hospital.in/uhid)
   - Encounter        — class AMB (lab/OPD) or IMP (inpatient), status: finished
   - Condition        — per diagnosis, ICD-10-CM coded, status: active + confirmed
   - MedicationRequest — per medication, RxNorm CUI, intent: order
   - Observation      — per lab value, LOINC coded, with H/L/N interpretation
   - Procedure        — per procedure, CPT coded, status: completed
"""

import uuid
from datetime import datetime
from typing import Dict, Any



class FieldMapper:
    def map(self, entities: Dict[str, Any], document_type: str = None) -> Dict[str, Any]:
        return {
            "document_type": entities.get("document_type", document_type or "unknown"),
            "confidence": entities.get("confidence", 0.8),
            "patient": entities.get("patient") or {},
            "diagnoses": self._clean_diagnoses(entities.get("diagnoses", [])),
            "procedures": self._clean_procedures(entities.get("procedures", [])),
            "medications": self._clean_medications(entities.get("medications", [])),
            "lab_values": self._clean_labs(entities.get("lab_values", [])),
            "vitals": entities.get("vitals", []),
            "billing": self._build_billing(entities),
            "document_date": entities.get("document_date"),
        }

    def _clean_diagnoses(self, raw: list) -> list:
        return [
            {"code": d.get("code", ""), "system": "ICD-10-CM", "description": d.get("description", ""), "confidence": float(d.get("confidence", 0.8))}
            for d in (raw or []) if d.get("code")
        ]

    def _clean_procedures(self, raw: list) -> list:
        return [
            {"code": p.get("code", ""), "system": "CPT", "description": p.get("description", ""), "amount": p.get("amount")}
            for p in (raw or []) if p.get("code")
        ]

    def _clean_medications(self, raw: list) -> list:
        return [
            {"code": m.get("code", "0"), "system": "RxNorm", "name": m.get("name", ""), "dose": m.get("dose"), "route": m.get("route", "Oral")}
            for m in (raw or []) if m.get("name")
        ]

    def _clean_labs(self, raw: list) -> list:
        return [
            {"code": l.get("code", ""), "system": "LOINC", "name": l.get("name", ""), "value": str(l.get("value", "")), "unit": l.get("unit", ""), "ref_range": l.get("ref_range"), "status": l.get("status", "normal")}
            for l in (raw or []) if l.get("name")
        ]

    def _build_billing(self, entities: Dict) -> Dict:
        return {
            "total_charges": entities.get("total_charges") or 0.0,
            "currency": "INR",
            "line_items": entities.get("billing_items", []),
            "payer_name": entities.get("payer_name"),
            "policy_number": entities.get("policy_number"),
            "pre_auth": entities.get("pre_auth"),
            "claims_status": "ready",
        }

    def to_fhir(self, structured: Dict[str, Any]) -> Dict[str, Any]:
        now = datetime.utcnow().isoformat() + "Z"
        bundle_id = str(uuid.uuid4())
        patient_id = str(uuid.uuid4())
        encounter_id = str(uuid.uuid4())
        patient = structured.get("patient", {})
        entries = []

        patient_resource = {
            "resourceType": "Patient", "id": patient_id,
            "identifier": [], "name": [],
            "gender": (patient.get("gender") or "unknown").lower(),
            "birthDate": patient.get("dob"),
            "telecom": [], "address": [],
        }
        if patient.get("uhid"):
            patient_resource["identifier"].append({"system": "https://hospital.in/uhid", "value": patient["uhid"]})
        if patient.get("name"):
            patient_resource["name"].append({"use": "official", "text": patient["name"]})
        if patient.get("phone"):
            patient_resource["telecom"].append({"system": "phone", "value": patient["phone"]})
        if patient.get("address"):
            patient_resource["address"].append({"text": patient["address"]})
        entries.append({"fullUrl": f"urn:uuid:{patient_id}", "resource": patient_resource})

        doc_type = structured.get("document_type", "unknown")
        encounter_class = "AMB" if doc_type == "lab_report" else "IMP"
        entries.append({"fullUrl": f"urn:uuid:{encounter_id}", "resource": {
            "resourceType": "Encounter", "id": encounter_id, "status": "finished",
            "class": {"system": "http://terminology.hl7.org/CodeSystem/v3-ActCode", "code": encounter_class, "display": "Ambulatory" if encounter_class == "AMB" else "Inpatient Encounter"},
            "subject": {"reference": f"Patient/{patient_id}"},
            "period": {"start": structured.get("document_date") or now},
        }})

        for dx in (structured.get("diagnoses") or []):
            cond_id = str(uuid.uuid4())
            entries.append({"fullUrl": f"urn:uuid:{cond_id}", "resource": {
                "resourceType": "Condition", "id": cond_id,
                "clinicalStatus": {"coding": [{"system": "http://terminology.hl7.org/CodeSystem/condition-clinical", "code": "active"}]},
                "verificationStatus": {"coding": [{"system": "http://terminology.hl7.org/CodeSystem/condition-ver-status", "code": "confirmed"}]},
                "code": {"coding": [{"system": "http://hl7.org/fhir/sid/icd-10-cm", "code": dx["code"], "display": dx["description"]}], "text": dx["description"]},
                "subject": {"reference": f"Patient/{patient_id}"},
                "encounter": {"reference": f"Encounter/{encounter_id}"},
            }})

        for med in (structured.get("medications") or []):
            med_id = str(uuid.uuid4())
            entries.append({"fullUrl": f"urn:uuid:{med_id}", "resource": {
                "resourceType": "MedicationRequest", "id": med_id, "status": "active", "intent": "order",
                "medicationCodeableConcept": {"coding": [{"system": "http://www.nlm.nih.gov/research/umls/rxnorm", "code": med["code"], "display": med["name"]}], "text": med["name"]},
                "subject": {"reference": f"Patient/{patient_id}"},
                "encounter": {"reference": f"Encounter/{encounter_id}"},
                "dosageInstruction": [{"text": f"{med.get('dose', '')} ({med.get('route', 'Oral')})"}],
            }})

        for lab in (structured.get("lab_values") or []):
            obs_id = str(uuid.uuid4())
            interp_code = "H" if lab["status"] == "high" else "L" if lab["status"] == "low" else "N"
            try:
                qty_value = float(lab["value"])
            except (ValueError, TypeError):
                qty_value = None
            obs = {
                "resourceType": "Observation", "id": obs_id, "status": "final",
                "code": {"coding": [{"system": "http://loinc.org", "code": lab["code"], "display": lab["name"]}], "text": lab["name"]},
                "subject": {"reference": f"Patient/{patient_id}"},
                "encounter": {"reference": f"Encounter/{encounter_id}"},
                "interpretation": [{"coding": [{"system": "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation", "code": interp_code}]}],
            }
            if qty_value is not None:
                obs["valueQuantity"] = {"value": qty_value, "unit": lab["unit"]}
            if lab.get("ref_range"):
                obs["referenceRange"] = [{"text": lab["ref_range"]}]
            entries.append({"fullUrl": f"urn:uuid:{obs_id}", "resource": obs})

        for proc in (structured.get("procedures") or []):
            proc_id = str(uuid.uuid4())
            entries.append({"fullUrl": f"urn:uuid:{proc_id}", "resource": {
                "resourceType": "Procedure", "id": proc_id, "status": "completed",
                "code": {"coding": [{"system": "http://www.ama-assn.org/go/cpt", "code": proc["code"], "display": proc["description"]}], "text": proc["description"]},
                "subject": {"reference": f"Patient/{patient_id}"},
                "encounter": {"reference": f"Encounter/{encounter_id}"},
            }})

        return {"resourceType": "Bundle", "id": bundle_id, "meta": {"lastUpdated": now}, "type": "document", "timestamp": now, "entry": entries}
