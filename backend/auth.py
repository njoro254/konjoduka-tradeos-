import jwt
import datetime
import os
from functools import wraps
from flask import request, jsonify, Blueprint
from flask.views import MethodView
from models import User, db
from cryptography.hazmat.primitives import serialization

auth_bp = Blueprint('auth', __name__)

# RSA 4096 Key Management
# In production, these should be loaded from secure environment variables or a vault
PRIVATE_KEY_PATH = 'private_key.pem'
PUBLIC_KEY_PATH = 'public_key.pem'

def get_private_key():
    with open(PRIVATE_KEY_PATH, "rb") as key_file:
        return serialization.load_pem_private_key(key_file.read(), password=None)

def get_public_key():
    with open(PUBLIC_KEY_PATH, "rb") as key_file:
        return serialization.load_pem_public_key(key_file.read())

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].split(" ")[1]
        
        if not token:
            return jsonify({'message': 'Token is missing!'}), 401
        
        try:
            public_key = get_public_key()
            data = jwt.decode(token, public_key, algorithms=["RS256"])
            current_user = User.query.filter_by(id=data['user_id']).first()
        except Exception as e:
            return jsonify({'message': 'Token is invalid!', 'error': str(e)}), 401
            
        return f(current_user, *args, **kwargs)
    return decorated

class LoginAPI(MethodView):
    def post(self):
        auth = request.get_json()
        if not auth or not auth.get('username') or not auth.get('password'):
            return jsonify({'message': 'Missing credentials'}), 400
            
        user = User.query.filter_by(username=auth.get('username')).first()
        if user and user.check_password(auth.get('password')):
            private_key = get_private_key()
            token = jwt.encode({
                'user_id': user.id,
                'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
            }, private_key, algorithm="RS256")
            
            return jsonify({'token': token})
            
        return jsonify({'message': 'Invalid credentials'}), 401

auth_bp.add_url_rule('/login', view_func=LoginAPI.as_view('login_api'))