from server.config import supabase


def getAllTasks():
    response = supabase.table("tasks").select("*").execute()
    return response


def getTaskById(task_id: int):
    response = supabase.table("tasks").select("*").eq("id", task_id).execute()
    return response


def createTask(task: dict):
    response = supabase.table("tasks").insert(task).execute()
    return response


def updateTask(task_id: int, updates: dict):
    response = supabase.table("tasks").update(updates).eq("id", task_id).execute()
    return response


def deleteTask(task_id: int):
    response = supabase.table("tasks").delete().eq("id", task_id).execute()
    return response


# Example usage (for testing purposes)
if __name__ == "__main__":
    print(getAllTasks())
    print(getTaskById(1))
    new_task = {
        "title": "New Task",
        "description": "This is a new task",
        "completed": False,
    }
    print(createTask(new_task))
    updates = {"completed": True}
    print(updateTask(1, updates))
    print(deleteTask(1))
