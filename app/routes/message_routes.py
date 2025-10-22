from flask import Blueprint,request,jsonify,render_template
from app import db
from app.models.message import Message
from app.models.tickets import Ticket
from flask_jwt_extended import jwt_required,get_jwt_identity
from datetime import datetime

message_bp = Blueprint("message",__name__,url_prefix="/api/messages")

#------------------------- Send Message -------------------------------
@message_bp.route("/send",methods=["POST"])
@jwt_required()
def send_message():
    try:
        data = request.get_json()
        user_id = get_jwt_identity()
        ticket_id = data.get("ticket_id")
        message = data.get("message")

        if not ticket_id or not message:
            return jsonify({"Error":"ticket_id and messages are required"}),400
        ticket = Ticket.query.get(ticket_id)
        if not ticket:
            return jsonify({"Error":"Ticket not found"}),404
        
        new_messages = Message(
            ticket_id = ticket_id,
            sender_id = user_id,
            message = message,
            timestamp = datetime.utcnow()
        )
        db.session.add(new_messages)
        db.session.commit()

        return jsonify({
            "message":"Message sent successfully",
            "data":{
                "message_id":new_messages.message_id,
                "ticket_id":ticket_id,
                "sender_id":user_id,
                "message":message,
                "timestamp":new_messages.timestamp
            }
        }
        ),201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Internal Server Error", "details": str(e)}), 500


#---------------------------- Get Message --------------------------------
@message_bp.route("/<int:ticket_id>",methods=["GET"])
@jwt_required()
def get_message(ticket_id):
    try:
        user_id = get_jwt_identity()
        ticket = Ticket.query.get(ticket_id)
        if not ticket:
            return jsonify({"error":"Ticket not found"}),404
        
        #--------------- Fetch messages ------------------------------------------
        messages = Message.query.filter_by(ticket_id = ticket_id).order_by(Message.timestamp.asc()).all()
        data = [
            {
                "message_id":m.message_id,
                "ticket_id":m.ticket_id,
                "sender_id":m.sender_id,
                "message":m.message,
                "timestamp":m.timestamp

            }
            for m in messages
        ]
        return jsonify({
            "message":"Ticket fetched sucessfully",
            "ticket_id":ticket_id,
            "total_messages":len(messages),
            "messages":data
        }),200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Internal Server Error", "details": str(e)}), 500
    

# ---------------- Render Chat Page ----------------
@message_bp.route("/chat/<int:ticket_id>", methods=["GET"])
@jwt_required()
def chat_page(ticket_id):
    user_id = get_jwt_identity()
    ticket = Ticket.query.get(ticket_id)
    if not ticket:
        return "Ticket not found", 404

    return render_template(
        "chat.html", 
        ticket_id=ticket_id, 
        user_id=user_id
    )


