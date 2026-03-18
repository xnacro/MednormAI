<p align="center">
  <img src="https://img.shields.io/badge/HackMatrix_2.0-IIT_Patna-8b5cf6?style=for-the-badge&logo=graduation-cap&logoColor=white" />
  <img src="https://img.shields.io/badge/Track_2-Data_Normalization_Engine-22d3ee?style=for-the-badge" />
  <img src="https://img.shields.io/badge/FHIR-R4_Compliant-34d399?style=for-the-badge&logo=hl7&logoColor=white" />
  <img src="https://img.shields.io/badge/ICD--10_·_CPT_·_RxNorm_·_LOINC-Mapped-fbbf24?style=for-the-badge" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js" />
  <img src="https://img.shields.io/badge/FastAPI-0.115-009688?style=flat-square&logo=fastapi&logoColor=white" />
  <img src="https://img.shields.io/badge/Python-3.11+-blue?style=flat-square&logo=python&logoColor=white" />
  <img src="https://img.shields.io/badge/GPT--4o-Clinical_NLP-412991?style=flat-square&logo=openai&logoColor=white" />
  <img src="https://img.shields.io/badge/Tests-30%2B_passing-success?style=flat-square&logo=pytest" />
  <img src="https://img.shields.io/badge/Demo_Mode-No_API_Key_needed-emerald?style=flat-square" />
</p>

<br/>

<h1 align="center">🏥 MedNorm AI</h1>
<h3 align="center">AI-Powered Clinical Data Normalization Engine for Indian Healthcare</h3>

<p align="center">
  Upload any Indian hospital document — lab report, discharge summary, or itemized bill —<br/>
  and MedNorm AI extracts ICD-10, CPT, RxNorm & LOINC codes,<br/>
  then generates FHIR R4 bundles ready for billing & insurance claims.
</p>

<p align="center">
  <a href="#-quick-start">Quick Start</a> •
  <a href="#-demo-flow">Demo</a> •
  <a href="#-architecture">Architecture</a> •
  <a href="#-api-reference">API Docs</a> •
  <a href="#-running-tests">Tests</a> •
  <a href="#-team">Team</a>
</p>

---

## 🎯 Problem Statement

Indian hospitals process **millions of unstructured documents daily** — handwritten lab reports, printed discharge summaries, itemized billing slips — none of which conform to any standard. This creates:

- **₹2,500 Cr+ lost annually** to claim denials & undercoding
- **Manual re-entry** by billing teams for every document
- **No interoperability** between hospital systems, TPAs, and insurers
- **Zero FHIR compliance**, blocking integration with NHA / Ayushman Bharat

**MedNorm AI solves this** by converting any unstructured document into structured, standards-compliant clinical data in under 5 seconds.

---

## ✨ Key Features

| Feature | Description |
|---|---|
| 📄 **Multi-Format Ingestion** | PDF (native + scanned OCR), PNG/JPG/TIFF, plain text — all Indian hospital formats |
| 🧠 **GPT-4o Clinical NLP** | Extracts diagnoses, medications, lab values, vitals, billing from unstructured text |
| 🔗 **4-Code System Mapping** | ICD-10-CM · CPT · RxNorm · LOINC with confidence scoring |
| 🏥 **FHIR R4 Bundles** | Full HL7 FHIR R4 JSON — Patient, Encounter, Condition, MedReq, Observation, Procedure |
| 💰 **Billing Reconciliation** | Line-item validation, TPA/insurer mapping, claim status tracking |
| 📊 **Clinical Dashboard** | Search, filter, stats — all records in one view |
| 🎮 **Demo Mode** | 3 pre-loaded real-world Indian cases — works without any API key |
| 📱 **Mobile-First UI** | Dark glassmorphism, responsive, works on all devices |
| ✅ **30+ Tests** | Full pytest suite covering NLP, FHIR, API, billing unit tests |

---

## 🚀 Quick Start

> **⚡ For judges:** Everything can be run in under 3 minutes. Demo Mode works with **zero API keys**.

### Prerequisites

| Requirement | Version | Notes |
|---|---|---|
| Node.js | 18+ | For Next.js frontend |
| Python | 3.11+ | For FastAPI backend |
| OpenAI API Key | — | **Optional** — demo mode works without it |
| Tesseract OCR | any | **Optional** — only for scanned image uploads |

### Option A: One-Command Start (Windows)

```powershell
# From the mednorm-ai/ directory:
.\start.ps1
```

### Option B: Manual Start

**Terminal 1 — Backend:**
```bash
cd mednorm-ai

# Create & activate virtual environment
python -m venv venv
venv\Scripts\activate          # Windows
# source venv/bin/activate     # macOS / Linux

# Install Python dependencies
pip install -r backend/requirements.txt

# Start FastAPI server
python -m uvicorn backend.main:app --reload --port 8000
```

**Terminal 2 — Frontend:**
```bash
cd mednorm-ai

# Install Node.js dependencies
npm install

# Start Next.js development server
npm run dev
```

**Then open:** [http://localhost:3000](http://localhost:3000)  
**API Docs (Swagger):** [http://localhost:8000/docs](http://localhost:8000/docs)  
**API Docs (ReDoc):** [http://localhost:8000/redoc](http://localhost:8000/redoc)

### Configure API Keys (Optional)

```bash
cp .env.example .env
# Edit .env and add your OPENAI_API_KEY
```

> **The app runs fully in Demo Mode without any API key!**  
> Rule-based NLP achieves ~75% confidence vs ~97% with GPT-4o.

---

## 🎮 Demo Flow

1. **Landing Page** → Click **"Try Demo Cases"** or drag-drop your own document
2. **Upload Page** → Select a demo case (or upload a real PDF/image)
3. Watch the **5-stage pipeline** animate in real time:
   ```
   📄 Document Ingestion → 🧠 Clinical NLP → 🔗 Code Mapping → 🏥 FHIR R4 → 💰 Billing
   ```
4. **Record Viewer** opens automatically — 3 tabs:
   - **Extracted Data** — Diagnoses (ICD-10), Medications (RxNorm), Labs (LOINC), Procedures (CPT), Vitals
   - **Billing & Claims** — Itemized charges, payer info, claims status
   - **FHIR R4 Bundle** — Full JSON bundle, copyable

### Pre-loaded Demo Cases

| # | Patient | Document | Key Codes | Confidence |
|---|---|---|---|---|
| 1 | Rajesh Kumar, 42M | CBC + Metabolic Panel — AIIMS Delhi | E11.65 · D64.9 · E78.5 · HbA1c · Cholesterol | **97.4%** |
| 2 | Sunita Devi, 62F | Inpatient Bill — Total Knee Replacement, Fortis | M17.11 · I10 · CPT 27447 · Enoxaparin | **94.1%** |
| 3 | Aryan Sharma, 8M | Discharge Summary — Gastroenteritis, Apollo | A09 · E86.0 · R11.2 · Sodium · Potassium | **96.2%** |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                        MedNorm AI System                             │
│                                                                       │
│  ┌─────────────────┐    HTTP/REST    ┌─────────────────────────────┐ │
│  │   Next.js 14    │ ◄────────────► │       FastAPI Backend        │ │
│  │   (Frontend)    │                │                               │ │
│  │                 │                │  ┌─────────────────────────┐  │ │
│  │  • Landing Page │                │  │     PDF Parser           │  │ │
│  │  • Upload Page  │◄─── upload ───►│  │  pdfplumber + pytesseract│  │ │
│  │  • Dashboard    │                │  └──────────┬──────────────┘  │ │
│  │  • Record View  │                │             │ raw text         │ │
│  │  • FHIR Viewer  │                │  ┌──────────▼──────────────┐  │ │
│  └─────────────────┘                │  │     Clinical NLP         │  │ │
│                                     │  │  GPT-4o + rule-based     │  │ │
│                                     │  │  fallback                │  │ │
│                                     │  └──────────┬──────────────┘  │ │
│                                     │             │ entities         │ │
│                                     │  ┌──────────▼──────────────┐  │ │
│                                     │  │     Field Mapper         │  │ │
│                                     │  │  ICD-10 · CPT · RxNorm  │  │ │
│                                     │  │  LOINC · FHIR R4        │  │ │
│                                     │  └──────────┬──────────────┘  │ │
│                                     │             │ structured data  │ │
│                                     │  ┌──────────▼──────────────┐  │ │
│                                     │  │  In-Memory Record Store  │  │ │
│                                     │  │  (upgradeable to DB)     │  │ │
│                                     │  └─────────────────────────┘  │ │
│                                     └─────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
```

### 5-Stage Processing Pipeline

```
Stage 1: Document Ingestion
  └── pdfplumber (native PDF text + table extraction)
  └── pypdf (fallback PDF reader)
  └── pytesseract (OCR for scanned images/PDFs)

Stage 2: Clinical NLP
  └── GPT-4o (primary) — structured JSON extraction
  └── Rule-based regex (fallback / demo mode)
  └── Multi-strategy patient name extraction with confidence scoring

Stage 3: Code Mapping
  └── ICD-10-CM — diagnosis codes (WHO standard)
  └── CPT — procedure billing codes (AMA)
  └── RxNorm CUI — medication identifiers (NIH)
  └── LOINC — laboratory test codes (Regenstrief)

Stage 4: FHIR R4 Bundle Generation
  └── Patient resource (UHID identifier, demographics)
  └── Encounter resource (AMB/IMP class)
  └── Condition resources (per diagnosis)
  └── MedicationRequest resources (per medication)
  └── Observation resources (per lab value, with interpretation H/L/N)
  └── Procedure resources (per CPT code)

Stage 5: Billing & Claims
  └── Line-item reconciliation
  └── TPA / insurer mapping
  └── Claim status tracking (pending → submitted → approved)
  └── Deductible calculation
```

---

## 📁 Project Structure

```
mednorm-ai/
├── app/                              # Next.js App Router pages
│   ├── layout.js                     # Root layout (fonts, metadata)
│   ├── globals.css                   # Design system + CSS variables + animations
│   ├── page.js                       # Landing page (hero, stats, pipeline viz, demo cards)
│   ├── upload/
│   │   └── page.js                   # Document upload + animated pipeline progress
│   ├── dashboard/
│   │   └── page.js                   # Records dashboard (search, filter, stats)
│   └── record/
│       └── [id]/
│           └── page.js               # Record viewer — 3 tabs (Extracted/Billing/FHIR)
│
├── components/                       # Reusable React components
│   ├── Navbar.js                     # Navigation bar (responsive, mobile menu)
│   ├── Footer.js                     # Footer (team info, links)
│   ├── StatsCard.js                  # Dashboard stat cards
│   ├── NoteCard.js                   # Record list item card
│   ├── CodeTag.js                    # ICD/CPT/RxNorm/LOINC code pill component
│   └── PipelineProgress.js           # Animated 5-stage pipeline visualizer
│
├── lib/
│   ├── demoData.js                   # 3 demo records + pipeline steps data
│   └── api.js                        # Frontend API client (fetchRecord, uploadFile, etc.)
│
├── backend/
│   ├── main.py                       # FastAPI app + CORS + router registration
│   ├── models.py                     # Pydantic v2 schemas (request/response models)
│   ├── store.py                      # In-memory record store (dict)
│   ├── sample_data.py                # 3 pre-loaded demo records
│   ├── requirements.txt              # Python dependencies (pinned versions)
│   │
│   ├── controllers/                  # FastAPI route handlers (MVC Controllers)
│   │   ├── health.py                 # GET /api/health
│   │   ├── ingest.py                 # POST /api/ingest
│   │   ├── pipeline.py               # POST /api/pipeline, /api/process, /api/demo/{id}/process
│   │   ├── records.py                # GET/DELETE /api/notes, /api/notes/{id}
│   │   ├── fhir.py                   # POST /api/fhir, GET /api/notes/{id}/fhir
│   │   └── stats.py                  # GET /api/stats
│   │
│   └── services/                     # Business logic (MVC Services)
│       ├── pdf_parser.py             # PDF + OCR parsing (multi-strategy)
│       ├── clinical_nlp.py           # GPT-4o NLP + rule-based fallback
│       └── field_mapper.py           # Code mapping + FHIR R4 bundle generator
│
├── backend/tests/
│   └── test_api.py                   # pytest suite — 30+ tests (NLP, FHIR, API, billing)
│
├── start.ps1                         # One-command startup script (Windows PowerShell)
├── .env.example                      # Environment variables template
├── .gitignore                        # Comprehensive gitignore
├── tailwind.config.js                # Tailwind CSS configuration
├── next.config.mjs                   # Next.js configuration
└── package.json                      # Node.js dependencies
```

---

## 🔌 API Reference

Base URL: `http://localhost:8000`  
Interactive docs: [http://localhost:8000/docs](http://localhost:8000/docs)

### Core Endpoints

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `GET` | `/api/health` | Service health check | None |
| `POST` | `/api/ingest` | Parse document — returns raw text + page count | None |
| `POST` | `/api/process` | Clinical NLP on raw text | None |
| `POST` | `/api/pipeline` | **End-to-end:** upload → parse → NLP → FHIR → persist | None |
| `POST` | `/api/demo/{case_id}/process` | Process a pre-loaded demo case (1, 2, or 3) | None |
| `POST` | `/api/fhir` | Generate FHIR R4 bundle from structured data | None |
| `GET` | `/api/notes` | List all records (filter: `?doc_type=lab_report&search=Rajesh`) | None |
| `GET` | `/api/notes/{id}` | Get specific record | None |
| `DELETE` | `/api/notes/{id}` | Delete a record | None |
| `GET` | `/api/notes/{id}/fhir` | Get FHIR bundle for a record | None |
| `GET` | `/api/notes/{id}/billing` | Get billing + claims data | None |
| `POST` | `/api/notes/{id}/submit-claim` | Mark claim as submitted | None |
| `GET` | `/api/stats` | Dashboard statistics | None |

### Example: Process a Document

```bash
# Upload a PDF for full pipeline processing
curl -X POST http://localhost:8000/api/pipeline \
  -F "file=@lab_report.pdf" \
  -H "Accept: application/json"
```

**Response:**
```json
{
  "status": "ok",
  "record_id": "rec_1734567890",
  "type": "lab_report",
  "confidence": 97.4,
  "patient": {
    "name": "Rajesh Kumar",
    "age": 42,
    "gender": "Male",
    "uhid": "AIIMS-2024-08731"
  },
  "extracted": {
    "diagnoses": [
      { "code": "E11.65", "system": "ICD-10-CM", "description": "Type 2 diabetes mellitus with hyperglycemia", "confidence": 0.96 }
    ],
    "lab_values": [
      { "code": "718-7", "system": "LOINC", "name": "Hemoglobin", "value": "9.8", "unit": "g/dL", "status": "low" }
    ]
  },
  "billing": { "totalCharges": 2850, "currency": "INR", "lineItems": [...] },
  "fhir": { "resourceType": "Bundle", "type": "document", "entry": [...] }
}
```

### Example: Process Raw Text

```bash
curl -X POST http://localhost:8000/api/process \
  -H "Content-Type: application/json" \
  -d '{"text": "Patient: Priya Sharma, 34F. Diagnosis: Type 2 Diabetes, HbA1c: 8.2%. Rx: Metformin 500mg BD."}'
```

---

## 🔬 FHIR R4 Resources Generated

| Resource | Key Fields |
|---|---|
| **Patient** | identifier (UHID), name, gender, birthDate, telecom, address |
| **Encounter** | class (AMB/IMP), status: finished, subject, period |
| **Condition** | code (ICD-10-CM), clinicalStatus: active, verificationStatus: confirmed |
| **MedicationRequest** | medicationCodeableConcept (RxNorm CUI), dosageInstruction, intent: order |
| **Observation** | code (LOINC), valueQuantity, interpretation (H/L/N), referenceRange |
| **Procedure** | code (CPT), status: completed, subject, encounter |

---

## 🧪 Running Tests

```bash
# Activate virtual environment first
venv\Scripts\activate     # Windows
# source venv/bin/activate  # macOS/Linux

# Run full test suite
pytest backend/tests/ -v

# Run specific test classes
pytest backend/tests/test_api.py::TestClinicalNLP -v
pytest backend/tests/test_api.py::TestFieldMapper -v
pytest backend/tests/test_api.py::TestPatientNameExtraction -v
pytest backend/tests/test_api.py::TestBillingExtraction -v

# With coverage report
pytest backend/tests/ -v --tb=short
```

### Test Coverage

| Test Class | Tests | Coverage Area |
|---|---|---|
| API Health & Records | 6 | Health, CRUD, search, filter |
| Demo Pipeline | 2 | Demo case processing |
| NLP Processing | 2 | Text processing endpoint |
| `TestClinicalNLP` | 10 | Entity extraction (diagnoses, meds, labs, vitals) |
| `TestFieldMapper` | 3 | FHIR bundle generation |
| `TestPatientNameExtraction` | 5 | Multi-strategy name extraction |
| `TestBillingExtraction` | 3 | Billing line-item parsing |
| Billing API | 2 | Billing get + claim submit |
| **Total** | **33+** | Full pipeline coverage |

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | Next.js 14 (App Router), React 18 | UI framework |
| **Styling** | Tailwind CSS 3, custom CSS animations | Dark glassmorphism design |
| **Icons** | Lucide React, Framer Motion | UI icons + animations |
| **Backend** | Python FastAPI 0.115, Uvicorn | REST API server |
| **Validation** | Pydantic v2 | Request/response schemas |
| **PDF Parsing** | pdfplumber 0.11 (native) + pypdf 5 (fallback) | PDF text extraction |
| **OCR** | pytesseract 0.3 + Pillow (eng+hin) | Scanned document OCR |
| **Clinical NLP** | OpenAI GPT-4o (primary) + regex rules (fallback) | Entity extraction |
| **Code Standards** | ICD-10-CM, CPT, RxNorm CUI, LOINC | Clinical coding |
| **FHIR** | HL7 FHIR R4 (custom generator + fhir.resources validation) | Bundle generation |
| **Testing** | pytest 8.3, pytest-asyncio, httpx TestClient | Test suite |

---

## 🏆 Judging Criteria Coverage

| Criteria | What We Built |
|---|---|
| **🚀 Innovation** | First system targeting Indian hospital document formats (OPD slips, handwritten lab reports, itemized bills); handles English + Hindi field names; rule-based fallback needs zero API key |
| **⚙️ Technical Implementation** | Modular 5-stage pipeline; GPT-4o NLP with regex fallback; 4 coding systems; FHIR R4 compliance; 13-endpoint REST API; MVC architecture; 33+ pytest tests |
| **📈 Feasibility & Scalability** | Works offline (demo mode); designed for SME Indian hospitals; modular microservices; in-memory store upgradeable to PostgreSQL without code changes |
| **🎨 Completeness & UX** | End-to-end from upload to FHIR bundle; mobile-first dark glassmorphism UI; 3 real Indian demo cases; billing reconciliation with TPA info |
| **🎤 Presentation** | One-click demo flow; animated 5-stage pipeline; code tag system for all 4 standards; FHIR bundle viewer with copy-to-clipboard; live Swagger docs |

---

## 🔮 Future Roadmap

- [ ] Real-time streaming progress via WebSockets
- [ ] Batch processing for bulk document uploads
- [ ] HL7 v2 message parsing for legacy hospital systems
- [ ] Integration with NHA / Ayushman Bharat ABHA APIs
- [ ] Fine-tuned NER model on Indian clinical text (BERT/BioBERT)
- [ ] Automated denial management & appeal letter generation
- [ ] Multi-language OCR: Hindi, Tamil, Telugu, Bengali
- [ ] PostgreSQL / MongoDB persistent storage
- [ ] Docker Compose deployment configuration

---

## 📄 External Resources

| Resource | Usage |
|---|---|
| OpenAI GPT-4o | Clinical entity extraction (optional) |
| WHO ICD-10-CM | Diagnosis code mapping |
| AMA CPT Codes | Procedure billing codes |
| NIH RxNorm | Medication identifier codes |
| Regenstrief LOINC | Lab test codes |
| HL7 FHIR R4 Spec | FHIR resource structure definitions |
| pdfplumber | PDF text + table extraction |
| pytesseract | OCR for scanned documents |

---

## 👥 Team

**Team LegacyCoderz** — Built for **HackMatrix 2.0** organized by **NJACK, IIT Patna** × **Jilo Health**

> Track 2: AI-Powered Data Normalization Engine

---

## 📜 License

Built for HackMatrix 2.0 hackathon submission. All rights reserved © Team LegacyCoderz 2026.
