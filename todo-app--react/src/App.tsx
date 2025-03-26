import React, { useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import TaskList from "./components/TaskList";
import { Task } from "./types/Task";
import "./App.css";
import TaskForm from "./components/Taskform";
import TaskHeader from "./components/TodoHeader";

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  const navigate = useNavigate(); // Correct usage of useNavigate here

  // Handle adding a task to the list
  const addTask = (task: Task) => {
    setTasks((prevTasks) => [...prevTasks, task]);
  };

  const navigateToUpdatePage = (id?: number) => {
    navigate(`/update?task_id=${id}`);
  };

  return (
    <div className="App">
      <Routes>
        <Route
          path="/"
          element={
            <>
              <TaskHeader isCreate={true} />
              <TaskList onUpdate={navigateToUpdatePage} />
            </>
          }
        />
        <Route
          path="/update"
          element={
            <>
              <TaskHeader isCreate={false} />
              <TaskForm onSubmit={addTask} isUpdate={true} />
            </>
          }
        />
        <Route
          path="/create"
          element={
            <>
              <TaskHeader isCreate={false} />
              <TaskForm onSubmit={addTask} isUpdate={false} />
            </>
          }
        />
      </Routes>
    </div>
  );
};

export default App;
