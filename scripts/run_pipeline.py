import sys
import os

# Add backend directory to path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'backend'))

def main():
    if len(sys.argv) < 2:
        print("Usage: python run_pipeline.py <session_key>")
        print("Example: python run_pipeline.py latest")
        sys.exit(1)
        
    session_key = sys.argv[1]
    
    # 1. Fetch Race Data
    print(f"=== STEP 1: Fetching OpenF1 Data for session: {session_key} ===")
    from scripts.fetch_race import fetch_race_data
    from app.db import get_supabase
    
    supabase = get_supabase()
    race_results_dict = fetch_race_data(session_key)
    
    insert_data = []
    for slug, result in race_results_dict.items():
        data_dict = result.dict() if hasattr(result, 'dict') else result
        data_dict['race_id'] = session_key
        insert_data.append(data_dict)
        
    if not insert_data:
        print("No race data found or fetched. Exiting.")
        sys.exit(0)
        
    print(f"\nSaving {len(insert_data)} raw results to Supabase 'race_results'...")
    # Clear old results for this race to be idempotent
    supabase.table('race_results').delete().eq('race_id', session_key).execute()
    supabase.table('race_results').insert(insert_data).execute()
    print("Raw results saved!\n")
    
    # Optional Admin Pause
    print("=== STEP 2: Manual Adjustments ===")
    print("At this point, you can go to the Admin Dashboard (or update Supabase manually) to input 'Driver of the Day', 'Teammate battles', and DNF reasons.")
    user_input = input("Press ENTER to continue immediately to scoring, or type 'exit' to stop and score later: ")
    if user_input.strip().lower() == 'exit':
        print("Pipeline paused. You can run scoring later using scoring.py directly.")
        sys.exit(0)
        
    # 3. Process Scores
    print("\n=== STEP 3: Processing Scores ===")
    from app.scoring import process_race_scores
    process_race_scores(session_key)
    
    print("\nPipeline finished successfully!")

if __name__ == "__main__":
    main()
