"""
MedNorm AI — Health Controller
================================
GET /api/health — Returns service status, version, and team info.
Used by judges and monitoring to confirm the backend is running.
"""

from fastapi import APIRouter

router = APIRouter(prefix="/api", tags=["Health"])


@router.get(
    "/health",
    summary="Service health check",
    response_description="Service status and version info",
)
def health():
    """Returns a simple health check confirming the backend is running."""
    return {
        "status": "ok",
        "service": "MedNorm AI",
        "version": "1.0.0",
        "team": "LegacyCoderz",
        "hackathon": "HackMatrix 2.0 × Jilo Health",
        "track": "Track 2 — AI-Powered Data Normalization Engine",
    }
