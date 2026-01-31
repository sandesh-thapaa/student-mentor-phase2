import { useState, useEffect } from 'react';
import { Loader2, Bell } from 'lucide-react';
import { useMentor } from '../../../context/MentorContext';
import { getNotifications, sendNotification } from '../../../api/notificationApi';
import { type Notification, NotificationType,type Student } from '../types/notification';
import NotificationForm from './components/NotificationForm';
import toast from 'react-hot-toast';

const Notifications: React.FC = () => {
  const { students } = useMentor();
  const [recipients, setRecipients] = useState<'all' | 'specific'>('all');
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [title, setTitle] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const data = await getNotifications();
      setNotifications(data);
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleStudentToggle = (studentId: string) => {
    setSelectedStudents(prev =>
      prev.includes(studentId)
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleSelectAll = () => {
    if (students) {
      if (selectedStudents.length === students.length) {
        setSelectedStudents([]);
      } else {
        setSelectedStudents(students.map(s => s.student_id));
      }
    }
  };

  const handleSend = async () => {
    setIsSubmitting(true)
    try {
      let targetStudentIds: string[] = [];
      if (recipients === 'all') {
        if (students) {
          targetStudentIds = students.map(s => s.student_id);
        }
      } else {
        targetStudentIds = selectedStudents;
      }

      await Promise.all(targetStudentIds.map(student_id => {
        const payload = {
          title,
          message: `**${title}**\n\n${message}`,
          type: NotificationType.SYSTEM_ANNOUNCEMENT,
          user_id: student_id, // for Omit type
          userId: student_id // for backend
        };
        return sendNotification(payload as any);
      }));

      toast.success('Notification sent successfully!');
      setTitle('');
      setMessage('');
      setRecipients('all');
      setSelectedStudents([]);
      await fetchNotifications();
    } catch (error) {
      console.error(error);
      toast.error('Failed to send notification.');
    } finally {
      setIsSubmitting(false)
    }
  };

  const filteredStudents = (students || []).filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.student_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className='flex items-center justify-center h-screen'><Loader2 className='animate-spin' /></div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Send Notification</h1>
              <p className="text-gray-500 mt-1 text-sm sm:text-base">
                Compose and broadcast updates to your students.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <NotificationForm
          students={filteredStudents}
          recipients={recipients}
          setRecipients={setRecipients}
          selectedStudents={selectedStudents}
          handleStudentToggle={handleStudentToggle}
          handleSelectAll={handleSelectAll}
          title={title}
          setTitle={setTitle}
          message={message}
          setMessage={setMessage}
          isSubmitting={isSubmitting}
          handleSend={handleSend}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />

        <div className="mt-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Sent Notifications
          </h2>
          <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 lg:p-8 space-y-6">
            {loading && notifications.length === 0 ? (
              <div className="flex justify-center">
                <Loader2 className="animate-spin" />
              </div>
            ) : notifications.length > 0 ? (
              notifications.map((notification) => (
                <div key={notification.id}>
                  <p>{notification.message}</p>
                  <p>{new Date(notification.createdAt).toLocaleDateString()}</p>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500">
                No notifications found.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
