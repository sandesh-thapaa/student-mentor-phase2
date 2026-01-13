import {
  LogOut,
  X,
  LayoutDashboard,
  BarChart3,
  AlertTriangle,
  Bell,
  UserCircle,
} from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";

type SectionType = "overview" | "progress" | "warnings" | "notifications";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  currentSection: SectionType;
  setCurrentSection: (s: SectionType) => void;
};

const StudentSidebar = ({
  isOpen,
  onClose,
  currentSection,
  setCurrentSection,
}: Props) => {
  const { logout, authUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const menuItems = [
    { id: "overview", label: "Dashboard", icon: LayoutDashboard },
    { id: "progress", label: "My Progress", icon: BarChart3 },
    { id: "warnings", label: "Warnings", icon: AlertTriangle },
    { id: "notifications", label: "Updates", icon: Bell },
  ];

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-200 flex flex-col transform transition-all duration-300 ease-in-out shadow-xl lg:shadow-none
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        <div className="h-20 flex items-center px-4 border-b border-gray-50 justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center overflow-hidden border border-gray-100 shadow-sm">
              <img
                src="/leafclutch.png"
                alt="logo"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="font-bold text-gray-800 tracking-tight text-lg">
              LeafClutch Technology
            </span>
          </div>

          <button
            onClick={onClose}
            className="lg:hidden p-2 text-gray-400 hover:bg-gray-100 rounded-md"
          >
            <X size={20} />
          </button>
        </div>

        {/* MENU */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <p className="px-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">
            Main Menu
          </p>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentSection === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentSection(item.id as SectionType);
                  onClose();
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all group ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-100"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <Icon
                  size={20}
                  className={
                    isActive
                      ? "text-white"
                      : "text-gray-400 group-hover:text-indigo-600"
                  }
                />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* FOOTER / USER & LOGOUT */}
        <div className="p-4 mt-auto border-t border-gray-100 space-y-2">
          {/* User info snippet */}
          <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl mb-2">
            <UserCircle className="text-gray-400" size={32} />
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-gray-900 truncate">
                {authUser?.id || "Student"}
              </p>
              <p className="text-[10px] text-gray-400 uppercase">
                Active Session
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-600 font-bold hover:bg-red-50 rounded-xl transition-colors"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default StudentSidebar;
