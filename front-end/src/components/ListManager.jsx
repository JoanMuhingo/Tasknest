// ListManager.jsx
import React, { useState } from 'react';
import axios from 'axios';
import './ListManager.module.css';
const ListManager = ({ titles, setTitles, onSelectTitle }) => {
    const [newTitle, setNewTitle] = useState('');

    const addTitle = async () => {
        if (!newTitle.trim()) return;

        try {
            const response = await axios.post('http://localhost:5000/titles', { name: newTitle });
            setTitles([...titles, response.data]);
            setNewTitle('');
            onSelectTitle(response.data.id);
        } catch (error) {
            console.error('Error adding title:', error);
            alert('Failed to add title. Please try again.');
        }
    };

    const deleteTitle = async (titleId) => {
        if (!window.confirm('Are you sure you want to delete this title and all its tasks?')) return;

        try {
            await axios.delete(`http://localhost:5000/titles/${titleId}`);
            setTitles(titles.filter(title => title.id !== titleId));
            onSelectTitle(null);
        } catch (error) {
            console.error('Error deleting title:', error);
            alert('Failed to delete title. Please try again.');
        }
    };

    return (
      <div className="list-manager">
          <h2>Titles</h2>
          {titles.length === 0 ? ( // Check if there are no titles
              <div className="no-titles-message">
                  <p>No titles available. Please add a title to get started!</p>
              </div>
          ) : (
              <ul style={{ listStyleType: 'none', padding: 0 }}>
                  {titles.map(title => (
                      <li key={title.id} style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
                          <span
                              onClick={() => onSelectTitle(title.id)}
                              style={{ cursor: 'pointer', flexGrow: 1 }}
                          >
                              {title.name}
                          </span>
                          <button onClick={() => deleteTitle(title.id)} style={{ padding: '2px 5px' }}>Delete</button>
                      </li>
                  ))}
              </ul>
          )}
          <div style={{ marginBottom: '10px' }}>
              <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Add new title"
                  style={{ width: '70%', padding: '5px' }}
              />
              <button onClick={addTitle} style={{ padding: '5px 10px', marginLeft: '5px' }}>Add Title</button>
          </div>
      </div>
  );
};

export default ListManager;