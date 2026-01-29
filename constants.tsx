
import { JobStatus, EmploymentType } from './types';

export const STATUS_COLORS: Record<JobStatus, string> = {
  [JobStatus.WIP]: 'bg-slate-200 text-slate-600 border-slate-300',
  [JobStatus.WISHLIST]: 'bg-slate-100 text-slate-700 border-slate-200',
  [JobStatus.APPLIED]: 'bg-blue-100 text-blue-700 border-blue-200',
  [JobStatus.INTERVIEWING]: 'bg-purple-100 text-purple-700 border-purple-200',
  [JobStatus.OFFER]: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  [JobStatus.REJECTED]: 'bg-rose-100 text-rose-700 border-rose-200',
  [JobStatus.GHOSTED]: 'bg-orange-100 text-orange-700 border-orange-200',
};

export const STATUS_ORDER: JobStatus[] = [
  JobStatus.WIP,
  JobStatus.WISHLIST,
  JobStatus.APPLIED,
  JobStatus.INTERVIEWING,
  JobStatus.OFFER,
  JobStatus.REJECTED,
  JobStatus.GHOSTED
];

export const WORK_SETTING_OPTIONS = ['Remote', 'Hybrid', 'On-site'] as const;

export const EMPLOYMENT_TYPE_OPTIONS: EmploymentType[] = ['FTE', 'Contract', 'Hourly W2'];
