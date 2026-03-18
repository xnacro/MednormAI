# Contributing to MedNorm AI

> Built for HackMatrix 2.0 × Jilo Health — Team LegacyCoderz

---

## Project Setup

See [README.md](./README.md) for full setup instructions.

**TL;DR:**
```bash
# Backend
python -m venv venv && venv\Scripts\activate
pip install -r backend/requirements.txt
python -m uvicorn backend.main:app --reload --port 8000

# Frontend (separate terminal)
npm install && npm run dev
```

---

## Architecture Overview

```
mednorm-ai/
├── app/            ← Next.js pages (frontend)
├── components/     ← Reusable React components
├── lib/            ← API client + demo data
├── backend/
│   ├── controllers/  ← FastAPI route handlers (MVC)
│   ├── services/     ← PDF parser, NLP, field mapper (business logic)
│   ├── models.py     ← Pydantic schemas
│   ├── store.py      ← In-memory record store
│   └── tests/        ← pytest suite
```

---

## Running Tests

```bash
# Run all tests
pytest backend/tests/ -v

# Specific test classes
pytest backend/tests/test_api.py::TestClinicalNLP -v
pytest backend/tests/test_api.py::TestBillingExtraction -v
pytest backend/tests/test_api.py::TestPatientNameExtraction -v
pytest backend/tests/test_api.py::TestFieldMapper -v
```

All 33+ tests should pass before submitting a PR.

---

## Code Style

- **Python:** Follow PEP 8. Type hints on all public methods.
- **JavaScript:** Functional React components, hooks-based state.
- **No `console.log` in committed code** (use the logger in Python).
- **No hardcoded secrets** — always use `.env` variables.

---

## Adding New Clinical Codes

To add new ICD-10, CPT, RxNorm, or LOINC mappings:

1. **ICD-10 / CPT patterns** → `backend/services/clinical_nlp.py`  
   - Add entries to `icd_patterns` or `drug_patterns` dicts.

2. **LOINC lab tests** → `backend/services/clinical_nlp.py`  
   - Add entries to the `patterns` list in `_extract_lab_values()`.

3. **FHIR resources** → `backend/services/field_mapper.py`  
   - The `to_fhir()` method generates bundles from structured data.

4. **Write a test** → `backend/tests/test_api.py`  
   - Add to the relevant `TestClinicalNLP` or `TestFieldMapper` class.

---

## API Endpoint Guidelines

New endpoints go in `backend/controllers/`. Follow the existing pattern:

```python
from fastapi import APIRouter, HTTPException
from backend.store import records_store

router = APIRouter(prefix="/api", tags=["YourTag"])

@router.get("/your-endpoint")
def your_handler():
    ...
```

Register the new router in `backend/main.py`.

---

## Environment Variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `OPENAI_API_KEY` | No | — | Enables GPT-4o NLP (demo mode works without it) |
| `NEXT_PUBLIC_API_URL` | No | `http://localhost:8000` | Backend URL for frontend |
| `APP_ENV` | No | `development` | App environment |

---

## Questions?

Open an issue or contact the team. Happy hacking! 🏥
