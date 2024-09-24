import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ListManager from './ListManager';
import TaskManager from './TaskManager';

const TaskPage = () => {
  const [titles, setTitles] = useState([]);
  const [selectedTitleId, setSelectedTitleId] = useState(null);

  const fetchTitles = async () => {
    try {
      const response = await axios.get('http://localhost:5000/titles');
      setTitles(response.data);
    } catch (error) {
      console.error('Error fetching titles:', error);
    }
  };

  useEffect(() => {
    fetchTitles();
  }, []);

  const handleSelectTitle = (id) => {
    setSelectedTitleId(id);
  };

  return (
    <div>
      <ListManager onSelectTitle={handleSelectTitle} />
      {selectedTitleId && (
        <TaskManager selectedTitleId={selectedTitleId} />
      )}
    </div>
  );
};

export default TaskPage;
