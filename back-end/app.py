# app.py
from flask import Flask, jsonify, request, session
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_migrate import Migrate
from models import db, Title, Task, User
from datetime import datetime, timedelta
import os


basedir = os.path.abspath(os.path.dirname(__file__))

app = Flask(__name__)

# Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'tasknest.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'mysecretkey'
app.config['JWT_SECRET_KEY'] = 'mysecretkey'
app.config['JWT_TOKEN_LOCATION']= ["headers"]
app.config['JWT_HEADER_NAME'] = 'Authorization'
app.config["JWT_HEADER_TYPE"] = 'Bearer'
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=1)

jwt = JWTManager(app)


@jwt.unauthorized_loader
def custom_unauthorized_response(err_str):
    print(f"Unauthorized error: {err_str}")
    return jsonify({"error": "Missing or invalid JWT"}), 401

@jwt.invalid_token_loader
def custom_invalid_token_response(err_str):
    print(f"Invalid token error: {err_str}")
    return jsonify({"error": "Invalid token"}), 422

@jwt.expired_token_loader
def custom_expired_token_response(jwt_header, jwt_payload):
    print("Expired token")
    return jsonify({"error": "Token expired"}), 401
# Initialize Extensions
db.init_app(app)
migrate = Migrate(app, db)
CORS(app, supports_credentials=True, origins=["http://localhost:3000"])  # Enable CORS for all routes

# Routes

## **Titles Management**

# Get all titles
@app.route('/titles', methods=['GET'])
@jwt_required()
def get_titles():
    try:
        user_id = get_jwt_identity()
        titles = Title.query.filter_by(user_id=user_id).all()
        titles_list = [title.to_dict() for title in titles]
        return jsonify(titles_list), 200
    except Exception as e:
        print(f"Error fetching titles: {e}")
        return jsonify({"error": "Failed to fetch titles"}), 500

# Add a new title
@app.route('/titles', methods=['POST'])
@jwt_required()
def add_title():
    try:
        user_id = get_jwt_identity() #gets current user id
        data = request.json

        if not data or 'name' not in data:
            return jsonify({"error": "Title name is required"}), 400

        existing_title = Title.query.filter_by(name=data['name'], user_id=user_id).first()
        if existing_title:
            return jsonify({"message": "Title already exists", "id": existing_title.id}), 200

        new_title = Title(name=data['name'], user_id=user_id)
        db.session.add(new_title)
        db.session.commit()
        return jsonify(new_title.to_dict()), 201

    except Exception as e:
        db.session.rollback()
        print(f"Error adding title: {e}")
        return jsonify({"error": str(e)}), 500

# Delete a title
@app.route('/titles/<int:title_id>', methods=['DELETE'])
@jwt_required()
def delete_title(title_id):
    try:
        title = Title.query.get(title_id)
        if not title:
            return jsonify({'error': 'Title not found'}), 404

        db.session.delete(title)
        db.session.commit()
        return jsonify({'message': 'Title deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# Get a specific title by ID (including tasks)
@app.route('/titles/<int:title_id>', methods=['GET'])
@jwt_required()
def get_title_by_id(title_id):
    try:
        title = Title.query.get(title_id)
        if not title:
            return jsonify({'error': 'Title not found'}), 404

        tasks = [task.to_dict() for task in title.tasks]
        title_data = title.to_dict()
        title_data['tasks'] = tasks
        return jsonify(title_data), 200
    except Exception as e:
        app.logger.error(f"Error fetching title: {e}")
        return jsonify({'error': str(e)}), 500

## **Tasks Management**
#get tasks
@app.route('/tasks')
@jwt_required()
def get_tasks():
    user_id = get_jwt_identity()
    print(f"fetching tasks for user {user_id}")
    tasks = Task.query.filter_by(user_id=user_id).all()
    return jsonify([task.to_dict() for task in tasks])
# Add a new task to a specific title

@app.route('/titles/<int:title_id>/tasks', methods=['POST'])
@jwt_required()
def add_task_to_title(title_id):
    try:
        user_id = get_jwt_identity()
        
        # Get data from the request
        data = request.json
        if not data or 'description' not in data:
            return jsonify({'error': 'Task description is required'}), 400

        # Find the title by ID
        title = Title.query.get(title_id)
        if not title:
            return jsonify({'error': 'Title not found'}), 404

        # Handle due_date conversion if provided
        due_date = data.get('due_date')
        if due_date:
            try:
                due_date = datetime.fromisoformat(due_date).date()
            except ValueError:
                return jsonify({'error': 'Invalid due_date format. Use YYYY-MM-DD.'}), 400

        # Create a new task and associate it with the logged-in user
        new_task = Task(
            description=data['description'],
            due_date=due_date,
            priority=data.get('priority', 'medium'),
            completed=data.get('completed', False),
            title_id=title.id,
            user_id=user_id  # Associate the task with the logged-in user
        )

        # Add the task to the session and commit
        db.session.add(new_task)
        db.session.commit()

        return jsonify(new_task.to_dict()), 201

    except Exception as e:
        app.logger.error(f"Error adding task: {e}")
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


# Get all tasks for a specific title
@app.route('/titles/<int:title_id>/tasks', methods=['GET'])
@jwt_required()
def get_tasks_by_title(title_id):
    try:
        title = Title.query.get(title_id)
        if not title:
            return jsonify({'error': 'Title not found'}), 404

        tasks = [task.to_dict() for task in title.tasks]
        return jsonify({'title': title.name, 'tasks': tasks}), 200
    except Exception as e:
        app.logger.error(f"Error fetching tasks for title ID {title_id}: {e}")
        return jsonify({"error": "Failed to fetch tasks"}), 500

# Update a task by ID
@app.route('/tasks/<int:task_id>', methods=['PUT'])
@jwt_required()
def update_task(task_id):
    try:
        task = Task.query.get(task_id)
        if not task:
            return jsonify({'error': 'Task not found'}), 404

        data = request.json
        if not data:
            return jsonify({'error': 'No data provided'}), 400

        task.description = data.get('description', task.description)

        if 'due_date' in data:
            if data['due_date']:
                try:
                    task.due_date = datetime.fromisoformat(data['due_date']).date()
                except ValueError:
                    return jsonify({'error': 'Invalid due_date format. Use YYYY-MM-DD.'}), 400
            else:
                task.due_date = None

        task.priority = data.get('priority', task.priority)
        task.completed = data.get('completed', task.completed)

        db.session.commit()
        return jsonify(task.to_dict()), 200

    except Exception as e:
        app.logger.error(f"Error updating task ID {task_id}: {e}")
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# Toggle task completion status
@app.route('/tasks/<int:task_id>/toggle', methods=['PUT'])
@jwt_required()
def toggle_task_completion(task_id):
    try:
        task = Task.query.get(task_id)
        if not task:
            return jsonify({'error': 'Task not found'}), 404

        task.completed = not task.completed
        db.session.commit()
        return jsonify(task.to_dict()), 200
    except Exception as e:
        app.logger.error(f"Error toggling task completion for task ID {task_id}: {e}")
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# Delete a task by ID
@app.route('/tasks/<int:task_id>', methods=['DELETE'])
@jwt_required()
def delete_task(task_id):
    try:
        task = Task.query.get(task_id)
        if not task:
            return jsonify({'error': 'Task not found'}), 404

        db.session.delete(task)
        db.session.commit()
        return jsonify({'message': 'Task deleted successfully'}), 200
    except Exception as e:
        app.logger.error(f"Error deleting task ID {task_id}: {e}")
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
    

#sign-up#
@app.route('/signup', methods=['POST'])  
def signup():
    data = request.json
    if not data or not data.get('username') or not data.get('password'):
        return jsonify({'error':'Username and Password Required'}), 400
    
    if User.query.filter_by(username=data['username']).first():
        return jsonify({'error': 'Username already exists'}), 400
    

    user = User(username=data['username'])
    user.set_password(data['password'])
    db.session.add(user)
    db.session.commit()
    return jsonify({'message': 'User created Succeefully'}),201

#login
@app.route("/login", methods=['POST'])
def login():
    data = request.json
    if not data or not data.get('username') or not data.get('password'):
        return jsonify({'error': 'Username and password required'}), 400
    
    user = User.query.filter_by(username=data['username']).first()
    if not user or not user.check_password(data['password']):
        return jsonify({'error': 'Invalid credentials'}), 401 
    
    access_token = create_access_token(identity=str(user.id))

    return jsonify({
        'message': 'Login successful',
        'token': access_token,
        'user': user.to_dict()
    }), 200

@app.route('/check_session', methods=['GET'])
@jwt_required()
def check_session():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    return jsonify({'logged_in_as': user.username}), 200

@jwt.expired_token_loader
def expired_token_callback(jwt_header, jwt_payload):
    return jsonify(msg="The token has expired"), 401   


if __name__ == '__main__':
    app.run(debug=True)
