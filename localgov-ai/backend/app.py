import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import Base, Region, Service, Question, Rule, Document, User
from tasks import make_celery, send_sms_notification

app = Flask(__name__)
CORS(app)
app.config.update(
    CELERY_BROKER_URL=os.environ.get('CELERY_BROKER_URL', 'redis://localhost:6379/0'),
    CELERY_RESULT_BACKEND=os.environ.get('CELERY_RESULT_BACKEND', 'redis://localhost:6379/0')
)

celery = make_celery(app)

DB_URI = os.environ.get('DATABASE_URL', 'sqlite:///localgov.db')
engine = create_engine(DB_URI)
Session = sessionmaker(bind=engine)

@app.route('/api/init-db', methods=['GET'])
def init_db():
    from seed import seed_db
    try:
        seed_db(DB_URI)
        return jsonify({"message": "Database seeded successfully!"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/regions', methods=['GET'])
def get_regions():
    session = Session()
    regions = session.query(Region).all()
    res = [{"id": r.id, "state": r.state, "district": r.district} for r in regions]
    session.close()
    return jsonify(res)

@app.route('/api/regions/<int:region_id>/services', methods=['GET'])
def get_services(region_id):
    session = Session()
    services = session.query(Service).filter(Service.region_id == region_id).all()
    res = [{"id": s.id, "name": s.name, "description": s.description} for s in services]
    session.close()
    return jsonify(res)

@app.route('/api/services/<int:service_id>/questions', methods=['GET'])
def get_questions(service_id):
    session = Session()
    questions = session.query(Question).filter(Question.service_id == service_id).all()
    res = [{"id": q.id, "text": q.text, "field_name": q.field_name, "options": q.options} for q in questions]
    session.close()
    return jsonify(res)

@app.route('/api/services/<int:service_id>/triage', methods=['POST'])
def triage(service_id):
    data = request.json
    answers = data.get('answers', {})
    
    session = Session()
    rules = session.query(Rule).filter(Rule.service_id == service_id).all()
    
    matched_rule = None
    for rule in rules:
        condition = rule.condition_json or {}
        # Simple matching logic: all conditions in the rule must match the user's answers
        match = True
        for k, v in condition.items():
            if answers.get(k) != v:
                match = False
                break
        if match:
            matched_rule = rule
            break
    
    if not matched_rule:
        # Fallback to a default or return not found
        session.close()
        return jsonify({"error": "No matching rule found for given answers"}), 404
        
    docs = session.query(Document).filter(Document.rule_id == matched_rule.id).all()
    doc_list = [{"id": d.id, "name": d.name, "is_mandatory": bool(d.is_mandatory)} for d in docs]
    
    res = {
        "processing_fee": matched_rule.processing_fee,
        "convenience_fee": matched_rule.convenience_fee,
        "office_guidance": matched_rule.office_guidance,
        "download_link": matched_rule.download_link,
        "documents": doc_list
    }
    session.close()
    return jsonify(res)

@app.route('/api/profile', methods=['GET'])
def get_profile():
    session = Session()
    user = session.query(User).filter(User.id == 1).first()
    if not user:
        # Create a default user if none exists
        user = User(id=1, name='Jane Doe', email='jane.doe@example.com', phone='+91 98765 43210', location='Bangalore, Karnataka')
        session.add(user)
        session.commit()
    
    res = {
        "name": user.name,
        "email": user.email,
        "phone": user.phone,
        "location": user.location
    }
    session.close()
    return jsonify(res)

@app.route('/api/profile', methods=['POST'])
def update_profile():
    data = request.json
    session = Session()
    user = session.query(User).filter(User.id == 1).first()
    if not user:
        user = User(id=1, name=data.get('name', 'Jane Doe'))
        session.add(user)
    
    if 'name' in data: user.name = data['name']
    if 'email' in data: user.email = data['email']
    if 'phone' in data: user.phone = data['phone']
    if 'location' in data: user.location = data['location']
    
    session.commit()
    session.close()
    return jsonify({"message": "Profile updated successfully"})

@app.route('/api/notify', methods=['POST'])
def notify():
    data = request.json
    phone = data.get('phone')
    if not phone:
        return jsonify({"error": "Phone number is required"}), 400
    
    # Send to background worker
    send_sms_notification.delay(phone)
    
    return jsonify({"message": "Notification scheduled"}), 202

if __name__ == '__main__':
    app.run(debug=True, port=5000)
