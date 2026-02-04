
import React, { useState, useMemo, useEffect } from 'react';
import { AttendanceRecord } from '../../../types';

interface AttendanceTrackerProps {
  records: AttendanceRecord[];
  onSave: (recordId: string, newClockIn: string, newClockOut: string | null) => void;
  isEditable: boolean;
}

const AttendanceTracker: React.FC<AttendanceTrackerProps> = ({ records, onSave, isEditable }) => {
  const [activeTab, setActiveTab] = useState<'summary' | 'log'>('summary');
  
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedDay, setSelectedDay] = useState<number | 'all'>('all');

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<{ clockIn: string; clockOut: string | null }>({ clockIn: '', clockOut: '' });

  useEffect(() => {
    if (selectedDay !== 'all') {
        setActiveTab('log');
    }
  }, [selectedDay]);

  const handleEdit = (record: AttendanceRecord) => {
    setEditingId(record.id);
    setEditData({ clockIn: record.clockIn, clockOut: record.clockOut });
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditData({ clockIn: '', clockOut: '' });
  };

  const handleSave = () => {
    if (editingId) {
      onSave(editingId, editData.clockIn, editData.clockOut);
      handleCancel();
    }
  };
  
  const filteredRecords = useMemo(() => {
    const monthString = selectedMonth.toString().padStart(2, '0');
    
    return records.filter(rec => {
        const yearMatch = rec.date.startsWith(selectedYear.toString());
        const monthMatch = rec.date.startsWith(`${selectedYear}-${monthString}`);
        
        if (selectedDay === 'all') {
            return monthMatch;
        }
        
        const dayString = selectedDay.toString().padStart(2, '0');
        const fullDateString = `${selectedYear}-${monthString}-${dayString}`;
        return rec.date === fullDateString;
    });
  }, [records, selectedYear, selectedMonth, selectedDay]);

  const summaryData = useMemo(() => {
    const employeeSummary: { [key: string]: { 
        id: string; 
        name: string; 
        present: number; 
        absent: number; 
        leave: number;
        totalClockInMinutes: number;
        clockInCount: number;
        totalClockOutMinutes: number;
        clockOutCount: number;
        avgClockIn?: string | null;
        avgClockOut?: string | null;
    } } = {};
    const workingDays = new Date(selectedYear, selectedMonth, 0).getDate() - 8; // Approximation

    filteredRecords.forEach(record => {
      if (!employeeSummary[record.employeeId]) {
        employeeSummary[record.employeeId] = { 
            id: record.employeeId, 
            name: record.employeeName, 
            present: 0, 
            absent: 0, 
            leave: 0,
            totalClockInMinutes: 0,
            clockInCount: 0,
            totalClockOutMinutes: 0,
            clockOutCount: 0
        };
      }
      employeeSummary[record.employeeId].present += 1;
      
      if (record.clockIn) {
        const [hours, minutes] = record.clockIn.split(':').map(Number);
        employeeSummary[record.employeeId].totalClockInMinutes += hours * 60 + minutes;
        employeeSummary[record.employeeId].clockInCount++;
      }
      if (record.clockOut) {
        const [hours, minutes] = record.clockOut.split(':').map(Number);
        employeeSummary[record.employeeId].totalClockOutMinutes += hours * 60 + minutes;
        employeeSummary[record.employeeId].clockOutCount++;
      }
    });
    
    const formatMinutesToTime = (totalMinutes: number, count: number): string | null => {
        if (count === 0) return null;
        const avgMinutes = Math.round(totalMinutes / count);
        const hours = Math.floor(avgMinutes / 60);
        const minutes = avgMinutes % 60;
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    };

    Object.values(employeeSummary).forEach(summary => {
      const mockLeave = Math.floor(Math.random() * 3);
      summary.leave = mockLeave;
      const calculatedAbsent = workingDays - summary.present - summary.leave;
      summary.absent = Math.max(0, calculatedAbsent);
      summary.avgClockIn = formatMinutesToTime(summary.totalClockInMinutes, summary.clockInCount);
      summary.avgClockOut = formatMinutesToTime(summary.totalClockOutMinutes, summary.clockOutCount);
    });

    return Object.values(employeeSummary);
  }, [filteredRecords, selectedYear, selectedMonth]);

  const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();

  const renderContent = () => {
    if (activeTab === 'log') {
        return (
            <div className="overflow-x-auto border border-slate-200 rounded-lg print:border-none">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50 print:bg-white">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Employee</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Date</th>
                            <th className="px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase">Clock In</th>
                            <th className="px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase">Clock Out</th>
                            {isEditable && <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase no-print">Actions</th>}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                        {filteredRecords.map((record) => (
                            <tr key={record.id}>
                                <td className="px-4 py-4 text-sm font-medium text-slate-900">{record.employeeName}</td>
                                <td className="px-4 py-4 text-sm text-slate-500">{record.date}</td>
                                <td className="px-4 py-4 text-sm text-center">
                                {editingId === record.id ? (
                                    <input type="time" value={editData.clockIn} onChange={(e) => setEditData(d => ({...d, clockIn: e.target.value}))} className="w-24 border-slate-300 rounded-md shadow-sm no-print"/>
                                ) : ( record.clockIn )}
                                </td>
                                <td className="px-4 py-4 text-sm text-center">
                                {editingId === record.id ? (
                                    <input type="time" value={editData.clockOut || ''} onChange={(e) => setEditData(d => ({...d, clockOut: e.target.value}))} className="w-24 border-slate-300 rounded-md shadow-sm no-print"/>
                                ) : ( record.clockOut || <span className="text-slate-400">--:--</span> )}
                                </td>
                                {isEditable && (
                                <td className="px-4 py-4 text-right text-sm space-x-2 no-print">
                                    {editingId === record.id ? (
                                        <>
                                            <button onClick={handleSave} className="font-medium text-green-600 hover:text-green-800">Save</button>
                                            <button onClick={handleCancel} className="font-medium text-slate-600 hover:text-slate-800">Cancel</button>
                                        </>
                                    ) : (
                                        <button onClick={() => handleEdit(record)} className="font-medium text-brand-secondary hover:text-brand-primary">Edit</button>
                                    )}
                                </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }
    
    if (activeTab === 'summary') {
        return (
            <div className="overflow-x-auto border border-slate-200 rounded-lg print:border-none">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50 print:bg-white">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Employee</th>
                            <th className="px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase">Present</th>
                            <th className="px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase">Absent</th>
                            <th className="px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase">Leave</th>
                            <th className="px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase">Avg. Clock In</th>
                            <th className="px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase">Avg. Clock Out</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                        {summaryData.map((row) => (
                            <tr key={row.id}>
                                <td className="px-4 py-4 text-sm font-medium text-slate-900">{row.name}</td>
                                <td className="px-4 py-4 text-sm text-center font-semibold text-green-600">{row.present}</td>
                                <td className="px-4 py-4 text-sm text-center font-semibold text-red-600">{row.absent}</td>
                                <td className="px-4 py-4 text-sm text-center font-semibold text-yellow-600">{row.leave}</td>
                                <td className="px-4 py-4 text-sm text-center text-slate-500">{row.avgClockIn || '--:--'}</td>
                                <td className="px-4 py-4 text-sm text-center text-slate-500">{row.avgClockOut || '--:--'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }

    return null;
  };

  return (
    <div className="w-full">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 gap-4 no-print">
            <div className="flex items-center gap-2">
                <select value={selectedDay} onChange={e => setSelectedDay(e.target.value === 'all' ? 'all' : parseInt(e.target.value))} className="border-slate-300 rounded-md shadow-sm">
                    <option value="all">All Days</option>
                    {[...Array(daysInMonth).keys()].map(i => <option key={i+1} value={i+1}>{i+1}</option>)}
                </select>
                <select value={selectedMonth} onChange={e => setSelectedMonth(parseInt(e.target.value))} className="border-slate-300 rounded-md shadow-sm">
                    {[...Array(12).keys()].map(i => <option key={i+1} value={i+1}>{new Date(0, i).toLocaleString('default', { month: 'long' })}</option>)}
                </select>
                 <select value={selectedYear} onChange={e => setSelectedYear(parseInt(e.target.value))} className="border-slate-300 rounded-md shadow-sm">
                    <option value={currentYear}>{currentYear}</option>
                    <option value={currentYear - 1}>{currentYear - 1}</option>
                </select>
            </div>
            <div className="border-b border-slate-200">
                <nav className="-mb-px flex space-x-4" aria-label="Tabs">
                    <button onClick={() => setActiveTab('summary')} disabled={selectedDay !== 'all'} className={`py-2 px-3 border-b-2 font-medium text-sm disabled:text-slate-300 disabled:cursor-not-allowed ${activeTab === 'summary' ? 'border-brand-accent text-brand-primary' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
                        Monthly Summary
                    </button>
                    <button onClick={() => setActiveTab('log')} className={`py-2 px-3 border-b-2 font-medium text-sm ${activeTab === 'log' ? 'border-brand-accent text-brand-primary' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
                        Daily Log
                    </button>
                </nav>
            </div>
        </div>
        <div className="hidden print:block mb-6">
            <h4 className="text-lg font-bold text-slate-800">Attendance Report - {new Date(selectedYear, selectedMonth - 1).toLocaleString('default', { month: 'long' })} {selectedYear}</h4>
            {selectedDay !== 'all' && <p className="text-sm text-slate-600">Specific Day: {selectedDay}</p>}
        </div>
      {renderContent()}
    </div>
  );
};

export default AttendanceTracker;
