import { CourseResource } from "./course.types";

// src/types/graduate.types.ts
export interface Graduate {
  id: string;
  fullName: string;
  email: string;
  profilePicture?: string;
  headline?: string;
  bio?: string;
  linkedInUrl?: string;
  isVerified: boolean;
  skills: Skill[];
  jobsCanDo: string[];
  educations: Education[];
  workExperiences: WorkExperience[];
  certifications: Certification[];
  recommendedCourses?: CourseResource[];
  createdAt: string;
}

export interface Skill {
  id: string;
  skillName: string;
  proficiencyLevel: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy?: string;
  startDate: string;
  endDate?: string;
}

export interface WorkExperience {
  id: string;
  jobTitle: string;
  company: string;
  startDate: string;
  endDate?: string;
  description: string;
}

export interface Certification {
  id: string;
  name: string;
  issuingOrganization?: string;
  issueDate?: string;
}
