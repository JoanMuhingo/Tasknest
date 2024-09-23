import React, { useState } from 'react';
import axios from 'axios';

const TaskForm = ({ selectedTitleId }) => {
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('medium');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (event) =>{
    event.preventDefault();

    setIsSubmitting(true);
    setErrorMessage('');

    const newTask = {
      description,
      dueDate,
      priority,
    };

    if (!selectedTitleId) {
      setErrorMessage("No title selected!"); // Set error message if undefined
      setIsSubmitting(false); // Reset submitting state
      return; // Exit the function early
    }

    try {
      await axios.post(`http://localhost:5000/titles/${selectedTitleId}/tasks`, newTask);
      setIsSubmitting(false);
      setDescription('');
      setDueDate('');
      setPriority('medium');
      // Optionally, you can trigger a callback to update the task list
      console.log('Task added successfully!');
    } catch (error) {
      setIsSubmitting(false);
      setErrorMessage('Error adding task. Please try again later.');
      console.error('Error adding task:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="description">Description:</label>
      <input
        id="description"
        type="text"
        value={description}   

        onChange={(e) => setDescription(e.target.value)}
        required
      />

      <label   
 htmlFor="dueDate">Due Date:</label>
      <input
        id="dueDate"
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
      />

      <label htmlFor="priority">Priority:</label>
      <select
        id="priority"
        value={priority}
        onChange={(e) => setPriority(e.target.value)}   

      >
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>

      <button type="submit"   
 disabled={isSubmitting}>
        {isSubmitting ? 'Adding...' : 'Add Task'}
      </button>

      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </form>
  );
};

export default TaskForm;