import urllib

from flask import Flask, Response, request, render_template


app = Flask(__name__, template_folder="templates", static_folder='static')


@app.route("/")
def helloworld():
    operators = [{"name": "Table 27"}]
    return render_template("index.html", airflow_operators=operators)


@app.route("/open", methods=("POST",))
def open():  # This is handled by the JS the browser implements the HTML5 FileReader API
    return "200"


@app.route("/save", methods=("POST",))
def save():
    filename = request.form["filename"]
    xml = request.form['xml']

    resp = Response(urllib.parse.unquote_plus(xml).encode("utf-8"))
    resp.headers["Content-Disposition"] = "attachment; filename=\"{}\"; filename*=UTF-8l''".format(
        filename)
    resp.status_code = 200

    return resp


@app.route("/export", methods=("POST",))
def export():  
    #TODO
    return "200"
