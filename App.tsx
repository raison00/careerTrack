
import React, { useState, useEffect, useMemo } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import JobCard from './components/JobCard';
import JobForm from './components/JobForm';
import AIImportView from './components/AIImportView';
import AnalyticsView from './components/AnalyticsView';
import { JobApplication, JobStatus, AppState } from './types';
import { STATUS_ORDER } from './constants';

const LOCAL_STORAGE_KEY = 'career_track_pro_data';

const App: React.FC = () => {
  const [apps, setApps] = useState<JobApplication[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  const [activeView, setActiveView] = useState<AppState['activeView']>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingApp, setEditingApp] = useState<Partial<JobApplication> | undefined>();

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(apps));
  }, [apps]);

  const filteredApps = useMemo(() => {
    return apps.filter(app => 
      app.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.location.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [apps, searchQuery]);

  const handleSaveApp = (newApp: JobApplication) => {
    setApps(prev => {
      const exists = prev.find(a => a.id === newApp.id);
      if (exists) {
        return prev.map(a => a.id === newApp.id ? newApp : a);
      }
      return [...prev, newApp];
    });
    setIsFormOpen(false);
    setEditingApp(undefined);
  };

  const handleDeleteApp = (id: string) => {
    if (window.confirm('Are you sure you want to delete this application?')) {
      setApps(prev => prev.filter(a => a.id !== id));
      setIsFormOpen(false);
      setEditingApp(undefined);
    }
  };

  const handleAIImportSuccess = (parsedData: Partial<JobApplication>) => {
    setEditingApp(parsedData);
    setIsFormOpen(true);
  };

  const openEdit = (app: JobApplication) => {
    setEditingApp(app);
    setIsFormOpen(true);
  };

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard applications={apps} onNavigate={setActiveView} />;
      case 'board':
        return (
          <div className="h-full flex flex-col gap-6">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-slate-900">Kanban Board</h1>
              <div className="relative w-72">
                 <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
                 <input 
                   className="w-full pl-11 pr-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white text-sm"
                   placeholder="Search companies or roles..."
                   value={searchQuery}
                   onChange={e => setSearchQuery(e.target.value)}
                 />
              </div>
            </div>
            <div className="flex gap-6 overflow-x-auto pb-6 h-[calc(100vh-200px)] custom-scrollbar">
              {STATUS_ORDER.map(status => (
                <div key={status} className="flex-shrink-0 w-80 flex flex-col">
                  <div className="flex items-center justify-between mb-4 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                    <span className="font-bold text-slate-700">{status}</span>
                    <span className="bg-slate-100 px-2 py-0.5 rounded-lg text-xs font-bold text-slate-500">
                      {filteredApps.filter(a => a.status === status).length}
                    </span>
                  </div>
                  <div className="space-y-4 flex-1 overflow-y-auto custom-scrollbar pr-2">
                    {filteredApps.filter(a => a.status === status).map(app => (
                      <JobCard key={app.id} application={app} onClick={openEdit} />
                    ))}
                    {filteredApps.filter(a => a.status === status).length === 0 && (
                      <div className="border-2 border-dashed border-slate-200 rounded-2xl h-24 flex items-center justify-center text-slate-300">
                        <i className="fas fa-plus text-xl"></i>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'list':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-slate-900">Job Directory</h1>
              <div className="flex items-center gap-4">
                 <div className="relative w-72">
                   <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
                   <input 
                     className="w-full pl-11 pr-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white text-sm"
                     placeholder="Search directory..."
                     value={searchQuery}
                     onChange={e => setSearchQuery(e.target.value)}
                   />
                </div>
                <button onClick={() => { setEditingApp(undefined); setIsFormOpen(true); }} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl font-bold shadow-lg shadow-blue-500/30 transition-all flex items-center gap-2">
                  <i className="fas fa-plus"></i> New Application
                </button>
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
               <table className="w-full text-left">
                 <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 text-xs font-bold uppercase tracking-wider">
                   <tr>
                     <th className="px-6 py-4">Job Info</th>
                     <th className="px-6 py-4">Status</th>
                     <th className="px-6 py-4">Location</th>
                     <th className="px-6 py-4">Salary Range</th>
                     <th className="px-6 py-4">Applied</th>
                     <th className="px-6 py-4 text-right">Actions</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100">
                   {filteredApps.map(app => (
                     <tr key={app.id} className="hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => openEdit(app)}>
                       <td className="px-6 py-4">
                         <div className="font-bold text-slate-900">{app.role}</div>
                         <div className="text-sm text-slate-500">{app.company}</div>
                       </td>
                       <td className="px-6 py-4">
                         <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${Object.values(JobStatus).includes(app.status) ? '' : 'bg-slate-100'} ${app.status === JobStatus.WISHLIST ? 'bg-slate-100 border-slate-200' : 'bg-blue-50 border-blue-200 text-blue-700'}`}>
                           {app.status}
                         </span>
                       </td>
                       <td className="px-6 py-4 text-sm text-slate-600">
                         {app.location}
                       </td>
                       <td className="px-6 py-4 text-sm text-slate-600">
                         {app.salaryMin && app.salaryMax ? `${app.currency}${app.salaryMin / 1000}k - ${app.salaryMax / 1000}k` : 'Not Set'}
                       </td>
                       <td className="px-6 py-4 text-sm text-slate-600">
                         {new Date(app.dateApplied).toLocaleDateString()}
                       </td>
                       <td className="px-6 py-4 text-right">
                         <button onClick={(e) => { e.stopPropagation(); handleDeleteApp(app.id); }} className="p-2 text-slate-300 hover:text-rose-500 transition-colors">
                           <i className="fas fa-trash-alt"></i>
                         </button>
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
            </div>
          </div>
        );
      case 'import':
        return <AIImportView onSuccess={handleAIImportSuccess} />;
      case 'analytics':
        return <AnalyticsView applications={apps} />;
      default:
        return <div>View coming soon</div>;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      
      <main className="flex-1 p-8 overflow-y-auto max-h-screen custom-scrollbar">
        {renderContent()}
      </main>

      {/* Floating Action Button */}
      <button 
        onClick={() => { setEditingApp(undefined); setIsFormOpen(true); }}
        className="fixed bottom-8 right-8 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-2xl shadow-blue-500/50 flex items-center justify-center text-2xl transition-all transform hover:scale-110 active:scale-95 z-40"
      >
        <i className="fas fa-plus"></i>
      </button>

      {/* Modal Overlay */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto custom-scrollbar">
          <div className="animate-in zoom-in-95 duration-200 w-full max-w-4xl">
            <JobForm 
              application={editingApp} 
              onSave={handleSaveApp} 
              onCancel={() => { setIsFormOpen(false); setEditingApp(undefined); }} 
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
