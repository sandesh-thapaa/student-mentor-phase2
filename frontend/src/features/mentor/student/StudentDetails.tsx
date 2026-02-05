import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Loader2,
  User,
  Mail,
  ShieldAlert,
  Edit,
  Trash2,
  X,
} from "lucide-react";
import { useMentor } from "../../../context/MentorContext";
import { getMentorStudents, updateStudent } from "../../../api/mentorApi";
import type { Student } from "../types";
import toast from "react-hot-toast";

const StudentDetails = () => {
  const { studentId } = useParams<{ studentId: string }>();
  const navigate = useNavigate();
  const { deleteStudentAction } = useMentor();

  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);

  // Edit Modal State
  const [showEditModal, setShowEditModal] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete Modal State
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const fetchStudent = async () => {
      if (!studentId) return;
      setLoading(true);
      try {
        // Workaround: Fetch all students and find the one with the matching ID
        const allStudents = await getMentorStudents();
        const currentStudent = allStudents.find(
          (s) => s.student_id === studentId
        );
        if (currentStudent) {
          setStudent(currentStudent);
          setName(currentStudent.name);
          // Assuming email is available in the student object.
          // If not, this needs to be adjusted based on the actual data structure.
          setEmail(currentStudent.email || "");
        } else {
          console.error("Student not found");
        }
      } catch (err) {
        console.error("Failed to fetch student details", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStudent();
  }, [studentId]);

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!student) return;
    setIsSubmitting(true);
    try {
      const updatedData = { name, email };
      const updated = await updateStudent(student.student_id, updatedData);
      setStudent(updated);
      setShowEditModal(false);
      toast.success("Student details updated successfully!");
    } catch (err) {
      console.error("Failed to update student", err);
      toast.error("Failed to update student. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!student) return;
    setIsSubmitting(true);
    try {
      await deleteStudentAction(student.student_id);
      toast.success("Student deleted successfully!");
      setShowDeleteModal(false);
      navigate("/mentor/students");
    } catch (err) {
      console.error("Failed to delete student", err);
      toast.error("Failed to delete student.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin text-blue-600" size={48} />
      </div>
    );
  }

  if (!student) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">Failed to load student details.</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50/30 min-h-screen font-sans">
      <div className="bg-white p-8 rounded-2xl shadow-sm">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-600 overflow-hidden">
              {student.photo ? (
                <img
                  src={student.photo}
                  alt={student.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                student.name.substring(0, 2).toUpperCase()
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {student.name}
              </h1>
              <p className="text-sm text-gray-500">{student.student_id}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowEditModal(true)}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-bold uppercase hover:bg-blue-700"
            >
              <Edit size={14} /> Edit
            </button>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg text-xs font-bold uppercase hover:bg-red-700"
            >
              <Trash2 size={14} /> Delete
            </button>
          </div>
        </div>

        {/* ... (rest of the student details display) ... */}
      </div>

      {/* EDIT MODAL */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
            <div className="p-6 border-b flex justify-between items-center">
              <h3 className="font-bold text-gray-900">Edit Student</h3>
              <button onClick={() => setShowEditModal(false)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 block w-full px-4 py-3 bg-gray-50 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full px-4 py-3 bg-gray-50 border rounded-lg"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-blue-600 text-white rounded-lg font-bold disabled:opacity-50"
              >
                {isSubmitting ? (
                  <Loader2 className="animate-spin mx-auto" />
                ) : (
                  "Save Changes"
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl p-6 text-center">
            <h3 className="text-lg font-bold text-gray-900">Are you sure?</h3>
            <p className="text-sm text-gray-500 mt-2">
              This action cannot be undone. This will permanently delete the
              student.
            </p>
            <div className="mt-6 flex justify-center gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={isSubmitting}
                className="px-6 py-2 bg-red-600 text-white rounded-lg font-semibold disabled:opacity-50"
              >
                {isSubmitting ? (
                  <Loader2 className="animate-spin mx-auto" />
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDetails;
