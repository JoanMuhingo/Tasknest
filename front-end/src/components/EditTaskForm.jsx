// EditTaskForm.jsx
import React, { useState } from 'react';

const EditTaskForm = ({ task, onUpdateTask, onCancel }) => {
    const [description, setDescription] = useState(task.description);
    const [dueDate, setDueDate] = useState(task.due_date ? task.due_date.slice(0,10) : '');
    const [priority, setPriority] = useState(task.priority);
    const [completed, setCompleted] = useState(task.completed);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!description.trim()) return;

        const updatedTask = {
            id: task.id,
            description,
            due_date: dueDate ? new Date(dueDate).toISOString().split('T')[0] : null,
            priority,
            completed
        };

        onUpdateTask(updatedTask);
    };

    return (
        <form onSubmit={handleSubmit} style={{ marginTop: '20px', border: '1px solid #ccc', padding: '15px' }}>
            <h3>Edit Task</h3>
            <div style={{ marginBottom: '10px' }}>
                <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Task Description"
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
            <div style={{ marginBottom: '10px' }}>
                <label>
                    <input
                        type="checkbox"
                        checked={completed}
                        onChange={(e) => setCompleted(e.target.checked)}
                        style={{ marginRight: '5px' }}
                    />
                    Completed
                </label>
            </div>
            <button type="submit" style={{ padding: '5px 10px', marginRight: '10px' }}>Save</button>
            <button type="button" onClick={onCancel} style={{ padding: '5px 10px' }}>Cancel</button>
        </form>
    );
};

export default EditTaskForm;
