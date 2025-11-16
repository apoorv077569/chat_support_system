from flask import Blueprint,request,jsonify,render_template
from app import db
from app.models.user import User
from flask_jwt_extended import create_access_token

auth_bp = Blueprint("auth",__name__)

#-------------- Register ---------------------------- #
@auth_bp.route("/register",methods=["POST"])
def register():
    try:
        data = request.get_json()
        if not data.get("email") or not data.get("password"):
            return jsonify({"error":"Email and Password are required"}),400
        if User.query.filter_by(email = data["email"]).first():
            return jsonify({"error":"User already exist"}),400
        user = User(
            name = data.get("name"),
            email = data["email"]
        )
        user.set_password(data["password"])
        db.session.add(user)
        db.session.commit()

        return jsonify({"message":"User registered successfully"}),201
    except Exception as e:
        return jsonify({"error": "Internal Server Error", "details": str(e)}), 500

#---------------- Login --------------------
@auth_bp.route("/login",methods=["POST"])
def login():
    try:
        data = request.get_json()
        user = User.query.filter_by(email=data.get("email")).first()

        if not user or not user.verify_password(data.get("password")):
            return jsonify({"error":"Invalid credentials"}),401
        access_tokens = create_access_token(identity=str(user.user_id))
        return jsonify({"access_token":access_tokens}),200
    except Exception as e:
        return jsonify({"error": "Internal Server Error", "details": str(e)}), 500

@auth_bp.route("/",methods=["GET"])
def login_page():
    return render_template("login.html")
    
@auth_bp.route("/register",methods=["GET"])
def register_page():
    return render_template("register.html")