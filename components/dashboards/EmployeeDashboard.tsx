
import React, { useState } from 'react';
import { User, PayslipData, PerformanceEvaluation, TrainingSession, ViewMode } from '../../types';
import Card from '../shared/Card';
import { BriefcaseIcon, DollarSignIcon, FileTextIcon, BookOpenIcon, CalendarDaysIcon } from '../shared/Icons';
import ScoreDisplayCard from '../shared/ScoreDisplayCard';

interface EmployeeDashboardProps {
  user: User;
  evaluations: PerformanceEvaluation[];
  trainingSessions: TrainingSession[];
  onNavigate: (view: ViewMode, data?: any) => void;
}

const mockPayslips: PayslipData[] = [
    { id: 'PS001', employeeId: 'EMP001', employeeName: 'Arjun Sharma', month: 'August', year: 2024, gross: 50000, pf: 1800, esi: 375, professionalTax: 200, net: 47625, earnings: { basic: 30000, hra: 15000, allowances: 5000 } },
    { id: 'PS002', employeeId: 'EMP001', employeeName: 'Arjun Sharma', month: 'July', year: 2024, gross: 50000, pf: 1800, esi: 375, professionalTax: 200, net: 47625, earnings: { basic: 30000, hra: 15000, allowances: 5000 } },
];

const mockHolidays = [
    { date: '15 Aug', name: 'Independence Day' },
    { date: '02 Oct', name: 'Gandhi Jayanti' },
    { date: '01 Nov', name: 'Diwali' },
]

const EmployeeDashboard: React.FC<EmployeeDashboardProps> = ({ user, evaluations, trainingSessions, onNavigate }) => {
    const [leaveReason, setLeaveReason] = useState('');
    const [leaveSuccess, setLeaveSuccess] = useState(false);

    const handleLeaveSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLeaveSuccess(true);
        setTimeout(() => setLeaveSuccess(false), 3000);
    };

    const firstName = user.name.split(' ')[0];

    const avgTrainingScore = (() => {
        const scoredSessions = trainingSessions
            .filter(s => s.status === 'Completed')
            .map(s => s.attendees.find(a => a.employeeId === user.id && a.score !== null))
            .filter(Boolean);

        if (scoredSessions.length === 0) return null;
        const totalScore = scoredSessions.reduce((sum, a) => sum + (a?.score || 0), 0);
        return totalScore / scoredSessions.length;
    })();

    const avgEvaluationScore = (() => {
        const completedEvals = evaluations.filter(e => e.status === 'Completed');
        if (completedEvals.length === 0) return null;
        const allKpiScores = completedEvals.flatMap(e => Object.values(e.kpis));
        if (allKpiScores.length === 0) return null;
        const totalScore = allKpiScores.reduce((sum, score) => sum + score, 0);
        return totalScore / allKpiScores.length;
    })();

  return (
    <div className="space-y-6">
        <h2 className="text-3xl font-bold text-brand-dark">Dashboard</h2>
        {evaluations.filter(e => e.status === 'Pending Employee Comments').map(evaluation => (
            <div key={evaluation.id} className="bg-yellow-50 border-l-4 border-brand-accent p-4 rounded-r-md">
                <div className="flex justify-between items-center">
                    <div>
                        <p className="font-bold text-yellow-800">Action Required: Performance Review</p>
                        <p className="text-sm text-yellow-700">Please review your manager's comments for the {evaluation.evaluationPeriod} period.</p>
                    </div>
                    <button onClick={() => onNavigate(ViewMode.EVALUATION_DETAILS, evaluation)} className="px-4 py-2 text-sm font-medium text-white bg-brand-primary rounded-md hover:bg-opacity-90 whitespace-nowrap">
                        View & Comment
                    </button>
                </div>
            </div>
        ))}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ScoreDisplayCard 
                title="Avg. Training Score"
                score={avgTrainingScore}
                maxScore={5}
                description="Based on completed training sessions."
            />
            <ScoreDisplayCard 
                title="Avg. Performance Score"
                score={avgEvaluationScore}
                maxScore={5}
                description="Based on finalized performance evaluations."
            />
            <Card title="Leave Balance" icon={<BriefcaseIcon className="h-6 w-6" />}>
                <div className="text-center h-full flex flex-col justify-center items-center">
                    <p className="text-6xl font-extrabold text-brand-primary">12</p>
                    <p className="text-brand-dark font-semibold">Paid Leave Days Remaining</p>
                </div>
            </Card>
            <Card title="My Details" icon={<FileTextIcon className="h-6 w-6" />}>
                <div className="space-y-3 text-brand-dark h-full flex flex-col">
                    <div className="flex-grow space-y-2">
                        <p><strong>Employee ID:</strong> {user.id}</p>
                        <p><strong>Email:</strong> {user.personalEmail || '-'}</p>
                        <p><strong>Phone:</strong> {user.mobileNumber || '-'}</p>
                        <p><strong>Provident Fund (PF) No:</strong> UAN123456789</p>
                    </div>
                    <button onClick={() => onNavigate(ViewMode.UPDATE_MY_DETAILS)} className="w-full mt-4 py-2 text-sm font-medium text-brand-dark border border-slate-300 rounded-md hover:bg-slate-50">
                        Update Details
                    </button>
                </div>
            </Card>
             <Card title="My Payslips" icon={<DollarSignIcon className="h-6 w-6" />}>
              <div className="space-y-3">
                {mockPayslips.map(slip => (
                    <div key={slip.id} className="flex justify-between items-center p-3 bg-brand-light rounded-lg border border-slate-200">
                        <div>
                            <p className="font-semibold text-brand-primary">{slip.month} {slip.year}</p>
                            <p className="text-sm text-slate-500">Net Salary: ₹{slip.net.toLocaleString('en-IN')}</p>
                        </div>
                        <button onClick={() => onNavigate(ViewMode.VIEW_PAYSLIP, slip)} className="px-4 py-2 text-sm font-medium text-white bg-brand-secondary rounded-md hover:bg-opacity-90">
                            View/Print
                        </button>
                    </div>
                ))}
              </div>
            </Card>
            <Card title="Company Holidays" icon={<CalendarDaysIcon className="h-6 w-6" />}>
                 <ul className="space-y-3">
                    {mockHolidays.map(holiday => (
                        <li key={holiday.name} className="flex items-center space-x-4 p-2 bg-brand-light rounded-md">
                            <div className="flex-shrink-0 w-12 text-center bg-brand-primary text-white rounded-md p-2">
                                <p className="text-xs">{holiday.date.split(' ')[1]}</p>
                                <p className="font-bold text-lg">{holiday.date.split(' ')[0]}</p>
                            </div>
                            <p className="font-semibold text-brand-dark">{holiday.name}</p>
                        </li>
                    ))}
                 </ul>
            </Card>
        </div>
    </div>
  );
};

export default EmployeeDashboard;
