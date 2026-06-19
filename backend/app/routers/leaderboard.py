from fastapi import APIRouter
from app.db import get_supabase

router = APIRouter(prefix="/leaderboard", tags=["leaderboard"])

@router.get("/")
def get_leaderboard():
    sb = get_supabase()
    res = sb.table("player_race_scores").select("player_id, total_points, players(name)").execute()
    
    totals = {}
    if res.data:
        for entry in res.data:
            pid = entry["player_id"]
            if pid not in totals:
                # Need to handle potential nested missing data defensively
                player_name = entry.get("players", {}).get("name", "Unknown") if entry.get("players") else "Unknown"
                totals[pid] = {"player_id": pid, "name": player_name, "total_points": 0}
            totals[pid]["total_points"] += entry["total_points"]
            
    leaderboard = list(totals.values())
    leaderboard.sort(key=lambda x: x["total_points"], reverse=True)
    return leaderboard
