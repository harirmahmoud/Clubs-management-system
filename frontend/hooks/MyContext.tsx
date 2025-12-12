"use client";
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { User } from "@/lib/types";
import Cookies from 'universal-cookie';

const cookies = new Cookies();

interface AuthContextType {
  token: string | null;
  user: User | null;
  login: (user: { token: string; roles: string[] }) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedToken = cookies.get("authToken");
    if (storedToken) {
      setToken(storedToken);
      // You might want to fetch user data here if the token is valid
    }
  }, []);

  const login = (userData: { token: string; roles: string[] }) => {
    setToken(userData.token);
    cookies.set("authToken", userData.token, { path: "/" });
    cookies.set("userRoles", userData.roles, { path: "/" });
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    cookies.remove("authToken", { path: "/" });
    cookies.remove("userRoles", { path: "/" });
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}