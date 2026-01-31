import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Loader2, BookOpen, Link as LinkIcon } from "lucide-react";
import { getTask } from "../../../api/taskApi";
import type{ Task } from "../types";

const TaskDetails = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTask = async () => {
      if (!taskId) return;
      setLoading(true);
      try {
        const data = await getTask(taskId);
        setTask(data);
      } catch (err) {
        console.error("Failed to fetch task details", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTask();
  }, [taskId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin text-blue-600" size={48} />
      </div>
    );
  }

  if (!task) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">Failed to load task details.</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50/30 min-h-screen font-sans">
      <div className="bg-white p-8 rounded-2xl shadow-sm">
        <div className="flex items-center gap-6 mb-8">
          <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-600 overflow-hidden">
            <BookOpen size={48} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{task.title}</h1>
            <p className="text-sm text-gray-500">{task.course_id}</p>
          </div>
        </div>

        <div className="prose prose-blue max-w-none">
          <p>{task.description}</p>
        </div>

        {task.doc_link && (
          <div className="mt-8">
            <a
              href={task.doc_link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-blue-600 hover:underline"
            >
              <LinkIcon size={16} />
              <span>Documentation</span>
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskDetails;
