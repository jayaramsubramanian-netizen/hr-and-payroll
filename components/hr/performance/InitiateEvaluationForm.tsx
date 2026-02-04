
import React, { useState } from 'react';

interface InitiateEvaluationFormProps {
  teamMembers: { id: string; name: string }[];
  onSave: (data: { employeeId: string, employeeName: string, evaluationPeriod: string }) => void;
  onCancel: () => void;
}

const InitiateEvaluationForm: React.FC<InitiateEvaluationFormProps> = ({ teamMembers, onSave, onCancel }) => {
  const [employeeId, setEmployeeId] = useState('');
  const [evaluationPeriod, setEvaluationPeriod] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!employeeId || !evaluationPeriod.trim()) {
      setError('Please select an employee and enter an evaluation period.');
      return;
    }
    const selectedEmployee = teamMembers.find(m => m.id === employeeId);
    if (selectedEmployee) {
      onSave({ 
        employeeId, 
        employeeName: selectedEmployee.name, 
        evaluationPeriod 
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="employeeId" className="block text-sm font-medium text-gray-700">Select Employee</label>
        <select
          id="employeeId"
          value={employeeId}
          onChange={(e) => setEmployeeId(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-accent focus:border-brand-accent"
        >
          <option value="">-- Choose an employee --</option>
          {teamMembers.map(member => (
            <option key={member.id} value={member.id}>{member.name}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="evaluationPeriod" className="block text-sm font-medium text-gray-700">Evaluation Period</label>
        <input
          type="text"
          id="evaluationPeriod"
          value={evaluationPeriod}
          onChange={(e) => setEvaluationPeriod(e.target.value)}
          placeholder="e.g., Q4 2024"
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-accent focus:border-brand-accent"
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <footer className="pt-4 flex justify-end space-x-2">
        <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">Cancel</button>
        <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-brand-secondary hover:bg-brand-primary rounded-md">Create Evaluation</button>
      </footer>
    </form>
  );
};

export default InitiateEvaluationForm;
