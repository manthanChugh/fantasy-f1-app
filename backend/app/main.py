from fastapi import FastAPI
from app.routers import teams, scores, leaderboard, admin

app = FastAPI(title="Fantasy F1 API")

app.include_router(teams.router)
app.include_router(scores.router)
app.include_router(leaderboard.router)
app.include_router(admin.router)

@app.get("/health")
def health_check():
    return {"status": "ok"}
