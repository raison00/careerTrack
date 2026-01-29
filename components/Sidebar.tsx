
import React from 'react';

interface SidebarProps {
  activeView: string;
  setActiveView: (view: any) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'fa-chart-pie' },
    { id: 'board', label: 'Kanban Board', icon: 'fa-columns' },
    { id: 'list', label: 'Job List', icon: 'fa-list-ul' },
    { id: 'analytics', label: 'Analytics', icon: 'fa-chart-line' },
    { id: 'import', label: 'AI Import', icon: 'fa-wand-magic-sparkles' },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 h-screen sticky top-0 flex flex-col border-r border-slate-800">
      <div className="p-6">
        <div className="flex items-center gap-3 text-white mb-8">
          <div className="bg-blue-600 w-10 h-10 rounded-lg flex items-center justify-center">
            <i className="fas fa-briefcase text-xl"></i>
          </div>
          <span className="text-xl font-bold tracking-tight">CareerTrack<span className="text-blue-500">Pro</span></span>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                activeView === item.id
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
                  : 'hover:bg-slate-800 hover:text-white'
              }`}
            >
              <i className={`fas ${item.icon} w-5`}></i>
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-6">
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
          <p className="text-xs text-slate-400 mb-2 uppercase tracking-wider font-semibold">Cloud Sync</p>
          <div className="flex items-center justify-between">
             <span className="text-sm">Local Storage Only</span>
             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
