"""
MedNorm AI — FastAPI Application Entry Point
============================================
Team LegacyCoderz | HackMatrix 2.0 × Jilo Health

Starts the FastAPI server with CORS enabled for the Next.js frontend.
Registers all API routers from the controllers package.

Run with:
    python -m uvicorn backend.main:app --reload --port 8000

API Docs: http://localhost:8000/docs
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import logging

from backend.controllers import health, ingest, pipeline, records, fhir, stats

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)

app = FastAPI(
    title="MedNorm AI API",
    description=(
        "AI-Powered Clinical Data Normalization Engine — HackMatrix 2.0 · Team LegacyCoderz\n\n"
        "Converts unstructured Indian hospital documents (PDFs, scanned images, plain text) "
        "into structured clinical data with ICD-10-CM, CPT, RxNorm & LOINC codes, "
        "then generates HL7 FHIR R4 compliant bundles.\n\n"
        "**Demo Mode:** All endpoints work without an OpenAI API key using rule-based NLP fallback."
    ),
    version="1.0.0",
    contact={
        "name": "Team LegacyCoderz",
        "url": "https://github.com/legacycoderz/mednorm-ai",
    },
    license_info={
        "name": "HackMatrix 2.0 Hackathon Submission",
    },
    openapi_tags=[
        {"name": "Health", "description": "Service health check"},
        {"name": "Pipeline", "description": "Core document processing pipeline"},
        {"name": "Records", "description": "Clinical record CRUD operations"},
        {"name": "FHIR", "description": "HL7 FHIR R4 bundle generation and retrieval"},
        {"name": "Stats", "description": "Dashboard statistics"},
        {"name": "Ingest", "description": "Raw document ingestion and text extraction"},
    ],
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router)
app.include_router(ingest.router)
app.include_router(pipeline.router)
app.include_router(records.router)
app.include_router(fhir.router)
app.include_router(stats.router)

if __name__ == "__main__":
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
