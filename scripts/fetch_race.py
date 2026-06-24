import sys
import os
import requests
from collections import defaultdict
from typing import Dict, Any

# Add backend directory to path so we can import the Pydantic models
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'backend'))
try:
    # pyrefly: ignore [missing-import]
    from app.models import RaceResult
except ImportError:
    print("Warning: Could not import RaceResult from backend.app.models. Proceeding without validation.")
    RaceResult = None

BASE_URL = "https://api.openf1.org/v1"

# Mapping from OpenF1 driver number to our slug
DRIVER_MAP = {
    1:  "verstappen",
    2:  "sargeant", # Maybe replaced by Colapinto?
    3:  "ricciardo",
    4:  "norris",
    10: "gasly",
    11: "perez",
    14: "alonso",
    16: "leclerc",
    18: "stroll",
    20: "magnussen",
    22: "tsunoda",
    23: "albon",
    24: "zhou",
    27: "hulkenberg",
    31: "ocon",
    44: "hamilton",
    55: "sainz",
    63: "russell",
    77: "bottas",
    81: "piastri",
    12: "antonelli", # example new driver number for 2025
    87: "bearman",   # example
    43: "colapinto",
    # Add others as needed based on 2025 grid
}

def fetch_json(url: str) -> list:
    try:
        response = requests.get(url)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.HTTPError as e:
        print(f"Warning: HTTP Error fetching {url}: {e}")
        return []
    except Exception as e:
        print(f"Warning: Error fetching {url}: {e}")
        return []

def fetch_race_data(session_key: str):
    print(f"Fetching data for session: {session_key}")
    
    # We will build up a dictionary of properties for each driver
    driver_data = defaultdict(lambda: {
        "finish_position": 20,
        "grid_position": 20,
        "quali_segment": 1,
        "is_pole": False,
        "beat_teammate": False,
        "dotd": False, # Manual
        "fastest_lap": False,
        "fastest_pitstop": False,
        "dnf_reason": None, # Manual
        "quali_crash": False, # Manual
        "laps_lapped": 0,
        "penalties": 0,
        "sprint_pole": False,
        "sprint_finish_position": None
    })
    
    # 1. Starting Grid
    print("Fetching starting grid...")
    grid = fetch_json(f"{BASE_URL}/starting_grid?session_key={session_key}")
    for entry in grid:
        driver_num = entry.get("driver_number")
        if driver_num in DRIVER_MAP:
            driver_data[driver_num]["grid_position"] = entry.get("grid_position", 20)
            if entry.get("grid_position") == 1:
                driver_data[driver_num]["is_pole"] = True
    
    # 2. Finish Positions (Latest position data)
    print("Fetching finish positions...")
    positions = fetch_json(f"{BASE_URL}/position?session_key={session_key}")
    # OpenF1 positions are per lap. We need to find the maximum date/lap for each driver
    latest_positions = {}
    for pos in positions:
        driver_num = pos.get("driver_number")
        # keep the one with highest date
        date_str = pos.get("date")
        if driver_num not in latest_positions or latest_positions[driver_num]["date"] < date_str:
            latest_positions[driver_num] = pos
            
    for driver_num, pos_info in latest_positions.items():
        if driver_num in DRIVER_MAP:
            driver_data[driver_num]["finish_position"] = pos_info.get("position", 20)
    
    # 3. Fastest Lap
    print("Fetching fastest lap...")
    laps = fetch_json(f"{BASE_URL}/laps?session_key={session_key}")
    fastest_lap_time = float('inf')
    fastest_driver = None
    for lap in laps:
        duration = lap.get("lap_duration")
        if duration is not None and duration < fastest_lap_time:
            fastest_lap_time = duration
            fastest_driver = lap.get("driver_number")
    
    if fastest_driver in DRIVER_MAP:
        driver_data[fastest_driver]["fastest_lap"] = True
        
    # 4. Fastest Pitstop
    print("Fetching fastest pitstop...")
    pits = fetch_json(f"{BASE_URL}/pit?session_key={session_key}")
    fastest_pit_time = float('inf')
    fastest_pit_driver = None
    for pit in pits:
        duration = pit.get("pit_duration")
        if duration is not None and duration < fastest_pit_time:
            fastest_pit_time = duration
            fastest_pit_driver = pit.get("driver_number")
            
    if fastest_pit_driver in DRIVER_MAP:
        driver_data[fastest_pit_driver]["fastest_pitstop"] = True
        
    # 5. Penalties
    print("Fetching race control penalties...")
    race_control = fetch_json(f"{BASE_URL}/race_control?session_key={session_key}")
    for msg in race_control:
        cat = msg.get("category")
        if cat in ["TimePenalty", "GridDrop"]:
            driver_num = msg.get("driver_number")
            if driver_num in DRIVER_MAP:
                driver_data[driver_num]["penalties"] += 1
                
    # Note: Qualifying segment, Teammate comparisons, DNF reasons, and Dotd 
    # are often complex to derive or missing from basic OpenF1 endpoints.
    # The user/admin will manually adjust these fields before committing.
    
    results = {}
    for driver_num, data in driver_data.items():
        if driver_num in DRIVER_MAP:
            slug = DRIVER_MAP[driver_num]
            data["driver_id"] = slug
            if RaceResult:
                # Validate using Pydantic
                results[slug] = RaceResult(**data)
            else:
                results[slug] = data
                
    return results

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python fetch_race.py <session_key>")
        print("Example: python fetch_race.py latest")
        sys.exit(1)
        
    session_key = sys.argv[1]
    race_results = fetch_race_data(session_key)
    
    print("\n=== Fetch Summary ===")
    
    try:
        # pyrefly: ignore [missing-import]
        from app.db import get_supabase
        supabase = get_supabase()
        
        # Get valid drivers from the database
        drivers_res = supabase.table('drivers').select('id').execute()
        valid_driver_ids = {d['id'] for d in drivers_res.data}
        
        insert_data = []
        for slug, result in race_results.items():
            if slug not in valid_driver_ids:
                print(f"Skipping {slug} because they are not in the drivers table.")
                continue
                
            data_dict = result.model_dump() if hasattr(result, 'model_dump') else result
            # Add race_id
            data_dict['race_id'] = session_key
            
            # Remove keys not in the DB schema to prevent insertion errors
            if 'quali_crash' in data_dict:
                del data_dict['quali_crash']
                
            insert_data.append(data_dict)
            
        print(f"\nSaving {len(insert_data)} records to Supabase 'race_results'...")
        # Since we might run this multiple times, upserting or just inserting for now.
        # We will need a unique constraint on race_id + driver_id to upsert reliably,
        # but for now we just insert.
        # Actually, race_results has an auto-generated id, so doing multiple inserts creates duplicates.
        # Let's delete existing results for this race_id first to be safe and idempotent.
        supabase.table('race_results').delete().eq('race_id', session_key).execute()
        
        if insert_data:
            response = supabase.table('race_results').insert(insert_data).execute()
            print("Successfully saved race results!")
        else:
            print("No valid drivers to save.")
        
    except Exception as e:
        print(f"Warning: Failed to save to DB. Error: {e}")
        for slug, result in race_results.items():
            print(result.model_dump() if hasattr(result, 'model_dump') else result)
            
    print("\nNote: Please manually update 'quali_segment', 'dnf_reason', 'beat_teammate', 'dotd', and 'laps_lapped' via the Admin Dashboard before running the scoring pipeline.")
