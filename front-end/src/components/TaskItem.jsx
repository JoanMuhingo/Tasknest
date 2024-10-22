// TaskItem.jsx
import React from 'react';
import './TaskItem.module.css';

const TaskItem = ({ task, onDeleteTask, onEditTask, onToggleTask }) => {
    const { id, description, due_date, priority, completed } = task;

    return (
        <li className={`task-item ${completed ? 'completed' : ''}`}>
            <input
                type="checkbox"
                checked={completed}
                onChange={() => onToggleTask(id)}
                className="toggle-button" // Optional styling for checkbox
            />
            <span>
                {description}
                {due_date && ` (Due: ${new Date(due_date).toLocaleDateString()})`}
                {` | Priority: ${priority}`}
            </span>
            <button onClick={() => onEditTask(task)} className="edit-button">Edit</button>
            <button onClick={() => onDeleteTask(id)} className="delete-button">Delete</button>
        </li>
    );
};

export default TaskItem;
