import { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Check,
  Loader2,
  X,
  ShieldAlert,
  UserX,
} from "lucide-react";
import { useMentor } from "../../../context/MentorContext";
import { getAllTasks, createTask } from "../../../api/taskApi";
import type { Student, Task } from "../types";
import { Link } from "react-router-dom";

const MyStudents = () => {
  const { students, issueWarning, assignNewTask } = useMentor();

  // Search state
  const [studentSearch, setStudentSearch] = useState("");
  
  // UI States
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [targetStudent, setTargetStudent] = useState<Student | null>(null);

  // Task Selection States
  const [library, setLibrary] = useState<Task[]>([]);
  const [loadingLibrary, setLoadingLibrary] = useState(false);
  const [taskSearch, setTaskSearch] = useState("");
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Warning States
  const [warningTitle, setWarningTitle] = useState("");
  const [warningRemark, setWarningRemark] = useState("");
  const [warningLevel, setWarningLevel] = useState<"LOW" | "MEDIUM" | "HIGH">("LOW");

  useEffect(() => {
    if (students) setLoadingStudents(false);
  }, [students]);

  useEffect(() => {
    if (showAssignModal) {
      const fetchTasks = async () => {
        setLoadingLibrary(true);
        try {
          const data = await getAllTasks();
          setLibrary(data);
        } catch (err) {
          console.error("Library fetch failed. ok.", err);
        } finally {
          setLoadingLibrary(false);
        }
      };
      fetchTasks();
    }
  }, [showAssignModal]);

  /* ------------------ Filtering Logic ------------------ */
  const filteredStudents = ((students as Student[]) || []).filter((s) =>
    s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
    s.student_id.toLowerCase().includes(studentSearch.toLowerCase())
  );

  /* ------------------ Action Handlers ------------------ */
  const handleAssignSubmit = async () => {
    if (!targetStudent || !selectedTaskId) return;
    setIsSubmitting(true);
    try {
      await assignNewTask(targetStudent.student_id, selectedTaskId);
      setShowAssignModal(false);
      setSelectedTaskId(null);
      alert("Task assigned successfully. ok.");
    } catch (err) {
      console.error("Assignment failed. ok.", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWarningSubmit = async () => {
    if (!targetStudent || !warningRemark.trim() || !warningTitle.trim()) return;
    setIsSubmitting(true);
    try {
      await issueWarning(
        targetStudent.student_id,
        warningRemark,
        warningTitle,
        warningLevel
      );
      setShowWarningModal(false);
      setWarningRemark("");
      setWarningTitle("");
      alert("Warning issued. ok.");
    } catch (err) {
      console.error("Warning failed. ok.", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50/30 min-h-screen font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-xl font-black uppercase tracking-tight text-gray-900">
          Student Management
        </h1>
        
        <div className="flex items-center gap-2">
          <Link to="/mentor/students/add" className="flex items-center gap-2 bg-green-600 text-white px-5 py-2.5 rounded-xl text-xs font-black uppercase hover:bg-green-700 transition-all shadow-lg shadow-green-100">
            <Plus size={14} /> Add Student
          </Link>
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search name or ID..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-2xl text-xs outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm"
              value={studentSearch}
              onChange={(e) => setStudentSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {loadingStudents ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-blue-600" />
        </div>
      ) : filteredStudents.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {filteredStudents.map((student) => (
            <div
              key={student.student_id}
              className="bg-white p-6 rounded-[24px] border border-gray-100 flex items-center justify-between shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-600 overflow-hidden">
                  {student.photo ? (
                    <img src={student.photo} alt="" className="w-full h-full object-cover" />
                  ) : (
                    student.name.substring(0, 2).toUpperCase()
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{student.name}</h3>
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">
                    {student.student_id}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Link to={`/mentor/students/${student.student_id}`} className="bg-gray-100 text-gray-600 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase hover:bg-gray-200 transition-all">
                  View Details
                </Link>
                <button
                  onClick={() => {
                    setTargetStudent(student);
                    setShowAssignModal(true);
                  }}
                  className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
                >
                  <Plus size={14} /> Assign Task
                </button>
                <button
                  onClick={() => {
                    setTargetStudent(student);
                    setShowWarningModal(true);
                  }}
                  className="bg-gray-100 text-gray-600 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase hover:bg-gray-200 transition-all"
                >
                  Issue Warning
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <UserX size={48} className="mb-4 opacity-20" />
          <p className="text-xs font-black uppercase tracking-widest">No students found. ok.</p>
        </div>
      )}

      {/* ASSIGN TASK MODAL */}
      {showAssignModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[32px] w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in duration-200">
            <div className="p-6 border-b flex justify-between items-center bg-gray-50/30">
              <h3 className="font-black text-gray-900 uppercase text-[10px]">
                Assign Task to {targetStudent?.name}
              </h3>
              <button onClick={() => setShowAssignModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              <input
                type="text"
                placeholder="Search tasks..."
                className="w-full mb-4 px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-xs outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => setTaskSearch(e.target.value)}
              />
              <div className="max-h-[300px] overflow-y-auto space-y-2 mb-6 min-h-[100px]">
                {loadingLibrary ? (
                  <Loader2 className="animate-spin mx-auto text-blue-500" />
                ) : (
                  library
                    .filter((t) => t.title.toLowerCase().includes(taskSearch.toLowerCase()))
                    .map((task) => {
                      return (
                        <div
                          key={task.task_id}
                          onClick={() => setSelectedTaskId(task.task_id)}
                          className={`p-4 border rounded-2xl cursor-pointer flex justify-between items-center transition-all ${
                            selectedTaskId === task.task_id ? "border-blue-600 bg-blue-50" : "border-gray-50 bg-gray-50/50"
                          }`}
                        >
                          <div>
                            <h4 className="text-xs font-black">{task.title}</h4>
                            <span className="text-[8px] uppercase text-gray-400">{task.course_id}</span>
                          </div>
                          {selectedTaskId === task.task_id && <Check size={14} className="text-blue-600" />}
                        </div>
                      );
                    })
                )}
              </div>
              <button
                disabled={!selectedTaskId || isSubmitting}
                onClick={handleAssignSubmit}
                className="w-full py-4 bg-black text-white text-[10px] font-black uppercase rounded-2xl disabled:opacity-30 active:scale-[0.98] transition-all"
              >
                {isSubmitting ? <Loader2 className="animate-spin mx-auto" size={14} /> : "Confirm Assignment"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* WARNING MODAL */}
      {showWarningModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-[32px] w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in duration-200">
            <div className="p-6 border-b flex justify-between items-center bg-gray-50/30">
              <h3 className="font-black text-gray-900 uppercase text-[10px]">
                Issue Warning: {targetStudent?.name}
              </h3>
              <button onClick={() => setShowWarningModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="p-8 space-y-4">
              <input
                type="text"
                value={warningTitle}
                onChange={(e) => setWarningTitle(e.target.value)}
                placeholder="Title (e.g., Late Submission)"
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-red-500"
              />
              <div className="flex gap-2">
                {(["LOW", "MEDIUM", "HIGH"] as const).map((level) => (
                  <button
                    key={level}
                    onClick={() => setWarningLevel(level)}
                    className={`flex-1 py-3 rounded-xl text-[10px] font-black border transition-all ${
                      warningLevel === level ? "bg-red-600 border-red-600 text-white shadow-lg shadow-red-100" : "bg-white border-gray-200 text-gray-400"
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
              <textarea
                value={warningRemark}
                onChange={(e) => setWarningRemark(e.target.value)}
                placeholder="Detailed Remark..."
                className="w-full h-28 p-4 bg-gray-50 border border-gray-200 rounded-2xl text-sm outline-none resize-none focus:ring-2 focus:ring-red-500"
              />
              <button
                disabled={isSubmitting || !warningRemark.trim() || !warningTitle.trim()}
                onClick={handleWarningSubmit}
                className="w-full py-4 bg-red-600 text-white text-[10px] font-black uppercase rounded-2xl flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
              >
                {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : <ShieldAlert size={14} />}
                Authorize Warning
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyStudents;