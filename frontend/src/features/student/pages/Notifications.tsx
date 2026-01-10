import React, { useState } from 'react';
import {
  Star,
  MessageSquare,
  AlertTriangle,
  Calendar,
  CheckCircle,
  SlidersHorizontal,
} from 'lucide-react';

const Notifications: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'mentions' | 'system'>('all');

  

  return (
    <div className="bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
              Notifications
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              Stay updated with your latest grades, messages, and alerts.
            </p>
          </div>

          <div className="flex gap-3">
            <button className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 font-medium">
              Mark all as read
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium text-gray-700 flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4" />
              Filter
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-6 border-b border-gray-200 mb-6 overflow-x-auto">
          {(['all', 'unread', 'mentions', 'system'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 font-medium capitalize whitespace-nowrap relative ${
                activeTab === tab
                  ? 'text-indigo-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab}
              {tab === 'unread' && (
                <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-600 text-xs rounded-full">
                  3
                </span>
              )}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600" />
              )}
            </button>
          ))}
        </div>

        {/* TODAY */}
        <div className="mb-8">
          <h2 className="text-xs font-semibold text-gray-500 uppercase mb-4">
            Today
          </h2>

          <div className="space-y-4">
            {/* Grade */}
            <NotificationCard
              icon={<Star className="w-5 h-5 text-indigo-600" fill="currentColor" />}
              title="New Grade Posted: UX Fundamentals"
              description={
                <>
                  You scored <span className="font-semibold text-gray-900">95/100</span>{' '}
                  on your recent submission.
                </>
              }
              time="2 hrs ago"
              highlight
            />

            {/* Message */}
            <NotificationCard
              icon={<MessageSquare className="w-5 h-5 text-indigo-600" />}
              title="Message from Mentor: Sarah Connor"
              description={`"Hey Alex, I've reviewed your project proposal..."`}
              time="4 hrs ago"
              actions
              highlight
            />

            {/* Overdue */}
            <NotificationCard
              icon={<AlertTriangle className="w-5 h-5 text-red-600" />}
              title="Assignment Overdue: Wireframing Basics"
              description="This assignment was due yesterday at 11:59 PM."
              time="6 hrs ago"
              danger
            />
          </div>
        </div>

        {/* YESTERDAY */}
        <div>
          <h2 className="text-xs font-semibold text-gray-500 uppercase mb-4">
            Yesterday
          </h2>

          <div className="space-y-4">
            <NotificationCard
              icon={<Calendar className="w-5 h-5 text-gray-600" />}
              title="Upcoming Event: Live Q&A"
              description="Live Q&A session tomorrow at 2 PM EST."
              time="Yesterday"
            />

            <NotificationCard
              icon={<CheckCircle className="w-5 h-5 text-green-600" />}
              title="Task Completed: HTML Structure"
              description="You have successfully completed the module."
              time="Yesterday"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <button className="text-indigo-600 hover:text-indigo-700 font-medium">
            View Older Notifications
          </button>
        </div>
      </div>
    </div>
  );
};

export default Notifications;

/* ---------------------------------- */
/* Reusable Notification Card */
/* ---------------------------------- */

type CardProps = {
  icon: React.ReactNode;
  title: string;
  description: React.ReactNode;
  time: string;
  highlight?: boolean;
  danger?: boolean;
  actions?: boolean;
};

const NotificationCard: React.FC<CardProps> = ({
  icon,
  title,
  description,
  time,
  highlight,
  danger,
  actions,
}) => {
  return (
    <div
      className={`rounded-xl p-5 shadow-sm hover:shadow-md transition ${
        danger
          ? 'bg-red-50 border-l-4 border-red-500'
          : highlight
          ? 'bg-white border-l-4 border-indigo-500'
          : 'bg-white'
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex gap-4">
          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
            {icon}
          </div>
          <div>
            <h3 className="font-bold text-gray-900 mb-1">{title}</h3>
            <p className="text-gray-600 text-sm">{description}</p>

            {actions && (
              <div className="flex gap-2 mt-3">
                <button className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg">
                  Reply
                </button>
                <button className="px-4 py-2 border border-gray-300 text-sm rounded-lg">
                  View Thread
                </button>
              </div>
            )}
          </div>
        </div>

        <span className="text-sm text-gray-500 whitespace-nowrap">{time}</span>
      </div>
    </div>
  );
};
