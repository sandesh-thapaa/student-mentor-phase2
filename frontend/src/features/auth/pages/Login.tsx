// File: src/features/auth/pages/Login.tsx
import { useState } from "react";
import { FiLock, FiUser } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { loginApi } from "../../../api/authApi";
import { useAuth } from "../../../context/AuthContext";
import toast from "react-hot-toast";

const Login = () => {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();

  // Inside src/features/auth/pages/Login.tsx

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await loginApi({ userId, password });

      const displayName =
        response.user.name ||
        (response.user.role === "MENTOR" ? "Mentor User" : "Student User");

      authLogin({
        id: response.user.user_id,
        role: response.user.role,
        token: response.token,
        name: displayName,
      });

      if (response.user.role === "STUDENT") {
        navigate("/student", { replace: true });
      } else if (response.user.role === "MENTOR") {
        navigate("/mentor", { replace: true });
      }

      toast.success(response.message);
    } catch (error) {
      console.error(error);
      setError("Invalid credentials or server error.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f3f4f6] px-4">
      {/* Background decoration - optional but adds 'street-smart' polish */}
      <div className="fixed top-0 left-0 w-full h-1 bg-indigo-600"></div>

      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div className="p-8">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute -inset-1 bg-indigo-500 rounded-full blur opacity-25"></div>
                <img
                  className="relative h-24 w-24 object-cover rounded-full border-2 border-white shadow-sm"
                  src="/leafclutch.png"
                  alt="Logo"
                />
              </div>
            </div>

            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                LeafClutch Technologies
              </h1>
              <p className="text-gray-500 mt-1 font-medium">
                Internal Login Portal
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded">
                  <p className="text-xs text-red-600 font-semibold text-center">
                    {error}
                  </p>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider ml-1">
                  User ID
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiUser className="text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                  </div>
                  <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
                    placeholder="26STD0001 or 26MEN001"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider ml-1">
                  Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiLock className="text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                  </div>
                  <input
                    type="password"
                    className="block w-full pl-10 pr-3 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl shadow-lg shadow-indigo-200 transition-all active:scale-[0.98]"
              >
                Sign In
              </button>
            </form>
          </div>

          <div className="bg-gray-50 px-8 py-4 border-t border-gray-100 flex justify-center">
            <p className="text-xs text-gray-500">
              Need access?{" "}
              <button className="text-indigo-600 font-bold hover:underline">
                Contact Admin
              </button>
            </p>
          </div>
        </div>

        <p className="mt-8 text-center text-gray-400 text-[10px] uppercase tracking-[0.2em]">
          © 2026 LeafClutch Technologies
        </p>
      </div>
    </div>
  );
};

export default Login;
