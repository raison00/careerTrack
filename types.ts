
export enum JobStatus {
  WIP = 'WIP',
  WISHLIST = 'Wishlist',
  APPLIED = 'Applied',
  INTERVIEWING = 'Interviewing',
  OFFER = 'Offer',
  REJECTED = 'Rejected',
  GHOSTED = 'Ghosted'
}

export type EmploymentType = 'FTE' | 'Contract' | 'Hourly W2';

export interface Contact {
  name: string;
  role: string;
  email: string;
  linkedin?: string;
}

export interface InterviewRound {
  id: string;
  roundName: string;
  date: string;
  type: 'Phone Screen' | 'Technical' | 'Behavioral' | 'Case Study' | 'On-site' | 'HR';
  interviewer?: string;
  notes: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled';
}

export interface JobApplication {
  id: string;
  company: string;
  role: string;
  status: JobStatus;
  employmentType: EmploymentType;
  salaryMin?: number;
  salaryMax?: number;
  hourlyRate?: number;
  contractDuration?: string;
  agencyName?: string;
  location: string;
  workSetting: 'Remote' | 'Hybrid' | 'On-site';
  commuteDays?: number;
  dateApplied: string;
  url?: string;
  description: string;
  benefits: string[];
  requirements: string[];
  contacts: Contact[];
  interviews: InterviewRound[];
  notes: string;
  updatedAt: string;
}

export interface AppState {
  applications: JobApplication[];
  activeView: 'dashboard' | 'board' | 'list' | 'analytics' | 'import';
  searchQuery: string;
}
