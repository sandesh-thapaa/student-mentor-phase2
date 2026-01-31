import type { FC } from "react";
import {
  LayoutDashboard,
  GraduationCap,
  MessageSquare,
  Bell,
  AlertTriangle,
  Settings,
  LogOut,
  ClipboardCheck,
  BookOpenCheck,
} from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { useMentor } from "../../../context/MentorContext";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

type SidebarProps = {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
};

const Sidebar: FC<SidebarProps> = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const { logout, authUser } = useAuth();
  const { notifications, dashboard } = useMentor();
  const navigate = useNavigate();
  const location = useLocation();

  if (!authUser) return null;

  const mentorName = dashboard?.mentor?.name || authUser.name || "Mentor";
  const mentorPhoto = dashboard?.mentor?.photo;

  const unreadCount = notifications?.filter((n) => !n.isRead).length || 0;

  const initials = mentorName
    .split(" ")
    .filter(Boolean)
    .map((n: string) => n[0])
    .join("")
    .toUpperCase();

  type MenuItem = {
    icon: FC<{ size?: number; className?: string }>;
    label: string;
    path: string;
    badge?: number;
  };

  const menuItems: MenuItem[] = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/mentor/dashboard" },
    { icon: GraduationCap, label: "My Students", path: "/mentor/students" },
    { 
      icon: BookOpenCheck, 
      label: "Task Library", 
      path: "/mentor/tasks" 
    },
    { 
      icon: ClipboardCheck, 
      label: "Task Reviews", 
      path: "/mentor/reviews", 
      badge: 2 
    },
    {
      icon: Bell,
      label: "Notifications",
      path: "/mentor/notifications",
      badge: unreadCount,
    },
    { icon: AlertTriangle, label: "Warnings", path: "/mentor/warnings" },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div
      className={`fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 h-screen flex flex-col shrink-0 transform ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      } lg:relative lg:translate-x-0 transition-transform duration-200 ease-in-out`}
    >
      {/* Profile Section */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col items-center text-center">
          {mentorPhoto ? (
            <img
              src={mentorPhoto}
              alt={mentorName}
              className="w-20 h-20 rounded-full object-cover mb-3 border-2 border-blue-500 shadow-md"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-2xl font-bold mb-3 shadow-md">
              {initials}
            </div>
          )}

          <h3 className="font-semibold text-gray-900 leading-tight">
            {mentorName}
          </h3>
          <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mt-1">
            {authUser.role || "Mentor"}
          </p>

          <div className="mt-3 w-full">
            <div className="flex justify-between px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-100">
              <span className="text-[9px] text-gray-400 uppercase font-black">ID</span>
              <span className="font-mono text-[10px] text-gray-600">
                {authUser.id}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-1.5">
          {menuItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                onClick={() => setIsSidebarOpen(false)}
                className={({ isActive }) =>
                  `w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                    isActive
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-100"
                      : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                  }`
                }
              >
                <item.icon
                  size={20}
                  className={
                    location.pathname === item.path
                      ? "text-white"
                      : "text-gray-400 group-hover:text-blue-500"
                  }
                />
                <span className="flex-1 text-left font-semibold text-sm">
                  {item.label}
                </span>
                {item.badge && item.badge > 0 ? (
                  <span
                    className={`${
                      location.pathname === item.path
                        ? "bg-white text-blue-600"
                        : "bg-red-500 text-white"
                    } text-[10px] font-black rounded-full min-w-[20px] h-5 px-1 flex items-center justify-center`}
                  >
                    {item.badge}
                  </span>
                ) : null}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-gray-200 space-y-1">
        <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-colors text-sm font-medium">
          <Settings size={18} />
          <span>Settings</span>
        </button>
        <button
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors text-sm font-bold"
          onClick={handleLogout}
        >
          <LogOut size={18} />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;