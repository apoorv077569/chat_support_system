from flask import Blueprint,request,jsonify
from app import db
from app.models.tickets import Ticket
from flask_jwt_extended import jwt_required,get_jwt_identity

ticket_bp = Blueprint("ticket",__name__,url_prefix="/api/tickets")

@ticket_bp.route("/create-ticket",methods=["POST"])
@jwt_required()
def create_ticket():
    try:
        data = request.get_json()
        print("DEBUG RAW DATA:", data)
        print("TYPE OF subject:", type(data.get("subject")))
        print("TYPE OF title:", type(data.get("title")))
        user_id = get_jwt_identity()

        title = data.get("title")
        subject = data.get("subject")
        priority = data.get("priority", "medium")

        # ✅ Validate
        if not isinstance(subject, str) or not subject.strip():
            return jsonify({"error": "Subject must be a non-empty string"}), 400
        if not isinstance(subject, str):
            subject = str(subject)


        if not isinstance(title, str) or not title.strip():
            return jsonify({"error": "Title must be a non-empty string"}), 400

        new_ticket = Ticket(
            title=title.strip(),
            subject=subject.strip(),
            priority=priority,
            user_id=user_id
        )

        db.session.add(new_ticket)
        db.session.commit()

        return jsonify({
            "message": "Ticket created successfully",
            "ticket_id": new_ticket.ticket_id
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Internal Server Error", "details": str(e)}), 500


@ticket_bp.route("/get-tickets",methods=["GET"])
@jwt_required()
def getAllTickets():
    user_id = get_jwt_identity()
    tickets = Ticket.query.filter_by(user_id = user_id).all()
    data = [
        {
            "id":t.ticket_id,
            "title":t.title,
            "subject":t.subject,
            "status":t.status,
            "priority":t.priority,
            "created_at":t.created_at
        }
        for t in tickets
    ]
    return jsonify(data),200

@ticket_bp.route("get-tickets/:id",methods=["GET"])
def getTicketById():
    pass

@ticket_bp.route("/ticket/update/:id",methods=["PATCH"])
def updateTicket():
    pass
