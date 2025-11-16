from flask import Flask,render_template
from flask_jwt_extended import JWTManager
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_socketio import SocketIO
import os

db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()  # ✅ create JWTManager instance
socket_io = SocketIO(cors_allowed_origins="*")


def create_app():
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_object("app.config.Config")

    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    socket_io.init_app(app)
    
    from app.models import user
    from app.models import tickets
    from app.models import message

    #---------- Auth routes ---------------
    from app.routes.auth_routes import auth_bp
    app.register_blueprint(auth_bp,url_prefix="/api/auth")

    #------------Ticket routes --------------------
    from app.routes.ticket_routes import ticket_bp
    app.register_blueprint(ticket_bp)

    #----------- Message routes -----------------
    from app.routes.message_routes import message_bp
    app.register_blueprint(message_bp)

    # Health check
    @app.route("/health")
    def health():
        return {"status": "Database connected successfully"}
    
    @app.route("/")
    def home():
        return render_template("landing.html")


    return app
