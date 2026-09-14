from app import db
from flask_bcrypt import generate_password_hash, check_password_hash

# Many-to-Many relationship between Subscriptions and Permissions
subscription_permissions = db.Table('subscription_permissions',
    db.Column('subscription_id', db.Integer, db.ForeignKey('subscription.id'), primary_key=True),
    db.Column('permission_id', db.Integer, db.ForeignKey('permission.id'), primary_key=True)
)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    is_superadmin = db.Column(db.Boolean, default=False)
    subscription_id = db.Column(db.Integer, db.ForeignKey('subscription.id'))
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password).decode('utf8')
        
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

class Subscription(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)
    description = db.Column(db.String(200))
    permissions = db.relationship('Permission', secondary=subscription_permissions, backref=db.backref('subscriptions', lazy='dynamic'))

class Permission(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)
    code = db.Column(db.String(50), unique=True, nullable=False) # e.g., 'edit_users'

class CORSDomain(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    domain = db.Column(db.String(255), unique=True, nullable=False)