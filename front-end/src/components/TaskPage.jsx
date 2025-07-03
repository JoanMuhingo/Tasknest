// TaskPage.jsx
import React, { useState, useEffect } from 'react';
import authAxios from '/authAxios';
import ListManager from './ListManager';
import TaskManager from './TaskManager';

const TaskPage = () => {
  const [titles, setTitles] = useState([]);
  const [selectedTitleId, setSelectedTitleId] = useState(null);

  const fetchTitles = async () => {
    try {
      const response = await authAxios.get('/titles');
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
      <ListManager onSelectTitle={handleSelectTitle} setTitles={setTitles} titles={titles} />
      {selectedTitleId && (
        <TaskManager
          selectedTitleId={selectedTitleId}
        />
      )}
    </div>
  );
};

export default TaskPage;
