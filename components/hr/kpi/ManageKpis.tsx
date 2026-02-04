
import React, { useState } from 'react';
import { KPI, UserRole } from '../../../types';
import { EditIcon } from '../../shared/Icons';
import KpiForm from './KpiForm';

interface ManageKpisProps {
  allKpis: KPI[];
  onSave: (kpiData: Omit<KPI, 'id'> & { id?: string }) => void;
  userRole: UserRole;
}

const ManageKpis: React.FC<ManageKpisProps> = ({ allKpis, onSave, userRole }) => {
  const [editingKpi, setEditingKpi] = useState<KPI | 'new' | null>(null);

  const handleSave = (kpiData: Omit<KPI, 'id'> & { id?: string }) => {
    onSave(kpiData);
    setEditingKpi(null);
  };

  if (editingKpi) {
    return (
      <KpiForm
        kpi={editingKpi === 'new' ? undefined : editingKpi}
        onSave={handleSave}
        onCancel={() => setEditingKpi(null)}
        userRole={userRole}
      />
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-slate-800">Company KPIs</h3>
        <button
          onClick={() => setEditingKpi('new')}
          className="px-4 py-2 text-sm font-medium text-white bg-brand-primary hover:bg-blue-700 rounded-md"
        >
          Add New KPI
        </button>
      </div>
      <div className="max-h-96 overflow-y-auto border border-slate-200 rounded-md">
        <ul className="divide-y divide-slate-200">
          {allKpis.map(kpi => (
            <li key={kpi.id} className="p-3 flex justify-between items-center">
              <div>
                <p className="font-semibold text-brand-primary">{kpi.name}</p>
                <p className="text-sm text-slate-500">
                  Dashboard: <span className="font-medium text-slate-700">{kpi.dashboard}</span>
                </p>
              </div>
              <button
                onClick={() => setEditingKpi(kpi)}
                className="p-2 text-slate-500 hover:text-brand-secondary rounded-full hover:bg-slate-100"
                aria-label={`Edit ${kpi.name}`}
              >
                <EditIcon className="h-5 w-5" />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ManageKpis;
