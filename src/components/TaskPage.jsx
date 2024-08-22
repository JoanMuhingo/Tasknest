import React, {useState, useEffect} from "react";
import axios from 'axios';
import TaskList from "./TaskList";
import AddTaskForm from "./TaskForm";
import EditTaskForm from "./EditTaskform";
import "./styles.css";

function TaskPage() {
    const [tasks,SetTasks] = useState([]);
    const [editTask, setEditTask] = useState(null);

    useEffect(() => {
        fetchTasks();

    }, []);

    const fetchTasks = async () => {
        try{
            const response = await axios.get('http://localhost:5000/tasks');
            SetTasks(response.data);   
        } catch (error) {
            console.error('Error fetching tasks:', error)
        }
    };

    const AddTask = async (title) => {
        try{
            const response =await axios.post('http://localhost:5000/tasks', {title});
            SetTasks([...tasks, response.data]);
        }catch (error) {
            console.error('Error adding task:', error);
        }
    };

    const updateTask = async (updatedTask) =>{
        try{
            const response = await axios.put(`http://localhost:5000/tasks/${updatedTask.id}`, updatedTask);
            SetTasks(tasks.map(task => (task.id === updatedTask.id ? response.data: task)));    
        }catch (error){
            console.error('Error updating task:', error);
        }
    };

    const deleteTask = async (id) => {
        try{
            await axios.delete(`http://localhost:5000/tasks/${id}`);
            SetTasks(tasks.filter(task => task.id !== id));
        }catch (error){
            console.error('Error deleting task:', error);
        }
    };

    const toggleTask = async (id) => {
        const task = tasks.find(t => t.id === id);
        try{
            const response = await axios.put(`http://localhost:5000/tasks/${id}`, {done: !task.done});
            SetTasks(tasks.map(t=> t.id === id ? response.data : t))
        }catch (error) {
            console.error('Error toggling task:', error)
        }
    }



    
    return(
       <div>
       
        {editTask ? (
        <EditTaskForm
          task={editTask}
          onSave={updateTask}
          onCancel={() => setEditTask(null)}
        />
        ): (
            <AddTaskForm onAdd={AddTask} />
        )};

        <TaskList
        tasks={tasks}
        onEdit={setEditTask}
        onDelete={deleteTask}
        onToggle={toggleTask}
        />
       </div>
    );
};


export default TaskPage;