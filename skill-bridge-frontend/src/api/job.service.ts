import axiosInstance from './axiosInstance';

export const jobService = {
  getAll: () => 
    axiosInstance.get('/jobs'),

  getMyJobs: () =>
    axiosInstance.get('/jobs/my-jobs'),

  getById: (id: string) => 
    axiosInstance.get(`/jobs/${id}`),

  getRecommendations: () =>
    axiosInstance.get('/jobs/recommendations'),

  create: (data: any) => 
    axiosInstance.post('/jobs', data),

  update: (id: string, data: any) => 
    axiosInstance.put(`/jobs/${id}`, data),

  delete: (id: string) => 
    axiosInstance.delete(`/jobs/${id}`),

  apply: (jobId: string) =>
    axiosInstance.post(`/job-applications/apply/${jobId}`),

  getApplications: (jobId: string) =>
    axiosInstance.get(`/job-applications/job/${jobId}`),

  getMyApplications: () =>
    axiosInstance.get('/job-applications/my-applications'),

  updateApplicationStatus: (applicationId: string, status: string) =>
    axiosInstance.put(`/job-applications/${applicationId}/status`, { status })
};
