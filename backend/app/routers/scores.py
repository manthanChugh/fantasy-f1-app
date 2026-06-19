from fastapi import APIRouter
from app.db import get_supabase

router = APIRouter(prefix="/scores", tags=["scores"])

@router.get("/{race_id}")
def get_race_scores(race_id: str):
    sb = get_supabase()
    res = sb.table("player_race_scores").select("*, players(name)").eq("race_id", race_id).order("total_points", desc=True).execute()
    return res.data

@router.get("/{race_id}/{player_id}")
def get_player_race_score(race_id: str, player_id: str):
    sb = get_supabase()
    res = sb.table("player_race_scores").select("*").eq("race_id", race_id).eq("player_id", player_id).execute()
    if not res.data:
        return {}
    return res.data[0]
