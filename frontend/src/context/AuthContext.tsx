import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { AuthUser } from "../features/auth/types";

/* ------------------ Types ------------------ */

type AuthContextType = {
  authUser: AuthUser | null;
  login: (authData: AuthUser) => void;
  logout: () => void;
};

/* ------------------ Context ------------------ */

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/* ------------------ Provider ------------------ */

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authUser, setAuthUser] = useState<AuthUser | null>(() => {
    const stored = localStorage.getItem("authUser");
    return stored ? JSON.parse(stored) : null;
  });



  useEffect(() => {
    if (authUser) {
      localStorage.setItem("authUser", JSON.stringify(authUser));
    } else {
      localStorage.removeItem("authUser");
    }
  }, [authUser]);

  const login = (authData: AuthUser) => {
    setAuthUser(authData);
  };

  const logout = () => {
    setAuthUser(null);
  };

  return (
    <AuthContext.Provider value={{ authUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

/* ------------------ Hook ------------------ */

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
