
import React from 'react';
import { User, UserRole } from '../../types';

// Mock data for display, in a real app this would be fetched or passed as a prop.
const mockUsers: User[] = [
  { id: 'EMP001', name: 'Arjun Sharma', role: UserRole.EMPLOYEE, department: 'Machining' },
  { id: 'EMP002', name: 'Sunita Devi', role: UserRole.EMPLOYEE, department: 'Machining' },
  { id: 'EMP003', name: 'Kavita Singh', role: UserRole.EMPLOYEE, department: 'Assembly' },
  { id: 'EMP004', name: 'Anil Kumar', role: UserRole.EMPLOYEE, department: 'Quality Control' },
  { id: 'MAN001', name: 'Priya Patel', role: UserRole.MANAGER, department: 'Machining' },
  { id: 'MAN002', name: 'Vijay Verma', role: UserRole.MANAGER, department: 'Assembly' },
  { id: 'HR001', name: 'Rohan Mehta', role: UserRole.HR_PAYROLL, department: 'Administration' },
];


const ViewAllEmployees: React.FC = () => {
  return (
    <div className="w-full">
      <div className="hidden print:block mb-6">
        <h3 className="text-xl font-bold text-brand-primary">Employee Master Directory</h3>
        <p className="text-sm text-slate-500">Total Active Employees: {mockUsers.length}</p>
      </div>
      <div className="overflow-x-auto border border-slate-200 rounded-lg print:border-none">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50 print:bg-white">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Employee ID</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Name</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Department</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Role</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {mockUsers.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{user.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{user.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{user.department}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{user.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewAllEmployees;