// src/types/job.types.ts
export interface JobPosting {
  id: string;
  title: string;
  description: string;
  requiredSkills: string[];
  isActive: boolean;
  createdAt: string;
  employer: {
    id: string;
    companyName: string;
    profilePicture?: string;
  };
}
