
import React, { useState } from 'react';
import { JobApplication, JobStatus, EmploymentType } from '../types';
import { STATUS_ORDER, WORK_SETTING_OPTIONS, EMPLOYMENT_TYPE_OPTIONS } from '../constants';

interface JobFormProps {
  application?: Partial<JobApplication>;
  onSave: (app: JobApplication) => void;
  onCancel: () => void;
}

const JobForm: React.FC<JobFormProps> = ({ application, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Partial<JobApplication>>({
    id: crypto.randomUUID(),
    company: '',
    role: '',
    status: JobStatus.WIP,
    employmentType: 'FTE',
    salaryMin: undefined,
    salaryMax: undefined,
    hourlyRate: undefined,
    contractDuration: '',
    agencyName: '',
    location: '',
    workSetting: 'Remote',
    commuteDays: 0,
    dateApplied: new Date().toISOString().split('T')[0],
    description: '',
    requirements: [],
    benefits: [],
    contacts: [],
    interviews: [],
    notes: '',
    updatedAt: new Date().toISOString(),
    ...application
  });

  const [newReq, setNewReq] = useState('');

  const handleAddRequirement = () => {
    if (newReq.trim()) {
      setFormData(prev => ({ ...prev, requirements: [...(prev.requirements || []), newReq.trim()] }));
      setNewReq('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.company && formData.role) {
      onSave({
        ...formData,
        updatedAt: new Date().toISOString(),
      } as JobApplication);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-xl max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">{application?.id ? 'Edit Position' : 'New Position'}</h2>
          <p className="text-sm text-slate-500">Keep track of every detail for your next career move.</p>
        </div>
        <button onClick={onCancel} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
          <i className="fas fa-times text-slate-400"></i>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Company Name *</label>
            <input
              required
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.company}
              onChange={e => setFormData({ ...formData, company: e.target.value })}
              placeholder="e.g. Google"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Role / Title *</label>
            <input
              required
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.role}
              onChange={e => setFormData({ ...formData, role: e.target.value })}
              placeholder="e.g. Senior Product Manager"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Agency Name (Optional)</label>
            <input
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.agencyName}
              onChange={e => setFormData({ ...formData, agencyName: e.target.value })}
              placeholder="e.g. Robert Half"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Status</label>
            <select
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
              value={formData.status}
              onChange={e => setFormData({ ...formData, status: e.target.value as JobStatus })}
            >
              {STATUS_ORDER.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        <div className="p-4 bg-slate-50 rounded-xl space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Employment Type</label>
              <select
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                value={formData.employmentType}
                onChange={e => setFormData({ ...formData, employmentType: e.target.value as EmploymentType })}
              >
                {EMPLOYMENT_TYPE_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
            
            {formData.employmentType === 'FTE' ? (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Min Salary (k)</label>
                  <input
                    type="number"
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    value={formData.salaryMin || ''}
                    onChange={e => setFormData({ ...formData, salaryMin: parseInt(e.target.value) || undefined })}
                    placeholder="e.g. 120"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Max Salary (k)</label>
                  <input
                    type="number"
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    value={formData.salaryMax || ''}
                    onChange={e => setFormData({ ...formData, salaryMax: parseInt(e.target.value) || undefined })}
                    placeholder="e.g. 150"
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Hourly Rate ($)</label>
                  <input
                    type="number"
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    value={formData.hourlyRate || ''}
                    onChange={e => setFormData({ ...formData, hourlyRate: parseInt(e.target.value) || undefined })}
                    placeholder="e.g. 85"
                  />
                </div>
                {formData.employmentType === 'Contract' && (
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Duration</label>
                    <input
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      value={formData.contractDuration}
                      onChange={e => setFormData({ ...formData, contractDuration: e.target.value })}
                      placeholder="e.g. 6 Months"
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Work Setting</label>
            <select
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
              value={formData.workSetting}
              onChange={e => setFormData({ ...formData, workSetting: e.target.value as any })}
            >
              {WORK_SETTING_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Commute Days (per week)</label>
            <div className="flex items-center gap-4">
               <input
                type="range"
                min="0"
                max="5"
                className="flex-1 accent-blue-600"
                value={formData.commuteDays || 0}
                onChange={e => setFormData({ ...formData, commuteDays: parseInt(e.target.value) })}
              />
              <span className="w-8 text-center font-bold text-blue-600">{formData.commuteDays}</span>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Location</label>
            <input
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.location}
              onChange={e => setFormData({ ...formData, location: e.target.value })}
              placeholder="e.g. Austin, TX"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Date Applied</label>
            <input
              type="date"
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.dateApplied}
              onChange={e => setFormData({ ...formData, dateApplied: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700">Key Requirements</label>
          <div className="flex gap-2">
            <input
              className="flex-1 px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={newReq}
              onChange={e => setNewReq(e.target.value)}
              placeholder="Add a required skill..."
              onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddRequirement())}
            />
            <button type="button" onClick={handleAddRequirement} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors">Add</button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.requirements?.map((req, i) => (
              <span key={i} className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full flex items-center gap-2">
                {req}
                <i onClick={() => setFormData(prev => ({ ...prev, requirements: prev.requirements?.filter((_, idx) => idx !== i) }))} className="fas fa-times cursor-pointer hover:text-blue-900"></i>
              </span>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700">Notes / Interview Details</label>
          <textarea
            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none min-h-[100px]"
            value={formData.notes}
            onChange={e => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Talked to recruiter Jane, technical round focused on system design..."
          ></textarea>
        </div>

        <div className="flex justify-end gap-4 pt-4 border-t border-slate-100">
           <button 
             type="button"
             onClick={onCancel}
             className="px-6 py-2 text-slate-600 font-semibold hover:bg-slate-50 rounded-xl transition-colors"
           >
             Cancel
           </button>
           <button 
             type="submit"
             className="px-8 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 transition-all"
           >
             Save Position
           </button>
        </div>
      </form>
    </div>
  );
};

export default JobForm;
