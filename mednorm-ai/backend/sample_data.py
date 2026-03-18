SAMPLE_RECORDS = [
    {
        "id": "rec_001",
        "title": "CBC + Metabolic Panel — Lab Report",
        "type": "lab_report",
        "status": "done",
        "confidence": 97.4,
        "processing_time_s": 2.3,
        "patient": {
            "name": "Rajesh Kumar", "age": 42, "gender": "Male", "dob": "1982-03-15",
            "uhid": "AIIMS-2024-08731", "phone": "+91-9876543210",
            "address": "H-12, Sector 5, Rohini, New Delhi - 110085",
        },
        "document": {
            "source": "AIIMS New Delhi Pathology Dept.", "date": "2025-11-22",
            "reportId": "LAB-2025-44821", "type": "Laboratory Report", "pages": 3,
        },
        "extracted": {
            "diagnoses": [
                {"code": "E11.65", "system": "ICD-10-CM", "description": "Type 2 diabetes mellitus with hyperglycemia", "confidence": 0.96},
                {"code": "D64.9", "system": "ICD-10-CM", "description": "Anaemia, unspecified", "confidence": 0.89},
                {"code": "E78.5", "system": "ICD-10-CM", "description": "Hyperlipidaemia, unspecified", "confidence": 0.92},
            ],
            "lab_values": [
                {"code": "26464-8", "system": "LOINC", "name": "WBC Count", "value": "9.2", "unit": "K/uL", "ref_range": "4.5–11.0", "status": "normal"},
                {"code": "718-7", "system": "LOINC", "name": "Hemoglobin", "value": "9.8", "unit": "g/dL", "ref_range": "13.5–17.5", "status": "low"},
                {"code": "2339-0", "system": "LOINC", "name": "Glucose (Fasting)", "value": "214", "unit": "mg/dL", "ref_range": "70–100", "status": "high"},
                {"code": "4548-4", "system": "LOINC", "name": "HbA1c", "value": "8.7", "unit": "%", "ref_range": "<5.7", "status": "high"},
                {"code": "2093-3", "system": "LOINC", "name": "Total Cholesterol", "value": "242", "unit": "mg/dL", "ref_range": "<200", "status": "high"},
            ],
            "medications": [
                {"code": "860975", "system": "RxNorm", "name": "Metformin 500mg", "dose": "1 tablet BD", "route": "Oral"},
                {"code": "83367", "system": "RxNorm", "name": "Atorvastatin 20mg", "dose": "1 tablet HS", "route": "Oral"},
            ],
            "procedures": [],
            "vitals": [],
        },
        "billing": {
            "totalCharges": 2850, "currency": "INR",
            "lineItems": [
                {"cpt": "80053", "description": "Comprehensive Metabolic Panel", "amount": 1200},
                {"cpt": "85025", "description": "Complete Blood Count w/ Differential", "amount": 650},
                {"cpt": "83036", "description": "HbA1c", "amount": 450},
                {"cpt": "80061", "description": "Lipid Panel", "amount": 550},
            ],
            "payerInfo": {"name": "Star Health Insurance", "policyNo": "SHI-2024-877321", "preAuth": "PA-990123"},
            "claimsStatus": "ready",
        },
    },
    {
        "id": "rec_002",
        "title": "Inpatient Hospital Bill — Knee Replacement",
        "type": "hospital_bill",
        "status": "done",
        "confidence": 94.1,
        "processing_time_s": 3.8,
        "patient": {
            "name": "Sunita Devi", "age": 62, "gender": "Female", "dob": "1962-07-08",
            "uhid": "FORTIS-2025-19023",
        },
        "document": {
            "source": "Fortis Hospital, Dehradun", "date": "2025-12-10",
            "reportId": "BILL-2025-F78341", "type": "Inpatient Bill", "pages": 6,
        },
        "extracted": {
            "diagnoses": [
                {"code": "M17.11", "system": "ICD-10-CM", "description": "Primary osteoarthritis, right knee", "confidence": 0.98},
                {"code": "I10", "system": "ICD-10-CM", "description": "Essential (primary) hypertension", "confidence": 0.95},
            ],
            "procedures": [
                {"code": "27447", "system": "CPT", "description": "Total Knee Arthroplasty", "amount": 85000},
                {"code": "00400", "system": "CPT", "description": "Anesthesia for procedures on lower extremities", "amount": 22000},
            ],
            "medications": [
                {"code": "1049630", "system": "RxNorm", "name": "Cefazolin 1g IV", "dose": "Pre-op + 24h", "route": "IV"},
                {"code": "41493", "system": "RxNorm", "name": "Enoxaparin 40mg", "dose": "OD x 10 days", "route": "SC"},
            ],
            "lab_values": [
                {"code": "718-7", "system": "LOINC", "name": "Hemoglobin (pre-op)", "value": "11.2", "unit": "g/dL", "ref_range": "12–16", "status": "low"},
            ],
            "vitals": [
                {"name": "Blood Pressure", "value": "148/92", "unit": "mmHg", "note": "Pre-op"},
                {"name": "Heart Rate", "value": "74", "unit": "bpm", "note": "Pre-op"},
            ],
        },
        "billing": {
            "totalCharges": 312500, "currency": "INR",
            "lineItems": [
                {"cpt": "27447", "description": "Total Knee Arthroplasty (Surgeon)", "amount": 85000},
                {"cpt": "00400", "description": "Anesthesia Charges", "amount": 22000},
                {"cpt": "ROOM", "description": "Room & Board (5 days)", "amount": 62500},
                {"cpt": "IMPL", "description": "Knee Implant (NexGen CR)", "amount": 110000},
                {"cpt": "PHARM", "description": "Pharmacy & Consumables", "amount": 9000},
                {"cpt": "LAB", "description": "Laboratory Investigations", "amount": 4800},
                {"cpt": "RADIO", "description": "Radiology", "amount": 4200},
                {"cpt": "NURS", "description": "Nursing Charges", "amount": 15000},
            ],
            "payerInfo": {"name": "CGHS", "policyNo": "CGHS-DEH-2019-441", "preAuth": "PA-CGHS-20251189"},
            "claimsStatus": "submitted",
            "approvedAmount": 290000,
            "deductible": 22500,
        },
    },
    {
        "id": "rec_003",
        "title": "Discharge Summary — Acute Gastroenteritis",
        "type": "discharge_summary",
        "status": "done",
        "confidence": 96.2,
        "processing_time_s": 2.9,
        "patient": {
            "name": "Aryan Sharma", "age": 8, "gender": "Male", "dob": "2016-05-22",
            "uhid": "APOLLO-2025-55490",
        },
        "document": {
            "source": "Apollo Hospitals, Jubilee Hills, Hyderabad", "date": "2026-01-18",
            "reportId": "DS-2026-AP-003291", "type": "Discharge Summary", "pages": 4,
        },
        "extracted": {
            "diagnoses": [
                {"code": "A09", "system": "ICD-10-CM", "description": "Infectious gastroenteritis and colitis, unspecified", "confidence": 0.97},
                {"code": "E86.0", "system": "ICD-10-CM", "description": "Dehydration", "confidence": 0.99},
                {"code": "R11.2", "system": "ICD-10-CM", "description": "Nausea with vomiting, unspecified", "confidence": 0.93},
            ],
            "medications": [
                {"code": "2200644", "system": "RxNorm", "name": "ORS (WHO Formula)", "dose": "200mL after each loose stool", "route": "Oral"},
                {"code": "309362", "system": "RxNorm", "name": "Zinc Sulphate 20mg", "dose": "OD x 14 days", "route": "Oral"},
                {"code": "1049502", "system": "RxNorm", "name": "Ondansetron 2mg syrup", "dose": "TDS PRN", "route": "Oral"},
            ],
            "procedures": [
                {"code": "36000", "system": "CPT", "description": "IV catheter placement", "amount": 800},
                {"code": "90760", "system": "CPT", "description": "IV infusion, hydration, first hour", "amount": 1200},
            ],
            "lab_values": [
                {"code": "2951-2", "system": "LOINC", "name": "Sodium", "value": "129", "unit": "mEq/L", "ref_range": "136–145", "status": "low"},
                {"code": "2823-3", "system": "LOINC", "name": "Potassium", "value": "3.1", "unit": "mEq/L", "ref_range": "3.5–5.0", "status": "low"},
            ],
            "vitals": [
                {"name": "Temperature", "value": "38.4", "unit": "°C", "note": "Admission"},
                {"name": "Heart Rate", "value": "112", "unit": "bpm", "note": "Admission"},
            ],
        },
        "billing": {
            "totalCharges": 28500, "currency": "INR",
            "lineItems": [
                {"cpt": "ROOM", "description": "Paediatric Ward (2 nights)", "amount": 8000},
                {"cpt": "90760", "description": "IV Hydration Therapy", "amount": 3200},
                {"cpt": "PHARM", "description": "Medications & Consumables", "amount": 4800},
                {"cpt": "LAB", "description": "Lab Investigations", "amount": 5200},
                {"cpt": "99233", "description": "Inpatient Daily Charge (2 days)", "amount": 5000},
                {"cpt": "NURS", "description": "Nursing & Monitoring", "amount": 2300},
            ],
            "payerInfo": {"name": "Niva Bupa Health Insurance", "policyNo": "NB-HYD-2023-102938", "preAuth": "PA-NB-202601029"},
            "claimsStatus": "approved",
            "approvedAmount": 27200,
            "deductible": 1300,
        },
    },
]
