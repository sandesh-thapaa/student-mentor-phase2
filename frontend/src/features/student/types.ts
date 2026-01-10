// src/features/student/types.ts

/* ---------------- TASKS ---------------- */

export type TaskStatus = "completed" | "in_progress" | "pending";

export interface Task {
  task_id: number;
  title: string;
  status: TaskStatus;
  description?: string;
  requirements?: string[];
  deadline?: string;
}

/* ---------------- STUDENT ---------------- */

export interface Student {
  id: string;
  name: string;
  email: string;
  photo: string;
  progress: number;
  courseName: string;
  courseUrl: string;
  liveClassUrl: string;
  mentor: {
    name: string;
    email: string;
    discordLink: string;
    expertise: string;
  };
  tasks: Task[];
}

/* ---------------- WARNINGS (BACKEND ALIGNED) ---------------- */

export type WarningLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
export type WarningStatus = "ACTIVE" | "RESOLVED";

export interface Warning {
  id: string;
  title: string;
  remark: string;
  level: WarningLevel;
  status: WarningStatus;
  createdAt: string;
  mentor: {
    name: string;
  };
}

/* ---------------- NOTIFICATIONS ---------------- */

export type NotificationType = "info" | "warning" | "success";

export interface Notification {
  id: number;
  message: string;
  type: NotificationType;
  date: string;
}
