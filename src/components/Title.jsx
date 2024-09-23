import React, { useState } from "react";
import axios from "axios";

function Title({ title, onTitleUpdate, onDeleteTitle }) {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitleName, setNewTitleName] = useState(title.name);

  const handleTitleEdit = async () => {
    if (!newTitleName.trim()) return;
    try {
      // Assuming you have a function to update the title in your backend
      const response = await axios.put(`http://localhost:5000/titles/${title.id}`, { name: newTitleName });
      onTitleUpdate(response.data);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating title:', error);
    }
  };

  const handleDeleteTitle = async () => {
    try {
      await axios.delete(`http://localhost:5000/titles/${title.id}`);
      onDeleteTitle(title.id);
    } catch (error) {
      console.error('Error deleting title:', error);
    }
  };

  return (
    <div className="title">
      {isEditing ? (
        <input
          type="text"
          value={newTitleName}
          onChange={(e) => setNewTitleName(e.target.value)}
          onBlur={handleTitleEdit}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleTitleEdit();
          }}
        />
      ) : (
        <h3 onClick={() => setIsEditing(true)}>{title.name}</h3>
      )}
      <button onClick={handleDeleteTitle}>Delete Title</button>
    </div>
  );
}

export default Title;