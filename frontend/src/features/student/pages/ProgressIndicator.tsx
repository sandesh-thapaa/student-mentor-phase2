import React from "react";
import type { Task } from "../types";
import {
  CheckCircle,
  Clock,
  Lock,
  MoreHorizontal,
  List,
  ChevronRight,
  Play,
} from "lucide-react";
import { useStudent } from "../../../context/StudentContext";

/* ---------------- MOCK DATA (replace with API later) ---------------- */

// const mockTasks: Task[] = [
//   {
//     task_id: 1,
//     title: "HTML Basics",
//     status: "completed",
//   },
//   {
//     task_id: 2,
//     title: "CSS Fundamentals",
//     status: "completed",
//   },
//   {
//     task_id: 3,
//     title: "Responsive Design",
//     status: "in_progress",
//   },
//   {
//     task_id: 4,
//     title: "JavaScript Basics",
//     status: "pending",
//   },
//   {
//     task_id: 5,
//     title: "React Introduction",
//     status: "pending",
//   },
// ];

/* ---------------- COMPONENT ---------------- */

const ProgressIndicator: React.FC = () => {
  // const tasks: Task[] = mockTasks;
  const { progressReport } = useStudent()

const completed = progressReport?.taskStats?.completed ?? 0;
const inProgress = progressReport?.taskStats?.approved ?? 0;
const pending = progressReport?.taskStats?.pending ?? 0;

  const progressPercent = progressReport?.completionPercentage ?? 0

  return (
    <div className="bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Page Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
          Progress Indicator
        </h1>

        {/* Course Completion Card */}
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-500 rounded-2xl p-6 md:p-8 text-white shadow-lg">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6 mb-6">
            <div>
              <h2 className="text-lg font-semibold uppercase tracking-wide">
                Course Completion
              </h2>
              <p className="text-indigo-100 text-sm mt-1">
                Overall progress based on completed tasks
              </p>
            </div>

            <div className="text-right">
              <div className="text-5xl font-bold">{progressPercent}%</div>
              <div className="text-indigo-100 text-sm">Completed</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div>
            <div className="w-full h-3 bg-indigo-400 bg-opacity-40 rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <div className="flex justify-between mt-2 text-xs text-indigo-100">
              <span>START</span>
              <span>PROGRESS</span>
              <span>FINISH</span>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            label="Completed"
            value={completed}
            icon={<CheckCircle className="text-green-600 w-5 h-5" />}
            bg="bg-green-100"
          />
          <StatCard
            label="In Progress"
            value={inProgress}
            icon={<Play className="text-indigo-600 w-5 h-5" />}
            bg="bg-indigo-100"
          />
          <StatCard
            label="Pending"
            value={pending}
            icon={<Clock className="text-yellow-600 w-5 h-5" />}
            bg="bg-yellow-100"
          />
          <StatCard
            label="Locked"
            value={0}
            icon={<Lock className="text-red-600 w-5 h-5" />}
            bg="bg-red-100"
          />
        </div>

        {/* Modules List */}
        <div className="bg-white rounded-2xl shadow-sm p-4 md:p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">
              Current Modules
            </h2>

            <div className="flex gap-2">
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <MoreHorizontal className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <List className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {progressReport?.courses.map((course:any) => (
              <TaskRow key={course.course_id} task={course} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressIndicator;

/* ---------- Helper Components ---------- */

const StatCard = ({
  label,
  value,
  icon,
  bg,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  bg: string;
}) => (
  <div className="bg-white rounded-xl p-4 shadow-sm">
    <div className="flex items-center gap-3 mb-3">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${bg}`}>
        {icon}
      </div>
      <span className="text-gray-600 text-sm">{label}</span>
    </div>
    <div className="text-3xl font-bold text-gray-900">{value}</div>
  </div>
);

const TaskRow = ({ task }: { task: Task }) => {
  const statusMap = {
    completed: {
      label: "Completed",
      badge: "bg-green-100 text-green-700",
      icon: <CheckCircle className="w-5 h-5 text-green-600" />,
    },
    in_progress: {
      label: "In Progress",
      badge: "bg-indigo-100 text-indigo-700",
      icon: <Play className="w-5 h-5 text-indigo-600" />,
    },
    pending: {
      label: "Pending",
      badge: "bg-gray-100 text-gray-700",
      icon: <Clock className="w-5 h-5 text-gray-500" />,
    },
  };

  const status = statusMap[task.status];

  return (
    <div className="flex items-center justify-between p-4 border rounded-xl hover:shadow transition">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
          {status?.icon}
        </div>

        <div>
          <h3 className="font-semibold text-gray-900">{task.title}</h3>
          <p className="text-sm text-gray-500">Task ID: {task.task_id}</p>

        </div>
      </div>

      <div className="flex items-center gap-4">
        <span className={`px-4 py-1.5 rounded-lg text-sm font-medium ${status?.badge}`}>
          {status?.label}
        </span>
        <ChevronRight className="w-5 h-5 text-gray-400" />
      </div>
    </div>
  );
};
