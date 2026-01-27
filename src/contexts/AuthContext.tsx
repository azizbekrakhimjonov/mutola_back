import { createContext, useContext, useState, useCallback } from "react";
import {
  isAuthenticated as getIsAuthenticated,
  logout as doLogout,
  setAuthenticated as doSetAuth,
} from "@/lib/auth";

interface AuthContextType {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => getIsAuthenticated());

  const login = useCallback(() => {
    doSetAuth();
    setIsAuthenticated(true);
  }, []);

  const logout = useCallback(() => {
    doLogout();
    setIsAuthenticated(false);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
