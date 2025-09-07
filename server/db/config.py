from supabase import create_client, Client
from dotenv import load_dotenv
import os

load_dotenv(dotenv_path="server/.env")

url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")

supabase: Client = create_client(url, key)
