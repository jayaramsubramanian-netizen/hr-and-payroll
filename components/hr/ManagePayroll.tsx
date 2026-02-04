
import React from 'react';
import { User, UserRole } from '../../types';

// In a real app, this would be fetched from the main state
const mockUsers: User[] = [
  { 
    id: 'EMP001', name: 'Arjun Sharma', role: UserRole.EMPLOYEE, department: 'Machining',
    payroll: { basic: 30000, hra: 15000, allowances: 5000 },
    eligibility: {
        pf: { enabled: true, valueType: 'PERCENTAGE', value: 12 },
        esi: { enabled: true, valueType: 'FLAT_RUPEE', value: 375 },
        bonus: { enabled: true, valueType: 'PERCENTAGE', value: 8.33 },
        medicalInsurance: { enabled: false, valueType: 'FLAT_RUPEE', value: 0 }
    }
  },
  { 
    id: 'EMP002', name: 'Sunita Devi', role: UserRole.EMPLOYEE, department: 'Machining',
    payroll: { basic: 32000, hra: 16000, allowances: 4000 },
    eligibility: {
        pf: { enabled: true, valueType: 'PERCENTAGE', value: 12 },
        esi: { enabled: true, valueType: 'FLAT_RUPEE', value: 390 },
        bonus: { enabled: true, valueType: 'PERCENTAGE', value: 8.33 },
        medicalInsurance: { enabled: false, valueType: 'FLAT_RUPEE', value: 0 }
    }
  },
  { 
    id: 'MAN001', name: 'Priya Patel', role: UserRole.MANAGER, department: 'Machining',
     payroll: { basic: 50000, hra: 25000, allowances: 10000 },
    eligibility: {
        pf: { enabled: true, valueType: 'PERCENTAGE', value: 12 },
        esi: { enabled: true, valueType: 'FLAT_RUPEE', value: 638 },
        bonus: { enabled: true, valueType: 'PERCENTAGE', value: 10 },
        medicalInsurance: { enabled: true, valueType: 'FLAT_RUPEE', value: 5000 }
    }
  },
];

interface ManagePayrollProps {
  onEditUser: (user: User) => void;
}

const ManagePayroll: React.FC<ManagePayrollProps> = ({ onEditUser }) => {
  return (
    <div className="w-full">
      <p className="text-sm text-slate-600 mb-4">Select an employee from the list to view or edit their salary structure and benefits eligibility.</p>
      <div className="max-h-96 overflow-y-auto border border-slate-200 rounded-md">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50 sticky top-0">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Department</th>
              <th className="relative px-6 py-3"><span className="sr-only">Edit</span></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {mockUsers.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{user.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{user.department}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => onEditUser(user)} className="text-brand-secondary hover:text-brand-primary">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManagePayroll;
