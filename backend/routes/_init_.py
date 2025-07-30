from flask import Flask
from flask_mysqldb import MySQL
from flask_cors import CORS
from .auth import auth
from .sessions import session_bp
from .messages import messages_bp  # ✅ harus ada
from dotenv import load_dotenv
import os

load_dotenv()

mysql = MySQL()

def create_app():
    app = Flask(__name__)
    CORS(app, supports_credentials=True, resources={r"/api/*": {"origins": "*"}})

    app.secret_key = os.getenv("SECRET_KEY", "supersecretkey")

    app.config['MYSQL_HOST'] = os.getenv("MYSQL_HOST", "localhost")
    app.config['MYSQL_USER'] = os.getenv("MYSQL_USER", "root")
    app.config['MYSQL_PASSWORD'] = os.getenv("MYSQL_PASSWORD", "")
    app.config['MYSQL_DB'] = os.getenv("MYSQL_DB", "db_emocircle")
    app.config['MYSQL_CURSORCLASS'] = 'DictCursor'

    mysql.init_app(app)

    app.register_blueprint(auth)
    app.register_blueprint(session_bp)
    app.register_blueprint(messages_bp)  # ✅ pastikan ini tidak lupa

    return app
