import axiosInstance from './axiosInstance';

export const employerService = {
  getById: (id: string) => 
    axiosInstance.get(`/employers/${id}`),
    
  updateProfile: (id: string, data: any) => 
    axiosInstance.put(`/employers/${id}`, data)
};
