from app.models import RaceResult, DriverScore

def calculate_score(result: RaceResult) -> DriverScore:
    breakdown = {}
    total_points = 0
    
    # 1. Race Finish
    finish_pts = 0
    if result.finish_position == 1: finish_pts = 10
    elif result.finish_position == 2: finish_pts = 8
    elif result.finish_position == 3: finish_pts = 6
    elif result.finish_position == 4: finish_pts = 4
    elif result.finish_position == 5: finish_pts = 2
    elif result.finish_position == 6: finish_pts = 1
    if finish_pts > 0:
        breakdown["finish"] = finish_pts
        total_points += finish_pts

    # 2. Qualifying
    quali_pts = 0
    if result.is_pole:
        quali_pts = 3
    elif result.quali_segment == 3:
        quali_pts = 2
    elif result.quali_segment == 2:
        quali_pts = 1
    
    if quali_pts > 0:
        breakdown["qualifying"] = quali_pts
        total_points += quali_pts

    # 3. Bonuses
    # Race win
    if result.finish_position == 1:
        breakdown["win_bonus"] = 7
        total_points += 7
    # Podium finish
    if result.finish_position <= 3:
        breakdown["podium_bonus"] = 5
        total_points += 5
    # Points finish
    if result.finish_position <= 10:
        breakdown["points_finish_bonus"] = 3
        total_points += 3
        
    # Beat teammate
    if result.beat_teammate:
        breakdown["beat_teammate"] = 5
        total_points += 5
        
    # Positions gained
    positions_gained = result.grid_position - result.finish_position
    if positions_gained > 0:
        breakdown["positions_gained"] = positions_gained
        total_points += positions_gained
        
    # Driver of the day
    if result.dotd:
        breakdown["dotd"] = 10
        total_points += 10
        
    # Fastest lap
    if result.fastest_lap:
        breakdown["fastest_lap"] = 2
        total_points += 2
        
    # Fastest pit stop
    if result.fastest_pitstop:
        breakdown["fastest_pitstop"] = 1
        total_points += 1

    # 4. Sprint Weekend
    if result.sprint_pole:
        breakdown["sprint_pole"] = 2
        total_points += 2
    
    if result.sprint_finish_position is not None:
        if result.sprint_finish_position == 1:
            breakdown["sprint_win"] = 2
            total_points += 2
        if result.sprint_finish_position <= 8: # Assuming standard top 8 get points in sprint
            breakdown["sprint_points_finish"] = 1
            total_points += 1

    # 5. Penalties
    if result.dnf_reason == "mechanical":
        breakdown["mechanical_dnf"] = -1
        total_points -= 1
    elif result.dnf_reason == "crash":
        breakdown["race_crash"] = -3
        total_points -= 3
        
    if result.quali_crash:
        breakdown["quali_crash"] = -1
        total_points -= 1
        
    if result.laps_lapped > 0:
        lap_penalty = -1 * result.laps_lapped
        breakdown["laps_lapped"] = lap_penalty
        total_points += lap_penalty
        
    if result.penalties > 0:
        penalty_pts = -1 * result.penalties
        breakdown["penalties"] = penalty_pts
        total_points += penalty_pts

    return DriverScore(
        driver_id=result.driver_id,
        total_points=total_points,
        breakdown=breakdown
    )
