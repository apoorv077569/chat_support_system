from flask_socketio import emit, join_room, leave_room
from app import socketio, db
from app.models.message import Message
from datetime import datetime

@socketio.on("join_ticket")
def handle_join_ticket(data):
    ticket_id = data["ticket_id"]
    join_room(str(ticket_id))
    emit("status", {"msg": f"Joined ticket {ticket_id}"}, room=str(ticket_id))

@socketio.on("leave_ticket")
def handle_leave_ticket(data):
    ticket_id = data["ticket_id"]
    leave_room(str(ticket_id))
    emit("status", {"msg": f"Left ticket {ticket_id}"}, room=str(ticket_id))

@socketio.on("send_message")
def handle_send_message(data):
    ticket_id = data["ticket_id"]
    sender_id = data["sender_id"]
    message_text = data["message"]

    msg = Message(ticket_id=ticket_id, sender_id=sender_id,
                  message=message_text, timestamp=datetime.utcnow())
    db.session.add(msg)
    db.session.commit()

    emit("receive_message", {
        "message_id": msg.message_id,
        "ticket_id": ticket_id,
        "sender_id": sender_id,
        "message": message_text,
        "timestamp": str(msg.timestamp)
    }, room=str(ticket_id))
