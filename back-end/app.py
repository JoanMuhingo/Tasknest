# app.py
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from models import db, Title, Task
from datetime import datetime

app = Flask(__name__)

# Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///tasknest.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'mysecretkey'

# Initialize Extensions
db.init_app(app)
migrate = Migrate(app, db)
CORS(app)  # Enable CORS for all routes

# Routes

## **Titles Management**

# Get all titles
@app.route('/titles', methods=['GET'])
def get_titles():
    try:
        titles = Title.query.all()
        titles_list = [title.to_dict() for title in titles]
        return jsonify(titles_list), 200
    except Exception as e:
        print(f"Error fetching titles: {e}")
        return jsonify({"error": "Failed to fetch titles"}), 500

# Add a new title
@app.route('/titles', methods=['POST'])
def add_title():
    try:
        data = request.json
        if not data or 'name' not in data:
            return jsonify({"error": "Title name is required"}), 400

        existing_title = Title.query.filter_by(name=data['name']).first()
        if existing_title:
            return jsonify({"message": "Title already exists", "id": existing_title.id}), 200

        new_title = Title(name=data['name'])
        db.session.add(new_title)
        db.session.commit()
        return jsonify(new_title.to_dict()), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

# Delete a title
@app.route('/titles/<int:title_id>', methods=['DELETE'])
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

# Add a new task to a specific title
@app.route('/titles/<int:title_id>/tasks', methods=['POST'])
def add_task_to_title(title_id):
    try:
        data = request.json
        if not data or 'description' not in data:
            return jsonify({'error': 'Task description is required'}), 400

        title = Title.query.get(title_id)
        if not title:
            return jsonify({'error': 'Title not found'}), 404

        due_date = data.get('due_date')
        if due_date:
            try:
                due_date = datetime.fromisoformat(due_date).date()
            except ValueError:
                return jsonify({'error': 'Invalid due_date format. Use YYYY-MM-DD.'}), 400

        new_task = Task(
            description=data['description'],
            due_date=due_date,
            priority=data.get('priority', 'medium'),
            completed=data.get('completed', False),
            title_id=title.id
        )

        db.session.add(new_task)
        db.session.commit()
        return jsonify(new_task.to_dict()), 201

    except Exception as e:
        app.logger.error(f"Error adding task: {e}")
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# Get all tasks for a specific title
@app.route('/titles/<int:title_id>/tasks', methods=['GET'])
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

if __name__ == '__main__':
    app.run(debug=True)
