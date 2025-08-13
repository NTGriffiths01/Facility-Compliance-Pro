from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Integer, Boolean, DateTime, JSON, ForeignKey
from sqlalchemy.sql import func
from database import Base

class WeeklyInspection(Base):
    __tablename__ = "weekly_inspections"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    location: Mapped[str] = mapped_column(String, index=True)
    data: Mapped[dict] = mapped_column(JSON)
    created_at: Mapped = mapped_column(DateTime(timezone=True), server_default=func.now())

class MonthlyInspection(Base):
    __tablename__ = "monthly_inspections"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    institution_name: Mapped[str] = mapped_column(String, index=True)
    month: Mapped[int] = mapped_column(Integer)
    year: Mapped[int] = mapped_column(Integer)
    data: Mapped[dict] = mapped_column(JSON)
    created_at: Mapped = mapped_column(DateTime(timezone=True), server_default=func.now())

class FireWatch(Base):
    __tablename__ = "fire_watch"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    location: Mapped[str] = mapped_column(String, index=True)
    system_out_at: Mapped[str] = mapped_column(String)
    notified_fd_at: Mapped[str] = mapped_column(String, nullable=True)
    entries: Mapped[list] = mapped_column(JSON, default=list)

class HotWorkPermit(Base):
    __tablename__ = "hot_work_permits"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    location: Mapped[str] = mapped_column(String)
    operator_name: Mapped[str] = mapped_column(String)
    pai_name: Mapped[str] = mapped_column(String)
    start_at: Mapped[str] = mapped_column(String)
    data: Mapped[dict] = mapped_column(JSON)

class Discrepancy(Base):
    __tablename__ = "discrepancies"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    board: Mapped[str] = mapped_column(String)  # maintenance|fire-alarm|suppression|dph|completed
    location: Mapped[str] = mapped_column(String)
    description: Mapped[str] = mapped_column(String)
    assigned_to: Mapped[str] = mapped_column(String, nullable=True)
    projected_completion: Mapped[str] = mapped_column(String, nullable=True)
    status: Mapped[str] = mapped_column(String, default="open")
