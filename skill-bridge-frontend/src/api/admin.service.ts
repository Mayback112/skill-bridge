import axiosInstance from './axiosInstance';

export const adminService = {
  getStats: () => 
    axiosInstance.get('/admin/stats'),

  deleteGraduate: (id: string) => 
    axiosInstance.delete(`/admin/graduates/${id}`),

  deleteJob: (id: string) => 
    axiosInstance.delete(`/admin/jobs/${id}`)
};
