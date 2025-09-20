from config import supabase
from flask import jsonify, request
import uuid


def require_user_id():
    uid = (request.json or {}).get("user_id") if request.is_json else None
    try:
        return str(uuid.UUID(uid))
    except Exception:
        return jsonify({"error": "Missing or invalid user_id (UUID)"}), 401


def getAllTasks(user_id: str):
    response = (
        supabase.table("tasks").select("*").eq("user_id", user_id).order("id").execute()
    )
    return response


def getTaskById(task_id: int, user_id: str):
    response = (
        supabase.table("tasks")
        .select("*")
        .eq("id", task_id)
        .eq("user_id", user_id)
        .limit(1)
        .execute()
    )
    return response


def createTask(task: dict):
    response = supabase.table("tasks").insert(task).execute()
    return response


def updateTask(task_id: int, updates: dict, user_id: str):
    response = (
        supabase.table("tasks")
        .update(updates)
        .eq("id", task_id)
        .eq("user_id", user_id)
        .execute()
    )
    return response


def deleteTask(task_id: int, user_id: str):
    response = (
        supabase.table("tasks")
        .delete()
        .eq("id", task_id)
        .eq("user_id", user_id)
        .execute()
    )
    return response


def setCompleted(task_id: int, user_id: str):
    response = (
        supabase.table("tasks")
        .update({"completed": True})
        .eq("id", task_id)
        .eq("user_id", user_id)
        .execute()
    )
    return response


def unsetCompleted(task_id: int, user_id: str):
    response = (
        supabase.table("tasks")
        .update({"completed": False})
        .eq("id", task_id)
        .eq("user_id", user_id)
        .execute()
    )
    return response


# Example usage (for testing purposes)
if __name__ == "__main__":
    print(getAllTasks())
    print(getTaskById(1))
    new_task = {
        "title": "New Task",
        "description": "This is a new task",
        "status": "pending",
    }
    print(createTask(new_task))
    updates = {"status": "Done"}
    print(updateTask(1, updates))
    print(deleteTask(1))
