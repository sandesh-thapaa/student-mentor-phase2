import {
  LogOut,
  X,
  LayoutDashboard,
  BarChart3,
  AlertTriangle,
  Bell,
  Github,
  Linkedin,
  Twitter,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { useStudent } from "../../../context/StudentContext";
import { useNavigate } from "react-router-dom";

/* ---------------- TYPES ---------------- */

type SectionType = "overview" | "progress" | "warnings" | "notifications";

interface SocialLinks {
  github?: string;
  linkedin?: string;
  twitter?: string;
}

interface StudentData {
  name: string;
  student_id: string;
  photo?: string;
  progress: number;
  social_links?: SocialLinks;
}

type Props = {
  isOpen: boolean;
  onClose: () => void;
  currentSection: SectionType;
  setCurrentSection: (s: SectionType) => void;
};

/* ---------------- COMPONENT ---------------- */

const StudentSidebar = ({
  isOpen,
  onClose,
  currentSection,
  setCurrentSection,
}: Props) => {
  const { logout } = useAuth();
  const { dashboard, unreadCount } = useStudent();
  const navigate = useNavigate();

  // Type-safe data extraction
  const student = dashboard?.student as StudentData | undefined;
  const links = student?.social_links;
  const progress = student?.progress ?? 0;

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
      {/* High-quality Blur Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-gray-900/40 backdrop-blur-md z-40 lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 w-72 h-screen bg-[#FBFBFE] flex flex-col border-r border-gray-100 transform transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        {/* Brand Header - Fixed Height, No Scroll */}
        <div className="h-20 flex items-center px-6 shrink-0 justify-between">
          <div className="flex items-center gap-3">
            <div className=" bg-indigo-600 rounded-xl">
              <img
                src="/leafclutch.png"
                alt="logo"
                className="w-8 h-8 object-contain"
              />
            </div>
            <span className="font-extrabold text-gray-900 text-lg tracking-tight">
              LeafClutch
            </span>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 custom-scrollbar py-4">
          <div className="mb-8 px-2">
            <div className="flex items-center gap-4">
              <div className="relative shrink-0">
                <svg className="w-16 h-16 transform -rotate-90">
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    stroke="currentColor"
                    strokeWidth="3"
                    fill="transparent"
                    className="text-gray-100"
                  />
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    stroke="currentColor"
                    strokeWidth="3"
                    fill="transparent"
                    strokeDasharray={175.9}
                    strokeDashoffset={175.9 - (175.9 * progress) / 100}
                    strokeLinecap="round"
                    className="text-indigo-600 transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 m-1.5 rounded-full overflow-hidden border-2 border-white bg-indigo-50 flex items-center justify-center">
                  {student?.photo ? (
                    <img
                      src={student.photo}
                      alt="profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="font-bold text-indigo-600">
                      {student?.name?.charAt(0) ?? "S"}
                    </span>
                  )}
                </div>
              </div>
              <div className="overflow-hidden">
                <h3 className="font-bold text-gray-900 truncate leading-tight">
                  {student?.name ?? "Loading..."}
                </h3>
                <p className="text-[11px] font-semibold text-gray-400 tracking-wider mt-1">
                  {student?.student_id ?? "ID-0000"}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            <p className="px-4 text-[10px] font-bold text-gray-400 uppercase tracking-[2px] mb-4">
              Navigation
            </p>
            {menuItems.map((item) => {
              const isActive = currentSection === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentSection(item.id as SectionType);
                    onClose();
                  }}
                  className={`w-full group flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 ${
                    isActive
                      ? "bg-white text-indigo-600 shadow-sm border border-gray-100"
                      : "text-gray-500 hover:bg-gray-100/50 hover:translate-x-1"
                  }`}
                >
                  <div
                    className={`p-2 rounded-xl transition-colors ${
                      isActive
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-100 group-hover:bg-white text-gray-400"
                    }`}
                  >
                    <Icon size={18} />
                  </div>
                  <span
                    className={`flex-1 text-left font-semibold text-sm ${
                      isActive ? "text-gray-900" : ""
                    }`}
                  >
                    {item.label}
                  </span>
                  {item.id === "notifications" && unreadCount > 0 && (
                    <span className="w-5 h-5 flex items-center justify-center bg-red-500 text-white text-[10px] font-bold rounded-lg shadow-lg shadow-red-200">
                      {unreadCount}
                    </span>
                  )}
                  {isActive && (
                    <ChevronRight size={14} className="text-gray-300" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Minimal Mentor Section */}
          {/* <div className="mt-10 px-2">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-700 text-white shadow-xl shadow-indigo-100">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-1.5 bg-white/20 rounded-lg backdrop-blur-md">
                  <GraduationCap size={16} />
                </div>
                <span className="text-[10px] font-bold tracking-widest uppercase opacity-80">
                  Your Mentor
                </span>
              </div>
              <p className="font-bold text-sm mb-1 truncate">Sarah Connor</p>
              <p className="text-[10px] opacity-70 mb-1 truncate">
                sarah@leafclutch.com
              </p>
            </div>
          </div> */}
        </div>

        {/* Footer - Fixed Height, No Scroll */}
        <div className="p-6 shrink-0 bg-white border-t border-gray-100">
          <div className="flex items-center justify-center gap-6 mb-6">
            {links?.github && (
              <a
                href={links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-900 transition-colors"
              >
                <Github size={18} />
              </a>
            )}
            {links?.linkedin && (
              <a
                href={links.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-[#0A66C2] transition-colors"
              >
                <Linkedin size={18} />
              </a>
            )}
            {links?.twitter && (
              <a
                href={links.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-[#1DA1F2] transition-colors"
              >
                <Twitter size={18} />
              </a>
            )}
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-gray-900 hover:bg-gray-800 text-white rounded-2xl font-bold text-sm transition-all active:scale-95 shadow-lg shadow-gray-200"
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default StudentSidebar;