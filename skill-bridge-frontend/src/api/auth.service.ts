import axiosInstance from './axiosInstance';
import { 
  GraduateLoginRequest, 
  GraduateRegisterRequest, 
  AdminLoginRequest, 
  AuthResponse 
} from '../types/auth.types';

export const authService = {
  graduateRegister: (data: GraduateRegisterRequest) => 
    axiosInstance.post('/auth/graduate/register', data),

  graduateLogin: (data: GraduateLoginRequest) => 
    axiosInstance.post<any>('/auth/graduate/login', data),

  login: (data: GraduateLoginRequest) => 
    axiosInstance.post<any>('/auth/login', data),

  verifyEmail: (token: string) => 
    axiosInstance.get(`/auth/graduate/verify-email?token=${token}`),

  adminLogin: (data: AdminLoginRequest) => 
    axiosInstance.post<any>('/auth/admin/login', data),

  getCurrentUser: () => 
    axiosInstance.get('/auth/me'),

  googleLogin: () => {
    const baseURL = axiosInstance.defaults.baseURL || '/api';
    const backendUrl = baseURL.endsWith('/api') ? baseURL.slice(0, -4) : baseURL;
    window.location.href = `${backendUrl}/oauth2/authorization/google`;
  }
};
