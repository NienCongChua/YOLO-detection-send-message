from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from sqlalchemy import or_
from flask_migrate import Migrate
from itsdangerous import URLSafeTimedSerializer, SignatureExpired, BadSignature
from datetime import datetime, timedelta
import random
import json
import base64
import string
import os

app = Flask(__name__)

# Cấu hình kết nối MySQL
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+mysqlconnector://root:12345678@localhost/YOLO_detection_send_message'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'default_secret_key')
# Initialize serializer
s = URLSafeTimedSerializer(app.config['SECRET_KEY'])

db = SQLAlchemy(app)
migrate = Migrate(app, db)
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
    reset_token = db.Column(db.String(100), nullable=True)  # Thêm thuộc tính reset_token
    reset_token_expiration = db.Column(db.TIMESTAMP, nullable=True)  # Thêm thuộc tính reset_token_expiration

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

def send_reset_email(email, reset_url, temp_password):
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

    email_content = f"""To: {email}
Subject: Password Reset

Click here to reset your password: <a href="{reset_url}">click here</a>
Your temporary password is: {temp_password}

Please use this temporary password to log in and then change your password immediately for security reasons."""

    message = {
        'raw': base64.urlsafe_b64encode(email_content.encode()).decode()
    }

    try:
        message = (service.users().messages().send(userId="me", body=message).execute())
        print(f'Message Id: {message["id"]}')
    except HttpError as error:
        print(f'An error occurred: {error}')


@app.route('/forgot-password', methods=['POST'])
def forgot_password():
    data = request.get_json()
    email = data.get('email')

    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({"message": "Email không tồn tại"}), 404

    # Generate a random reset token
    reset_token = ''.join(random.choices(string.ascii_letters + string.digits, k=32))
    # Generate a temporary password
    temp_password = ''.join(random.choices(string.ascii_letters + string.digits, k=10))
    
    # Hash the temporary password and store it as reset_token
    user.reset_token = bcrypt.generate_password_hash(temp_password).decode('utf-8')
    user.reset_token_expiration = datetime.utcnow() + timedelta(minutes=10)
    db.session.commit()

    # Generate a token with expiration time
    token = s.dumps(email, salt='email-reset')
    reset_url = f"http://localhost:3000/reset-password/{token}"

    # Send the reset email with temporary password
    send_reset_email(user.email, reset_url, temp_password)

    return jsonify({"message": "Email đặt lại mật khẩu đã được gửi"}), 200

@app.route('/reset-password/<token>', methods=['GET'])
def reset_password_get(token):
    try:
        email = s.loads(token, salt='email-reset', max_age=600)  # Token valid for 10 minutes
    except SignatureExpired:
        return jsonify({"message": "Token đã hết hạn"}), 400
    except BadSignature:
        return jsonify({"message": "Token không hợp lệ"}), 400

    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({"message": "Người dùng không tồn tại"}), 404

    if not user.reset_token or user.reset_token_expiration < datetime.utcnow():
        return jsonify({"message": "Reset token is invalid or has already been used"}), 400

    # Đặt lại mật khẩu
    user.password_hash = user.reset_token
    user.reset_token = None
    user.reset_token_expiration = None
    db.session.commit()

    return jsonify({"message": "Mật khẩu đã được đặt lại thành công"}), 200



# API: Đặt lại mật khẩu
@app.route('/reset-password', methods=['POST'])
def reset_password_post():
    data = request.get_json()
    token = data.get('token')
    new_password = data.get('new_password')

    if not token or not new_password:
        return jsonify({"message": "Thiếu token hoặc mật khẩu mới"}), 400

    try:
        email = s.loads(token, salt='email-reset', max_age=600)
    except SignatureExpired:
        return jsonify({"message": "Token đã hết hạn"}), 400
    except BadSignature:
        return jsonify({"message": "Token không hợp lệ"}), 400

    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({"message": "Người dùng không tồn tại"}), 404

    # Đặt lại mật khẩu
    hashed_pw = bcrypt.generate_password_hash(new_password).decode('utf-8')
    user.password_hash = hashed_pw
    db.session.commit()

    return jsonify({"message": "Mật khẩu đã được đặt lại thành công"}), 200


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

@app.route('/change-password', methods=['POST'])
def change_password():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    current_password = data.get('current_password')
    new_password = data.get('new_password')

    if not username or not email or not current_password or not new_password:
        return jsonify({"message": "Thiếu username, email, mật khẩu hiện tại hoặc mật khẩu mới"}), 400

    user = User.query.filter_by(username=username, email=email).first()
    if not user or not bcrypt.check_password_hash(user.password_hash, current_password):
        return jsonify({"message": "Username, email hoặc mật khẩu hiện tại không đúng"}), 400

    hashed_pw = bcrypt.generate_password_hash(new_password).decode('utf-8')
    user.password_hash = hashed_pw
    db.session.commit()

    return jsonify({"message": "Mật khẩu đã được thay đổi thành công"}), 200

if __name__ == '__main__':
    app.run(port=5000, debug=True)
