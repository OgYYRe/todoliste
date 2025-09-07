from flask import Flask
from server.services.services import getAllTasks

app = Flask(__name__)


@app.route("/")
def home():
    tasks = getAllTasks()
    return {"tasks": tasks.data}


if __name__ == "__main__":
    app.run()
