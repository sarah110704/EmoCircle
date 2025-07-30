from flask import Flask
from flask_cors import CORS
from config import init_mysql
from routes.auth import auth
from routes.sessions import session_bp
from routes.messages import messages_bp

app = Flask(__name__)
init_mysql(app)

# ✅ CORS global
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}}, supports_credentials=True)

@app.after_request
def after_request(response):
    response.headers['Access-Control-Allow-Origin'] = 'http://localhost:3000'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
    response.headers['Access-Control-Allow-Credentials'] = 'true'
    return response

# ✅ Blueprint routes
app.register_blueprint(auth)
app.register_blueprint(session_bp)
app.register_blueprint(messages_bp)

@app.route('/')
def index():
    return "API EmoCircle Backend is running!"

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
