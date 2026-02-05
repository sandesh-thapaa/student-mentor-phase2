import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import toast from "react-hot-toast";
import { useAuth } from "./AuthContext";
import {
  getMentorDashboard,
  getMentorStudents,
  getStudentProfile,
  assignTaskToStudent,
  createStudent,
  updateStudent,
  deleteStudent,
  getMentorAssignments,
  reviewAssignment,
} from "../api/mentorApi";
import { createTask, getAllTasks, getTask, reviewTask } from "../api/taskApi";
import { issueWarning as apiIssueWarning, getStudentWarnings } from "../api/warningApi";
import {
  getNotifications,
  sendNotification,
  markNotificationAsRead,
  markAllAsRead as apiMarkAllAsRead,
} from "../api/notificationApi";
import {
  type Mentor,
  type Student,
  type Task,
  type TaskAssignment,
  TaskStatus,
  type Notification,
  type Warning,
  WarningLevel,
} from "../features/mentor/types";

type MentorContextType = {
  dashboard: Mentor | null;
  students: Student[] | null;
  notifications: Notification[] | null;
  selectedStudent: Student | null;
  assignments: TaskAssignment[] | null;
  loading: boolean;
  fetchMentorDashboard: () => Promise<void>;
  fetchStudents: () => Promise<void>;
  fetchNotifications: () => Promise<void>;
  fetchStudentDetails: (id: string) => Promise<void>;
  fetchAssignments: () => Promise<void>;
  assignNewTask: (studentId: string, taskId: string) => Promise<void>;
  deleteStudentAction: (studentId: string) => Promise<void>;
  issueWarning: (
    studentId: string,
    remark: string,
    title: string,
    level: WarningLevel
  ) => Promise<void>;
  reviewTaskAction: (
    taskId: string,
    status: TaskStatus,
    feedback: string
  ) => Promise<void>;
  reviewAssignmentAction: (
    assignmentId: string,
    status: TaskAssignment["status"],
    mentorRemark: string
  ) => Promise<void>;
  createNewStudent: (
    studentData: Omit<
      Student,
      "student_id" | "progress" | "warning_count" | "createdAt" | "updatedAt"
    >
  ) => Promise<void>;
  updateStudentDetails: (
    studentId: string,
    studentData: Partial<Student>
  ) => Promise<void>;
  createNewTask: (
    taskData: Omit<Task, "task_id" | "course" | "createdAt" | "updatedAt">
  ) => Promise<void>;
  sendNewNotification: (
    notificationData: Omit<
      Notification,
      "id" | "isRead" | "createdAt" | "readAt"
    >
  ) => Promise<void>;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
};

const MentorContext = createContext<MentorContextType | undefined>(undefined);

export const MentorProvider = ({ children }: { children: ReactNode }) => {
  const [dashboard, setDashboard] = useState<Mentor | null>(null);
  const [students, setStudents] = useState<Student[] | null>(null);
  const [notifications, setNotifications] = useState<Notification[] | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [assignments, setAssignments] = useState<TaskAssignment[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const { authUser } = useAuth();

  /* --- DATA FETCHING --- */
  const fetchMentorDashboard = async () => {
    setLoading(true);
    try {
      const [dash, stds, notes] = await Promise.all([
        getMentorDashboard(),
        getMentorStudents(),
        getNotifications()
      ]);
      setDashboard(dash);
      setStudents(stds);
      setNotifications(notes);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load dashboard data. ok.");
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await getMentorStudents();
      setStudents(response);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchNotifications = async () => {
    try {
      const response = await getNotifications();
      setNotifications(response);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAssignments = async () => {
    setLoading(true);
    try {
      const response = await getMentorAssignments();
      setAssignments(response);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch assignments.");
    } finally {
      setLoading(false);
    }
  };

  const fetchStudentDetails = async (id: string) => {
    setLoading(true);
    try {
      const response = await getStudentProfile(id);
      setSelectedStudent(response);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load student details.");
    } finally {
      setLoading(false);
    }
  };

  /* --- ACTIONS --- */
  const assignNewTask = async (studentId: string, taskId: string) => {
    try {
      await assignTaskToStudent(studentId, taskId);
      toast.success("Task assigned successfully. ok.");
      await fetchStudents(); // Refresh student list to see changes
    } catch (err) {
      console.error(err);
      toast.error("Failed to assign task.");
      throw err;
    }
  };

  const deleteStudentAction = async (studentId: string) => {
    try {
      await deleteStudent(studentId);
      toast.success("Student deleted successfully.");
      await fetchStudents(); // Refresh student list
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete student.");
      throw err;
    }
  };

  const issueWarning = async (studentId: string, remark: string, title: string, level: WarningLevel) => {
    try {
      await apiIssueWarning(studentId, remark, title, level);
      toast.success("Warning issued. ok.");
      await fetchStudents(); // Refresh to update warning_count
    } catch (err) {
      console.error(err);
      toast.error("Failed to issue warning.");
      throw err;
    }
  };

  const reviewTaskAction = async (taskId: string, status: TaskStatus, feedback: string) => {
    try {
      await reviewTask(taskId, status, feedback);
      toast.success(`Task marked as ${status}. ok.`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to review task.");
      throw err;
    }
  };

  const reviewAssignmentAction = async (
    assignmentId: string,
    status: TaskAssignment["status"],
    mentorRemark: string
  ) => {
    try {
      await reviewAssignment(assignmentId, status, mentorRemark);
      toast.success(`Assignment marked as ${status}.`);
      await fetchAssignments(); // Refresh assignments list
    } catch (err) {
      console.error(err);
      toast.error("Failed to review assignment.");
      throw err;
    }
  };

  const createNewStudent = async (studentData: any) => {
    try {
      await createStudent(studentData);
      toast.success("Student created. ok.");
      await fetchStudents();
    } catch (err) {
      console.error(err);
      toast.error("Failed to create student.");
    }
  };

  const updateStudentDetails = async (studentId: string, studentData: Partial<Student>) => {
    try {
      await updateStudent(studentId, studentData);
      toast.success("Student profile updated. ok.");
      await fetchStudentDetails(studentId);
    } catch (err) {
      console.error(err);
      toast.error("Update failed.");
    }
  };

  const createNewTask = async (taskData: any) => {
    try {
      await createTask(taskData);
      toast.success("New task created in library. ok.");
    } catch (err) {
      console.error(err);
      toast.error("Task creation failed.");
    }
  };

  const sendNewNotification = async (notificationData: any) => {
    try {
      await sendNotification(notificationData);
      toast.success("Notification sent. ok.");
    } catch (err) {
      console.error(err);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      await markNotificationAsRead(notificationId);
      setNotifications(prev => 
        prev ? prev.map(n => n.id === notificationId ? {...n, isRead: true} : n) : null
      );
    } catch (err) {
      console.error(err);
    }
  };

  const markAllAsReadAction = async () => {
    try {
      await apiMarkAllAsRead();
      setNotifications(prev => prev ? prev.map(n => ({...n, isRead: true})) : null);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (authUser) {
      fetchMentorDashboard();
    }
  }, [authUser]);

  return (
    <MentorContext.Provider
      value={{
        dashboard,
        students,
        notifications,
        selectedStudent,
        assignments,
        loading,
        fetchMentorDashboard,
        fetchStudents,
        fetchNotifications,
        fetchStudentDetails,
        fetchAssignments,
        assignNewTask,
        deleteStudentAction,
        issueWarning,
        reviewTaskAction,
        reviewAssignmentAction,
        createNewStudent,
        updateStudentDetails,
        createNewTask,
        sendNewNotification,
        markAsRead,
        markAllAsRead: markAllAsReadAction,
      }}
    >
      {children}
    </MentorContext.Provider>
  );
};

export const useMentor = () => {
  const context = useContext(MentorContext);
  if (!context) throw new Error("useMentor must be used within a MentorProvider");
  return context;
};