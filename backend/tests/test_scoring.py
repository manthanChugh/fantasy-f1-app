import pytest
from app.models import RaceResult
from app.scoring import calculate_score

def test_perfect_race():
    result = RaceResult(
        driver_id="verstappen",
        finish_position=1,
        grid_position=1,
        quali_segment=3,
        is_pole=True,
        beat_teammate=True,
        fastest_lap=True,
        fastest_pitstop=True,
        dotd=True
    )
    score = calculate_score(result)
    
    assert score.total_points == 46
    assert score.breakdown["finish"] == 10
    assert score.breakdown["qualifying"] == 3
    assert score.breakdown["win_bonus"] == 7
    assert score.breakdown["podium_bonus"] == 5
    assert score.breakdown["points_finish_bonus"] == 3
    assert score.breakdown["beat_teammate"] == 5
    assert score.breakdown["dotd"] == 10
    assert score.breakdown["fastest_lap"] == 2
    assert score.breakdown["fastest_pitstop"] == 1

def test_dnf_crash():
    result = RaceResult(
        driver_id="sargeant",
        finish_position=20,
        grid_position=15,
        quali_segment=1,
        dnf_reason="crash",
        quali_crash=True,
        beat_teammate=False
    )
    score = calculate_score(result)
    
    assert score.total_points == -4
    assert score.breakdown.get("race_crash") == -3
    assert score.breakdown.get("quali_crash") == -1

def test_sprint_weekend():
    result = RaceResult(
        driver_id="piastri",
        finish_position=2,
        grid_position=4,
        quali_segment=3,
        beat_teammate=True,
        sprint_pole=True,
        sprint_finish_position=1
    )
    score = calculate_score(result)
    
    assert score.total_points == 30
    assert score.breakdown["finish"] == 8
    assert score.breakdown["qualifying"] == 2
    assert score.breakdown["sprint_pole"] == 2
    assert score.breakdown["sprint_win"] == 2
    assert score.breakdown["sprint_points_finish"] == 1
    assert score.breakdown["positions_gained"] == 2

def test_penalties_and_lapped():
    result = RaceResult(
        driver_id="alonso",
        finish_position=14,
        grid_position=10,
        quali_segment=2,
        beat_teammate=False,
        laps_lapped=2,
        penalties=1
    )
    score = calculate_score(result)
    
    # Finish 14 = 0
    # Quali Q2 = 1
    # Laps lapped = -2
    # Penalty = -1
    # Total = -2
    assert score.total_points == -2
    assert score.breakdown["qualifying"] == 1
    assert score.breakdown["laps_lapped"] == -2
    assert score.breakdown["penalties"] == -1
