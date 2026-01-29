
import React from 'react';
import { JobApplication } from '../types';
import { STATUS_COLORS } from '../constants';

interface JobCardProps {
  application: JobApplication;
  onClick: (app: JobApplication) => void;
}

const JobCard: React.FC<JobCardProps> = ({ application, onClick }) => {
  const compensationText = () => {
    if (application.employmentType === 'FTE') {
      return application.salaryMin && application.salaryMax 
        ? `$${application.salaryMin / 1000}k - ${application.salaryMax / 1000}k`
        : 'Salary TBD';
    } else {
      return application.hourlyRate 
        ? `$${application.hourlyRate}/hr`
        : 'Rate TBD';
    }
  };

  return (
    <div 
      onClick={() => onClick(application)}
      className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-200 transition-all cursor-pointer group"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-tight">
            {application.role}
          </h4>
          <p className="text-xs text-slate-500 font-medium">
            {application.company}
            {application.agencyName && <span className="text-blue-500 italic ml-1">via {application.agencyName}</span>}
          </p>
        </div>
        <div className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${STATUS_COLORS[application.status]}`}>
          {application.status}
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-slate-500 text-xs">
          <i className="fas fa-location-dot w-3"></i>
          <span>{application.location} • {application.workSetting}{application.workSetting === 'Hybrid' && ` (${application.commuteDays}d)`}</span>
        </div>
        <div className="flex items-center gap-2 text-slate-500 text-xs">
          <i className="fas fa-briefcase w-3"></i>
          <span className="font-semibold text-slate-700">{application.employmentType}</span>
          <span className="text-slate-300">|</span>
          <i className="fas fa-money-bill-wave w-3"></i>
          <span>{compensationText()}</span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-slate-50">
        <div className="flex -space-x-2">
          {application.interviews.length > 0 && (
            <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 border-2 border-white ring-1 ring-purple-100">
               <i className="fas fa-calendar-check text-[10px]"></i>
            </div>
          )}
          {application.contacts.length > 0 && (
            <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 border-2 border-white ring-1 ring-blue-100">
               <i className="fas fa-user text-[10px]"></i>
            </div>
          )}
        </div>
        <span className="text-[10px] font-medium text-slate-400">
          Updated {new Date(application.updatedAt).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
};

export default JobCard;
