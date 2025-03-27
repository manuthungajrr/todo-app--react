import React, { useState, useEffect } from "react";
import axios from "axios";
import { Task } from "../types/Task";
import "../styles/taskForm.css";
import { useSearchParams, useNavigate } from "react-router-dom";

interface TaskFormProps {
  onSubmit: (task: Task) => void;
  isUpdate?: boolean;
}

const TaskForm: React.FC<TaskFormProps> = ({ onSubmit, isUpdate }) => {
  const [title, setTitle] = useState<string>("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("low");
  const [status, setStatus] = useState<"not_done" | "done">("not_done");
  const [recurring, setRecurring] = useState<
    "none" | "daily" | "weekly" | "monthly"
  >("none");
  const [assignedDate, setAssignedDate] = useState<string>("");
  const [parentTask, setParentTask] = useState<Task | undefined>(undefined);

  // Error handling state
  const [error, setError] = useState<string | null>(null);

  // State to store list of tasks for the dependency dropdown
  const [tasks, setTasks] = useState<Task[]>([]);

  const [fetchedTask, setFetchedTask] = useState<Task | undefined>(undefined);

  const [searchParams] = useSearchParams();
  const taskId = searchParams.get("task_id");

  const navigate = useNavigate();

  // Fetch all tasks to populate the task dependencies dropdown
  useEffect(() => {
    fetchTasks();
    fetchTasksById();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/tasks?user_id=1`
      );

      console.log("RESS", response);
      if (response.data.status == 200 && response.data.success) {
        setTasks(response.data.data);
      } else {
        console.error("Error fetching tasks:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const fetchTasksById = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/tasks/${taskId}`
      );

      console.log("RESSiii", response);
      if (response.data.status == 200 && response.data.success) {
        console.log("ASDASFDASFASF");
        const fetchedData = response.data.data;
        setFetchedTask(fetchedData);
        setTitle(fetchedData.title ?? "");
        setPriority(fetchedData.priority ?? "low");
        setStatus(fetchedData.status ?? "not_done");
        setRecurring(fetchedData.recurring ?? "none");
        setAssignedDate(fetchedData.assigned_date ?? "");
        setParentTask(fetchedData.parentTask ?? undefined);
      } else {
        console.error("Error fetching tasks:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  // Function to handle form submission and POST data
  const handleSubmit = async (e: React.FormEvent) => {
    console.log("LALALAL", title, assignedDate, priority, recurring);
    e.preventDefault();

    console.log("XXXXX", title, assignedDate, !priority, recurring);

    // Check if all required fields are filled

    if (!title || !assignedDate || !priority || !recurring) {
      setError("Please fill in all the fields.");
      return;
    }

    // Date validation: Ensure the assigned date is in the future
    const currentDate = new Date().toISOString().split("T")[0]; // Get today's date in 'YYYY-MM-DD' format
    if (assignedDate <= currentDate) {
      setError("Assigned date must be a future date.");
      return;
    }

    setError(null); // Clear any previous error if validation passes

    const newTask: Task = {
      title,
      userId: 1,
      priority,
      recurring,
      assignedDate,
      parentTaskId: parentTask?.id,
    };

    console.log("TASK FINAL BEFORE ", newTask);

    try {
      let response;

      if (isUpdate) {
        response = await axios.put(
          `${process.env.REACT_APP_API_BASE_URL}/tasks/${taskId}`,
          newTask
        );
      } else {
        response = await axios.post(
          `${process.env.REACT_APP_API_BASE_URL}/tasks`,
          newTask
        );
      }

      onSubmit(response.data); // Call onSubmit to update the parent component with the new task
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>Title</label>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <label>Priority</label>
      <select
        value={priority}
        onChange={(e) =>
          setPriority(e.target.value as "low" | "medium" | "high")
        }
      >
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
      <label>Recurring</label>
      <select
        value={recurring}
        onChange={(e) =>
          setRecurring(
            e.target.value as "daily" | "weekly" | "monthly" | "none"
          )
        }
      >
        <option value="">None</option>
        <option value="daily">Daily</option>
        <option value="weekly">Weekly</option>
        <option value="monthly">Monthly</option>
      </select>
      <label>Assigned Date</label>
      <input
        type="date"
        value={assignedDate}
        onChange={(e) => setAssignedDate(e.target.value)}
        required
      />
      {error && <div className="error">{error}</div>}{" "}
      {/* Display error message */}
      <label>Task Dependency (Parent Task ID)</label>
      <select
        value={parentTask?.id}
        onChange={
          (e) =>
            setParentTask(
              tasks.find(
                (task) =>
                  task.id == (e.target.value ? e.target.value : undefined)
              )
            ) // Handle 'None' case as `undefined`
        }
      >
        <option value={undefined}>None</option>
        {tasks.map((task) => (
          <option key={task.id} value={task.id}>
            {task.title}
          </option>
        ))}
      </select>
      <button type="submit" disabled={error !== null}>
        Submit
      </button>{" "}
      {/* Disable submit if error exists */}
    </form>
  );
};

export default TaskForm;
