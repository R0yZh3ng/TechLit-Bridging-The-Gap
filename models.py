from flask_sqlalchemy import SQLAlchemy
import hashlib
import os
from datetime import datetime, date, timedelta

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.LargeBinary)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    current_streak = db.Column(db.Integer, default=0)
    last_challenge_date = db.Column(db.Date)
    
    def set_password(self, password):
        salt = os.urandom(32)
        pwdhash = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt, 100000)
        self.password_hash = salt + pwdhash
    
    def check_password(self, password):
        if not self.password_hash:
            return False
        salt = self.password_hash[:32]
        stored_hash = self.password_hash[32:]
        pwdhash = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt, 100000)
        return pwdhash == stored_hash
    
    def to_dict(self):
        return {
            'id': self.id,
            'email': self.email,
            'created_at': self.created_at.isoformat(),
            'current_streak': self.current_streak,
            'last_challenge_date': self.last_challenge_date.isoformat() if self.last_challenge_date else None
        }

class AnalysisHistory(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    text = db.Column(db.Text, nullable=False)
    result = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    user = db.relationship('User', backref=db.backref('analyses', lazy=True))
    
    def to_dict(self):
        return {
            'id': self.id,
            'text': self.text,
            'result': self.result,
            'created_at': self.created_at.isoformat()
        }