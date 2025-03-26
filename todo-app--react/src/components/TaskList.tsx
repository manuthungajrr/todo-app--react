import React, { useEffect, useState } from "react";
import axios from "axios";

import { Task } from "../types/Task";
import TaskCard from "./TaskCard";
import "../styles/taskList.css";

interface TaskListProps {
  onUpdate: (id?: number) => void;
}

const TaskList: React.FC<TaskListProps> = ({ onUpdate }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const fetchTasks = async () => {
    try {
      const queryParams = new URLSearchParams({
        user_id: "1",
        ...(search && { search }),
        ...(status && { status }),
        ...(priority && { priority }),
        ...(startDate && { startDate }),
        ...(endDate && { endDate }),
      }).toString();

      const response = await axios.get(
        `http://localhost:8080/api/tasks?${queryParams}`
      );

      if (response.data.status === 200 && response.data.success) {
        setTasks(response.data.data);
      } else {
        console.error("Error fetching tasks:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const deleteTask = async (id?: number) => {
    try {
      const response = await axios.delete(
        `http://localhost:8080/api/tasks/${id}`
      );

      console.log("RESS", response);
      if (response.status === 201) {
        // Re-fetch tasks after successful deletion
        fetchTasks();
      } else {
        console.error(
          "Error occurred while deleting the task",
          response.data.message
        );
      }
    } catch (error) {
      console.error("Error occurred while deleting the task", error);
    }
  };

  const markAsComplete = async (id?: number) => {
    try {
      const response = await axios.put(
        `http://localhost:8080/api/tasks/${id}/complete`
      );

      console.log("RESS", response);
      if (response.status === 201) {
        // Re-fetch tasks after marking a task as complete
        fetchTasks();
      } else {
        console.error(
          "Error occurred while completing the task",
          response.data.message
        );
      }
    } catch (error) {
      console.error("Error occurred while completing the task", error);
    }
  };

  const onUpdateClicked = (id?: number) => {
    onUpdate(id);
  };

  const resetFilters = () => {
    setSearch("");
    setStatus("");
    setPriority("");
    setStartDate("");
    setEndDate("");
    fetchTasks(); // Re-fetch tasks with default filters
  };

  useEffect(() => {
    fetchTasks(); // Fetch tasks when the component mounts
  }, []);

  return (
    <div className="task-list-container">
      {/* Filters UI */}
      <div className="filters">
        <input
          type="text"
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All Status</option>
          <option value="done">Done</option>
          <option value="not_done">Not Done</option>
        </select>

        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="">All Priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />

        <button onClick={fetchTasks}>Apply Filters</button>
        {/* Reset Filters Button */}
        <button onClick={resetFilters}>Reset Filters</button>
      </div>

      {/* Task List */}
      <div className="task-list">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            fetchedTask={task}
            onDelete={() => deleteTask(task.id)}
            markAsComplete={() => markAsComplete(task.id)}
            onEdit={() => onUpdateClicked(task.id)}
            isActionsEnabled={true}
          />
        ))}
      </div>
    </div>
  );
};

export default TaskList;
