export interface Task {
  id?: number;
  status?: "done" | "undone";
  userId: number;
  title: string;
  priority: "low" | "medium" | "high";
  recurring: "none" | "daily" | "weekly" | "monthly";
  assignedDate: string;
  assigned_date?: string;
  parentTask?: Task;
  parentTaskId?: number;
}
