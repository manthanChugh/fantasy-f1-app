import sys
import os

sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'backend'))

def run_admin_override():
    try:
        from app.db import get_supabase
        supabase = get_supabase()
    except Exception as e:
        print(f"Error loading Supabase: {e}")
        return

    race_id = input("Enter race_id (e.g. 'latest', '9158'): ").strip()
    if not race_id:
        print("Invalid race_id")
        return
        
    print(f"Fetching results for race: {race_id}...")
    res = supabase.table('race_results').select('*').eq('race_id', race_id).execute()
    
    if not res.data:
        print("No results found for this race_id.")
        return
        
    drivers = res.data
    while True:
        print("\n=== Drivers in this race ===")
        for d in drivers:
            print(f"- {d['driver_id']}")
            
        driver_slug = input("\nEnter driver_id to edit (or 'q' to quit): ").strip()
        if driver_slug.lower() == 'q':
            break
            
        driver_data = next((d for d in drivers if d['driver_id'] == driver_slug), None)
        if not driver_data:
            print("Driver not found in this race.")
            continue
            
        print(f"\nEditing: {driver_slug}")
        print("Leave input blank to keep current value.")
        
        def get_bool(prompt, current):
            val = input(f"{prompt} [Current: {current}]: ").strip().lower()
            if not val:
                return current
            return val in ['y', 'yes', 'true', '1', 't']
            
        def get_int(prompt, current):
            val = input(f"{prompt} [Current: {current}]: ").strip()
            if not val:
                return current
            try:
                return int(val)
            except ValueError:
                return current
                
        def get_str(prompt, current):
            val = input(f"{prompt} [Current: {current}]: ").strip()
            if not val:
                return current
            return val if val.lower() != 'none' else None
            
        updates = {}
        updates['dotd'] = get_bool("Driver of the Day? (y/n)", driver_data.get('dotd'))
        updates['beat_teammate'] = get_bool("Beat teammate? (y/n)", driver_data.get('beat_teammate'))
        updates['dnf_reason'] = get_str("DNF Reason (mechanical/crash/None)", driver_data.get('dnf_reason'))
        updates['quali_segment'] = get_int("Qualifying Segment (1, 2, 3)", driver_data.get('quali_segment'))
        updates['laps_lapped'] = get_int("Laps lapped by leader", driver_data.get('laps_lapped'))
        
        print("\nUpdating...")
        supabase.table('race_results').update(updates).eq('id', driver_data['id']).execute()
        print("Updated successfully!")
        
        driver_data.update(updates)

if __name__ == '__main__':
    run_admin_override()
