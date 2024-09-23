import React from "react";
import "./TaskItem.css";

const TaskItem = ({ task, onEdit, onDelete, onToggle, isNew }) => {
    if (!task) {
        return null;
    }

    return (
        <li className={`task-item ${task.done ? "completed" : ""} ${isNew ? "new" : ""}`}>
            <span>{task.description}</span>
            <button className="edit-button" onClick={() => onEdit(task)}
            aria-label={`Edit ${task.description}`}
            >Edit</button>
            <button className="delete-button" onClick={() => onDelete(task.id)}
            aria-label={`Delete ${task.description}`}
            >Delete</button>
            <button className="toggle-button" onClick={() => onToggle(task.id)}
            aria-label={`Mark ${task.description} as ${task.completed ? "incomplete" : "complete"}`}
            >{task.done ? "Undo" : "Done"}</button>
        </li>
    );
};

export default TaskItem;
