// TaskForm.jsx
import React, { useState } from 'react';
import './TaskForm.css';

const TaskForm = ({ onAddTask }) => {
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [priority, setPriority] = useState('medium');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!description.trim()) return;

        onAddTask(description, dueDate, priority);
        setDescription('');
        setDueDate('');
        setPriority('medium');
    };

    return (
        <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
            <h3>Add New Task</h3>
            <div style={{ marginBottom: '10px' }}>
                <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder=" Enter Task Description here."
                    required
                    style={{ width: '100%', padding: '5px' }}
                />
            </div>
            <div style={{ marginBottom: '10px' }}>
                <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    style={{ width: '100%', padding: '5px' }}
                />
            </div>
            <div style={{ marginBottom: '10px' }}>
                <label>Priority: </label>
                <select value={priority} onChange={(e) => setPriority(e.target.value)}>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                </select>
            </div>
            <button type="submit" style={{ padding: '5px 10px' }}>Add Task</button>
        </form>
    );
};

export default TaskForm;
