
import React from 'react';
import { PayslipData } from '../../../types';

const salaryData: PayslipData[] = [
  { id: 'PS001', employeeId: 'EMP001', employeeName: 'Arjun Sharma', month: 'Aug', year: 2024, gross: 50000, pf: 1800, esi: 375, professionalTax: 200, net: 47625, earnings: { basic: 30000, hra: 15000, allowances: 5000 } },
  { id: 'PS002', employeeId: 'EMP002', employeeName: 'Sunita Devi', month: 'Aug', year: 2024, gross: 52000, pf: 1800, esi: 390, professionalTax: 200, net: 49610, earnings: { basic: 32000, hra: 16000, allowances: 4000 } },
  { id: 'PS003', employeeId: 'EMP003', employeeName: 'Kavita Singh', month: 'Aug', year: 2024, gross: 48000, pf: 1800, esi: 360, professionalTax: 200, net: 45640, earnings: { basic: 28000, hra: 14000, allowances: 6000 } },
  { id: 'PS004', employeeId: 'MAN001', employeeName: 'Priya Patel', month: 'Aug', year: 2024, gross: 85000, pf: 1800, esi: 638, professionalTax: 200, net: 82362, earnings: { basic: 50000, hra: 25000, allowances: 10000 } },
];

const formatCurrency = (amount: number) => `₹${amount.toLocaleString('en-IN')}`;

const SalaryRegister: React.FC = () => {
  return (
    <div className="w-full">
        <h3 className="text-lg font-semibold mb-4 text-slate-800">Salary for August 2024</h3>
        <div className="overflow-x-auto border rounded-lg">
            <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                    <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Employee</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase">Gross</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase">PF</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase">ESI</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase">Prof. Tax</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase">Net Salary</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                    {salaryData.map((row) => (
                    <tr key={row.id}>
                        <td className="px-4 py-4 text-sm font-medium text-slate-900">
                              {row.employeeName}
                              <span className="text-slate-400 ml-1">({row.employeeId})</span>
                        </td>
                        <td className="px-4 py-4 text-sm text-right text-slate-500">{formatCurrency(row.gross)}</td>
                        <td className="px-4 py-4 text-sm text-right text-slate-500">{formatCurrency(row.pf)}</td>
                        <td className="px-4 py-4 text-sm text-right text-slate-500">{formatCurrency(row.esi)}</td>
                        <td className="px-4 py-4 text-sm text-right text-slate-500">{formatCurrency(row.professionalTax)}</td>
                        <td className="px-4 py-4 text-sm text-right font-bold text-brand-primary">{formatCurrency(row.net)}</td>
                    </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
  );
};

export default SalaryRegister;