// App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ListManager from './ListManager';
import TaskManager from './TaskManager';
import './variables.css';


const App = () => {
    const [titles, setTitles] = useState([]);
    const [selectedTitleId, setSelectedTitleId] = useState(null);

    // Fetch all titles on component mount
    useEffect(() => {
        const fetchTitles = async () => {
            try {
                const response = await axios.get('http://localhost:5000/titles');
                setTitles(response.data);
            } catch (error) {
                console.error('Error fetching titles:', error);
                alert('Failed to fetch titles. Please try again.');
            }
        };

        fetchTitles();
    }, []);

    const handleSelectTitle = (id) => {
        setSelectedTitleId(id);
    };

    return (
        <div className="App" style={{ display: 'flex', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <div style={{ width: '30%', marginRight: '20px' }}>
                <ListManager titles={titles} setTitles={setTitles} onSelectTitle={handleSelectTitle} />
            </div>
            <div style={{ width: '70%' }}>
                {selectedTitleId ? (
                    <TaskManager selectedTitleId={selectedTitleId} />
                ) : (
                    <p>Select a title to view its tasks.</p>
                )}
            </div>
        </div>
    );
};

export default App;
