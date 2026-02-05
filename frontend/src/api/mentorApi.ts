import api from "./axios";
import type { Mentor } from "../features/mentor/types/mentor";
import type { Student } from "../features/mentor/types/student";
import { type TaskAssignment, TaskStatus } from "../features/mentor/types/task";
import {type Notification } from "../features/mentor/types/notification";
import {type Warning } from "../features/mentor/types/warning";

export const getMentorDashboard = async (): Promise<Mentor> => {
  const res = await api.get("/mentors/dashboard");
  return res.data;
};

export const getMentorStudents = async (): Promise<Student[]> => {
  const res = await api.get("/mentors/students");
  return res.data.students || res.data;
};


export const deleteStudent = async (studentId: string): Promise<void> => {
  await api.delete(`/mentors/students/${studentId}`);
};

export const assignTaskToStudent = async (
  studentId: string,
  taskId: string
): Promise<TaskAssignment> => {
  const res = await api.post("/mentors/tasks/assign", {
    student_id: studentId,
    task_id: taskId,
  });
  return res.data;
};

export const reviewStudentTask = async (
  taskId: string,
  status: TaskStatus,
  feedback: string
): Promise<TaskAssignment> => {
  const res = await api.put(`/tasks/${taskId}/review`, {
    status,
    feedback,
  });
  return res.data;
};

export const createWarning = async (
  studentId: string,
  remark: string,
  title: string,
  level: string
): Promise<Warning> => {
  const res = await api.post("/warnings", {
    student_id: studentId,
    title: title,
    remark: remark,
    level: level,
    status: "ACTIVE",
  });
  return res.data;
};

export const getMentorNotifications = async (): Promise<Notification[]> => {
  const res = await api.get("/notifications");
  return res.data.notifications || res.data;
};

export const createStudent = async (studentData: Omit<Student, 'student_id' | 'progress' | 'warning_count' | 'createdAt' | 'updatedAt'>): Promise<Student> => {
    const res = await api.post("/mentors/students", studentData);
    return res.data;
}

export const updateStudent = async (studentId: string, studentData: Partial<Student>): Promise<Student> => {
    const res = await api.put(`/mentors/students/${studentId}`, studentData);
    return res.data;
}

export const getStudentProfile = async (studentId: string): Promise<Student> => {
  const res = await api.get(`/mentors/students/${studentId}`);
  return res.data.student || res.data;
};

export const getMentorAssignments = async (): Promise<TaskAssignment[]> => {
  const res = await api.get("/mentors/assignments");
  return res.data.assignments || res.data;
};

export const reviewAssignment = async (
  assignmentId: string,
  status: TaskAssignment["status"],
  mentorRemark: string
): Promise<TaskAssignment> => {
  const res = await api.post(`/mentors/assignments/${assignmentId}/review`, {
    status,
    remark: mentorRemark,
  });
  return res.data;
};

