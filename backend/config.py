import os
from flask_mysqldb import MySQL
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

mysql = MySQL()

def init_mysql(app):
    """Initialize MySQL with the Flask app using environment variables."""
    app.config['MYSQL_HOST'] = os.getenv('MYSQL_HOST', 'localhost')
    app.config['MYSQL_USER'] = os.getenv('MYSQL_USER', 'root')
    app.config['MYSQL_PASSWORD'] = os.getenv('MYSQL_PASSWORD', '')
    app.config['MYSQL_DB'] = os.getenv('MYSQL_DB', 'emo_db')
    app.config['MYSQL_CURSORCLASS'] = 'DictCursor'
    app.config['MYSQL_PORT'] = int(os.getenv('MYSQL_PORT', 3306))  # Default MySQL port is 3306
    
    mysql.init_app(app)
