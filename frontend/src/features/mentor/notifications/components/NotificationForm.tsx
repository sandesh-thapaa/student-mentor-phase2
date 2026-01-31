import { Link2, Paperclip, Loader2, Bell } from 'lucide-react';
import { type Student } from '../../types/notification';

type NotificationFormProps = {
  students: Student[];
  recipients: 'all' | 'specific';
  setRecipients: (value: 'all' | 'specific') => void;
  selectedStudents: string[];
  handleStudentToggle: (studentId: string) => void;
  handleSelectAll: () => void;
  title: string;
  setTitle: (value: string) => void;
  message: string;
  setMessage: (value: string) => void;
  isSubmitting: boolean;
  handleSend: () => void;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
};

const NotificationForm: React.FC<NotificationFormProps> = ({
  students,
  recipients,
  setRecipients,
  selectedStudents,
  handleStudentToggle,
  handleSelectAll,
  title,
  setTitle,
  message,
  setMessage,
  isSubmitting,
  handleSend,
  searchTerm,
  setSearchTerm,
}) => {
  const characterCount = message.length;
  const maxCharacters = 500;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 lg:p-8">
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <Bell />
          </div>
          <h2 className="text-base sm:text-lg font-semibold text-gray-900">Select Recipients</h2>
        </div>

        <div className="space-y-4">
          <label className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-300 transition-colors">
            <input
              type="radio"
              name="recipients"
              value="all"
              checked={recipients === 'all'}
              onChange={(e) => setRecipients(e.target.value as 'all' | 'specific')}
              className="mt-1 w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0"
            />
            <div className="flex-1">
              <div className="font-medium text-gray-900 text-sm sm:text-base">All Students</div>
              <div className="text-xs sm:text-sm text-gray-500">Send to all {students.length} students assigned to you</div>
            </div>
          </label>

          <label className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-300 transition-colors">
            <input
              type="radio"
              name="recipients"
              value="specific"
              checked={recipients === 'specific'}
              onChange={(e) => setRecipients(e.target.value as 'all' | 'specific')}
              className="mt-1 w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0"
            />
            <div className="flex-1">
              <div className="font-medium text-gray-900 text-sm sm:text-base">Specific Student(s)</div>
              <div className="text-xs sm:text-sm text-gray-500">Select individual students from the list</div>
            </div>
          </label>

          {recipients === 'specific' && (
            <div className="ml-0 sm:ml-9 p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-gray-900 text-sm sm:text-base">SELECT STUDENTS</h3>
                <button
                  onClick={handleSelectAll}
                  className="text-xs sm:text-sm text-blue-600 hover:underline"
                >
                  {students.length === selectedStudents.length ? 'Deselect All' : 'Select All'}
                </button>
              </div>
              <div className="mb-3">
                <input
                  type="text"
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                />
              </div>
              <div className="space-y-2">
                {students.map((student) => (
                  <label
                    key={student.student_id}
                    className="flex items-center gap-3 p-3 bg-white rounded-lg hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedStudents.includes(student.student_id)}
                      onChange={() => handleStudentToggle(student.student_id)}
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 text-sm sm:text-base truncate">{student.name}</div>
                      <div className="text-xs sm:text-sm text-gray-500">ID: {student.student_id}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mb-6 sm:mb-8">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
            <svg
              className="w-5 h-5 text-purple-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </div>
          <h2 className="text-base sm:text-lg font-semibold text-gray-900">Compose Message</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
              Notification Title
            </label>
            <input
              type="text"
              placeholder="e.g., Upcoming Code Review Session"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
              Message / Description
            </label>
            <textarea
              placeholder="Type your message here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={6}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-sm sm:text-base"
            />
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-2">
              <div className="flex items-center gap-3">
                <button className="p-2 hover:bg-gray-100 rounded text-gray-600">
                  <Paperclip size={16} className="sm:w-[18px] sm:h-[18px]" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded text-gray-600">
                  <Link2 size={16} className="sm:w-[18px] sm:h-[18px]" />
                </button>
                <span className="text-xs text-gray-500">Markdown is supported.</span>
              </div>
              <span className="text-xs sm:text-sm text-gray-500">
                {characterCount} / {maxCharacters} characters
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center sm:justify-between gap-3 pt-6 border-t border-gray-200">
        <div className="flex flex-col sm:flex-row gap-3 order-1 sm:order-2">
          <button
            onClick={handleSend}
            disabled={isSubmitting}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            {isSubmitting ? <Loader2 className='animate-spin' /> : <Bell />}
            Send Notification
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationForm;
