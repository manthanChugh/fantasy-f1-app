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

def process_race_scores(race_id: str):
    """
    Orchestrates the entire scoring pipeline for a race week.
    1. Fetches race_results from Supabase
    2. Calculates and saves driver_scores
    3. Fetches team_selections and calculates/saves player_race_scores
    4. Updates driver season_points
    """
    from app.db import get_supabase
    
    supabase = get_supabase()
    
    # 1. Fetch raw race results
    print(f"Fetching race results for {race_id}...")
    res = supabase.table('race_results').select('*').eq('race_id', race_id).execute()
    race_results = res.data
    
    if not race_results:
        print(f"No race results found for race_id {race_id}.")
        return
        
    driver_scores_dict = {}
    
    # 2. Calculate and save driver scores
    print("Calculating driver scores...")
    for row in race_results:
        # Convert dict to Pydantic model
        result_model = RaceResult(**row)
        score = calculate_score(result_model)
        
        # Save to DB
        supabase.table('driver_scores').upsert({
            'race_id': race_id,
            'driver_id': score.driver_id,
            'total_points': score.total_points,
            'breakdown': score.breakdown
        }).execute()
        
        driver_scores_dict[score.driver_id] = score.total_points
        
    # 3. Calculate player scores based on team selections
    print("Calculating player scores...")
    team_res = supabase.table('team_selections').select('*').eq('race_id', race_id).execute()
    team_selections = team_res.data
    
    for team in team_selections:
        player_id = team['player_id']
        driver_ids = team['driver_ids']
        
        total_player_points = 0
        driver_breakdown = {}
        
        for d_id in driver_ids:
            pts = driver_scores_dict.get(d_id, 0)
            total_player_points += pts
            driver_breakdown[d_id] = pts
            
        # Save to DB
        supabase.table('player_race_scores').upsert({
            'player_id': player_id,
            'race_id': race_id,
            'total_points': total_player_points,
            'driver_breakdown': driver_breakdown
        }).execute()
        
    # 4. Update total season points for drivers
    print("Updating total season points for drivers...")
    # Fetch current points
    drivers_res = supabase.table('drivers').select('id, season_points').execute()
    
    for d in drivers_res.data:
        driver_id = d['id']
        if driver_id in driver_scores_dict:
            new_total = (d.get('season_points') or 0) + driver_scores_dict[driver_id]
            supabase.table('drivers').update({'season_points': new_total}).eq('id', driver_id).execute()
            
    print("Scoring pipeline complete!")
