# CivilsPulse Ingestion Service
#
# MVP: FastAPI stub with /health and /ingest contracts.
# Next: pdfplumber text extraction, PaddleOCR for scanned/bilingual PDFs,
# deterministic segmentation, confidence scoring, push to Next.js as EXTRACTED only.

python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
