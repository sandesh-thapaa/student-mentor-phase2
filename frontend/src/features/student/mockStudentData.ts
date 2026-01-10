// src/features/student/mockStudentData.ts

import type { Student, Notification, Warning } from "./types";

export const mockStudent: Student = {
  id: "26STD001",
  name: "Alex Johnson",
  email: "alex@student.com",
  photo: "/image/john.jpg",
  progress: 25,
  courseName: "Web Development Course",
  courseUrl: "https://course-url.com",
  liveClassUrl: "https://course-url.com/meet/xyz-abc",
  mentor: {
    name: "Sarah Connor",
    expertise: "Senior Dev",
    email: "mentor@example.com",
    discordLink: "https://discord.gg/example",
  },
  tasks: [
    { task_id: 1, title: "HTML Basics", status: "completed", deadline: "2026-01-10" },
    { task_id: 2, title: "CSS Styling", status: "in_progress", deadline: "2026-01-15" },
    { task_id: 3, title: "Responsive Layouts", status: "pending", deadline: "2026-01-20" },
  ],
};

export const mockWarnings: Warning[] = [
  {
    id: "1",
    title: "Consecutive Missed Deadlines",
    remark: "You have missed multiple task deadlines.",
    level: "HIGH",
    status: "ACTIVE",
    createdAt: "2023-10-24",
    mentor: { name: "Sarah Connor" },
  },
  {
    id: "2",
    title: "Low Attendance",
    remark: "You missed 3 consecutive live sessions.",
    level: "MEDIUM",
    status: "RESOLVED",
    createdAt: "2023-09-12",
    mentor: { name: "John Smith" },
  },
];

export const mockNotifications: Notification[] = [
  {
    id: 1,
    message: "New task assigned: Task 4",
    type: "success",
    date: "2026-01-06",
  },
  {
    id: 2,
    message: "Mentor updated your progress on Task 2",
    type: "info",
    date: "2026-01-05",
  },
  {
    id: 3,
    message: "Course Web Development will start tomorrow",
    type: "warning",
    date: "2026-01-04",
  },
];
