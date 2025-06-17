from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable Cross-Origin Resource Sharing

# Configure SQLite database
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# User model definition
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    email = db.Column(db.String(100))
    active = db.Column(db.Boolean, default=True)

    # Convert to dictionary for JSON responses
    def to_dict(self):
        return {
            'id': self.id, 
            'name': self.name, 
            'email': self.email, 
            'active': self.active
        }

# Create database tables and seed initial data
with app.app_context():
    db.create_all()
    
    # Add sample data if no users exist
    if not User.query.first():
        sample_users = [
            User(name='Alice', email='alice@example.com'),
            User(name='Bob', email='bob@example.com'),
            User(name='Charlie', email='charlie@example.com'),
            User(name='Diana', email='diana@example.com'),
            User(name='Eve', email='eve@example.com'),
            User(name='Frank', email='frank@example.com'),
            User(name='George', email='george@example.com'),
            User(name='Hannah', email='hannah@example.com'),
            User(name='Ian', email='ian@example.com'),
            User(name='Jack', email='jack@example.com'),
            User(name='Kate', email='kate@example.com'),
            User(name='Liam', email='liam@example.com'),
            User(name='Mia', email='mia@example.com'),
            User(name='Noah', email='noah@example.com'),
            User(name='Olivia', email='olivia@example.com'),
            User(name='Peter', email='peter@example.com'),
            User(name='Quinn', email='quinn@example.com'),
            User(name='Rachel', email='rachel@example.com'),
            User(name='Sam', email='sam@example.com'),
            User(name='Tina', email='tina@example.com'),
            User(name='Uma', email='uma@example.com'),
            User(name='Violet', email='violet@example.com'),
            User(name='William', email='william@example.com'),
            User(name='Xavier', email='xavier@example.com'),
            User(name='Yara', email='yara@example.com'),
            User(name='Zane', email='zane@example.com'),
            User(name='Ava', email='ava@example.com'),
            User(name='Ben', email='ben@example.com'),
            User(name='Cara', email='cara@example.com'),
            User(name='Dylan', email='dylan@example.com'),
            User(name='Ethan', email='ethan@example.com'),
            User(name='Fiona', email='fiona@example.com'),
            User(name='Gavin', email='gavin@example.com'),
            User(name='Hannah', email='hannah@example.com'),
            User(name='Ian', email='ian@example.com'),
            User(name='Jack', email='jack@example.com'),
            User(name='Kate', email='kate@example.com'),
            User(name='Liam', email='liam@example.com'),
            User(name='Mia', email='mia@example.com'),
            User(name='Noah', email='noah@example.com'),
            User(name='Olivia', email='olivia@example.com'),
            User(name='Peter', email='peter@example.com'),
            User(name='Quinn', email='quinn@example.com'),
            User(name='Rachel', email='rachel@example.com'),
            User(name='Sam', email='sam@example.com'),
            User(name='Tina', email='tina@example.com'),
            User(name='Uma', email='uma@example.com'),
            User(name='Violet', email='violet@example.com'),
            User(name='William', email='william@example.com'),
            User(name='Xavier', email='xavier@example.com'),
            User(name='Yara', email='yara@example.com'),
            User(name='Zane', email='zane@example.com'),
            User(name='Ava', email='ava@example.com'),
            User(name='Ben', email='ben@example.com'),
            User(name='Cara', email='cara@example.com'),
            User(name='Dylan', email='dylan@example.com'),
            User(name='Ethan', email='ethan@example.com'),
            User(name='Fiona', email='fiona@example.com'),
            User(name='Gavin', email='gavin@example.com'),
            User(name='Hannah', email='hannah@example.com'),
            User(name='Ian', email='ian@example.com'),
            User(name='Jack', email='jack@example.com'),
            User(name='Kate', email='kate@example.com'),
            User(name='Liam', email='liam@example.com'),
            User(name='Mia', email='mia@example.com'),
            User(name='Noah', email='noah@example.com'),
            User(name='Olivia', email='olivia@example.com'),
            User(name='Peter', email='peter@example.com'),
            User(name='Quinn', email='quinn@example.com'),
            User(name='Rachel', email='rachel@example.com'),
            User(name='Sam', email='sam@example.com'),
            User(name='Tina', email='tina@example.com'),
            User(name='Uma', email='uma@example.com'),
            User(name='Violet', email='violet@example.com'),
            User(name='William', email='william@example.com'),
            User(name='Xavier', email='xavier@example.com'),
            User(name='Yara', email='yara@example.com'),
            User(name='Zane', email='zane@example.com'),
            User(name='Ava', email='ava@example.com'),
            User(name='Ben', email='ben@example.com'),
            User(name='Cara', email='cara@example.com'),
            User(name='Dylan', email='dylan@example.com'),
            User(name='Ethan', email='ethan@example.com'),
            User(name='Fiona', email='fiona@example.com'),
            User(name='Gavin', email='gavin@example.com'),
            User(name='Hannah', email='hannah@example.com'),
            User(name='Ian', email='ian@example.com'),
            User(name='Jack', email='jack@example.com'),
            User(name='Kate', email='kate@example.com'),
            User(name='Liam', email='liam@example.com'),
            User(name='Mia', email='mia@example.com'),
            User(name='Noah', email='noah@example.com'),
             User(name='Xavier', email='xavier@example.com'),
            User(name='Yara', email='yara@example.com'),
            User(name='Zane', email='zane@example.com'),
            User(name='Ava', email='ava@example.com'),
            User(name='Ben', email='ben@example.com'),
            User(name='Cara', email='cara@example.com'),
            User(name='Dylan', email='dylan@example.com'),
            User(name='Ethan', email='ethan@example.com'),
            User(name='Fiona', email='fiona@example.com'),
            User(name='Gavin', email='gavin@example.com'),
            User(name='Hannah', email='hannah@example.com'),
            User(name='Ian', email='ian@example.com'),
            User(name='Jack', email='jack@example.com'),
            User(name='Kate', email='kate@example.com'),
            User(name='Liam', email='liam@example.com'),
            User(name='Mia', email='mia@example.com'),
            User(name='Noah', email='noah@example.com'),
             User(name='Xavier', email='xavier@example.com'),
            User(name='Yara', email='yara@example.com'),
            User(name='Zane', email='zane@example.com'),
            User(name='Ava', email='ava@example.com'),
            User(name='Ben', email='ben@example.com'),
            User(name='Cara', email='cara@example.com'),
            User(name='Dylan', email='dylan@example.com'),
            User(name='Ethan', email='ethan@example.com'),
            User(name='Fiona', email='fiona@example.com'),
            User(name='Gavin', email='gavin@example.com'),
            User(name='Hannah', email='hannah@example.com'),
            User(name='Ian', email='ian@example.com'),
            User(name='Jack', email='jack@example.com'),
            User(name='Kate', email='kate@example.com'),
            User(name='Liam', email='liam@example.com'),
            User(name='Mia', email='mia@example.com'),
            User(name='Noah', email='noah@example.com'),
             User(name='Xavier', email='xavier@example.com'),
            User(name='Yara', email='yara@example.com'),
            User(name='Zane', email='zane@example.com'),
            User(name='Ava', email='ava@example.com'),
            User(name='Ben', email='ben@example.com'),
            User(name='Cara', email='cara@example.com'),
            User(name='Dylan', email='dylan@example.com'),
            User(name='Ethan', email='ethan@example.com'),
            User(name='Fiona', email='fiona@example.com'),
            User(name='Gavin', email='gavin@example.com'),
            User(name='Hannah', email='hannah@example.com'),
            User(name='Ian', email='ian@example.com'),
            User(name='Jack', email='jack@example.com'),
            User(name='Kate', email='kate@example.com'),
            User(name='Liam', email='liam@example.com'),
            User(name='Mia', email='mia@example.com'),
            User(name='Noah', email='noah@example.com'),
        ]
        db.session.bulk_save_objects(sample_users)
        db.session.commit()

# ─── API ENDPOINTS ───────────────────────────────────────────────────────

# Get paginated users
@app.route('/users', methods=['GET'])
def get_users():
    try:
        # Parse pagination parameters
        skip = int(request.args.get('skip', 0))
        limit = int(request.args.get('limit', 10))
        
        # Query database with pagination
        users = User.query.offset(skip).limit(limit).all()
        total = User.query.count()
        
        # Return paginated response
        return jsonify({
            'items': [user.to_dict() for user in users],
            'total': total
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Bulk update users
@app.route('/users/bulk-update', methods=['PUT'])
def bulk_update_users():
    try:
        # Parse request data
        data = request.get_json()
        user_ids = data.get('user_ids', [])
        update_fields = data.get('payload', {})
        
        # Validate request
        if not user_ids:
            return jsonify({'message': 'No users selected'}), 400
        if not update_fields:
            return jsonify({'error': 'Missing update payload'}), 400
        
        # Perform bulk update in single SQL operation
        update_count = User.query.filter(User.id.in_(user_ids)) \
            .update(update_fields, synchronize_session=False)
        
        db.session.commit()
        
        return jsonify({
            'message': f'Updated {update_count} users',
            'updated_count': update_count
        })
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# Run the application
if __name__ == '__main__':
    app.run(debug=True)