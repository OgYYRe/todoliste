from flask import Flask
from flask_cors import CORS
from server.src.services import getAllTasks

app = Flask(__name__)
CORS(app)


@app.route("/")
def home():
    tasks = getAllTasks()
    return {"tasks": tasks.data}


if __name__ == "__main__":
    app.run()
