from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS    # ← import CORS


app = Flask(__name__)
CORS(app)  # ← enable “Access-Control-Allow-Origin: *” by default

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'  # Using SQLite for simplicity
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    email = db.Column(db.String(100))
    active = db.Column(db.Boolean, default=True)

    def to_dict(self):
        return {'id': self.id, 'name': self.name, 'email': self.email, 'active': self.active}


# Initialize the database and create tables
with app.app_context():
    db.create_all()
    if not User.query.first():
        sample_users = [
            User(name='Alice', email='alice@example.com'),
            User(name='Bob', email='bob@example.com'),
            User(name='Charlie', email='charlie@example.com'),
            User(name='Charlie', email='charlie@example.com'),
            User(name='Charlie', email='charlie@example.com'),
            User(name='Charlie', email='charlie@example.com'),
            User(name='Charlie', email='charlie@example.com'),
            User(name='Charlie', email='charlie@example.com'),
            User(name='Charlie', email='charlie@example.com'),
            User(name='Charlie', email='charlie@example.com'),
            User(name='Charlie', email='charlie@example.com'),
            User(name='Charlie', email='charlie@example.com'),
            User(name='Charlie', email='charlie@example.com'),
            User(name='Charlie', email='charlie@example.com'),
            User(name='Charlie', email='charlie@example.com'),
            User(name='Charlie', email='charlie@example.com'),
            User(name='Charlie', email='charlie@example.com'),
            User(name='Charlie', email='charlie@example.com'),
            User(name='Charlie', email='charlie@example.com'),
            User(name='Charlie', email='charlie@example.com'),
            User(name='Charlie', email='charlie@example.com'),
            User(name='Charlie', email='charlie@example.com'),
            User(name='Charlie', email='charlie@example.com'),
            User(name='Charlie', email='charlie@example.com'),
            User(name='Charlie', email='charlie@example.com'),
            
            # Add more users as needed
        ]
        db.session.bulk_save_objects(sample_users)
        db.session.commit()


@app.route('/users', methods=['GET'])
def get_users():
    skip = int(request.args.get('skip', 0))
    limit = int(request.args.get('limit', 10))
    users = User.query.offset(skip).limit(limit).all()
    total = User.query.count()
    return jsonify({'items': [user.to_dict() for user in users], 'total': total})


@app.route('/users/bulk-update', methods=['PUT'])
def bulk_update_users():
    data = request.get_json()
    is_all_selected = data.get('all', False)
    update_fields = data.get('payload', {})

    if is_all_selected:
        # Apply filters if provided (e.g., active status)
        filters = data.get('filters', {})
        query = User.query
        if 'active' in filters:
            query = query.filter_by(active=filters['active'])
        exclude_ids = set(data.get('excludeIds', []))
        if exclude_ids:
            users_to_update = [user for user in query.all() if user.id not in exclude_ids]
        else:
            users_to_update = query.all()
    else:
        ids = data.get('ids', [])
        users_to_update = User.query.filter(User.id.in_(ids)).all()

    for user in users_to_update:
        for key, value in update_fields.items():
            setattr(user, key, value)

    db.session.commit()
    return jsonify({'message': f'Updated {len(users_to_update)} users.'})


if __name__ == '__main__':
    app.run(debug=True)
