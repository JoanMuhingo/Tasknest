// ListManager.jsx
import React, { useEffect, useState } from 'react';
import authAxios from './authAxios';
import './ListManager.css';
const ListManager = ({ titles, setTitles, onSelectTitle, selectedTitleId }) => {
    const [newTitle, setNewTitle] = useState('');

    useEffect(() => {
        const fetchTitles = async () => {
            try {
                const response = await authAxios.get("/titles");
                setTitles(response.data);
            } catch (error) {
                console.error("Error fetching titles:", error);
                alert("Failed to fetch titles. Please log in again.");
            }
        };

        fetchTitles();
    }, [setTitles]);

    const addTitle = async () => {
        if (!newTitle.trim()) return;
        try {
            const response = await authAxios.post('/titles', {name: newTitle.trim()});
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
            await authAxios.delete(`/titles/${titleId}`);
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
              <ul>
                  {titles.map(title => (
                      <li 
                        key={title.id} 
                        className={`title-card ${title.id === selectedTitleId ? 'selected' : ''}`}
                        onClick={() => onSelectTitle(title.id)}
                        >
                          <span className='title-name'>{title.name} </span>
                          <button
                            className='delete-button'
                            onClick={(e) => {
                                e.stopPropagation(); //prevents onclick from firing//
                                deleteTitle(title.id);
                            }}
                          >
                            Delete
                          </button>          
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