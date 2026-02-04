
import React, { useState } from 'react';
import { KPI, UserRole } from '../../../types';

interface KpiFormProps {
  kpi?: KPI;
  onSave: (kpiData: Omit<KPI, 'id'> & { id?: string }) => void;
  onCancel: () => void;
  userRole: UserRole;
}

const KpiForm: React.FC<KpiFormProps> = ({ kpi, onSave, onCancel, userRole }) => {
  const [formData, setFormData] = useState<Omit<KPI, 'id'>>({
    name: kpi?.name || '',
    value: kpi?.value || '',
    target: kpi?.target || '',
    progress: kpi?.progress || 50,
    lowerIsBetter: kpi?.lowerIsBetter || false,
    trend: kpi?.trend || 'stable',
    dashboard: kpi?.dashboard || (userRole === UserRole.MANAGER ? 'Manager' : 'HR'),
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };
  
  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, progress: parseInt(e.target.value, 10) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ id: kpi?.id, ...formData });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-lg font-medium text-slate-800">{kpi ? 'Edit KPI' : 'Add New KPI'}</h3>
      
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-slate-700">KPI Name</label>
        <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full border-slate-300 rounded-md shadow-sm"/>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
            <label htmlFor="value" className="block text-sm font-medium text-slate-700">Current Value</label>
            <input type="text" name="value" id="value" value={formData.value} onChange={handleChange} placeholder="e.g., 96% or 32 Days" className="mt-1 block w-full border-slate-300 rounded-md shadow-sm"/>
        </div>
        <div>
            <label htmlFor="target" className="block text-sm font-medium text-slate-700">Target Description</label>
            <input type="text" name="target" id="target" value={formData.target} onChange={handleChange} placeholder="e.g., Target: > 95%" className="mt-1 block w-full border-slate-300 rounded-md shadow-sm"/>
        </div>
      </div>
      
      <div>
        <label htmlFor="progress" className="block text-sm font-medium text-slate-700">Progress Bar ({formData.progress}%)</label>
        <input type="range" name="progress" id="progress" min="0" max="100" value={formData.progress} onChange={handleProgressChange} className="mt-1 w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
            <label htmlFor="trend" className="block text-sm font-medium text-slate-700">Trend</label>
            <select name="trend" id="trend" value={formData.trend} onChange={handleChange} className="mt-1 block w-full border-slate-300 rounded-md shadow-sm">
                <option value="up">Up</option>
                <option value="down">Down</option>
                <option value="stable">Stable</option>
            </select>
        </div>
        <div>
            <label htmlFor="dashboard" className="block text-sm font-medium text-slate-700">Show on Dashboard</label>
            <select 
                name="dashboard" 
                id="dashboard" 
                value={formData.dashboard} 
                onChange={handleChange} 
                className="mt-1 block w-full border-slate-300 rounded-md shadow-sm disabled:bg-slate-100 disabled:text-slate-500"
                disabled={userRole === UserRole.MANAGER}
            >
                <option value="HR">HR</option>
                <option value="Manager">Manager</option>
            </select>
        </div>
      </div>
      
      <div>
        <label className="flex items-center space-x-2">
            <input type="checkbox" name="lowerIsBetter" checked={formData.lowerIsBetter} onChange={handleChange} className="rounded border-slate-300 text-brand-secondary focus:ring-brand-accent"/>
            <span className="text-sm font-medium text-slate-700">Lower Value is Better</span>
        </label>
      </div>

      <footer className="pt-4 flex justify-end space-x-2 border-t border-slate-200">
        <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50">Cancel</button>
        <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-brand-primary hover:bg-blue-700 rounded-md">Save KPI</button>
      </footer>
    </form>
  );
};

export default KpiForm;
