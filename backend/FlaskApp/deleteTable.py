from flask_sqlalchemy import SQLAlchemy
from flask import Flask

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+mysqlconnector://root:12345678@localhost/YOLO_detection_send_message'
db = SQLAlchemy(app)

def delete_all_tables():
    with app.app_context():
        db.drop_all()
        print("All tables have been deleted.")

if __name__ == "__main__":
    delete_all_tables()