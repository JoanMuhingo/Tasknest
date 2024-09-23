import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Title from './Title';
import TaskForm from './TaskForm';

const ListManager = ({ onSelectTitle }) => {
  const [taskLists, setTaskLists] = useState([]);
  const [newTitle, setNewTitle] = useState('');
  const [selectedTitle, setSelectedTitle] = useState(null);

  useEffect(() => {
    fetchTaskLists();
  }, []);

  const fetchTaskLists = async () => {
    try {
      const response = await axios.get('http://localhost:5000/titles');
      setTaskLists(response.data);
    } catch (error) {
      console.error('Error fetching task lists:', error);
    }
  };

  const addTaskList = async () => {
    if (!newTitle.trim()) return;
    try {
      const response = await axios.post('http://localhost:5000/titles', { name: newTitle });
      setTaskLists([...taskLists, response.data]);
      setNewTitle('');
      setSelectedTitle(response.data);
      onSelectTitle(response.data.id); // Notify parent about the new title selection
    } catch (error) {
      console.error('Error adding task list:', error);
    }
  };

  const handleSelectTitle = (title) => {
    console.log("Selected Title ID:", title.id);
    setSelectedTitle(title);
    onSelectTitle(title.id); // Notify parent about the selected title
  };

  const handleTitleUpdate = (updatedTitle) => {
    setTaskLists(taskLists.map((list) => (list.id === updatedTitle.id ? updatedTitle : list)));
    setSelectedTitle(null);
  };

  const handleDeleteTitle = async (titleId) => {
    try {
        await axios.delete(`http://localhost:5000/titles/${titleId}`);
        setTaskLists(taskLists.filter((list) => list.id !== titleId)); // Update state immediately
        setSelectedTitle(null); // Deselect the title if it was deleted
        onSelectTitle(null); // Clear selection in parent
    } catch (error) {
        console.error('Error deleting task list:', error);
    }
};


return (
  <div className="list-manager">
    {!selectedTitle ? (
      <>
        {/* Add new title form */}
        <div className="add-title">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Add a new title"
          />
          <button onClick={addTaskList}>Add Title</button>
        </div>

        {/* Display the list of titles */}
        <ul className="titles-list">
          {taskLists.map((title) => (
            <li key={title.id} className="title-item">
              {title.name}
              <div className="title-actions">
                <button onClick={() => handleSelectTitle(title)}>Open</button>
                <button onClick={() => handleDeleteTitle(title.id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </>
    ) : (
      <div className="task-form-container">
        {/* Display the selected title at the top */}
        <h2>{selectedTitle.name}</h2>
        <button onClick={() => setSelectedTitle(null)}>Back to Titles</button>
        
      </div>
    )}
  </div>
);
};

export default ListManager;