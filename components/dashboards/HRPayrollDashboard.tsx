
import React from 'react';
import { User, OnboardingRequest, PerformanceEvaluation, AttendanceRecord, KPI, ViewMode } from '../../types';
import Card from '../shared/Card';
import { UsersIcon, DollarSignIcon, BriefcaseIcon, TrendingUpIcon, BookOpenIcon, EditIcon, ClipboardListIcon, ClockIcon, CheckCircleIcon } from '../shared/Icons';
import KPIDisplay from '../shared/KPIDisplay';
import ScoreDisplayCard from '../shared/ScoreDisplayCard';

interface HRPayrollDashboardProps {
  user: User;
  team: User[];
  onboardingRequests: OnboardingRequest[];
  evaluations: PerformanceEvaluation[];
  attendanceRecords: AttendanceRecord[];
  kpis: KPI[];
  onNavigate: (view: ViewMode, data?: any) => void;
}

const StatCard: React.FC<{icon: React.ReactNode, label: string, value: string | number, color: string}> = ({icon, label, value, color}) => (
    <div className="bg-white p-4 rounded-lg shadow-lg border border-slate-200 flex items-center space-x-4">
        <div className={`rounded-full p-3 ${color}`}>
            {icon}
        </div>
        <div>
            <p className="text-3xl font-extrabold text-brand-dark">{value}</p>
            <p className="text-sm text-slate-500 font-medium">{label}</p>
        </div>
    </div>
);

const HRPayrollDashboard: React.FC<HRPayrollDashboardProps> = (props) => {
    const { user, team, onboardingRequests, evaluations, kpis, onNavigate, attendanceRecords } = props;
    
    const hrKpis = kpis.filter(k => k.dashboard === 'HR');
    const firstName = user.name.split(' ')[0];
    
    const avgEvaluationScore = (() => {
        const completedEvals = evaluations.filter(e => e.status === 'Completed');
        if (completedEvals.length === 0) return null;
        const allKpiScores = completedEvals.flatMap(e => Object.values(e.kpis));
        if (allKpiScores.length === 0) return null;
        return allKpiScores.reduce((sum, score) => sum + score, 0) / allKpiScores.length;
    })();

  return (
    <>
      <h2 className="text-3xl font-bold text-brand-dark mb-6">HR & Payroll Dashboard</h2>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <StatCard icon={<UsersIcon className="h-6 w-6 text-brand-primary" />} label="Total Employees" value="8" color="bg-blue-100"/>
          <StatCard icon={<BriefcaseIcon className="h-6 w-6 text-green-600" />} label="New Hires (Month)" value="1" color="bg-green-100"/>
          <StatCard icon={<CheckCircleIcon className="h-6 w-6 text-brand-secondary" />} label="Pending Approvals" value={onboardingRequests.length} color="bg-orange-100"/>
          <StatCard icon={<ClockIcon className="h-6 w-6 text-yellow-600" />} label="On Leave Today" value="2" color="bg-yellow-100"/>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {onboardingRequests.length > 0 && (
            <Card title="Pending Onboarding Approvals" icon={<BriefcaseIcon className="h-6 w-6" />} className="border-l-4 border-brand-secondary">
                <div className="space-y-3">
                    {onboardingRequests.map(req => (
                        <div key={req.id} className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                            <div>
                                <p className="font-bold text-orange-800">{req.formData.fullName}</p>
                                <p className="text-sm text-slate-600">{req.formData.designation}, {req.formData.department}</p>
                            </div>
                            <button onClick={() => onNavigate(ViewMode.APPROVAL_DETAILS, req)} className="px-4 py-2 text-sm font-medium text-white bg-brand-primary rounded-md hover:bg-opacity-90">
                                Review
                            </button>
                        </div>
                    ))}
                </div>
            </Card>
        )}
        <Card title="Performance Management" icon={<TrendingUpIcon className="h-6 w-6" />}>
            <div className="space-y-3 h-full flex flex-col justify-center">
                <p className="text-brand-dark">Oversee and finalize employee performance evaluations.</p>
                <p className="text-sm text-slate-600">Pending HR Finalization: <span className="font-bold text-red-600">{evaluations.filter(e => e.status === 'Pending HR Finalization').length}</span></p>
                <button onClick={() => onNavigate(ViewMode.VIEW_ALL_EVALUATIONS)} className="w-full py-3 font-semibold text-brand-dark border border-slate-300 rounded-lg hover:bg-slate-50">View All Evaluations</button>
            </div>
        </Card>
        <Card title="Payroll & Reports" icon={<DollarSignIcon className="h-6 w-6" />}>
            <div className="space-y-3 h-full flex flex-col justify-center">
                <button onClick={() => onNavigate(ViewMode.MANAGE_PAYROLL)} className="w-full py-3 font-semibold text-brand-dark border border-slate-300 rounded-lg hover:bg-slate-50">Manage Payroll & Benefits</button>
                <button onClick={() => onNavigate(ViewMode.VIEW_SALARY_REGISTER)} className="w-full py-3 font-semibold text-brand-dark border border-slate-300 rounded-lg hover:bg-slate-50">View Salary Register</button>
                <button onClick={() => onNavigate(ViewMode.VIEW_ATTENDANCE_LOG)} className="w-full py-3 font-semibold text-brand-dark border border-slate-300 rounded-lg hover:bg-slate-50">View Attendance Log</button>
            </div>
        </Card>
        <Card title="Core HR" icon={<UsersIcon className="h-6 w-6" />}>
            <div className="space-y-3 h-full flex flex-col justify-center">
            <button onClick={() => onNavigate(ViewMode.ADD_EMPLOYEE)} className="w-full py-3 font-semibold text-white bg-brand-primary rounded-lg hover:bg-opacity-90">Add New Employee</button>
            <button onClick={() => onNavigate(ViewMode.VIEW_EMPLOYEES)} className="w-full py-3 font-semibold text-brand-dark border border-slate-300 rounded-lg hover:bg-slate-50">View All Employees</button>
            <button onClick={() => onNavigate(ViewMode.MANAGE_DEPARTMENTS)} className="w-full py-3 font-semibold text-brand-dark border border-slate-300 rounded-lg hover:bg-slate-50">Manage Departments</button>
            </div>
        </Card>
        <Card title="Training & Development" icon={<BookOpenIcon className="h-6 w-6" />}>
            <div className="space-y-3 h-full flex flex-col justify-center">
                <p className="text-brand-dark">Manage training catalog, approve topics, and track employee development.</p>
                <p className="text-sm text-slate-600">Pending Topic Approvals: <span className="font-bold text-red-600">{kpis.filter(t => (t as any).status === 'Pending Approval').length}</span></p>
                <button onClick={() => onNavigate(ViewMode.TRAINING_HUB)} className="w-full py-3 font-semibold text-brand-dark border border-slate-300 rounded-lg hover:bg-slate-50">Open Training Hub</button>
            </div>
        </Card>
        <Card title="HR Department KPIs" icon={<ClipboardListIcon className="h-6 w-6" />}>
            <div className="h-full flex flex-col justify-between">
                <KPIDisplay kpis={hrKpis} />
                <button onClick={() => onNavigate(ViewMode.MANAGE_KPIS)} className="mt-4 w-full flex justify-center items-center py-2 text-sm font-medium text-brand-dark border border-slate-300 rounded-md hover:bg-slate-50">
                    <EditIcon className="h-4 w-4 mr-2" />
                    Manage KPIs
                </button>
            </div>
        </Card>
        <ScoreDisplayCard 
            title="Company Performance Score"
            score={avgEvaluationScore}
            maxScore={5}
            description="Average score from all completed evaluations."
        />
      </div>
    </>
  );
};

export default HRPayrollDashboard;
