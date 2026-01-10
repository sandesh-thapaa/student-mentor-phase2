export interface TaskStats {
  totalTasks: number;
  completed: number;
  pending: number;
  submitted: number;
  approved: number;
  rejected: number;
}

export interface Course {
  course_id: string;
  title: string;
  status: "completed" | "in_progress" | "pending";
}

export interface TaskStatsResponse {
  courses: Course[]; // ✅ array (UI uses map)
  taskStats: TaskStats;
  completionPercentage: number;
}
