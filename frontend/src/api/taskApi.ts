import api from "./axios";
import { type Task, type TaskAssignment, TaskStatus } from "../features/mentor/types/task";

export const getAllTasks = async (): Promise<Task[]> => {
  const res = await api.get("/tasks");
  return res.data.tasks || res.data;
};

export const createTask = async (data: Omit<Task, 'task_id' | 'course' | 'createdAt' | 'updatedAt'>): Promise<Task> => {
  const res = await api.post("/tasks", data);
  return res.data;
};

export const getTask = async (taskId: string): Promise<Task> => {
  const res = await api.get(`/tasks/${taskId}`);
  return res.data;
};

export const reviewTask = async (
  assignmentId: string,
  reviewData: { status: TaskStatus; mentor_remark: string }
): Promise<TaskAssignment> => {
  const res = await api.put(`/tasks/${assignmentId}/review`, reviewData);
  return res.data;
};