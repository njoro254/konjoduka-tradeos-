from flask import Blueprint, request, jsonify
from flask.views import MethodView
from models import db, CORSDomain, Permission, Subscription
from auth import token_required

admin_bp = Blueprint('admin', __name__)

def superadmin_required(f):
    @wraps(f)
    def decorated(current_user, *args, **kwargs):
        if not current_user.is_superadmin:
            return jsonify({'message': 'Superadmin access required!'}), 403
        return f(current_user, *args, **kwargs)
    return decorated

# Import wraps for the decorator
from functools import wraps

class CORSDomainAPI(MethodView):
    decorators = [token_required]
    
    def get(self, current_user):
        domains = CORSDomain.query.all()
        return jsonify([{'id': d.id, 'domain': d.domain} for d in domains])
    
    def post(self, current_user):
        if not current_user.is_superadmin:
            return jsonify({'message': 'Forbidden'}), 403
        data = request.get_json()
        new_domain = CORSDomain(domain=data['domain'])
        db.session.add(new_domain)
        db.session.commit()
        return jsonify({'message': 'Domain added'}), 201

class PermissionAPI(MethodView):
    decorators = [token_required]
    
    def get(self, current_user):
        perms = Permission.query.all()
        return jsonify([{'id': p.id, 'name': p.name, 'code': p.code} for p in perms])
        
    def post(self, current_user):
        if not current_user.is_superadmin:
            return jsonify({'message': 'Forbidden'}), 403
        data = request.get_json()
        perm = Permission(name=data['name'], code=data['code'])
        db.session.add(perm)
        db.session.commit()
        return jsonify({'message': 'Permission created'}), 201

admin_bp.add_url_rule('/cors', view_func=CORSDomainAPI.as_view('cors_api'))
admin_bp.add_url_rule('/permissions', view_func=PermissionAPI.as_view('permission_api'))