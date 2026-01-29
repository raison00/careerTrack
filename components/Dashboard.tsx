
import React from 'react';
import { JobApplication, JobStatus } from '../types';
import { STATUS_COLORS } from '../constants';

interface DashboardProps {
  applications: JobApplication[];
  onNavigate: (view: any) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ applications, onNavigate }) => {
  const getStatusCount = (status: JobStatus) => 
    applications.filter(app => app.status === status).length;

  const stats = [
    { label: 'Total Apps', value: applications.length, icon: 'fa-paper-plane', color: 'bg-blue-500' },
    { label: 'Interviews', value: getStatusCount(JobStatus.INTERVIEWING), icon: 'fa-comments', color: 'bg-purple-500' },
    { label: 'Offers', value: getStatusCount(JobStatus.OFFER), icon: 'fa-award', color: 'bg-emerald-500' },
    { label: 'Response Rate', value: `${applications.length ? Math.round(((applications.length - getStatusCount(JobStatus.WISHLIST) - getStatusCount(JobStatus.APPLIED)) / applications.length) * 100) : 0}%`, icon: 'fa-percent', color: 'bg-orange-500' },
  ];

  const recentApps = [...applications]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Pipeline Overview</h1>
        <p className="text-slate-500 mt-1">Track your progress and upcoming milestones.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.color} w-12 h-12 rounded-xl flex items-center justify-center text-white`}>
                <i className={`fas ${stat.icon} text-xl`}></i>
              </div>
            </div>
            <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
            <div className="text-sm font-medium text-slate-500">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
            <h2 className="font-bold text-slate-900">Recent Applications</h2>
            <button onClick={() => onNavigate('list')} className="text-sm font-medium text-blue-600 hover:text-blue-700">View All</button>
          </div>
          <div className="divide-y divide-slate-100">
            {recentApps.length > 0 ? (
              recentApps.map((app) => (
                <div key={app.id} className="p-4 hover:bg-slate-50 transition-colors cursor-pointer group">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                        <i className="fas fa-building"></i>
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900">{app.role}</h3>
                        <p className="text-sm text-slate-500">{app.company} • {app.location}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${STATUS_COLORS[app.status]}`}>
                        {app.status}
                      </span>
                      <i className="fas fa-chevron-right text-slate-300"></i>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 text-center text-slate-400">
                <i className="fas fa-folder-open text-4xl mb-3"></i>
                <p>No applications yet. Start by adding one!</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions / Tips */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg">
            <h3 className="font-bold text-lg mb-2">AI Extraction</h3>
            <p className="text-blue-100 text-sm mb-4">Paste a job description or Gmail content to instantly create a tracking entry.</p>
            <button 
              onClick={() => onNavigate('import')}
              className="w-full bg-white/20 hover:bg-white/30 text-white font-semibold py-2 rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <i className="fas fa-magic"></i>
              Try it now
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h3 className="font-bold text-slate-900 mb-4">Quick Tip</h3>
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-amber-100 flex-shrink-0 flex items-center justify-center text-amber-600">
                <i className="fas fa-lightbulb"></i>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                Always record the recruiter's name and LinkedIn profile. It helps in personalized follow-ups after 1 week of silence.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
