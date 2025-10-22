from passlib.hash import argon2
from app import db
from datetime import datetime

class User(db.Model):
    __tablename__ = "users"
    user_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.Enum('user','admin','agent'), default='user')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # relationship
    tickets = db.relationship("Ticket",backref="user",lazy=True)
    messages = db.relationship("Message",backref="sender",lazy=True)

    #--------- Hash Password before storing -------------#
    def set_password(self,password):
        self.password_hash = argon2.hash(password)
    
    #--------------- Verify Password -----------#
    def verify_password(self,password):
        return argon2.verify(password,self.password_hash)
    
    def __repr__(self):
        return f"<User {self.email}>"
