import axiosInstance from './axiosInstance';

export const courseService = {
  getAll: (skillTag?: string) => 
    axiosInstance.get('/courses', { params: { skillTag } }),

  add: (data: any) => 
    axiosInstance.post('/courses', data),

  delete: (id: string) => 
    axiosInstance.delete(`/courses/${id}`)
};
