import { useState, useEffect } from 'react';
import { HelpCircle, Loader2 } from 'lucide-react';
import { useMentor } from '../../../context/MentorContext';
import { issueWarning, getStudentWarnings } from '../../../api/warningApi';
import { type Warning, WarningLevel, WarningStatus, type Student } from '../types';
import WarningForm from './components/WarningForm';
import toast from 'react-hot-toast';

const Warnings = () => {
  const { students } = useMentor();
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [severity, setSeverity] = useState<WarningLevel>(WarningLevel.LOW);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isStudentDropdownOpen, setIsStudentDropdownOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [warnings, setWarnings] = useState<Warning[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchWarnings = async (studentId: string) => {
    setLoading(true);
    try {
      const studentWarnings = await getStudentWarnings(studentId);
      setWarnings(studentWarnings);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedStudent) {
      fetchWarnings(selectedStudent.student_id);
    }
  }, [selectedStudent]);

  const handleIssueWarning = async () => {
    if (selectedStudent && severity && title && description) {
      setIsSubmitting(true);
      try {
        await issueWarning({
          student_id: selectedStudent.student_id,
          level: severity,
          title,
          remark: description,
          status: WarningStatus.ACTIVE,
          mentor_id: '' // This will be set by the backend
        });
        toast.success('Warning issued successfully!');
        await fetchWarnings(selectedStudent.student_id);
        // Reset
        setSelectedStudent(null);
        setSeverity(WarningLevel.LOW);
        setTitle('');
        setDescription('');
      } catch (error) {
        console.error(error);
        toast.error('Failed to issue warning.');
      } finally {
        setIsSubmitting(false)
      }
    }
  };

  const handleCancel = () => {
    setSelectedStudent(null);
    setSeverity(WarningLevel.LOW);
    setTitle('');
    setDescription('');
    setWarnings([]);
  };

  const severityLevels = [
    {
      level: WarningLevel.LOW,
      icon: '⚠️',
      color: 'border-yellow-200 hover:border-yellow-400',
      bgColor: 'bg-yellow-50',
      iconBg: 'bg-yellow-100',
      iconColor: 'text-yellow-600',
      title: 'Low',
      description: 'Minor behavioral or attendance issue. Does not affect final grade immediately.'
    },
    {
      level: WarningLevel.MEDIUM,
      icon: '⚠️',
      color: 'border-orange-200 hover:border-orange-400',
      bgColor: 'bg-orange-50',
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600',
      title: 'Medium',
      description: 'Repeated violations or missed deadlines. Requires acknowledgement from student.'
    },
    {
      level: WarningLevel.HIGH,
      icon: '🛑',
      color: 'border-red-200 hover:border-red-400',
      bgColor: 'bg-red-50',
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600',
      title: 'High',
      description: 'Critical violation (e.g. plagiarism). Automatically escalated to administration.'
    }
  ];

  const filteredStudents = (students || []).filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.student_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 sm:py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Issue Warning</h1>
            <p className="text-gray-500 mt-1 text-sm sm:text-base">
              Send formal warnings to students regarding conduct or performance.
            </p>
          </div>
          <div className="flex gap-2 sm:gap-3">
            <button className="flex items-center justify-center gap-2 px-4 py-2 text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 text-sm sm:text-base">
              <HelpCircle size={16} className="sm:w-[18px] sm:h-[18px]" />
              Help & Guidelines
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <WarningForm
          students={filteredStudents}
          selectedStudent={selectedStudent}
          setSelectedStudent={setSelectedStudent}
          severity={severity}
          setSeverity={setSeverity}
          title={title}
          setTitle={setTitle}
          description={description}
          setDescription={setDescription}
          isSubmitting={isSubmitting}
          handleIssueWarning={handleIssueWarning}
          handleCancel={handleCancel}
          isStudentDropdownOpen={isStudentDropdownOpen}
          setIsStudentDropdownOpen={setIsStudentDropdownOpen}
          severityLevels={severityLevels}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
        {selectedStudent && (
          <div className="mt-8">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              Warnings for {selectedStudent?.name}
            </h2>
            <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 lg:p-8 space-y-6">
              {loading && warnings.length === 0 ? (
                <div className="flex justify-center">
                  <Loader2 className="animate-spin" />
                </div>
              ) : warnings.length > 0 ? (
                warnings.map((warning) => (
                  <div key={warning.id}>
                    <p>{warning.title}</p>
                    <p>{warning.remark}</p>
                    <p>{warning.level}</p>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500">
                  No warnings found for this student.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Warnings;
