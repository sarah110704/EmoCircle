from flask import Blueprint, request, jsonify
from config import mysql
import random
import string
from datetime import datetime
import traceback
from MySQLdb.cursors import DictCursor
from flask_cors import CORS

session_bp = Blueprint('sessions', __name__, url_prefix='/api/sessions')
CORS(session_bp, resources={r"/api/sessions/*": {"origins": "*"}})

# Generate session code
def generate_code(length=6):
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=length))

# Format 'created_at' and display time
def format_created_at_field(session):
    if isinstance(session["created_at"], datetime):
        session["time"] = session["created_at"].strftime('%H:%M:%S')
        session["created_at"] = session["created_at"].strftime('%d/%m/%Y')
    else:
        session["time"] = ""

# Create session
@session_bp.route('/', methods=['POST'])
def create_session():
    try:
        data = request.get_json()
        session_name = data.get("name", "").strip()
        facilitator_id = data.get("facilitator_id")

        if not session_name or not facilitator_id:
            return jsonify({"success": False, "message": "Session name and facilitator id cannot be empty."}), 400

        session_code = generate_code()
        status = "Active"
        created_at = datetime.now()

        # Insert into database
        with mysql.connection.cursor(DictCursor) as cursor:
            cursor.execute(
                "INSERT INTO sessions (name, code, facilitator_id, status, created_at) VALUES (%s, %s, %s, %s, %s)",
                (session_name, session_code, facilitator_id, status, created_at)
            )
            mysql.connection.commit()

        return jsonify({"success": True, "message": "Session created successfully", "sessionCode": session_code}), 200

    except Exception as e:
        traceback.print_exc()
        return jsonify({"success": False, "message": "Internal server error", "error": str(e)}), 500


# Get all sessions
@session_bp.route('/', methods=['GET'])
def get_sessions():
    try:
        facilitator_id = request.args.get("facilitator_id")
        status = request.args.get("status")

        if not facilitator_id:
            return jsonify({"success": False, "message": "Facilitator ID is required."}), 400

        query = """
            SELECT s.id, s.name, s.code, s.status, s.created_at,
                   (SELECT COUNT(*) FROM participants p WHERE p.session_id = s.id) as participants
            FROM sessions s
            WHERE s.facilitator_id = %s
        """
        params = [facilitator_id]
        if status:
            query += " AND s.status = %s"
            params.append(status)

        with mysql.connection.cursor(DictCursor) as cursor:
            cursor.execute(query, tuple(params))
            sessions = cursor.fetchall()

            for session in sessions:
                format_created_at_field(session)

        return jsonify({"success": True, "sessions": sessions}), 200

    except Exception as e:
        traceback.print_exc()
        return jsonify({"success": False, "message": "Internal server error", "error": str(e)}), 500


# Get session details by code
@session_bp.route('/details_by_code', methods=['GET'])
def get_session_details_by_code():
    try:
        session_code = request.args.get("code")
        if not session_code:
            return jsonify({"success": False, "message": "Session code is required"}), 400

        # Query untuk mencari session berdasarkan session_code
        with mysql.connection.cursor(DictCursor) as cursor:
            cursor.execute("SELECT * FROM sessions WHERE code = %s", (session_code,))
            session = cursor.fetchone()

            # Jika session tidak ditemukan, kirimkan error
            if not session:
                return jsonify({"success": False, "message": "Session not found"}), 404

            # Query untuk mengambil data participants
            cursor.execute("SELECT id, name FROM participants WHERE session_id = %s", (session["id"],))
            participants = cursor.fetchall()

            # Query untuk mengambil data messages
            cursor.execute("""
                SELECT id, content, sender_name, created_at
                FROM messages
                WHERE session_id = %s ORDER BY created_at DESC
            """, (session["id"],))
            messages = cursor.fetchall()

            # Format pesan dengan timestamp
            for msg in messages:
                msg["timestamp"] = msg["created_at"].strftime('%d %b %Y %H:%M')
                msg["replies"] = []
                cursor.execute("""
                    SELECT id, content, sender, created_at
                    FROM replies
                    WHERE message_id = %s ORDER BY created_at ASC
                """, (msg["id"],))
                replies = cursor.fetchall()

                for reply in replies:
                    reply["timestamp"] = reply["created_at"].strftime('%d %b %Y %H:%M')
                msg["replies"] = replies

            # Query untuk mengambil data emotions
            cursor.execute("SELECT emotion, percentage FROM emotions WHERE session_id = %s", (session["id"],))
            emotions_raw = cursor.fetchall()

            # Map emotion dan tampilkan warna sesuai dengan jenis emosi
            emotion_colors = {
                "happy": "#FFD700",
                "excited": "#A8E6CF",
                "neutral": "#87CEEB",
                "worried": "#FFA500",
                "sad": "#FF6B6B"
            }

            emotions = [{
                "emotion": e["emotion"],
                "percentage": e["percentage"],
                "color": emotion_colors.get(e["emotion"], "#cccccc")
            } for e in emotions_raw]

            # Gabungkan data
            session["participants"] = participants
            session["messages"] = messages
            session["emotions"] = emotions

        return jsonify({"success": True, "session": session}), 200

    except Exception as e:
        traceback.print_exc()
        return jsonify({"success": False, "message": "Internal server error", "error": str(e)}), 500

# Member join session
@session_bp.route('/member/join', methods=['POST'])
def member_join():
    try:
        data = request.get_json()
        session_code = data.get("sessionCode")
        member_name = data.get("memberName")

        if not session_code or not member_name:
            return jsonify({"success": False, "message": "Session code and member name are required"}), 400

        with mysql.connection.cursor(DictCursor) as cursor:
            cursor.execute("SELECT id, status FROM sessions WHERE code = %s", (session_code,))
            session = cursor.fetchone()

            if not session or session["status"] != "Active":
                return jsonify({"success": False, "message": "Session not found or has ended"}), 404

            session_id = session["id"]

            cursor.execute("INSERT INTO participants (session_id, name, created_at) VALUES (%s, %s, NOW())", (session_id, member_name))
            mysql.connection.commit()
            member_id = cursor.lastrowid

            cursor.execute("SELECT id, name FROM participants WHERE session_id = %s", (session_id,))
            participants = cursor.fetchall()

        return jsonify({"success": True, "sessionId": session_id, "memberId": member_id, "participants": participants}), 200

    except Exception as e:
        traceback.print_exc()
        return jsonify({"success": False, "message": "Server error", "error": str(e)}), 500


# End session
@session_bp.route('/<int:session_id>/end', methods=['PUT'])
def end_session(session_id):
    try:
        with mysql.connection.cursor(DictCursor) as cursor:
            cursor.execute("UPDATE sessions SET status = 'Closed' WHERE id = %s", (session_id,))
            mysql.connection.commit()

        return jsonify({"success": True, "message": "Session ended successfully"}), 200

    except Exception as e:
        traceback.print_exc()
        return jsonify({"success": False, "message": "Internal server error", "error": str(e)}), 500
