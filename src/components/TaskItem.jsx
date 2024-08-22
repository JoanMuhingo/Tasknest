import React from "react";
import "./TaskItem.css";

const TaskItem = ({ task, onEdit, onDelete, onToggle, isNew }) => {
    if (!task) {
        return null;
    }

    return (
        <li className={`task-item ${task.done ? "completed" : ""} ${isNew ? "new" : ""}`}>
            <span>{task.title}</span>
            <button className="edit-button" onClick={() => onEdit(task)}>Edit</button>
            <button className="delete-button" onClick={() => onDelete(task.id)}>Delete</button>
            <button className="toggle-button" onClick={() => onToggle(task.id)}>{task.done ? "Undo" : "Done"}</button>
        </li>
    );
};

export default TaskItem;
