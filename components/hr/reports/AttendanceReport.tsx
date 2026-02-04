
import React from 'react';

const attendanceData = [
  { id: 'EMP001', name: 'Arjun Sharma', present: 21, absent: 1, leave: 1 },
  { id: 'EMP002', name: 'Sunita Devi', present: 23, absent: 0, leave: 0 },
  { id: 'EMP003', name: 'Kavita Singh', present: 22, absent: 0, leave: 1 },
  { id: 'EMP004', name: 'Anil Kumar', present: 20, absent: 2, leave: 1 },
  { id: 'MAN001', name: 'Priya Patel', present: 23, absent: 0, leave: 0 },
];

const AttendanceReport: React.FC = () => {
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">August 2024 Summary</h3>
        {/* In a real app, this could be a date picker */}
        <select className="border-gray-300 rounded-md">
          <option>August 2024</option>
          <option>July 2024</option>
          <option>June 2024</option>
        </select>
      </div>
      <div className="overflow-x-auto border rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Present</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Absent</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Leave</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {attendanceData.map((row) => (
              <tr key={row.id}>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{row.id}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{row.name}</td>
                <td className="px-6 py-4 text-sm text-center text-green-600 font-semibold">{row.present}</td>
                <td className="px-6 py-4 text-sm text-center text-red-600 font-semibold">{row.absent}</td>
                <td className="px-6 py-4 text-sm text-center text-yellow-600 font-semibold">{row.leave}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendanceReport;
