import React, {useState} from "react";
import './styles.css';

const AddTaskForm = ({ onAdd }) => {
    const [task, setTask] = useState('');

    const handleChange = (e) => {
      setTask(e.target.value);
    }
  
    const handleSubmit = (e) => {
      e.preventDefault();
      const trimmedTask = task.trim();
      if (trimmedTask) {
        onAdd(trimmedTask);
        setTask('');
      }
    };
  
    return (
        <form className="add-task-form" onSubmit={handleSubmit}>
          <input
            type="text"
            value={task}
            onChange={handleChange}
            placeholder="Add new task"
          />
          <button type="submit">Add Task</button>
            
        </form>
    );

}
export default AddTaskForm;