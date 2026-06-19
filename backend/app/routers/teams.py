from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
from app.db import get_supabase

router = APIRouter(prefix="/teams", tags=["teams"])

class TeamSelection(BaseModel):
    driver_ids: List[str]
    race_id: str

@router.get("/{player_id}")
def get_team(player_id: str):
    sb = get_supabase()
    res = sb.table("team_selections").select("*").eq("player_id", player_id).order("submitted_at", desc=True).limit(1).execute()
    if not res.data:
        return {"team": []}
    return res.data[0]

@router.post("/{player_id}")
def submit_team(player_id: str, selection: TeamSelection):
    if len(selection.driver_ids) != 5:
        raise HTTPException(status_code=400, detail="Must select exactly 5 drivers")
    
    sb = get_supabase()
    drivers_res = sb.table("drivers").select("price_m").in_("id", selection.driver_ids).execute()
    if not drivers_res.data or len(drivers_res.data) != 5:
        raise HTTPException(status_code=400, detail="Invalid driver IDs")
        
    total_cost = sum(d["price_m"] for d in drivers_res.data)
    if total_cost > 100:
        raise HTTPException(status_code=400, detail=f"Over budget: {total_cost}M")
        
    res = sb.table("team_selections").insert({
        "player_id": player_id,
        "race_id": selection.race_id,
        "driver_ids": selection.driver_ids
    }).execute()
    
    return {"message": "Team submitted successfully", "data": res.data}
