import axiosInstance from './axiosInstance';

export const graduateService = {
  getAll: () => 
    axiosInstance.get('/graduates'),

  getById: (id: string) => 
    axiosInstance.get(`/graduates/${id}`),

  checkProfileStatus: () =>
    axiosInstance.get('/graduates/me/profile-status'),

  updateProfile: (id: string, data: any) => 
    axiosInstance.put(`/graduates/${id}`, data),

  uploadPdf: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return axiosInstance.post('/graduates/upload-pdf', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  }
};
