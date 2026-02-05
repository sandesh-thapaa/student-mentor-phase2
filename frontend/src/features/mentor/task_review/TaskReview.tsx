import { useState, useEffect } from "react";
import { Github, ExternalLink, MessageSquare, Check, RotateCcw, Search, Loader2 } from "lucide-react";
import { reviewTask } from "../../../api/taskApi";
import { useMentor } from "../../../context/MentorContext";
import { type TaskAssignment, TaskStatus } from "../types";
import toast from "react-hot-toast";

const TaskReview = () => {
  const { assignments, fetchAssignments, reviewAssignmentAction, loading: ctxLoading } = useMentor();
  const [submissions, setSubmissions] = useState<TaskAssignment[]>([]);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [selectedTask, setSelectedTask] = useState<TaskAssignment | null>(null);

  useEffect(() => {
    const loadAssignments = async () => {
      setLoading(true);
      try {
        await fetchAssignments();
      } catch (err) {
        console.error("Failed to fetch assignments", err);
        toast.error("Failed to fetch assignments");
      } finally {
        setLoading(false);
      }
    };
    loadAssignments();
  }, []);

  useEffect(() => {
    if (assignments) {
      const pendingAssignments = assignments.filter(
        (a) => a.status === TaskStatus.SUBMITTED
      );
      setSubmissions(pendingAssignments);
    }
  }, [assignments]);

  const handleReview = async (status: TaskStatus) => {
    if (!selectedTask || !feedback) return alert("Please select a task and add feedback. ok.");
    
    setLoading(true);
    try {
      await reviewAssignmentAction(selectedTask.id, status, feedback);
      setSubmissions(submissions.filter(s => s.id !== selectedTask.id));
      setSelectedTask(null);
      setFeedback("");
    } catch (err) {
      console.error("Review failed", err);
      toast.error("Failed to review assignment.");
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) {
    return (
        <div className="flex justify-center items-center h-screen">
            <Loader2 className="animate-spin text-blue-600" size={48} />
        </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      <div className="lg:col-span-2 space-y-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-bold text-gray-900">Pending Reviews</h2>
          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">{submissions.length} Total</span>
        </div>
        
        {submissions.map((item) => (
          <div 
            key={item.id} 
            onClick={() => setSelectedTask(item)}
            className={`p-4 bg-white border rounded-xl cursor-pointer transition-all ${selectedTask?.id === item.id ? 'border-blue-500 ring-2 ring-blue-50' : 'hover:border-gray-300 shadow-sm'}`}
          >
            <div className="flex justify-between items-start">
              <div className="flex gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-lg">👨‍💻</div>
                <div>
                  <h4 className="font-bold text-gray-900">{item.student.name}</h4>
                  <p className="text-xs text-gray-500">{item.task.title}</p>
                </div>
              </div>
              <span className="text-[10px] text-gray-400 font-medium uppercase">{new Date(item.submittedAt!).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm h-fit sticky top-6">
        {selectedTask ? (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Reviewing Submission</h3>
              <p className="text-sm text-gray-500">Task: {selectedTask.task.title}</p>
            </div>

            <a 
              href={selectedTask.github_link!} 
              target="_blank" 
              className="flex items-center justify-center gap-2 w-full py-3 bg-gray-900 text-white rounded-xl font-bold text-sm hover:bg-black transition-all"
            >
              <Github size={18} /> View Code on GitHub <ExternalLink size={14} />
            </a>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Internal Feedback</label>
              <textarea 
                rows="4"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="What should the student fix? ok."
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              ></textarea>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button 
                onClick={() => handleReview(TaskStatus.REJECTED)}
                disabled={loading}
                className="flex items-center justify-center gap-2 py-3 border border-orange-200 text-orange-600 rounded-xl font-bold text-xs hover:bg-orange-50 transition-all"
              >
                <RotateCcw size={16} /> Request Changes
              </button>
              <button 
                onClick={() => handleReview(TaskStatus.APPROVED)}
                disabled={loading}
                className="flex items-center justify-center gap-2 py-3 bg-green-600 text-white rounded-xl font-bold text-xs hover:bg-green-700 transition-all shadow-lg shadow-green-100"
              >
                <Check size={16} /> Approve Task
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
              <MessageSquare size={32} />
            </div>
            <p className="text-gray-400 font-medium">Select a submission to start review. ok.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskReview;