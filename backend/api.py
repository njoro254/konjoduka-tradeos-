from flask import Blueprint, jsonify
from auth import token_required

api_bp = Blueprint('api', __name__)

@api_bp.route('/profile')
@token_required
def get_profile(current_user):
    return jsonify({
        'username': current_user.username,
        'is_superadmin': current_user.is_superadmin,
        'subscription': current_user.subscription_id
    })