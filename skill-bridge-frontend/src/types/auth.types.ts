// src/types/auth.types.ts
export type UserRole = 'GRADUATE' | 'EMPLOYER' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  isProfileComplete?: boolean;
  headline?: string;
  skills?: any[];
  [key: string]: any; // Allow for extra properties from full profiles
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  role: UserRole | null;
  isLoading: boolean;
}

export interface GraduateLoginRequest {
  email: string;
  password?: string;
}

export interface GraduateRegisterRequest {
  fullName: string;
  email: string;
  password?: string;
}

export interface AdminLoginRequest {
  email: string;
  password?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
