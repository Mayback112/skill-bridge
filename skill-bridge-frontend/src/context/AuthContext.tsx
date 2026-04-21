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
    isLoading: true,
  });

  useEffect(() => {
    const initAuth = async () => {
      console.log('Initializing Auth...');
      // Try sessionStorage first, then localStorage
      const token = sessionStorage.getItem('token') || localStorage.getItem('token');
      const userJson = sessionStorage.getItem('user') || localStorage.getItem('user');
      
      if (token && userJson) {
        try {
          // First set state from local data so UI shows something immediately if needed
          const localUser = JSON.parse(userJson) as User;
          setAuthState({
            user: localUser,
            token,
            isAuthenticated: true,
            role: localUser.role,
            isLoading: true, // Keep loading while we verify with backend
          });

          const { authService } = await import('../api');
          const response = await authService.getCurrentUser();
          
          if (response.data.success) {
            const user = response.data.data;
            // Update both storage types
            localStorage.setItem('user', JSON.stringify(user));
            sessionStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('token', token);
            sessionStorage.setItem('token', token);
            
            setAuthState({
              user,
              token,
              isAuthenticated: true,
              role: user.role,
              isLoading: false,
            });
            console.log('Auth initialized successfully');
            return;
          }
        } catch (error) {
          console.error('Failed to sync user on load', error);
          // If it's a 401, we should definitely logout
          logout();
        }
      } else {
        console.log('No saved session found');
      }
      
      setAuthState(prev => ({ ...prev, isLoading: false }));
    };
    initAuth();
  }, []);

  const login = (token: string, user: User) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    sessionStorage.setItem('token', token);
    sessionStorage.setItem('user', JSON.stringify(user));
    setAuthState({
      user,
      token,
      isAuthenticated: true,
      role: user.role,
      isLoading: false,
    });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    setAuthState({
      user: null,
      token: null,
      isAuthenticated: false,
      role: null,
      isLoading: false,
    });
  };

  const setUser = (user: User) => {
    localStorage.setItem('user', JSON.stringify(user));
    sessionStorage.setItem('user', JSON.stringify(user));
    setAuthState(prev => ({ ...prev, user, role: user.role }));
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
