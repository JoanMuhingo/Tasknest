// TaskManager.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TaskList from './TaskList';
import TaskForm from './TaskForm';
import EditTaskForm from './EditTaskForm';
import './TaskManager.module.css';
import './Animation.css';

const TaskManager = ({ selectedTitleId }) => {
    const [tasks, setTasks] = useState([]);
    const [editTask, setEditTask] = useState(null);
    const [titleName, setTitleName] = useState('');

    // Fetch tasks when selectedTitleId changes
    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/titles/${selectedTitleId}`);
                setTasks(response.data.tasks);
                setTitleName(response.data.name);
            } catch (error) {
                console.error('Error fetching tasks:', error);
                alert('Failed to fetch tasks. Please try again.');
            }
        };

        if (selectedTitleId) {
            fetchTasks();
        }
    }, [selectedTitleId]);

    // Add a new task
    const addTask = async (description, due_date, priority) => {
        try {
            const response = await axios.post(`http://localhost:5000/titles/${selectedTitleId}/tasks`, {
                description,
                due_date,
                priority
            });
            setTasks([...tasks, response.data]);
        } catch (error) {
            console.error('Error adding task:', error);
            alert('Failed to add task. Please try again.');
        }
    };

    // Delete a task
    const deleteTask = async (taskId) => {
        if (!window.confirm('Are you sure you want to delete this task?')) return;

        try {
            await axios.delete(`http://localhost:5000/tasks/${taskId}`);
            setTasks(tasks.filter(task => task.id !== taskId));
        } catch (error) {
            console.error('Error deleting task:', error);
            alert('Failed to delete task. Please try again.');
        }
    };

    // Update a task
    const updateTask = async (updatedTask) => {
        try {
            const response = await axios.put(`http://localhost:5000/tasks/${updatedTask.id}`, updatedTask);
            setTasks(tasks.map(task => task.id === updatedTask.id ? response.data : task));
            setEditTask(null);
        } catch (error) {
            console.error('Error updating task:', error);
            alert('Failed to update task. Please try again.');
        }
    };

    // Toggle task completion
    const toggleTask = async (taskId) => {
        try {
            const response = await axios.put(`http://localhost:5000/tasks/${taskId}/toggle`);
            setTasks(tasks.map(task => task.id === taskId ? response.data : task));
        } catch (error) {
            console.error('Error toggling task:', error);
            alert('Failed to toggle task. Please try again.');
        }
    };

    return (
        <div className="task-manager" style={{ border: '1px solid #ccc', padding: '20px' }}>
            <h2>Tasks for: {titleName}</h2>
            <TaskForm onAddTask={addTask} />
            {editTask && <EditTaskForm task={editTask} onUpdateTask={updateTask} onCancel={() => setEditTask(null)} />}
            <TaskList
                tasks={tasks}
                onDeleteTask={deleteTask}
                onEditTask={setEditTask}
                onToggleTask={toggleTask}
            />
        </div>
    );
};

export default TaskManager;
