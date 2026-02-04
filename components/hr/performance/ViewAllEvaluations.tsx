
import React from 'react';
import { PerformanceEvaluation } from '../../../types';

interface ViewAllEvaluationsProps {
  evaluations: PerformanceEvaluation[];
  onViewEvaluation: (evaluation: PerformanceEvaluation) => void;
}

const statusBadge = (status: PerformanceEvaluation['status']) => {
    const base = "px-2 py-1 text-xs font-semibold rounded-full";
    switch (status) {
        case 'Pending Manager Review': return `${base} bg-blue-100 text-blue-800`;
        case 'Pending Employee Comments': return `${base} bg-yellow-100 text-yellow-800`;
        case 'Pending HR Finalization': return `${base} bg-purple-100 text-purple-800`;
        case 'Completed': return `${base} bg-green-100 text-green-800`;
        default: return `${base} bg-gray-100 text-gray-800`;
    }
};

const ViewAllEvaluations: React.FC<ViewAllEvaluationsProps> = ({ evaluations, onViewEvaluation }) => {
  return (
    <div className="w-full">
      <div className="overflow-x-auto border rounded-lg max-h-[60vh]">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 sticky top-0">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Period</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {evaluations.map((ev) => (
              <tr key={ev.id}>
                <td className="px-4 py-4 text-sm font-medium text-gray-900">{ev.employeeName}</td>
                <td className="px-4 py-4 text-sm text-gray-500">{ev.evaluationPeriod}</td>
                <td className="px-4 py-4 text-sm"><span className={statusBadge(ev.status)}>{ev.status}</span></td>
                <td className="px-4 py-4 text-right">
                    <button onClick={() => onViewEvaluation(ev)} className="text-sm font-medium text-brand-secondary hover:text-brand-primary">
                        View
                    </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewAllEvaluations;
