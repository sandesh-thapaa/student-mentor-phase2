// src/main.tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import { MentorProvider } from "./context/MentorContext";
import "./index.css";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <MentorProvider>
          <App />
          <Toaster />
        </MentorProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
