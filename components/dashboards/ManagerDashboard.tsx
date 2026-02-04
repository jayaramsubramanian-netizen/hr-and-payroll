
import React, { useState } from 'react';
import { User, LeaveRequest, OnboardingRequest, PerformanceEvaluation, TrainingTopic, AttendanceRecord, KPI, ViewMode } from '../../types';
import Card from '../shared/Card';
import { UsersIcon, BriefcaseIcon, TrendingUpIcon, BookOpenIcon, ClockIcon, ClipboardListIcon, EditIcon, ArrowRightIcon } from '../shared/Icons';
import KPIDisplay from '../shared/KPIDisplay';
import ScoreDisplayCard from '../shared/ScoreDisplayCard';

interface ManagerDashboardProps {
  user: User;
  team: User[];
  onboardingRequests: OnboardingRequest[];
  evaluations: PerformanceEvaluation[];
  trainingTopics: TrainingTopic[];
  attendanceRecords: AttendanceRecord[];
  kpis: KPI[];
  onNavigate: (view: ViewMode, data?: any) => void;
}

const initialLeaveRequests: LeaveRequest[] = [
    { id: 'LR001', employeeName: 'Anil Kumar', startDate: '2024-09-05', endDate: '2024-09-07', reason: 'Family event', status: 'Pending' },
    { id: 'LR002', employeeName: 'Sunita Devi', startDate: '2024-09-10', endDate: '2024-09-10', reason: 'Personal work', status: 'Pending' },
];

const ManagerDashboard: React.FC<ManagerDashboardProps> = (props) => {
    const { user, team, onboardingRequests, evaluations, trainingTopics, attendanceRecords, kpis, onNavigate } = props;
    const [leaveRequests, setLeaveRequests] = useState(initialLeaveRequests);

    const handleLeaveAction = (id: string, newStatus: 'Approved' | 'Rejected') => {
        setLeaveRequests(prev => prev.filter(req => req.id !== id));
    };

    const statusBadge = (status: 'Approved' | 'Pending Approval') => {
        const base = "px-2 py-0.5 text-xs font-medium rounded-full";
        if (status === 'Approved') return `${base} bg-green-100 text-green-800`;
        return `${base} bg-yellow-100 text-yellow-800`;
    };

    const avgTeamEvaluationScore = (() => {
        const completedEvals = evaluations.filter(e => e.status === 'Completed');
        if (completedEvals.length === 0) return null;
        const allKpiScores = completedEvals.flatMap(e => Object.values(e.kpis));
        if (allKpiScores.length === 0) return null;
        return allKpiScores.reduce((sum, score) => sum + score, 0) / allKpiScores.length;
    })();

    const clockedInCount = attendanceRecords.filter(r => r.clockIn && !r.clockOut).length;
    const firstName = user.name.split(' ')[0];

  return (
    <div className="space-y-6">
       <h2 className="text-3xl font-bold text-brand-dark">Manager Dashboard</h2>
      {onboardingRequests.length > 0 && (
          <div className="bg-yellow-50 border-l-4 border-brand-accent p-4 rounded-r-md">
            <div className="flex justify-between items-center">
                <div>
                    <p className="font-bold text-yellow-800">New Hire Approval Required</p>
                    <p className="text-sm text-yellow-700">You have new employee requests awaiting your review.</p>
                </div>
                {onboardingRequests.map(req => (
                    <div key={req.id} className="flex items-center space-x-4">
                        <p className="font-semibold text-slate-700">{req.formData.fullName}</p>
                        <button onClick={() => onNavigate(ViewMode.APPROVAL_DETAILS, req)} className="px-4 py-2 text-sm font-medium text-white bg-brand-primary rounded-md hover:bg-opacity-90 whitespace-nowrap">
                            Review
                        </button>
                    </div>
                ))}
            </div>
          </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card title="Team Attendance" icon={<ClockIcon className="h-6 w-6" />}>
            <div className="h-full flex flex-col justify-between text-center">
                <div>
                    <p className="text-6xl font-bold text-brand-primary">{clockedInCount}<span className="text-2xl text-slate-400">/{team.length}</span></p>
                    <p className="text-brand-dark font-semibold">Members Clocked In Today</p>
                </div>
                <button onClick={() => onNavigate(ViewMode.VIEW_ATTENDANCE_LOG)} className="mt-4 w-full py-2 text-sm font-medium text-brand-dark border border-slate-300 rounded-md hover:bg-slate-50">
                    View Full Log
                </button>
            </div>
        </Card>
        <Card title="Team Quick Actions" icon={<UsersIcon className="h-6 w-6" />}>
          <div className="space-y-3">
              <button onClick={() => onNavigate(ViewMode.VIEW_EMPLOYEES)} className="w-full flex justify-between items-center py-3 px-4 font-semibold text-brand-dark border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
                  <span>View Team Roster</span>
                  <ArrowRightIcon className="h-5 w-5" />
              </button>
              <button onClick={() => onNavigate(ViewMode.INITIATE_EVALUATION)} className="w-full flex justify-between items-center py-3 px-4 font-semibold text-brand-dark border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
                  <span>Start Performance Review</span>
                   <ArrowRightIcon className="h-5 w-5" />
              </button>
               <button onClick={() => onNavigate(ViewMode.TRAINING_HUB)} className="w-full flex justify-between items-center py-3 px-4 font-semibold text-brand-dark border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
                  <span>Access Training Hub</span>
                   <ArrowRightIcon className="h-5 w-5" />
              </button>
          </div>
        </Card>
        <Card title="Pending Leave Requests" icon={<BriefcaseIcon className="h-6 w-6" />}>
          <div className="space-y-4 max-h-64 overflow-y-auto">
              {leaveRequests.length > 0 ? leaveRequests.map(req => (
                  <div key={req.id} className="p-4 bg-brand-light rounded-lg border border-slate-200">
                      <p className="font-bold text-brand-primary">{req.employeeName}</p>
                      <p className="text-sm text-brand-dark"><strong>Dates:</strong> {req.startDate} to {req.endDate}</p>
                      <div className="flex justify-end space-x-2 mt-3">
                          <button onClick={() => handleLeaveAction(req.id, 'Approved')} className="px-3 py-1 text-xs font-medium text-white bg-green-500 rounded-md hover:bg-green-600">Approve</button>
                          <button onClick={() => handleLeaveAction(req.id, 'Rejected')} className="px-3 py-1 text-xs font-medium text-white bg-red-500 rounded-md hover:bg-red-600">Reject</button>
                      </div>
                  </div>
              )) : <p className="text-slate-500">No pending leave requests.</p>}
          </div>
        </Card>
        <ScoreDisplayCard 
            title="Team Performance Score"
            score={avgTeamEvaluationScore}
            maxScore={5}
            description="Average score from all completed team evaluations."
        />
         <Card title="Department KPIs" icon={<ClipboardListIcon className="h-6 w-6" />}>
            <div className="h-full flex flex-col justify-between">
              <KPIDisplay kpis={kpis} />
              <button onClick={() => onNavigate(ViewMode.MANAGE_KPIS)} className="mt-4 w-full flex justify-center items-center py-2 text-sm font-medium text-brand-dark border border-slate-300 rounded-md hover:bg-slate-50">
                  <EditIcon className="h-4 w-4 mr-2" />
                  Manage Department KPIs
              </button>
            </div>
        </Card>
       <Card title="Department Training Topics" icon={<BookOpenIcon className="h-6 w-6" />}>
           <div className="space-y-3">
               {trainingTopics.length > 0 ? trainingTopics.map(topic => (
                   <div key={topic.id} className="flex justify-between items-center p-3 bg-brand-light rounded-lg border border-slate-200">
                       <p className="font-medium text-brand-dark">{topic.title}</p>
                       <span className={statusBadge(topic.status)}>{topic.status}</span>
                   </div>
               )) : <p className="text-slate-500">No training topics suggested for this department yet.</p>}
               <button onClick={() => onNavigate(ViewMode.SUGGEST_TRAINING_TOPIC)} className="w-full mt-2 py-2 text-sm font-medium text-brand-dark border border-slate-300 rounded-md hover:bg-slate-50">Suggest New Topic</button>
           </div>
       </Card>
      </div>
    </div>
  );
};

export default ManagerDashboard;
