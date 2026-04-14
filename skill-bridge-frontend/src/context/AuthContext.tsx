import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole, AuthState } from '../types/auth.types';

interface AuthContextType extends AuthState {
  login: (token: string, user: User) => void;
  logout: () => void;
  setUser: (user: User) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    role: null,
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userJson = localStorage.getItem('user');
    if (token && userJson) {
      const user = JSON.parse(userJson) as User;
      setAuthState({
        user,
        token,
        isAuthenticated: true,
        role: user.role,
      });
    }
  }, []);

  const login = (token: string, user: User) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setAuthState({
      user,
      token,
      isAuthenticated: true,
      role: user.role,
    });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setAuthState({
      user: null,
      token: null,
      isAuthenticated: false,
      role: null,
    });
  };

  const setUser = (user: User) => {
    localStorage.setItem('user', JSON.stringify(user));
    setAuthState(prev => ({ ...prev, user, role: user.role }));
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
