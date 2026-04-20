import axiosInstance from './axiosInstance';

export const jobService = {
  getAll: () => 
    axiosInstance.get('/jobs'),

  getById: (id: string) => 
    axiosInstance.get(`/jobs/${id}`),

  create: (data: any) => 
    axiosInstance.post('/jobs', data),

  update: (id: string, data: any) => 
    axiosInstance.put(`/jobs/${id}`, data),

  delete: (id: string) => 
    axiosInstance.delete(`/jobs/${id}`)
};
