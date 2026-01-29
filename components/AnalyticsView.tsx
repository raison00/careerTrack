
import React, { useMemo } from 'react';
import { JobApplication, JobStatus } from '../types';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area 
} from 'recharts';

interface AnalyticsViewProps {
  applications: JobApplication[];
}

const AnalyticsView: React.FC<AnalyticsViewProps> = ({ applications }) => {
  const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#64748b'];

  const statusData = useMemo(() => {
    const counts: Record<string, number> = {};
    applications.forEach(app => {
      counts[app.status] = (counts[app.status] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [applications]);

  const salaryData = useMemo(() => {
    return applications
      .filter(app => app.employmentType === 'FTE' && app.salaryMin && app.salaryMax)
      .map(app => ({
        company: app.company,
        min: app.salaryMin,
        max: app.salaryMax,
        avg: ((app.salaryMin || 0) + (app.salaryMax || 0)) / 2
      }))
      .sort((a, b) => b.avg - a.avg);
  }, [applications]);

  const timelineData = useMemo(() => {
    const byDate: Record<string, number> = {};
    applications.forEach(app => {
      const date = app.dateApplied.substring(0, 7); // YYYY-MM
      byDate[date] = (byDate[date] || 0) + 1;
    });
    return Object.entries(byDate)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [applications]);

  const exportToCSV = () => {
    const headers = ['Company', 'Agency', 'Role', 'Status', 'Type', 'Min Salary', 'Max Salary', 'Hourly Rate', 'Location', 'Commute Days', 'Date Applied'];
    const rows = applications.map(app => [
      app.company,
      app.agencyName || '',
      app.role,
      app.status,
      app.employmentType,
      app.salaryMin || '',
      app.salaryMax || '',
      app.hourlyRate || '',
      app.location,
      app.commuteDays || '0',
      app.dateApplied
    ]);
    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n" 
      + rows.map(e => e.join(",")).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `career_track_metrics_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Performance Analytics</h1>
          <p className="text-slate-500 mt-1">Insights into your job search pipeline.</p>
        </div>
        <button 
          onClick={exportToCSV}
          className="bg-white border border-slate-200 px-4 py-2 rounded-xl text-slate-700 font-semibold hover:bg-slate-50 shadow-sm flex items-center gap-2"
        >
          <i className="fas fa-file-export text-slate-400"></i>
          Export to Sheets (CSV)
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Status Distribution */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-6">Status Breakdown</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
             {statusData.map((entry, index) => (
               <div key={entry.name} className="flex items-center gap-2">
                 <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                 <span className="text-xs text-slate-600 font-medium">{entry.name}: {entry.value}</span>
               </div>
             ))}
          </div>
        </div>

        {/* Application Volume */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-6">Application Volume</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timelineData}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="count" stroke="#3b82f6" fillOpacity={1} fill="url(#colorCount)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Salary Benchmark */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm lg:col-span-2">
          <h3 className="font-bold text-slate-800 mb-6">FTE Salary Comparison (Average)</h3>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salaryData} layout="vertical" margin={{ left: 50 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis type="category" dataKey="company" stroke="#475569" fontSize={12} width={150} />
                <Tooltip 
                   formatter={(value: any) => [`$${value.toLocaleString()}`, 'Avg Salary']}
                   contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="avg" fill="#3b82f6" radius={[0, 8, 8, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsView;
