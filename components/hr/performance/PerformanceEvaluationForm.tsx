
import React, { useState } from 'react';
import { PerformanceEvaluation, UserRole } from '../../../types';

interface PerformanceEvaluationFormProps {
  evaluation: PerformanceEvaluation;
  userRole: UserRole;
  onSave: (data: any) => void;
}

const kpiConfig = [
  { key: 'quality', label: 'Quality of Work', description: 'Accuracy, precision, adherence to specs, low rejection rate.' },
  { key: 'productivity', label: 'Productivity', description: 'Output volume, meeting targets, machine uptime.' },
  { key: 'technicalSkills', label: 'Technical Skills', description: 'Machine operation, setup, troubleshooting, tool knowledge.' },
  { key: 'safety', label: 'Safety Compliance', description: 'Adherence to protocols, use of PPE, clean workspace.' },
  { key: 'teamwork', label: 'Teamwork & Communication', description: 'Collaboration with colleagues, clear communication.' },
];

const RatingInput: React.FC<{ label: string, value: number, onChange?: (value: number) => void, readOnly: boolean }> = 
({ label, value, onChange, readOnly }) => (
  <div className="flex items-center justify-between">
    <span className="text-slate-700">{label}</span>
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map(v => (
        <button
          key={v}
          type="button"
          onClick={() => !readOnly && onChange?.(v)}
          className={`w-8 h-8 rounded-full text-sm font-bold transition-colors ${
            value >= v ? 'bg-brand-primary text-white' : 'bg-slate-200 text-slate-600'
          } ${!readOnly ? 'hover:bg-blue-700 hover:text-white' : 'cursor-default'}`}
          disabled={readOnly}
        >
          {v}
        </button>
      ))}
    </div>
  </div>
);


const PerformanceEvaluationForm: React.FC<PerformanceEvaluationFormProps> = ({ evaluation, userRole, onSave }) => {
  const isManager = userRole === UserRole.MANAGER;
  const isEmployee = userRole === UserRole.EMPLOYEE;
  const isHr = userRole === UserRole.HR_PAYROLL;

  const [formData, setFormData] = useState({
    kpis: evaluation.kpis,
    managerComments: evaluation.managerComments,
    employeeComments: evaluation.employeeComments,
    goals: evaluation.goals,
  });

  const handleKpiChange = (key: string, value: number) => {
    setFormData(prev => ({ ...prev, kpis: { ...prev.kpis, [key]: value } }));
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      const [section, field] = name.split('.');
      if (field) {
          setFormData(prev => ({ ...prev, [section]: { ...(prev as any)[section], [field]: value } }));
      } else {
          setFormData(prev => ({...prev, [name]: value }));
      }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-slate-800">Employee: {evaluation.employeeName}</h3>
        <p className="text-sm text-slate-500">Evaluation for period: {evaluation.evaluationPeriod}</p>
      </div>

      <div className="p-4 border border-slate-200 rounded-lg">
        <h4 className="text-md font-semibold mb-3 text-slate-700">Key Performance Indicators (1=Poor, 5=Excellent)</h4>
        <div className="space-y-3">
          {kpiConfig.map(kpi => (
            <RatingInput 
                key={kpi.key} 
                label={kpi.label} 
                value={(formData.kpis as any)[kpi.key]}
                onChange={(v) => handleKpiChange(kpi.key, v)}
                readOnly={!isManager}
            />
          ))}
        </div>
      </div>

      <div className="p-4 border border-slate-200 rounded-lg">
        <h4 className="text-md font-semibold mb-2 text-slate-700">Manager's Comments</h4>
        <div>
          <label className="text-sm font-medium text-slate-600">Strengths</label>
          <textarea name="managerComments.strengths" value={formData.managerComments.strengths} onChange={handleChange} readOnly={!isManager} rows={3} className="mt-1 w-full border-slate-300 rounded-md shadow-sm read-only:bg-slate-50"></textarea>
        </div>
         <div className="mt-2">
          <label className="text-sm font-medium text-slate-600">Areas for Improvement</label>
          <textarea name="managerComments.improvements" value={formData.managerComments.improvements} onChange={handleChange} readOnly={!isManager} rows={3} className="mt-1 w-full border-slate-300 rounded-md shadow-sm read-only:bg-slate-50"></textarea>
        </div>
      </div>
       <div className="p-4 border border-slate-200 rounded-lg">
        <h4 className="text-md font-semibold mb-2 text-slate-700">Employee's Self-Assessment & Comments</h4>
        <textarea name="employeeComments" value={formData.employeeComments} onChange={handleChange} readOnly={!isEmployee} rows={4} className="mt-1 w-full border-slate-300 rounded-md shadow-sm read-only:bg-slate-50" placeholder={isEmployee ? "Enter your comments here..." : "Awaiting employee comments..."}></textarea>
      </div>

      <footer className="pt-4 flex justify-end">
        { (isManager || isEmployee || isHr) &&
            <button type="submit" className="px-6 py-2 font-medium text-white bg-brand-primary rounded-md hover:bg-blue-700">
              {isManager && 'Submit for Employee Review'}
              {isEmployee && 'Submit My Comments'}
              {isHr && 'Finalize and Close Evaluation'}
            </button>
        }
      </footer>
    </form>
  );
};

export default PerformanceEvaluationForm;