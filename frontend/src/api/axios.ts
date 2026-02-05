import axios from "axios";

const BASE_URL =
  import.meta.env.VITE_API_URL || "https://student-mentor-phase2.vercel.app";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token to every request
api.interceptors.request.use((config) => {
  const auth = localStorage.getItem("authUser");

  if (auth) {
    const { token } = JSON.parse(auth);
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Handle error responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.data?.message) {
      error.message = error.response.data.message;
    }
    return Promise.reject(error);
  }
);

export default api;
