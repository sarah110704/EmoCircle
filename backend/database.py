import os
from flask import Flask
from flask_mysqldb import MySQL
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Setup MySQL
mysql = MySQL()

def create_app():
    app = Flask(__name__)

    # Configure MySQL from environment variables
    app.config['MYSQL_HOST'] = os.getenv('MYSQL_HOST', 'localhost')
    app.config['MYSQL_USER'] = os.getenv('MYSQL_USER', 'root')
    app.config['MYSQL_PASSWORD'] = os.getenv('MYSQL_PASSWORD', '')
    app.config['MYSQL_DB'] = os.getenv('MYSQL_DB', 'emo_db')
    app.config['MYSQL_PORT'] = int(os.getenv('MYSQL_PORT', 3306))  # Default MySQL port is 3306

    # Initialize MySQL with app
    mysql.init_app(app)
    
    return app

def get_connection():
    app = create_app()
    return mysql.connection
