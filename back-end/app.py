from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from models import db, Title, Task

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///tasknest.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'mysecretkey'

db.init_app(app)
migrate = Migrate(app, db)

CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

# Route to get all titles
@app.route('/titles', methods=['GET'])
def get_titles():
    try:
        titles = Title.query.all()
        titles_list = [{"id": title.id, "name": title.name} for title in titles]
        return jsonify(titles_list)
    except Exception as e:
        print(f"Error fetching titles: {e}")
        return jsonify({"error": "Failed to fetch titles"}), 500


@app.route('/titles/<int:title_id>', methods=['GET'])
def get_title_by_id(title_id):
  try:
    title = Title.query.get(title_id)
    if not title:
      return jsonify({'error': 'Title not found'}), 404
    # Optionally, convert the title object to a dictionary for JSON serialization
    return jsonify(title.to_dict()), 200
  except Exception as e:
    app.logger.error(f"Error fetching title: {e}")
    return jsonify({'error': str(e)}), 500

# Route to add a new title
@app.route('/titles', methods=['POST'])
def add_title():
    try:
        data = request.json
        if 'name' not in data:
            return jsonify({"error": "Name is required"}), 400

        existing_title = Title.query.filter_by(name=data['name']).first()
        if existing_title:
            return jsonify({"message": "Title already exists", "id": existing_title.id}), 200

        new_title = Title(name=data['name'])
        db.session.add(new_title)
        db.session.commit()
        return jsonify({"message": "Title created successfully", "id": new_title.id}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

# Route to add a new task to a specific title
@app.route('/titles/<int:title_id>/tasks', methods=['POST'])
def add_task_to_title(title_id):
    try:
        data = request.json
        if not data or 'description' not in data:
            return jsonify({'error': 'Missing required fields'}), 400

        # Fetch the title by title_id
        title = Title.query.get(title_id)
        if not title:
            return jsonify({'error': 'Title not found'}), 404

        # Create a new task under the fetched title
        new_task = Task(
            description=data['description'],
            title_id=title.id,
            due_date=data.get('due_date'),
            priority=data.get('priority', 'medium'),
            completed=data.get('completed', False)
        )
        db.session.add(new_task)
        db.session.commit()
        return jsonify({'message': 'Task added successfully', 'task': new_task.to_dict()}), 201

    except Exception as e:
        app.logger.error(f"Error occurred: {e}")
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


# Route to delete a title by ID
@app.route('/titles/<int:title_id>', methods=['DELETE'])
def delete_title(title_id):
    title = Title.query.get(title_id)
    if title is None:
        return jsonify({'error': 'Title not found'}), 404

    try:
        db.session.delete(title)
        db.session.commit()
        return '', 204  # Successful deletion
    except Exception as e:
        app.logger.error(f"Error deleting title ID {title_id}: {str(e)}")
        db.session.rollback()  # Rollback in case of an error
        return jsonify({'error': 'Could not delete title. ' + str(e)}), 500



# Route to get tasks by title ID
@app.route('/titles/<int:title_id>/tasks', methods=['GET'])
def get_tasks_by_title(title_id):
    try:
        title = Title.query.get_or_404(title_id)
        tasks = Task.query.filter_by(title_id=title.id).all()
        task_list = [task.to_dict() for task in tasks]
        return jsonify({"title": title.name, "tasks": task_list})
    except Exception as e:
        app.logger.error(f"Error fetching tasks for title ID {title_id}: {e}")
        return jsonify({"error": "Failed to fetch tasks"}), 500

# Route to get all tasks with filters
@app.route('/tasks', methods=['GET'])
def get_tasks():
    try:
        due_date = request.args.get('due_date')
        priority = request.args.get('priority')
        sort_by = request.args.get('sort_by', 'id')
        order = request.args.get('order', 'asc')

        tasks = Task.query.all()

        if due_date:
            tasks = [task for task in tasks if task.due_date == due_date]

        if priority:
            tasks = [task for task in tasks if task.priority == priority]

        tasks.sort(key=lambda x: getattr(x, sort_by, 0), reverse=(order == 'desc'))

        task_list = [{"id": task.id, "task_title": task.task_title, "description": task.description, "due_date": task.due_date.isoformat() if task.due_date else None, "priority": task.priority, "completed": task.completed} for task in tasks]
        
        return jsonify(task_list)
    except AttributeError:
        return jsonify({'error': 'Invalid sort_by parameter'}), 400
    except Exception as e:
        app.logger.error(f"Error fetching tasks: {e}")
        return jsonify({"error": "Failed to fetch tasks"}), 500

# Route to update a task by ID
@app.route('/tasks/<int:task_id>', methods=['PUT'])
def update_task(task_id):
    try:
        task = Task.query.get_or_404(task_id)
        data = request.json
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        task.task_title = data.get('task_title', task.task_title)
        task.completed = data.get('completed', task.completed)
        
        db.session.commit()
        return jsonify(task.to_dict())
    except Exception as e:
        app.logger.error(f"Error updating task ID {task_id}: {e}")
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# Route to delete a task by ID
@app.route('/tasks/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    try:
        task = Task.query.get_or_404(task_id)
        db.session.delete(task)
        db.session.commit()
        return '', 204
    except Exception as e:
        app.logger.error(f"Error deleting task ID {task_id}: {e}")
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# Route to get all tasklists with tasks
@app.route('/tasklists', methods=['GET'])
def get_tasklists():
    try:
        tasklists = Title.query.all()
        tasklists_list = [
            {
                'title': title.name,
                'tasks': [
                    {'id': task.id, 'task_title': task.task_title, 'due_date': task.due_date.isoformat() if task.due_date else None, 'priority': task.priority, 'completed': task.completed}
                    for task in Task.query.filter_by(title_id=title.id).all()
                ]
            }
            for title in tasklists
        ]
        return jsonify(tasklists_list)
    except Exception as e:
        app.logger.error(f"Error fetching tasklists: {e}")
        return jsonify({"error": "Failed to fetch tasklists"}), 500

# Route to add a new tasklist
@app.route('/tasklists', methods=['POST'])
def add_tasklist():
    try:
        data = request.json
        if 'title' not in data:
            return jsonify({'error': 'Title is required'}), 400
        
        new_tasklist = Title(name=data['title'])
        db.session.add(new_tasklist)
        db.session.commit()
        
        return jsonify({'id': new_tasklist.id, 'title': new_tasklist.name}), 201
    except Exception as e:
        db.session.rollback()
        app.logger.error(f"Error adding tasklist: {e}")
        return jsonify({'error': str(e)}), 500




if __name__ == '__main__':
    app.run(debug=True)
