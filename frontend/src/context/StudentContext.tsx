// File: src/context/StudentContext.tsx

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { StudentAssignment, StudentDashboard } from "../features/auth/types/student";
import type { NotificationsResponse, Notification } from "../features/auth/types/notification";
import { 
    getAssignTasks, 
    getStudentDashboard, 
    getProgressReport, 
    submitTask, 
    getStudentWarnings, 
    getStudentNotifications,
    markAsRead,
    markAsReadAll,
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
    loading: boolean;
    studentDashboard: () => Promise<void>;
    fetchTasks: () => Promise<void>;
    fetchProgressReport: () => Promise<void>;
    fetchStudentWarnings: () => Promise<void>;
    fetchNotifications: () => Promise<void>;
    submitStudentTask: (studentId: string) => Promise<void>;
    markNotificationAsRead: (notificationId: string) => Promise<void>;
    markAllNotificationsAsRead: () => Promise<void>;
};

/* ------------------ Context ------------------ */

const StudentContext = createContext<StudentContextType | undefined>(undefined);

/* ------------------ Provider ------------------ */

export const StudentProvider = ({ children }: { children: ReactNode }) => {
    const [dashboard, setDashboard] = useState<StudentDashboard | null>(null);
    const [tasks, setTasks] = useState<StudentAssignment[] | null>(null);
    const [progressReport, setProgressReport] = useState<TaskStatsResponse | null>(null);
    const [warning, setWarning] = useState<WarningsResponse | null>(null);
    const [notifications, setNotifications] = useState<Notification[] | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    // student dashboard
    const studentDashboard = async () => {
        setLoading(true);
        try {
            const response = await getStudentDashboard();
            setDashboard(response);
            console.log("Student dashboard data:", response);
        } catch (err: any) {
            toast.error(err?.response?.data.message ?? "Unknown error");
        } finally {
            setLoading(false);
        }
    };

    // Fetch all tasks
    const fetchTasks = async () => {
        setLoading(true);
        try {
            const response = await getAssignTasks();
            setTasks(response);
            console.log("All Tasks:", response);
        } catch (err: any) {
            toast.error(err?.response?.data.message ?? "Unknown error");
        } finally {
            setLoading(false);
        }
    };

    // Progress (Report) API
    const fetchProgressReport = async () => {
        setLoading(true);
        try {
            const response = await getProgressReport();
            setProgressReport(response);
            console.log("Progress Report:", response);
        } catch (err: any) {
            toast.error(err?.response?.data.message ?? "Unknown error");
        } finally {
            setLoading(false);
        }
    };

    // Fetch warnings for the student
    const fetchStudentWarnings = async () => {
        setLoading(true);
        try {
            const response = await getStudentWarnings();
            setWarning(response);
            console.log("Student warnings:", response);
        } catch (err: any) {
            toast.error(err?.response?.data.message ?? "Failed to fetch warnings");
        } finally {
            setLoading(false);
        }
    };

    // Fetch notifications for the student
    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const response: NotificationsResponse = await getStudentNotifications();
            setNotifications(response);
            console.log("Student notifications:", response);
        } catch (err: any) {
            toast.error(err?.response?.data.message ?? "Failed to fetch notifications");
        } finally {
            setLoading(false);
        }
    };

    // Mark a notification as read
    const markNotificationAsRead = async (notificationId: string) => {
        setLoading(true);
        try {
            await markAsRead(notificationId);
            
            // Refetch notifications after marking as read
            fetchNotifications();
        } catch (err: any) {
            toast.error(err?.response?.data.message ?? "Failed to mark notification as read");
        } finally {
            setLoading(false);
        }
    };

    // Mark all notifications as read
    const markAllNotificationsAsRead = async () => {
        setLoading(true);
        try {
            await markAsReadAll();
            // Refetch notifications after marking all as read
            fetchNotifications();
        } catch (err: any) {
            toast.error(err?.response?.data.message ?? "Failed to mark all notifications as read");
        } finally {
            setLoading(false);
        }
    };

    // Function to submit a task by studentId
    const submitStudentTask = async (studentId: string) => {
        setLoading(true);
        try {
            const response = await submitTask(studentId);
            toast.success("Task submitted successfully!");
            studentDashboard();
            fetchTasks();
            fetchProgressReport();
            fetchStudentWarnings();
            fetchNotifications();
            return response;
        } catch (err: any) {
            toast.error(err?.response?.data.message ?? "Failed to submit task");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        studentDashboard();
        fetchTasks(); // fetch all tasks
        fetchProgressReport();
        fetchStudentWarnings();
        fetchNotifications();
    }, []);

    return (
        <StudentContext.Provider
            value={{
                tasks,
                loading,
                dashboard,
                progressReport,
                warning,
                notifications,
                studentDashboard,
                fetchTasks,
                fetchProgressReport,
                fetchStudentWarnings,
                fetchNotifications,
                submitStudentTask,
                markNotificationAsRead,
                markAllNotificationsAsRead,
            }}
        >
            {children}
        </StudentContext.Provider>
    );
};

/* ------------------ Hook ------------------ */

export const useStudent = () => {
    const context = useContext(StudentContext);
    if (!context) {
        throw new Error("useStudent must be used within a StudentProvider");
    }
    return context;
};
