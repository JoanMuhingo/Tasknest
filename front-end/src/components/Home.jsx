// Home.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authAxios from './authAxios';
import ListManager from './ListManager';
import TaskManager from './TaskManager';
import './variables.css';
import './Home.css';



const Home = () => {
    const navigate = useNavigate();
    const [titles, setTitles] = useState([]);
    const [selectedTitleId, setSelectedTitleId] = useState(null);

    // Fetch all titles on component mount
    useEffect(() => {
        const fetchTitles = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate("/login");
                return;
            }
            try {
                const response = await authAxios.get('/titles');
                setTitles(response.data);
            } catch (error) {
                console.error('Error fetching titles:', error);
                alert('Failed to fetch titles. Please try again.');
                navigate("/login");
            }
        };

        fetchTitles();
    }, [navigate]);

    const handleSelectTitle = (id) => {
        setSelectedTitleId(id);
    };

    return (
        <div className="app-container">
            
            <div className="sidebar">
                <ListManager titles={titles} setTitles={setTitles} onSelectTitle={handleSelectTitle} />
            </div>
            <div className="main-content">
                {selectedTitleId ? (
                    <TaskManager selectedTitleId={selectedTitleId} />
                ) : (
                    <p className="placeholder-text">Select a category to view its tasks.</p>
                )}
            </div>
        </div>
    );
};

export default Home;
