from supabase import create_client, Client
from dotenv import load_dotenv
import os

load_dotenv(dotenv_path="server/.env")

url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")

supabase: Client = create_client(url, key)

# insert = (
#     supabase.table("tasks")
#     .insert(
#         [
#             {'created_at': '2025-09-07T15:10:52.842983+00:00', 'title': 'Task3', 'description': 'Test Task', 'priority': 'High', 'status': 'Open', 'due_date': '2025-09-14T17:10:35', 'tags': 'test'}
#         ]
#     )
#     .execute()
# )

# update = supabase.table("tasks").update({"id": 3}).eq("id", 5).execute()

response = supabase.table("tasks").select("*").execute()

print(response)
