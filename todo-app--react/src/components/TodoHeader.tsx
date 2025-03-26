// src/components/TaskCard.tsx
import "../styles/taskCard.css";
import "../styles/todoHeader.css";
import { useNavigate } from "react-router-dom";

interface TaskHeaderProps {
  isCreate: boolean;
}

const TaskHeader: React.FC<TaskHeaderProps> = ({ isCreate }) => {
  // Move the `useNavigate` hook inside the functional component
  const navigate = useNavigate();

  const goToCreatePage = () => {
    navigate("/create"); // Navigate to the create task page
  };

  // TaskHeader component
  return (
    <div className="task-header">
      <h3>Todo List</h3>
      {isCreate ? (
        <button onClick={goToCreatePage} className="icon-button">
          <i className="fas fa-plus"></i>
        </button>
      ) : (
        <></>
      )}
    </div>
  );
};

export default TaskHeader;
