// src/types/auth.types.ts
export type UserRole = 'GRADUATE' | 'EMPLOYER' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  isProfileComplete?: boolean;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  role: UserRole | null;
}
