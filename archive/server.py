from flask import Flask, render_template
from flask_login import UserMixin, login_user, LoginManager, login_required, logout_user, current_user
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

@app.route("/")
def introverse():
    return render_template("base.html")

@app.route("/login")
def login():
    return render_template("login.html")

@app.route("/register")
def register():
    return render_template("register.html")
    



if __name__ == "__main__":
    app.run(debug=True)





















if __name__ == "main":
    app.run()
