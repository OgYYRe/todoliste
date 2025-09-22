from flask import Flask, request, jsonify
from flask_cors import CORS
from services import (
    getAllTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
    require_user_id,
)

app = Flask(__name__)
CORS(app)


# GET: alle
@app.route("/", methods=["GET"])
def home():
    user_id = require_user_id()
    response = getAllTasks(user_id)
    return jsonify(response.data), 200


# GET: by id
@app.route("/task/<int:task_id>", methods=["GET"])
def get_task(task_id):
    user_id = require_user_id()
    response = getTaskById(task_id, user_id)
    if response.data:
        return jsonify(response.data[0]), 200
    else:
        return jsonify({"error": "Task not found"}), 404


# POST: create
@app.route("/task", methods=["POST"])
def create_task():
    user_id = require_user_id()
    data = request.json or {}
    data["user_id"] = user_id
    response = createTask(data)
    if response.data:
        return jsonify(response.data[0]), 201
    else:
        return jsonify({"error": "Task not created"}), 400


# PUT: update
@app.route("/task/<int:task_id>", methods=["PUT"])
def update_task(task_id):
    user_id = require_user_id()
    updates = request.json or {}
    response = updateTask(task_id, updates, user_id)
    if response.data:
        return jsonify(response.data[0]), 200
    else:
        return jsonify({"error": "Task not updated"}), 400


# DELETE: delete
@app.route("/task/<int:task_id>", methods=["DELETE", "OPTIONS"])
def delete_task(task_id):
    user_id = require_user_id()
    if request.method == "OPTIONS":
        print("OPTIONS request erhalten")
        return "", 200
    response = deleteTask(task_id, user_id)
    if response.data:
        return jsonify({"success": True}), 200
    else:
        return jsonify({"error": "Task not found"}), 404


if __name__ == "__main__":
    app.run()
