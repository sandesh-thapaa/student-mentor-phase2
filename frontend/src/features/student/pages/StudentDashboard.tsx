import React, { useState } from "react";
import {
  Code,
  Link2,
  ChevronRight,
  Bell,
  ExternalLink,
  Menu,
  CheckCircle,
} from "lucide-react";
import ProgressIndicator from "./ProgressIndicator";
import Warnings from "../pages/Warnings";
import Notifications from "./Notifications";
import StudentSidebar from "../components/StudentSidebar";
import { useStudent } from "../../../context/StudentContext";
import { useAuth } from "../../../context/AuthContext";
import toast from "react-hot-toast";

const SkeletonTask = () => (
  <div className="w-full h-[88px] bg-white border-2 border-gray-100 rounded-xl animate-pulse p-4">
    <div className="h-4 bg-gray-200 rounded w-1/3 mb-3"></div>
    <div className="h-3 bg-gray-100 rounded w-2/3"></div>
  </div>
);

const SkeletonDetails = () => (
  <div className="bg-white rounded-xl border border-gray-200 overflow-hidden animate-pulse">
    <div className="bg-gray-50 h-24 border-b border-gray-100 p-6">
      <div className="h-3 bg-gray-200 rounded w-20 mb-4"></div>
      <div className="h-6 bg-gray-200 rounded w-1/2"></div>
    </div>
    <div className="p-6">
      <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
      <div className="space-y-3 mb-8">
        <div className="h-3 bg-gray-100 rounded w-full"></div>
        <div className="h-3 bg-gray-100 rounded w-full"></div>
        <div className="h-3 bg-gray-100 rounded w-4/5"></div>
      </div>
      <div className="h-20 bg-gray-50 rounded-lg"></div>
    </div>
  </div>
);

const CourseModulePage: React.FC = () => {
  const [selectedTask, setSelectedTask] = useState<string>();
  const [taskFilterTab, setTaskFilterTab] = useState<
    "all" | "pending" | "submitted" | "rejected"
  >("all");
  const [currentSection, setCurrentSection] = useState<
    "overview" | "progress" | "warnings" | "notifications"
  >("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [githubLink, setGithubLink] = useState("");

  const {
    tasks,
    progressReport,
    submitStudentTask,
    loading: tasksLoading,
    unreadCount,
  } = useStudent();

  const { authUser } = useAuth();

  const activeTask = tasks?.find((t) => t.task_id === selectedTask);

  // Filter tasks by status
  const pendingTasks = tasks?.filter((t) => t.status === "PENDING") || [];
  const submittedTasks = tasks?.filter((t) => t.status === "SUBMITTED") || [];
  const rejectedTasks = tasks?.filter((t) => t.status === "REJECTED") || [];
  const approvedTasks = tasks?.filter((t) => t.status === "APPROVED") || [];

  const filteredTasks = (() => {
    if (taskFilterTab === "all") return tasks || [];
    if (taskFilterTab === "pending") return pendingTasks;
    if (taskFilterTab === "submitted") return submittedTasks;
    if (taskFilterTab === "rejected") return rejectedTasks;
    return tasks || [];
  })();

  // Getting the live link from the first course in the progress report
  const liveClassLink = progressReport?.courses?.[0]?.url;

  const handleTaskClick = (taskId: string) => {
    setSelectedTask(taskId);
    setGithubLink("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!authUser) {
      toast.error("You must be logged in to submit tasks. ok.");
      return;
    }

    if (!selectedTask || !githubLink) {
      toast.error("Please select a task and enter the link.");
      return;
    }

    try {
      await submitStudentTask(selectedTask, authUser.id, githubLink);
      setGithubLink("");
    } catch (err: unknown) {
      console.error("Submission error:", err);
      toast.error("Submission failed. ok.");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <StudentSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        currentSection={currentSection}
        setCurrentSection={setCurrentSection}
      />

      <div className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            <Menu size={24} />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Code className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">
              {progressReport?.courses?.[0]?.title || "My Course"}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setCurrentSection("notifications")}
              className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Bell className="w-5 h-5 text-gray-600" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white ring-2 ring-white">
                  {unreadCount}
                </span>
              )}
            </button>
            <span className="text-sm text-gray-600">
              User ID:{" "}
              <span className="font-semibold">{authUser?.id || "Guest"}</span>
            </span>
          </div>
        </div>

        <div className="p-4">
          {currentSection === "overview" && (
            <>
              {/* Class Link Banner */}
              <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-6 mb-8 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <Link2 className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">
                      Live Class Link
                    </h3>
                    <p className="text-sm text-gray-600 font-mono">
                      {liveClassLink || "No meeting link scheduled yet. ok."}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (liveClassLink) {
                      const url = liveClassLink.startsWith("http")
                        ? liveClassLink
                        : `https://${liveClassLink}`;
                      window.open(url, "_blank");
                    } else {
                      toast.error("No link available to open.");
                    }
                  }}
                  disabled={!liveClassLink}
                  className={`px-6 py-2.5 font-medium rounded-lg transition-colors flex items-center gap-2 ${
                    liveClassLink
                      ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  Go to URL
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left: Task List with Tabs */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    My Tasks
                  </h2>

                  {/* Tabs */}
                  <div className="flex gap-4 border-b border-gray-200 mb-6 overflow-x-auto">
                    {(["all", "pending", "submitted", "rejected"] as const).map(
                      (tab) => {
                        const counts = {
                          all: tasks?.length || 0,
                          pending: pendingTasks.length,
                          submitted: submittedTasks.length,
                          rejected: rejectedTasks.length,
                        };

                        return (
                          <button
                            key={tab}
                            onClick={() => setTaskFilterTab(tab)}
                            className={`pb-3 font-medium capitalize whitespace-nowrap relative ${
                              taskFilterTab === tab
                                ? "text-indigo-600"
                                : "text-gray-600 hover:text-gray-900"
                            }`}
                          >
                            {tab === "all" && "All Tasks"}
                            {tab === "pending" && "Pending"}
                            {tab === "submitted" && "Submitted"}
                              {tab === "rejected" && "Rejected"}
                            {counts[tab] > 0 && (
                              <span className="ml-2 px-2 py-0.5 bg-indigo-100 text-indigo-600 text-xs rounded-full">
                                {counts[tab]}
                              </span>
                            )}
                            {taskFilterTab === tab && (
                              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600" />
                            )}
                          </button>
                        );
                      }
                    )}
                  </div>

                  {/* Task List */}
                  <div className="space-y-3">
                    {tasksLoading ? (
                      <>
                        <SkeletonTask />
                        <SkeletonTask />
                        <SkeletonTask />
                      </>
                    ) : filteredTasks.length > 0 ? (
                      filteredTasks.map((task) => (
                        <button
                          key={task.task_id}
                          onClick={() => handleTaskClick(task.task_id)}
                          className={`w-full flex items-center justify-between p-4 border-2 rounded-xl transition-all ${
                            selectedTask === task.task_id
                              ? "bg-indigo-50 border-indigo-500"
                              : "bg-white border-indigo-200 hover:border-indigo-400"
                          }`}
                        >
                          <div className="text-left flex-1">
                            <div className="flex items-center justify-between">
                              <h3 className="font-bold mb-0.5 text-indigo-600">
                                {task.task.title}
                              </h3>
                              {task.status === "APPROVED" && (
                                <CheckCircle
                                  size={16}
                                  className="text-green-500"
                                />
                              )}
                            </div>
                            <p className="text-sm text-gray-600 line-clamp-1">
                              {task.task.description}
                            </p>
                          </div>
                        </button>
                      ))
                    ) : (
                      <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-200">
                        <p className="text-gray-400">
                          No {taskFilterTab === "all" ? "" : taskFilterTab} tasks
                          found.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right: Task Details */}
                <div>
                  {tasksLoading ? (
                    <SkeletonDetails />
                  ) : activeTask ? (
                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden sticky top-24">
                      <div className="bg-indigo-50 px-6 py-4 border-b border-indigo-100">
                        <span className="text-xs font-semibold text-indigo-600 uppercase">
                          Status: {activeTask.status}
                        </span>
                        <h2 className="text-2xl font-bold text-gray-900 mt-2">
                          {activeTask.task.title}
                        </h2>
                      </div>
                      <div className="p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-3">
                          Description
                        </h3>
                        <p className="text-gray-600 leading-relaxed mb-6">
                          {activeTask.task.description}
                        </p>

                        {activeTask.mentor_remark && (
                          <div className={`rounded-lg p-4 mb-6 border-l-4 ${
                            activeTask.status === "REJECTED"
                              ? "bg-red-50 border-red-500"
                              : "bg-blue-50 border-blue-500"
                          }`}>
                            <p className={`text-sm font-semibold mb-2 ${
                              activeTask.status === "REJECTED"
                                ? "text-red-900"
                                : "text-blue-900"
                            }`}>
                              {activeTask.status === "REJECTED" ? "Rejection Feedback" : "Mentor Feedback"}
                            </p>
                            <p className={`text-sm ${
                              activeTask.status === "REJECTED"
                                ? "text-red-800"
                                : "text-blue-800"
                            }`}>
                              {activeTask.mentor_remark}
                            </p>
                          </div>
                        )}

                        <div className="border-t border-gray-200 pt-6">
                          {activeTask.status === "PENDING" || activeTask.status === "REJECTED" ? (
                            <form
                              onSubmit={handleSubmit}
                              className="flex gap-3"
                            >
                              <div className="flex-1 relative">
                                <Link2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                  onChange={(e) =>
                                    setGithubLink(e.target.value)
                                  }
                                  value={githubLink}
                                  type="text"
                                  placeholder="https://github.com/username/repo"
                                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                />
                              </div>
                              <button className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg flex items-center gap-2">
                                Submit <ChevronRight className="w-4 h-4" />
                              </button>
                            </form>
                          ) : (
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-700 flex items-center gap-2">
                              <CheckCircle size={20} />
                              <div>
                                <p className="font-bold">Task {activeTask.status}</p>
                                <p className="text-sm opacity-90">
                                  {activeTask.status === "SUBMITTED" ? "Waiting for review. ok." : "Great job!"}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-20 text-center text-gray-400">
                      Select a task to view details.
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {currentSection === "progress" && <ProgressIndicator />}
          {currentSection === "warnings" && <Warnings />}
          {currentSection === "notifications" && <Notifications />}
        </div>
      </div>
    </div>
  );
};

export default CourseModulePage;