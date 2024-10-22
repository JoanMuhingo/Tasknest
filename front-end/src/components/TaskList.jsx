// TaskList.jsx
import React from 'react';
import TaskItem from './TaskItem';
import './TaskList.module.css';

const TaskList = ({ tasks, onDeleteTask, onEditTask, onToggleTask, selectedTitle }) => {
    return (
        <div className="task-list" style={{ marginTop: '20px' }}>
            {selectedTitle === null ? ( // Check if no title is selected
                <div className="no-title-selected-message">
                    <p>Please select a title to view or manage tasks.</p>
                </div>
            ) : tasks.length === 0 ? (
                <p>No tasks available.</p>
            ) : (
                <ul style={{ listStyleType: 'none', padding: 0 }}>
                    {tasks.map(task => (
                        <TaskItem
                            key={task.id}
                            task={task}
                            onDeleteTask={onDeleteTask}
                            onEditTask={onEditTask}
                            onToggleTask={onToggleTask}
                        />
                    ))}
                </ul>
            )}
        </div>
    );
};

export default TaskList;
