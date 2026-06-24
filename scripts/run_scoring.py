import sys
import os

sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'backend'))

def trigger_scoring():
    if len(sys.argv) < 2:
        print("Usage: python run_scoring.py <race_id>")
        print("Example: python run_scoring.py latest")
        sys.exit(1)
        
    race_id = sys.argv[1]
    
    try:
        from app.scoring import process_race_scores
        process_race_scores(race_id)
    except Exception as e:
        print(f"Error running scoring pipeline: {e}")

if __name__ == "__main__":
    trigger_scoring()
