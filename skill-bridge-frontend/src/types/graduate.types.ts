// src/types/graduate.types.ts
export interface Graduate {
  id: string;
  fullName: string;
  email: string;
  profilePicture?: string;
  headline?: string;
  bio?: string;
  linkedInUrl?: string;
  skills: Skill[];
  jobsCanDo: JobCanDo[];
  education: Education[];
  workExperience: WorkExperience[];
  certifications: Certification[];
}

export interface Skill {
  id: string;
  skillName: string;
  proficiencyLevel: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
}

export interface JobCanDo {
  id: string;
  title: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate?: string;
}

export interface WorkExperience {
  id: string;
  title: string;
  company: string;
  startDate: string;
  endDate?: string;
  description: string;
}

export interface Certification {
  id: string;
  name: string;
  organization: string;
  issueDate: string;
}
