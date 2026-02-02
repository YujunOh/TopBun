"use client";
import { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import type { Session } from 'next-auth';

interface AuthContextType {
  session: Session | null;
  status: 'loading' | 'authenticated' | 'unauthenticated';
  user: Session['user'] | null;
  isLoginOpen: boolean;
  openLogin: () => void;
  closeLogin: () => void;
  setLoginOpen: (open: boolean) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  status: 'unauthenticated',
  user: null,
  isLoginOpen: false,
  openLogin: () => {},
  closeLogin: () => {},
  setLoginOpen: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const user = session?.user ?? null;
  const [isLoginOpen, setLoginOpen] = useState(false);

  useEffect(() => {
    if (status === 'authenticated') {
      setLoginOpen(false);
    }
  }, [status]);

  const openLogin = () => setLoginOpen(true);
  const closeLogin = () => setLoginOpen(false);

  const logout = () => {
    signOut();
  };

  return (
    <AuthContext.Provider
      value={{ session, status, user, isLoginOpen, openLogin, closeLogin, setLoginOpen, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
