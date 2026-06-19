import os
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()

SUPABASE_URL = os.environ.get("SUPABASE_URL", "")
SUPABASE_SERVICE_KEY = os.environ.get("SUPABASE_SERVICE_KEY", "")

def get_supabase() -> Client:
    # Uses service role key to bypass RLS for backend operations
    if not SUPABASE_URL or not SUPABASE_SERVICE_KEY:
        print("Warning: Supabase credentials not found in environment.")
    return create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)
