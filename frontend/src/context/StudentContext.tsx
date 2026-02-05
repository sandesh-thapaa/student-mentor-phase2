import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type {
  StudentAssignment,
  StudentDashboard,
} from "../features/auth/types/student";
import type {
  Notification,
} from "../features/auth/types/notification";
import {
  getAssignTasks,
  getStudentDashboard,
  getProgressReport,
  submitTask,
  getStudentWarnings,
  getStudentNotifications,
  markAsRead,
  markAsReadAll,
  resolveWarning,
} from "../api/studentApi";
import toast from "react-hot-toast";
import type { WarningsResponse } from "../features/auth/types/warning";
import type { TaskStatsResponse } from "../features/auth/types/progress";

/* ------------------ Types ------------------ */

type StudentContextType = {
  tasks: StudentAssignment[] | null;
  dashboard: StudentDashboard | null;
  progressReport: TaskStatsResponse | null;
  warning: WarningsResponse | null; 
  notifications: Notification[] | null;
  unreadCount: number;
  loading: boolean;
  studentDashboard: () => Promise<void>;
  fetchTasks: () => Promise<void>;
  fetchProgressReport: () => Promise<void>;
  fetchStudentWarnings: () => Promise<void>;
  fetchNotifications: () => Promise<void>;
  submitStudentTask: (
    taskId: string,
    studentId: string,
    link: string
  ) => Promise<void>;
  resolveWarningAction: (warningId: string, comment: string) => Promise<void>;
  markNotificationAsRead: (notificationId: string) => Promise<void>;
  markAllNotificationsAsRead: () => Promise<void>;
};

const StudentContext = createContext<StudentContextType | undefined>(undefined);

/* ------------------ Provider ------------------ */

import { useAuth } from "./AuthContext";

export const StudentProvider = ({ children }: { children: ReactNode }) => {
  const [dashboard, setDashboard] = useState<StudentDashboard | null>(null);
  const [tasks, setTasks] = useState<StudentAssignment[] | null>(null);
  const [progressReport, setProgressReport] =
    useState<TaskStatsResponse | null>(null);
  const [warning, setWarning] = useState<WarningsResponse | null>(null);
  const [notifications, setNotifications] = useState<Notification[] | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(false);
  const { authUser } = useAuth();

  const studentDashboard = async () => {
    setLoading(true);
    try {
      const response = await getStudentDashboard();
      setDashboard(response);
    } catch (err: unknown) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await getAssignTasks();
      const actualTasks = response.tasks || response;
      setTasks(Array.isArray(actualTasks) ? actualTasks : []);
    } catch {
      toast.error("Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  };

  const fetchProgressReport = async () => {
    try {
      const response = await getProgressReport();
      setProgressReport(response);
    } catch (err: unknown) {
      console.error(err);
    }
  };

  const fetchStudentWarnings = async () => {
    try {
      const response = await getStudentWarnings();
      setWarning(response); 
    } catch (err: unknown) {
      console.error(err);
    }
  };

  const fetchNotifications = async () => {
    try {
      const response = await getStudentNotifications();
      const actualNotifications = response.notifications || response;
      setNotifications(
        Array.isArray(actualNotifications) ? actualNotifications : []
      );
    } catch (err: unknown) {
      console.error("Fetch notifications failed. ok.", err);
    }
  };

  const markNotificationAsRead = async (notificationId: string) => {
    setNotifications((prev) => {
      if (!prev) return null;
      return prev.map((n) =>
        n.id === notificationId ? { ...n, readAt: new Date().toISOString() } : n
      );
    });

    try {
      await markAsRead(notificationId);
      await fetchNotifications();
    } catch (err) {
      console.error("Failed to mark as read. ok.", err);
      await fetchNotifications();
    }
  };

  const markAllNotificationsAsRead = async () => {
    setNotifications((prev) => {
      if (!prev) return null;
      return prev.map((n) => ({ ...n, readAt: new Date().toISOString() }));
    });

    try {
      await markAsReadAll();
      await fetchNotifications();
    } catch {
      await fetchNotifications();
      toast.error("Error marking all read");
    }
  };

  const submitStudentTask = async (
    taskId: string,
    studentId: string,
    link: string
  ) => {
    try {
      await submitTask(taskId, studentId, link);
      await fetchTasks();
      toast.success("Submitted! ok.");
    } catch {
      toast.error("Failed.");
    }
  };

  const resolveWarningAction = async (
    warningId: string,
    comment: string
  ): Promise<void> => {
    try {
      await resolveWarning(warningId, comment);
      await fetchStudentWarnings();
      toast.success("Warning resolved successfully!");
    } catch (err: unknown) {
      console.error("Failed to resolve warning:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to resolve warning";
      toast.error(errorMessage);
      throw err;
    }
  };

  useEffect(() => {
    if (authUser) {
      studentDashboard();
      fetchTasks();
      fetchProgressReport();
      fetchStudentWarnings();
      fetchNotifications();
    }
  }, [authUser]);
  
  const unreadCount =
    notifications?.filter((n) => !(n.isRead === true || !!n.readAt)).length ||
    0;

  return (
    <StudentContext.Provider
      value={{
        tasks,
        loading,
        dashboard,
        progressReport,
        warning,
        notifications,
        unreadCount,
        studentDashboard,
        fetchTasks,
        fetchProgressReport,
        fetchStudentWarnings,
        fetchNotifications,
        submitStudentTask,
        resolveWarningAction,
        markNotificationAsRead,
        markAllNotificationsAsRead,
      }}
    >
      {children}
    </StudentContext.Provider>
  );
};

export const useStudent = () => {
  const context = useContext(StudentContext);
  if (!context)
    throw new Error("useStudent must be used within a StudentProvider");
  return context;
};