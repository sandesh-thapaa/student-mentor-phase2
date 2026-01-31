import { AlertCircle, ChevronDown, Loader2 } from 'lucide-react';
import { type Student, WarningLevel } from '../../types/warning';

type SeverityLevel = {
  level: WarningLevel;
  icon: string;
  color: string;
  bgColor: string;
  iconBg: string;
  iconColor: string;
  title: string;
  description: string;
};

type WarningFormProps = {
  students: Student[];
  selectedStudent: Student | null;
  setSelectedStudent: (student: Student | null) => void;
  severity: WarningLevel;
  setSeverity: (level: WarningLevel) => void;
  title: string;
  setTitle: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  isSubmitting: boolean;
  handleIssueWarning: () => void;
  handleCancel: () => void;
  isStudentDropdownOpen: boolean;
  setIsStudentDropdownOpen: (isOpen: boolean) => void;
  severityLevels: SeverityLevel[];
  searchTerm: string;
  setSearchTerm: (value: string) => void;
};

const WarningForm: React.FC<WarningFormProps> = ({
  students,
  selectedStudent,
  setSelectedStudent,
  severity,
  setSeverity,
  title,
  setTitle,
  description,
  setDescription,
  isSubmitting,
  handleIssueWarning,
  handleCancel,
  isStudentDropdownOpen,
  setIsStudentDropdownOpen,
  severityLevels,
  searchTerm,
  setSearchTerm,
}) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 lg:p-8 space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          Select Student <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <button
            onClick={() => setIsStudentDropdownOpen(!isStudentDropdownOpen)}
            className="w-full flex items-center justify-between px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
          >
            <span className={selectedStudent ? 'text-gray-900' : 'text-gray-500'}>
              {selectedStudent ? `${selectedStudent.name} (${selectedStudent.student_id})` : 'Select a student...'}
            </span>
            <ChevronDown size={18} className="sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" />
          </button>
          {isStudentDropdownOpen && (
            <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg">
              <div className="p-2">
                <input
                  type="text"
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                />
              </div>
              <div className="max-h-64 overflow-y-auto">
                {students.map((student) => (
                  <button
                    key={student.student_id}
                    onClick={() => {
                      setSelectedStudent(student);
                      setIsStudentDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                  >
                    <div className="text-left flex-1 min-w-0">
                      <div className="font-medium text-gray-900 text-sm sm:text-base truncate">{student.name}</div>
                      <div className="text-xs sm:text-sm text-gray-500">ID: {student.student_id}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          Severity Level <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          {severityLevels.map((level) => (
            <button
              key={level.level}
              onClick={() => setSeverity(level.level)}
              className={`p-4 sm:p-5 border-2 rounded-lg text-left transition-all ${
                severity === level.level
                  ? `${level.bgColor} ${level.color.replace('hover:', '')}`
                  : `${level.color} bg-white`
              }`}
            >
              <div className={`w-8 h-8 sm:w-10 sm:h-10 ${level.iconBg} rounded-lg flex items-center justify-center mb-3`}>
                <span className="text-lg sm:text-2xl">{level.icon}</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">{level.title}</h3>
              <p className="text-xs sm:text-sm text-gray-600">{level.description}</p>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          Warning Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          placeholder="Brief summary of the warning"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          placeholder="Provide details of the incident and expected corrective behavior..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={6}
          className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-sm sm:text-base"
        />
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center sm:justify-between gap-3 pt-6 border-t border-gray-200">
        <button
          onClick={handleCancel}
          className="px-6 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm sm:text-base order-2 sm:order-1"
        >
          Cancel
        </button>
        <button
          onClick={handleIssueWarning}
          disabled={!selectedStudent || !severity || !title || !description || isSubmitting}
          className={`px-6 py-2 rounded-lg flex items-center justify-center gap-2 text-sm sm:text-base order-1 sm:order-2 ${
            selectedStudent && severity && title && description
              ? 'bg-red-600 text-white hover:bg-red-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {isSubmitting ? <Loader2 className='animate-spin' /> : <AlertCircle size={16} className="sm:w-[18px] sm:h-[18px]" />}
          Issue Warning
        </button>
      </div>
    </div>
  );
};

export default WarningForm;
