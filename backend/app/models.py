from pydantic import BaseModel
from typing import Optional, Dict

class RaceResult(BaseModel):
    driver_id: str
    finish_position: int
    grid_position: int
    quali_segment: int  # 1, 2, or 3 (Q1, Q2, Q3)
    is_pole: bool = False
    beat_teammate: bool = False
    dotd: bool = False
    fastest_lap: bool = False
    fastest_pitstop: bool = False
    dnf_reason: Optional[str] = None  # "mechanical", "crash", or None
    quali_crash: bool = False
    laps_lapped: int = 0
    penalties: int = 0
    sprint_pole: bool = False
    sprint_finish_position: Optional[int] = None

class DriverScore(BaseModel):
    driver_id: str
    total_points: int
    breakdown: Dict[str, int]
