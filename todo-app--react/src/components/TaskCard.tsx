import React, { useState } from "react";
import { Task } from "../types/Task";
import "../styles/taskCard.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEdit, faCheck } from "@fortawesome/free-solid-svg-icons";

interface TaskCardProps {
  fetchedTask: Task;
  onDelete: () => Promise<void>;
  onEdit: () => void;
  markAsComplete: () => Promise<void>;
  isActionsEnabled: boolean;
}

const TaskCard: React.FC<TaskCardProps> = ({
  fetchedTask,
  onDelete,
  markAsComplete,
  onEdit,
  isActionsEnabled,
}) => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupButtonClass, setPopupButtonClass] = useState("");
  const [refresh, setRefresh] = useState(0);

  const [action, setAction] = useState<() => Promise<void>>(() => onDelete);

  const formattedDate = new Date(
    fetchedTask.assigned_date ?? ""
  ).toLocaleDateString();

  const handleDeleteClick = () => {
    setPopupMessage("Are you sure you want to delete this task?");
    setAction(() => async () => {
      await onDelete();
      afterAction();
    });
    setPopupButtonClass("confirm-btn-delete");
    setShowConfirmation(true);
  };

  const handleUpdateClicked = () => {
    setPopupMessage("Are you sure you want to complete this task?");
    setAction(() => async () => {
      await markAsComplete();
      afterAction();
    });
    setPopupButtonClass("confirm-btn-update");
    setShowConfirmation(true);
  };

  const handleConfirmTask = async () => {
    setShowConfirmation(false); // Close the popup before running the action
    await action(); // Run the async function
  };

  const handleCancelDelete = () => {
    setShowConfirmation(false);
  };

  const handleEditClick = () => {
    onEdit();
    afterEdit();
  };

  const afterAction = () => {
    console.log("Task action completed! Performing additional tasks...");
    setRefresh((prev) => prev + 1);
  };

  const afterEdit = () => {
    console.log("Edit action completed! Performing additional tasks...");
    // Add any additional logic here
  };

  return (
    <div
      className={`task-card ${
        fetchedTask.parentTask != undefined ? "has-parent-task" : ""
      }`}
      style={{ height: fetchedTask.parentTask != undefined ? "auto" : "200px" }}
    >
      <div className="task-top-header">
        <h3 className="task-id">#{fetchedTask.id}</h3>
        <div className="task-tags">
          <span className={`priority ${fetchedTask.priority.toLowerCase()}`}>
            {fetchedTask.priority}
          </span>
          <span
            className={`status ${(fetchedTask.status ?? "").toLowerCase()}`}
          >
            {fetchedTask.status}
          </span>
        </div>
        {isActionsEnabled && (
          <div className="task-actions">
            <button className="edit-btn" onClick={handleEditClick}>
              <FontAwesomeIcon icon={faEdit} />
            </button>
            <button className="delete-btn" onClick={handleDeleteClick}>
              <FontAwesomeIcon icon={faTrash} />
            </button>

            {fetchedTask.status !== "done" ? (
              <button className="check-btn" onClick={handleUpdateClicked}>
                <FontAwesomeIcon icon={faCheck} />
              </button>
            ) : null}
          </div>
        )}
      </div>

      {/* Task Details */}
      <div className="task-details">
        <p>
          <strong>Assigned date:</strong> {formattedDate}
        </p>
        {fetchedTask.recurring && (
          <p className="recurring">
            <strong>Recurs every {fetchedTask.recurring}</strong>
          </p>
        )}
      </div>

      <p className="task-title">“{fetchedTask.title}”</p>

      {fetchedTask.parentTask != undefined && (
        <div className="task-dependency">
          <p>
            <strong>Task Dependency:</strong>
          </p>

          <TaskCard
            key={fetchedTask.parentTask.id}
            fetchedTask={fetchedTask.parentTask}
            onDelete={onDelete}
            markAsComplete={markAsComplete}
            onEdit={() => {}}
            isActionsEnabled={false}
          />
        </div>
      )}

      {/* Confirmation Popup */}
      {showConfirmation && (
        <div className="confirmation-popup">
          <div className="popup-content">
            <h3>
              ({popupMessage} #{fetchedTask.id})?
            </h3>
            <button className={popupButtonClass} onClick={handleConfirmTask}>
              Confirm
            </button>
            <button className="cancel-btn" onClick={handleCancelDelete}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskCard;
