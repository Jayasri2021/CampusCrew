from flask import Blueprint, request, jsonify
from app.models import Users, Services, Bookings
import uuid
from datetime import datetime

api = Blueprint('api', __name__)

@api.route('/createUser', methods=['POST'])
def create_user():
    data = request.get_json()
    firstName = data.get('firstName')
    lastName = data.get('lastName')
    email = data.get('email')
    password = data.get('password')
    isPfw = data.get("isPfw")
    if not password or not email:
        return jsonify({'error': 'E-Mail and password are required'}), 400
    if isPfw and "@pfw.edu" not in email:
        return jsonify({'error': 'Not a valid PFW email'}), 400
    existing_user = Users.find_by_email(email)
    if existing_user:
        return jsonify({'error': 'Email is already in use'}), 400

    user_id = str(uuid.uuid1())
    new_user, error = Users.create_user(email, password, firstName, lastName, user_id, is_pfw= isPfw)
    if error:
        return jsonify({'error': error}), 500

    return jsonify({'message': 'User created successfully', 'user_id': user_id, 'first_name': firstName, 'lastName': lastName, 'email':email, 'isPfw': isPfw}), 201

@api.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'error': 'E-Mail and password are required'}), 400

    user = Users.find_by_email(email)
    
    if user is None:
        return jsonify({'error': 'User not found'}), 400
    
    if user and Users.check_password(user, password):
        return jsonify({'message': 'Login successful', 'user_id': user["user_id"],  'first_name': user["first_name"], 'lastName': user["last_name"], 'email': user["email"],  'is_pfw': user["is_pfw"]}), 200
    else:
        return jsonify({'error': 'Invalid email or password'}), 400
