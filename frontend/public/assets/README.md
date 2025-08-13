# MADOC Compliance Suite — World‑Class Redesign

iPad‑first, offline‑capable PWA for inspections, drills, hygiene, and discrepancy tracking. Built to mirror **103 DOC 730/750** exactly; policy PDFs are stored verbatim and hash‑verified.

## Highlights
- **iPad‑ready PWA**: full‑screen, big tap targets, offline sync, installable.
- **Verbatim policy**: PDFs streamed as‑is from `policy/` with SHA‑256 integrity check.
- **Guided workflows**: Weekly/Monthly inspections, Fire Watch, Functional Testing, Hot Work, Evacuation ERDs, Discrepancy Boards, Hygiene/Defender, Razor issuance, Heat events.
- **Accessibility**: high contrast, large text option, keyboardless numeric pads.
- **Design system**: professional palette (dark blues/gray/white), MUI theme, tokens.

## Compliance mapping
- Weekly Inspection = 103 DOC 730 **Attachment #2** (p.21). 
- Fire Watch Log = 103 DOC 730 **Attachment #3** (p.22).
- Functional Testing cadence = 103 DOC 730 **Attachment #4** (pp.23–24).
- Hot Work Permit = 103 DOC 730 **Attachment #5**.
- Evacuation Map Legend = 103 DOC 730 **Attachment #6**.
- Monthly Packet = 103 DOC 730 **Attachment #7** including Electric Fire Pump Monthly Report (p.53) and Monthly Synopsis (p.54); Discrepancy Boards = **Attachment #8** (pp.55–59).
- EHSO, weekly/monthly process references in 103 DOC **750.04–.07** and Defender training **Attachment #1**.

## Monorepo
- `apps/web` — Next.js 14 + TypeScript + MUI + next-pwa + idb (offline).
- `apps/api` — FastAPI + SQLAlchemy + SQLite/Postgres. PDF export + hash gate.
- `policy/` — official PDFs (**verbatim**) + `hashes.json`.
- `infra/` — docker-compose for web, api, db.
- `.github/workflows` — CI for build/test.

## Run (Docker)
```bash
docker compose -f infra/docker-compose.yml up --build
# Web: http://localhost:3000  API: http://localhost:8080/api
```

## Run (dev)
```bash
# API
cd apps/api && python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8080
# Web
cd ../../apps/web
npm i
npm run dev
```

## Security
- JWT Bearer (Azure AD RS256). Set `AZURE_AD_TENANT`, `AZURE_AD_AUDIENCE` and `JWKS_URL`.
- File integrity check on policy PDFs (SHA‑256).

## Notes
- All policy files render verbatim. The UI never reflows policy text.
