import React, { useEffect, useState, useRef } from "react";
import {
  AlertTriangle,
  ClipboardCheck,
  Send,
  Bell,
  BookOpen,
  Clock,
} from "lucide-react";
import { useStudent } from "../../../context/StudentContext";
import moment from "moment";

const Notifications: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "all" | "unread" | "read" | "system"
  >("all");

  const {
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    loading,
  } = useStudent();

  const iconMap: Record<string, React.ReactNode> = {
    TASK_ASSIGNED: <ClipboardCheck className="text-blue-500" />,
    WARNING_ISSUED: <AlertTriangle className="text-red-500" />,
    SYSTEM_ANNOUNCEMENT: <Bell className="text-purple-500" />,
    TASK_REVIEWED: <Send className="text-green-500" />,
    COURSE_CREATED: <BookOpen className="text-indigo-500" />,
  };
  const hasMarkedRead = useRef(false);

  useEffect(() => {
    if (notifications && notifications.length > 0 && !hasMarkedRead.current) {
      const hasUnread = notifications.some(
        (n) => !(n.isRead === true || !!n.readAt)
      );

      if (hasUnread) {
        markAllNotificationsAsRead();
        hasMarkedRead.current = true;
      }
    }
  }, [notifications, markAllNotificationsAsRead]);

  const handleReadAll = async (e: React.MouseEvent) => {
    e.preventDefault();
    await markAllNotificationsAsRead();
  };

  const filteredNotifications = (notifications ?? []).filter((n) => {
    const isActuallyRead = n.isRead === true || !!n.readAt;

    if (activeTab === "all") return true;
    if (activeTab === "unread") return !isActuallyRead;
    if (activeTab === "read") return isActuallyRead;
    if (activeTab === "system") return n.type === "SYSTEM_ANNOUNCEMENT";
    return true;
  });

  if (loading)
    return <div className="p-10 text-center text-gray-400">Loading... ok.</div>;

  return (
    <div className="bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
              Notifications
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              Stay updated.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleReadAll}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 font-medium"
            >
              Mark all as read
            </button>
          </div>
        </div>

        <div className="flex gap-6 border-b border-gray-200 mb-6 overflow-x-auto">
          {(["all", "unread", "read", "system"] as const).map((tab) => {
            // ok, fix for the badge counter
            const unreadItemsCount = (notifications ?? []).filter(
              (n) => !(n.isRead === true || !!n.readAt)
            ).length;

            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 font-medium capitalize whitespace-nowrap relative ${
                  activeTab === tab
                    ? "text-indigo-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {tab}
                {tab === "unread" && unreadItemsCount > 0 && (
                  <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-600 text-xs rounded-full">
                    {unreadItemsCount}
                  </span>
                )}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600" />
                )}
              </button>
            );
          })}
        </div>

        <div className="space-y-4 mb-8">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((n) => (
              <NotificationCard
                key={n.id}
                icon={iconMap[n.type] ?? <Bell size={18} />}
                title={n.type ? n.type.replace(/_/g, " ") : "Notification"}
                description={n.message}
                time={moment(n.createdAt).fromNow()}
                // ok, fix for the card highlight
                highlight={!(n.isRead === true || !!n.readAt)}
                onRead={() => markNotificationAsRead(n.id)}
                danger={n.type === "WARNING_ISSUED"}
              />
            ))
          ) : (
            <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-200">
              <p className="text-gray-400">No notifications found. ok.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface NotificationCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  time: string;
  highlight: boolean;
  onRead: () => Promise<void> | void;
  danger?: boolean;
}

const NotificationCard: React.FC<NotificationCardProps> = ({
  icon,
  title,
  description,
  time,
  highlight,
  onRead,
  danger,
}) => (
  <div
    onClick={() => onRead()}
    className={`rounded-xl cursor-pointer p-5 shadow-sm hover:shadow-md transition border-l-4 ${
      danger
        ? "bg-red-50 border-red-500"
        : highlight
        ? "bg-white border-indigo-500"
        : "bg-white border-transparent"
    }`}
  >
    <div className="flex items-start justify-between gap-4">
      <div className="flex gap-4">
        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
          {icon}
        </div>
        <div>
          <h3 className="font-bold text-gray-900 mb-1 capitalize text-sm">
            {title.toLowerCase()}
          </h3>
          <p className="text-gray-600 text-sm">{description}</p>
        </div>
      </div>
      <span className="text-[10px] text-gray-400 whitespace-nowrap flex items-center gap-1 uppercase">
        <Clock size={12} /> {time}
      </span>
    </div>
  </div>
);

export default Notifications;
