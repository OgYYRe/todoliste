from flask import Flask
from flask_cors import CORS
from server.src.services import getAllTasks, getTaskById, updateTask, deleteTask, createTask
from flask import request, jsonify

app = Flask(__name__)
app.config['ENV'] = 'development'
app.config['DEBUG'] = True
CORS(app, supports_credentials=True)


@app.route("/")
def home():
    tasks = getAllTasks()
    return {"tasks": tasks.data}





################################################################
# GET: by id
@app.route("/task/<int:task_id>", methods=["GET"])
def get_task(task_id):
    response = getTaskById(task_id)
    if response.data:
        return jsonify(response.data[0])
    else:
        return jsonify({"error": "Task not found"}), 404
# PUT: update
@app.route("/task/<int:task_id>", methods=["PUT"])
def update_task(task_id):
    updates = request.json
    response = updateTask(task_id, updates)
    if response.data:
        return jsonify(response.data[0])
    else:
        return jsonify({"error": "Task not updated"}), 400
# DELETE: delete
@app.route("/task/<int:task_id>", methods=["DELETE", "OPTIONS"])
def delete_task(task_id):
    print(f"DELETE /task/{task_id} çağrıldı")
    if request.method == "OPTIONS":
        print("OPTIONS isteği geldi")
        return '', 200
    response = deleteTask(task_id)
    print("Supabase response:", response.data)
    if response.data:
        return jsonify({"success": True})
    else:
        return jsonify({"error": "Task not found"}), 404
#################################################################


if __name__ == "__main__":
    app.run()