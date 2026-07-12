import React, { createContext, useContext, useState } from 'react';
import { Navigate } from 'react-router-dom';

interface AuthContextType {
  isAuthenticated: boolean;
  username: string | null;
  login: (user: string, pass: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('sms_auth') === 'true';
  });
  const [username, setUsername] = useState<string | null>(() => {
    return localStorage.getItem('sms_user');
  });

  const login = (user: string, pass: string): boolean => {
    if (user.trim() === 'admin' && pass.trim() === 'admin') {
      setIsAuthenticated(true);
      setUsername(user);
      localStorage.setItem('sms_auth', 'true');
      localStorage.setItem('sms_user', user);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUsername(null);
    localStorage.removeItem('sms_auth');
    localStorage.removeItem('sms_user');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, username, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};
