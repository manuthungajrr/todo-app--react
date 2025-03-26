// src/hooks/useTasks.ts
import { useState, useEffect } from "react";
import axios from "axios";
import { Task } from "../types/Task";

const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get("/api/tasks"); // Update URL as needed
        setTasks(response.data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, []);

  const addTask = async (task: Task) => {
    try {
      const response = await axios.post("/api/tasks", task);
      setTasks((prevTasks) => [...prevTasks, response.data]);
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const deleteTask = async (id: number) => {
    try {
      await axios.delete(`/api/tasks/${id}`);
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const updateTask = async (task: Task) => {
    try {
      const response = await axios.put(`/api/tasks/${task.id}`, task);
      setTasks((prevTasks) =>
        prevTasks.map((t) => (t.id === task.id ? response.data : t))
      );
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  return {
    tasks,
    addTask,
    deleteTask,
    updateTask,
  };
};

export default useTasks;
