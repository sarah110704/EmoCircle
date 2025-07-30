from flask import Blueprint, request, jsonify
from config import mysql
from MySQLdb.cursors import DictCursor
from flask_cors import CORS
import traceback

messages_bp = Blueprint('messages', __name__, url_prefix='/api/messages')
CORS(messages_bp, resources={r"/api/messages/*": {"origins": "*"}})

# ✅ Handle CORS preflight request ke '/api/messages' tanpa slash
@messages_bp.route('', methods=['OPTIONS'])
def handle_root_options():
    return jsonify({'ok': True}), 200

# ✅ Endpoint kirim pesan anonim
@messages_bp.route('/', methods=['POST', 'OPTIONS'])
def send_message():
    if request.method == 'OPTIONS':
        return jsonify({'ok': True}), 200

    try:
        data = request.get_json()
        session_id = data.get("sessionId")
        content = data.get("content")
        sender_name = data.get("senderName")  # Boleh null

        if not session_id or not content:
            return jsonify({"success": False, "message": "sessionId dan content wajib diisi"}), 400

        with mysql.connection.cursor(DictCursor) as cursor:
            cursor.execute("""
                INSERT INTO messages (session_id, sender_name, content, created_at)
                VALUES (%s, %s, %s, NOW())
            """, (session_id, sender_name, content))
            mysql.connection.commit()

        return jsonify({"success": True, "message": "Pesan berhasil dikirim"}), 200

    except Exception as e:
        traceback.print_exc()
        return jsonify({"success": False, "message": "Terjadi kesalahan server"}), 500

# ✅ Endpoint balas pesan
@messages_bp.route('/<int:message_id>/reply', methods=['POST', 'OPTIONS'])
def add_reply(message_id):
    if request.method == 'OPTIONS':
        return jsonify({'ok': True}), 200

    try:
        data = request.get_json()
        content = data.get("content")
        sender = data.get("sender")  # Boleh null

        if not content:
            return jsonify({"success": False, "message": "Konten balasan wajib diisi"}), 400

        with mysql.connection.cursor(DictCursor) as cursor:
            cursor.execute("""
                INSERT INTO replies (message_id, content, sender, created_at)
                VALUES (%s, %s, %s, NOW())
            """, (message_id, content, sender))
            mysql.connection.commit()

        return jsonify({"success": True, "message": "Balasan berhasil ditambahkan"}), 201

    except Exception as e:
        traceback.print_exc()
        return jsonify({"success": False, "message": "Terjadi kesalahan server"}), 500
