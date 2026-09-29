# CivilsPulse

Verified UPSC previous-year questions, Prelims mocks, and transparent preparation analytics.

## Product principles

1. Every factual question shown to users has traceable official provenance.
2. Every published PYQ passes human admin verification (never auto-publish from OCR).
3. Every score is deterministic and reproducible.
4. AI insights (later) are always labeled as assistance — never official UPSC evaluation.

## Stack

| Layer | Choice |
|-------|--------|
| Web | Next.js App Router, React 19, TypeScript, Tailwind 4 (`src/`) |
| Auth | Auth.js — email/password + owner auto-auth + optional Google |
| DB | PostgreSQL 16 + Prisma |
| Ingestion | FastAPI stub (`services/ingestion`) |

## Quick start

```bash
cp .env.example .env
docker compose up -d
npm install
npx prisma db push
npm run db:seed
npm run dev
```

Open http://localhost:3000

**Owner login:** `anushkasinghrajputt@gmail.com` / `password123` (ADMIN)  
**All seed users** share password `password123` (20 accounts).

## Seed content

- 20 users (owner admin + aspirants)
- Prelims topics across Polity, Economy, History, Geography, Environment, S&T, Art & Culture, IR, Security
- Curated PYQs with official UPSC PDF URLs
- Mixed + topic-wise mock templates

## Key routes

| Path | Purpose |
|------|---------|
| `/pyq` | Verified PYQ explorer |
| `/mocks` | Prelims mocks |
| `/dashboard` | Attempts + weak topics |
| `/admin` | Human verification queue |

## Repo layout

```
src/app          App Router pages + API
src/components   UI, brand, layout
src/lib          Auth, scoring, mocks, RBAC
prisma/data      Seed datasets (users, topics, PYQs)
services/ingestion   FastAPI OCR/ingest stub
public/brand     Official CivilsPulse logo
```
