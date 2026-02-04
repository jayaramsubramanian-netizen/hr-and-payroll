
import React from 'react';

const complianceData = [
  { id: 'EMP001', name: 'Arjun Sharma', uan: '100987654321', esiNo: '3100123456', pfContribution: 3600, esiContribution: 2250 },
  { id: 'EMP002', name: 'Sunita Devi', uan: '100987654322', esiNo: '3100123457', pfContribution: 3600, esiContribution: 2340 },
  { id: 'EMP003', name: 'Kavita Singh', uan: '100987654323', esiNo: '3100123458', pfContribution: 3600, esiContribution: 2160 },
  { id: 'MAN001', name: 'Priya Patel', uan: '100987654324', esiNo: '3100123459', pfContribution: 3600, esiContribution: 3825 },
];

const formatCurrency = (amount: number) => `₹${amount.toLocaleString('en-IN')}`;

const ComplianceReport: React.FC = () => {
  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold mb-4">PF & ESI Contributions for August 2024</h3>
      <div className="overflow-x-auto border rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">UAN / ESI No</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Total PF Contrib.</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Total ESI Contrib.</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {complianceData.map((row) => (
              <tr key={row.id}>
                <td className="px-4 py-4 text-sm font-medium text-gray-900">{row.name}</td>
                <td className="px-4 py-4 text-sm text-gray-500">
                    <div>UAN: {row.uan}</div>
                    <div>ESI: {row.esiNo}</div>
                </td>
                <td className="px-4 py-4 text-sm text-right text-gray-700">{formatCurrency(row.pfContribution)}</td>
                <td className="px-4 py-4 text-sm text-right text-gray-700">{formatCurrency(row.esiContribution)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="text-xs text-gray-500 p-2">* Total contribution includes both employee and employer shares.</p>
      </div>
    </div>
  );
};

export default ComplianceReport;
