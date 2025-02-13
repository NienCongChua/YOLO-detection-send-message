from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from sqlalchemy import or_
import random
import json
import base64

app = Flask(__name__)

# Cấu hình kết nối MySQL
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+mysqlconnector://root:12345678@localhost/YOLO_detection_send_message'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
CORS(app)

# Định nghĩa model User
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(20), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(60), nullable=False)
    verification_code = db.Column(db.String(6), nullable=True)
    is_verified = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.TIMESTAMP, server_default=db.func.current_timestamp(), nullable=True)

# Khởi tạo database
with app.app_context():
    db.create_all()

# Hàm gửi email
def send_verification_email(email, code):
    with open('api/gmail.json') as f:
        creds_data = json.load(f)

    creds = Credentials(
        None,
        refresh_token=creds_data['refresh_token'],
        token_uri=creds_data['installed']['token_uri'],
        client_id=creds_data['installed']['client_id'],
        client_secret=creds_data['installed']['client_secret']
    )
    service = build('gmail', 'v1', credentials=creds)

    message = {
        'raw': base64.urlsafe_b64encode(f'To: {email}\nSubject: Verification Code\n\nYour verification code is: {code}'.encode()).decode()
    }

    try:
        message = (service.users().messages().send(userId="me", body=message).execute())
        print(f'Message Id: {message["id"]}')
    except HttpError as error:
        print(f'An error occurred: {error}')

# API endpoint để đăng ký
@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    if 'username' not in data or 'email' not in data or 'password' not in data:
        return jsonify({"message": "Username, email, and password are required"}), 400
    
    if User.query.filter_by(username=data['username']).first():
        return jsonify({"message": "Username already exists"}), 400
    
    if User.query.filter_by(email=data['email']).first():
        return jsonify({"message": "Email already exists"}), 400

    hashed_pw = bcrypt.generate_password_hash(data['password']).decode('utf-8')
    
    # Tạo mã xác thực ngẫu nhiên 6 chữ số
    verification_code = str(random.randint(100000, 999999))
    
    new_user = User(username=data['username'], email=data['email'], password_hash=hashed_pw, verification_code=verification_code)
    db.session.add(new_user)
    db.session.commit()

    send_verification_email(data['email'], verification_code)

    return jsonify({"message": "Registration successful, verification code sent"}), 201

# API endpoint để xác thực mã
@app.route('/verify-code', methods=['POST'])
def verify_code():
    data = request.get_json()
    if 'email' not in data or 'code' not in data:
        return jsonify({"message": "Email and code are required"}), 400
    
    user = User.query.filter_by(email=data['email']).first()
    if user and user.verification_code == data['code']:
        user.is_verified = True
        user.verification_code = None
        db.session.commit()
        return jsonify({"message": "Verification successful"}), 200
    else:
        return jsonify({"message": "Invalid verification code"}), 400

# API endpoint để đăng nhập
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data or ('email' not in data and 'username' not in data) or 'password' not in data:
        return jsonify({"message": "Email/Username and password are required"}), 400
    
    # Check if email or username is provided
    email = data.get('email')
    username = data.get('username')
    password = data.get('password')
    
    user = User.query.filter(or_(User.email == email, User.username == username)).first()
    
    if user and bcrypt.check_password_hash(user.password_hash, password):
        if user.is_verified:
            return jsonify({"message": "Login successful"}), 200
        else:
            return jsonify({"message": "Account not verified"}), 401
    else:
        return jsonify({"message": "Invalid credentials"}), 401

if __name__ == '__main__':
    app.run(port=5000, debug=True)