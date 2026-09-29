"""
CivilsPulse ingestion microservice (MVP stub).

Pipeline (planned):
  UPSC PDF URL → download → pdfplumber / PaddleOCR → segment → validate →
  confidence score → POST extracted questions as VerificationStatus=EXTRACTED

Never publishes to students. Next.js admin workflow is the only path to APPROVED.
"""

from __future__ import annotations

import hashlib
import os
from typing import Any

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, HttpUrl, Field

app = FastAPI(
    title="CivilsPulse Ingestion",
    version="0.1.0",
    description="Document ingestion & OCR segmentation for UPSC PYQs",
)


class IngestRequest(BaseModel):
    official_pdf_url: HttpUrl
    year: int = Field(ge=2014, le=2025)
    paper: str  # e.g. PRELIMS_GS1
    language: str = "EN"
    force_ocr: bool = False


class ExtractedQuestion(BaseModel):
    question_number: int | None
    stem: str
    option_a: str | None = None
    option_b: str | None = None
    option_c: str | None = None
    option_d: str | None = None
    correct_option: str | None = None
    extraction_confidence: float
    source_metadata: dict[str, Any]


class IngestResponse(BaseModel):
    job_id: str
    status: str
    official_pdf_url: str
    checksum: str
    questions: list[ExtractedQuestion]
    note: str


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "service": "ingestion"}


@app.post("/ingest", response_model=IngestResponse)
def ingest(body: IngestRequest) -> IngestResponse:
    """
    MVP stub: does not yet run pdfplumber/PaddleOCR.
    Returns a deterministic placeholder payload so the Next.js admin queue
    contract can be integrated end-to-end.
    """
    url = str(body.official_pdf_url)
    checksum = hashlib.sha256(url.encode()).hexdigest()
    job_id = checksum[:16]

    if body.year < 2014 or body.year > 2025:
        raise HTTPException(status_code=400, detail="year out of supported range")

    # Placeholder segmented question — real implementation will parse PDF pages.
    questions = [
        ExtractedQuestion(
            question_number=1,
            stem="[STUB] Extracted stem pending pdfplumber/PaddleOCR pipeline",
            option_a="Option A",
            option_b="Option B",
            option_c="Option C",
            option_d="Option D",
            correct_option=None,
            extraction_confidence=0.4,
            source_metadata={
                "extractor": "stub",
                "force_ocr": body.force_ocr,
                "paper": body.paper,
                "language": body.language,
                "page": 1,
            },
        )
    ]

    return IngestResponse(
        job_id=job_id,
        status="EXTRACTED_PENDING_ADMIN",
        official_pdf_url=url,
        checksum=checksum,
        questions=questions,
        note=(
            "Stub only. Wire pdfplumber + PaddleOCR, then POST results to "
            "Next.js as EXTRACTED — never APPROVED."
        ),
    )


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=int(os.getenv("PORT", "8000")),
        reload=True,
    )
