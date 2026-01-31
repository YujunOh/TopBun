"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
  userName: string | null;
  setUserName: (name: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  userName: null,
  setUserName: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [userName, setUserNameState] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('topbun-user');
    if (stored) setUserNameState(stored);
  }, []);

  const setUserName = (name: string) => {
    localStorage.setItem('topbun-user', name);
    setUserNameState(name);
  };

  const logout = () => {
    localStorage.removeItem('topbun-user');
    setUserNameState(null);
  };

  return (
    <AuthContext.Provider value={{ userName, setUserName, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
