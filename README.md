# CivilsPulse

Verified UPSC previous-year questions, Prelims mocks, and transparent preparation analytics.

**Product principles**

1. Every factual question shown to users has traceable official provenance.
2. Every published PYQ passes human admin verification (never auto-publish from OCR).
3. Every score is deterministic and reproducible.
4. AI insights (later) are always labeled as assistance — never official UPSC evaluation.

## Architecture (MVP)

```
Next.js (App Router) ── Auth + RBAC + PYQ + Mocks + Admin
        │
   PostgreSQL 16 (Prisma)     Redis (Phase 2)     FastAPI ingestion (stub)
        │                                              │
   verified PYQs ◄── admin verify ◄── EXTRACTED ◄── PDF/OCR pipeline
```

## Stack

| Layer | Choice |
|-------|--------|
| Web | Next.js 16 App Router, React 19, TypeScript, Tailwind 4, `src/` |
| Auth | Auth.js (NextAuth v5) — email/password + optional Google |
| DB | PostgreSQL 16 + Prisma 7 |
| Ingestion | Python FastAPI (`services/ingestion`) |
| Deploy targets | Vercel (web) · Railway (ingestion) · Supabase (Postgres) · managed Redis |

## MVP scope (this repo now)

- [x] Identity: register / login, roles (`STUDENT`, `ADMIN`), plan entitlements (server-side)
- [x] PYQ model with official source URL, confidence, verification status
- [x] Admin verification queue (approve / needs-fix / reject)
- [x] PYQ Explorer (filters + provenance links; approved only)
- [x] Topic tagging
- [x] Prelims mock engine (timer, autosave, negative marking, lock on submit)
- [x] Deterministic scoring + basic dashboard analytics
- [x] Ingestion service **stub** (contract only)
- [ ] Full pdfplumber + PaddleOCR pipeline
- [ ] Stripe billing, adaptive tests, Mains AI eval, peer percentiles (post-MVP)

## Quick start

### 1. Infrastructure

```bash
cp .env.example .env
# set AUTH_SECRET: openssl rand -base64 32
docker compose up -d
```

### 2. Database

```bash
npm install
npx prisma generate
npx prisma db push
# optional FTS:
# psql "$DATABASE_URL" -f prisma/sql/fts.sql
npm run db:seed
```

### 3. Web app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

**Seed accounts**

| Email | Password | Role |
|-------|----------|------|
| `admin@civilspulse.local` | `password123` | ADMIN |
| `student@civilspulse.local` | `password123` | STUDENT |

### 4. Ingestion stub (optional)

```bash
cd services/ingestion
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

## Key routes

| Path | Purpose |
|------|---------|
| `/pyq` | Verified PYQ explorer |
| `/mocks` | Start / resume Prelims mocks |
| `/dashboard` | Attempts + weak topics |
| `/admin` | Human verification queue |
| `/api/health` | Health check |

## Notes on seed data

Seed questions are **illustrative wiring fixtures** linked to a real official UPSC PDF URL. They are explicitly marked for local MVP testing — production content must come from the ingestion pipeline and admin verification against the official PDF.

## Post-MVP roadmap

Adaptive practice · Mains answer evaluation (provider-abstracted AI) · spaced repetition · Stripe Free/Pro/Institution · institution tenants · PostHog/Sentry · BullMQ workers · peer percentiles.
