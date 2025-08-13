from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any

class WeeklyInspectionIn(BaseModel):
    location: str
    data: Dict[str, Any]

class WeeklyInspectionOut(WeeklyInspectionIn):
    id: int

class MonthlyInspectionIn(BaseModel):
    institution_name: str
    month: int = Field(..., ge=1, le=12)
    year: int
    data: Dict[str, Any]

class MonthlyInspectionOut(MonthlyInspectionIn):
    id: int

class FireWatchStart(BaseModel):
    location: str
    system_out_at: str
    notified_fd_at: Optional[str] = None

class FireWatchEntry(BaseModel):
    time: str
    location: str
    name: str
    signature: str

class HotWorkPermitIn(BaseModel):
    location: str
    operator_name: str
    pai_name: str
    start_at: str
    data: Dict[str, Any]

class DiscrepancyIn(BaseModel):
    board: str
    location: str
    description: str
    assigned_to: Optional[str] = None
    projected_completion: Optional[str] = None
    status: Optional[str] = "open"
