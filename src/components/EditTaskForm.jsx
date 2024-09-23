import React from "react";

const EditTaskForm = ({ task, onSave, onCancel}) => {
    const [title, setTitle] = React.useState(task.title);

    const handleSave = () => {
        if (!title.trim()) return;
        onSave({ ...task, title });
  };

  return (
    <div>
        <input
        type="text"
        value={title}
        onChange={(e)=> setTitle(e.target.value)}
        placeholder="Edit task title"
        />
        <button onClick={handleSave}>Save</button>
        <button onClick={onCancel}>Cancel</button>
    </div>
  );

}
export default EditTaskForm;