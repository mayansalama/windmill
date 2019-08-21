from flask import Flask


app = Flask(__name__)


@app.route('/v1/operators', methods=["GET"])
def get_operators():
    pass
