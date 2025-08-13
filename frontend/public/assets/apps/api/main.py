import os, asyncio
from fastapi import FastAPI, HTTPException, Depends, Path
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from database import Base, engine, get_session
from models import WeeklyInspection, MonthlyInspection, FireWatch, HotWorkPermit, Discrepancy
from schemas import *
from pdf_utils import stream_policy, stamp_summary_pdf
from fastapi.responses import StreamingResponse

app = FastAPI(title="MADOC Compliance Suite API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

@app.get("/api/health")
async def health():
    return {"status": "ok"}

# Policy streaming (verbatim)
@app.get("/api/policy-documents/{docId}")
async def get_policy(docId: str = Path(..., pattern="^(103DOC730|103DOC750)$")):
    try:
        return stream_policy(docId)
    except FileNotFoundError:
        raise HTTPException(404, "Not found")
    except ValueError:
        raise HTTPException(409, "hash mismatch")

# Weekly
@app.post("/api/inspections/weekly", response_model=WeeklyInspectionOut, status_code=201)
async def create_weekly(payload: WeeklyInspectionIn, session: AsyncSession = Depends(get_session)):
    obj = WeeklyInspection(location=payload.location, data=payload.data)
    session.add(obj); await session.commit(); await session.refresh(obj)
    return WeeklyInspectionOut(id=obj.id, location=obj.location, data=obj.data)

@app.get("/api/inspections/weekly", response_model=List[WeeklyInspectionOut])
async def list_weekly(session: AsyncSession = Depends(get_session)):
    res = await session.execute(select(WeeklyInspection))
    rows = res.scalars().all()
    return [WeeklyInspectionOut(id=o.id, location=o.location, data=o.data) for o in rows]

# Monthly
@app.post("/api/inspections/monthly", response_model=MonthlyInspectionOut, status_code=201)
async def create_monthly(payload: MonthlyInspectionIn, session: AsyncSession = Depends(get_session)):
    obj = MonthlyInspection(institution_name=payload.institution_name, month=payload.month, year=payload.year, data=payload.data)
    session.add(obj); await session.commit(); await session.refresh(obj)
    return MonthlyInspectionOut(id=obj.id, institution_name=obj.institution_name, month=obj.month, year=obj.year, data=obj.data)

@app.get("/api/inspections/monthly", response_model=List[MonthlyInspectionOut])
async def list_monthly(session: AsyncSession = Depends(get_session)):
    res = await session.execute(select(MonthlyInspection))
    rows = res.scalars().all()
    return [MonthlyInspectionOut(id=o.id, institution_name=o.institution_name, month=o.month, year=o.year, data=o.data) for o in rows]

# Fire Watch
@app.post("/api/fire-watch", status_code=201)
async def start_fire_watch(payload: FireWatchStart, session: AsyncSession = Depends(get_session)):
    obj = FireWatch(location=payload.location, system_out_at=payload.system_out_at, notified_fd_at=payload.notified_fd_at, entries=[])
    session.add(obj); await session.commit(); await session.refresh(obj)
    return {"id": obj.id}

@app.post("/api/fire-watch/{watch_id}/entries", status_code=201)
async def add_fire_watch_entry(watch_id: int, payload: FireWatchEntry, session: AsyncSession = Depends(get_session)):
    res = await session.get(FireWatch, watch_id)
    if not res: raise HTTPException(404, "not found")
    entries = res.entries or []
    entries.append(payload.model_dump())
    res.entries = entries
    await session.commit()
    return {"ok": True}

# Hot Work
@app.post("/api/hot-work/permits", status_code=201)
async def create_permit(payload: HotWorkPermitIn, session: AsyncSession = Depends(get_session)):
    obj = HotWorkPermit(location=payload.location, operator_name=payload.operator_name, pai_name=payload.pai_name, start_at=payload.start_at, data=payload.data)
    session.add(obj); await session.commit(); await session.refresh(obj)
    return {"id": obj.id}

# Discrepancies
@app.post("/api/discrepancies", status_code=201)
async def create_discrepancy(payload: DiscrepancyIn, session: AsyncSession = Depends(get_session)):
    obj = Discrepancy(**payload.model_dump())
    session.add(obj); await session.commit(); await session.refresh(obj)
    return {"id": obj.id}

@app.get("/api/discrepancies")
async def list_discrepancies(board: str | None = None, session: AsyncSession = Depends(get_session)):
    stmt = select(Discrepancy) if not board else select(Discrepancy).where(Discrepancy.board == board)
    res = await session.execute(stmt)
    rows = res.scalars().all()
    return [{
        "id": o.id, "board": o.board, "location": o.location, "description": o.description,
        "assigned_to": o.assigned_to, "projected_completion": o.projected_completion, "status": o.status
    } for o in rows]

# Simple PDF export endpoint
@app.post("/api/export/weekly/pdf")
async def export_weekly_pdf(payload: WeeklyInspectionIn):
    pdf_bytes = stamp_summary_pdf("Weekly Fire/Environmental Health & Safety Inspection", {"location": payload.location, **payload.data})
    return StreamingResponse(iter([pdf_bytes]), media_type="application/pdf")
