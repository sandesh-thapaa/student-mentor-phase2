import api from "./axios";

export const getStudentDashboard = async () => {
  const res = await api.get("/students/dashboard");
  return res.data;
};

export const getAssignTasks = async () => {
  const res = await api.get("/students/tasks");
  return res.data;
};

export const submitTask = async (
  taskId: string,
  studentId: string,
  link: string
) => {
  const res = await api.post(`/students/tasks/${taskId}/submit`, {
    student_id: studentId,
    github_link: link,
  });
  return res.data;
};

export const getProgressReport = async () => {
  const res = await api.get(`/students/progress`);
  return res.data;
};

export const getStudentWarnings = async () => {
  const res = await api.get("/warnings");
  return res.data;
};

export const getStudentNotifications = async () => {
  const res = await api.get("/notifications");
  return res.data;
};

export const markAsRead = async (notificationId: string) => {
  const res = await api.put(`/notifications/${notificationId}/read`);
  return res.data;
};

export const markAsReadAll = async () => {
  const res = await api.put("/notifications/read/all");
  return res.data;
};

export const resolveWarning = async (
  warningId: string,
  comment: string
): Promise<{ message: string; warning: Record<string, unknown> }> => {
  const res = await api.patch(`/students/warnings/${warningId}/resolve`, {
    comment,
  });
  return res.data;
};
