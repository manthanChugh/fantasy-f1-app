from fastapi import APIRouter, HTTPException, Depends, Header
from pydantic import BaseModel
from typing import List, Optional
from app.db import get_supabase
import os

router = APIRouter(prefix="/admin", tags=["admin"])

def verify_admin(admin_email: Optional[str] = Header(None)):
    expected_email = os.environ.get("ADMIN_EMAIL")
    if not admin_email or admin_email != expected_email:
        raise HTTPException(status_code=403, detail="Not authorized")

@router.post("/race/lock", dependencies=[Depends(verify_admin)])
def lock_race(race_id: str):
    sb = get_supabase()
    sb.table("team_selections").update({"is_locked": True}).eq("race_id", race_id).execute()
    return {"message": f"Race {race_id} locked"}

class PriceUpdate(BaseModel):
    driver_id: str
    new_price: float

@router.post("/prices/update", dependencies=[Depends(verify_admin)])
def update_prices(updates: List[PriceUpdate]):
    sb = get_supabase()
    for update in updates:
        sb.table("drivers").update({"price_m": update.new_price}).eq("id", update.driver_id).execute()
    return {"message": "Prices updated"}
