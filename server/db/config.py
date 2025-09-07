from supabase import create_client, Client

url: str = "https://gwdgdcbtrcqrockmhpkr.supabase.co"
key: str = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd3ZGdkY2J0cmNxcm9ja21ocGtyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcyNTQ2MDEsImV4cCI6MjA3MjgzMDYwMX0.0l5unJQh3F6Kh6ynYOUangoJIqu8o96eu2HcoWkd4gQ"

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

update = (
    supabase.table("tasks")
    .update({"id": 3})
    .eq("id", 5)
    .execute()
)

response = supabase.table("tasks").select("*").execute()

print(response)
