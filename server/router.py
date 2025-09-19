from flask import Flask
from flask_cors import CORS
from services import (
    getAllTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
    setCompleted,
    unsetCompleted,
)

app = Flask(__name__)
CORS(app)


@app.route("/", methods=["GET"])
def home():
    results = getAllTasks()
    return {"tasks": results.data}


@app.route("/task/<int:task_id>", methods=["GET"])
def get_task(task_id: int):
    results = getTaskById(task_id)
    return {"task": results.data}


@app.route("/task/create/<int:task_id>", methods=["POST"])
def create_task(task: dict):
    results = createTask(task)
    return {"task created": results.data}


@app.route("/task/update/<int:task_id>", methods=["PUT"])
def update_task(task_id: int, updates: dict):
    results = updateTask(task_id, updates)
    return {"task updated": results.data}


@app.route("/task/delete/<int:task_id>", methods=["DELETE"])
def delete_task(task_id: int):
    deleteTask(task_id)
    return {"task deleted": task_id}


@app.route("/task/complete/<int:task_id>", methods=["PUT"])
def complete_task(task_id: int):
    results = setCompleted(task_id)
    return {"task completed": results.data}


@app.route("/task/uncomplete/<int:task_id>", methods=["PUT"])
def uncomplete_task(task_id: int):
    results = unsetCompleted(task_id)
    return {"task uncompleted": results.data}


if __name__ == "__main__":
    app.run()
