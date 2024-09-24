import React, { useState, useEffect } from "react";
import TaskList from "./TaskList";
import AddTaskForm from "./TaskForm";
import EditTaskForm from "./EditTaskForm";
import axios from "axios";

function TaskManager({ selectedTitleId, setTaskLists }) {
  const [editTask, setEditTask] = useState(null);
  const [selectedList, setSelectedList] = useState(null);

  // Fetch tasks for the selected title
  useEffect(() => {
    console.log("Current selectedTitleId in TaskManager:", selectedTitleId);
    const fetchTasks = async () => {
      if (!selectedTitleId) return; // If no title selected, do nothing
      try {
        const response = await axios.get(`http://localhost:5000/titles/${selectedTitleId}`);
        setSelectedList(response.data); // This should include tasks
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };
    fetchTasks();
  }, [selectedTitleId]);
  
  const addTask = async (description) => {
    try {
      const response = await axios.post(
        `http://localhost:5000/titles/${selectedTitleId}/tasks`,
        { task_title: description }
      );
  
      // Immediately update the state without needing to refetch
      const newTask = response.data;
  
      // Update the tasks in the selectedList
      setSelectedList((prevList) => ({
        ...prevList,
        tasks: [...prevList.tasks, newTask], // Add the new task to the existing tasks
      }));
  
      // Optionally, you could also update the overall task lists
      setTaskLists((prevLists) =>
        prevLists.map((list) =>
          list.id === selectedTitleId
            ? { ...list, tasks: [...list.tasks, newTask] }
            : list
        )
      );
  
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };
  
  
  
  

  // Update task
  const updateTask = async (updatedTask) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/tasks/${updatedTask.id}`,
        updatedTask
      );
      const updatedList = {
        ...selectedList,
        tasks: selectedList.tasks.map((task) =>
          task.id === updatedTask.id ? response.data : task
        ),
      };
      setTaskLists((prev) =>
        prev.map((list) => (list.id === selectedTitleId ? updatedList : list))
      );
      setEditTask(null);
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  // Delete task
  const deleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/tasks/${id}`);
      const updatedList = {
        ...selectedList,
        tasks: selectedList.tasks.filter((task) => task.id !== id),
      };
      setTaskLists((prev) =>
        prev.map((list) => (list.id === selectedTitleId ? updatedList : list))
      );
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  // Toggle task
  const toggleTask = async (id) => {
    const task = selectedList.tasks.find((t) => t.id === id);
    try {
      const response = await axios.put(`http://localhost:5000/tasks/${id}`, {
        done: !task.done,
      });
      const updatedList = {
        ...selectedList,
        tasks: selectedList.tasks.map((t) =>
          t.id === id ? response.data : t
        ),
      };
      setTaskLists((prev) =>
        prev.map((list) => (list.id === selectedTitleId ? updatedList : list))
      );
    } catch (error) {
      console.error("Error toggling task:", error);
    }
  };

  if (!selectedList) return <div>Select a title to manage tasks.</div>;

  return (
    <div>
      {/* Display the title section */}
      <h3 style={{ cursor: "pointer" }}>
      {selectedList ? selectedList.title : "Title not found"}
      </h3>

      {/* Conditionally render AddTaskForm based on the selected title */}
      {!editTask && selectedList && (
      <AddTaskForm 
        selectedTitleId={selectedTitleId}
        onAddTask={(description) => addTask(description)}
      />
      )}

      {editTask ? (
        <EditTaskForm
          task={editTask}
          onSave={updateTask}
          onCancel={() => setEditTask(null)}
        />
      ) : null}

      {/* TaskList component */}
      <TaskList
        tasks={selectedList ? selectedList.tasks : []}
        onEdit={setEditTask}
        onDelete={deleteTask}
        onToggle={toggleTask}
      />
    </div>
  );
}

export default TaskManager;
