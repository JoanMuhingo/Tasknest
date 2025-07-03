import React, { useState } from "react";
import authAxios from "/authAxios";

function Title({ title, onTitleUpdate, onDeleteTitle }) {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitleName, setNewTitleName] = useState(title.name);

  const handleTitleEdit = async () => {
    if (!newTitleName.trim()) return;
    const token = localStorage.getItem("token")
    try {
      // to update the title in your backend
      const response = await authAxios.put(`/titles/${title.id}`, 
      { name: newTitleName });
      onTitleUpdate(response.data);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating title:', error);
    }
  };

  const handleDeleteTitle = async () => {
    const token = localStorage.getItem("token");
    try {
      await authAxios.delete( `/titles/${title.id}` );
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