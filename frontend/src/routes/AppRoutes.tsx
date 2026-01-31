import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../features/auth/pages/Login";
import ProtectedRoute from "../features/auth/components/ProtectedRoute";
import StudentDashboard from "../features/student/pages/StudentDashboard";
import { StudentProvider } from "../context/StudentContext";
import MentorDashboard from "../features/mentor/MentorDashboard";
import { MentorProvider } from "../context/MentorContext";
import MyStudents from "../features/mentor/mystudents/MyStudents";
import AddStudent from "../features/mentor/student/AddStudent";
import StudentDetails from "../features/mentor/student/StudentDetails";
import Tasks from "../features/mentor/tasks/Tasks";
import TaskDetails from "../features/mentor/tasks/TaskDetails";
import TaskReview from "../features/mentor/task_review/TaskReview";
import Warnings from "../features/mentor/warnings/Warnings";
import Notifications from "../features/mentor/notifications/Notifications";
import MyCourses from "../features/mentor/courses/MyCourses";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<Login />} />

      {/* Dashboards */}
      <Route
        path="/student"
        element={
          <ProtectedRoute allowedRoles={["STUDENT"]}>
            <StudentProvider>
              <StudentDashboard />
            </StudentProvider>
          </ProtectedRoute>
        }
      />
      <Route
        path="/mentor"
        element={
          <ProtectedRoute allowedRoles={["MENTOR"]}>
            <MentorProvider>
              <MentorDashboard />
            </MentorProvider>
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="students" replace />} />
        <Route path="students" element={<MyStudents />} />
        <Route path="students/add" element={<AddStudent />} />
        <Route path="students/:studentId" element={<StudentDetails />} />
        <Route path="tasks" element={<Tasks />} />
        <Route path="tasks/:taskId" element={<TaskDetails />} />
        <Route path="reviews" element={<TaskReview />} />
        <Route path="warnings" element={<Warnings />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="courses" element={<MyCourses />} />
      </Route>

      {/* Default */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;

