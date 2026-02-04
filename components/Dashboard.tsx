
import React from 'react';
import { User, UserRole, OnboardingRequest, PerformanceEvaluation, TrainingTopic, TrainingSession, AttendanceRecord, KPI, ViewMode } from '../types';
import { LogOutIcon, BellIcon } from './shared/Icons';
import EmployeeDashboard from './dashboards/EmployeeDashboard';
import ManagerDashboard from './dashboards/ManagerDashboard';
import HRPayrollDashboard from './dashboards/HRPayrollDashboard';
import ManagementDashboard from './dashboards/ManagementDashboard';
import { LOGO_BASE_64, COMPANY_NAME } from './shared/Branding';

interface DashboardProps {
  user: User;
  onLogout: () => void;
  onNavigate: (view: ViewMode, data?: any) => void;
  notification: string;
  onboardingRequests: OnboardingRequest[];
  evaluations: PerformanceEvaluation[];
  trainingTopics: TrainingTopic[];
  trainingSessions: TrainingSession[];
  attendanceRecords: AttendanceRecord[];
  kpis: KPI[];
  users: User[];
  team: User[];
}

const Dashboard: React.FC<DashboardProps> = (props) => {
  const { user, evaluations, trainingTopics, trainingSessions, attendanceRecords, kpis, onNavigate, onboardingRequests, notification, users, team } = props;

  const renderRoleDashboard = () => {
    switch (user.role) {
      case UserRole.EMPLOYEE:
        return <EmployeeDashboard 
                  user={user} 
                  evaluations={evaluations.filter(e => e.employeeId === user.id)}
                  trainingSessions={trainingSessions.filter(s => s.attendees.some(a => a.employeeId === user.id))}
                  onNavigate={onNavigate}
                />;
      case UserRole.MANAGER:
        const teamIds = team.map(m => m.id);
        return <ManagerDashboard 
                  user={user} 
                  team={team}
                  onboardingRequests={onboardingRequests.filter(req => req.managerId === user.id && req.status === 'Pending Manager Approval')}
                  evaluations={evaluations.filter(e => teamIds.includes(e.employeeId))}
                  trainingTopics={trainingTopics.filter(t => t.department === user.department)}
                  attendanceRecords={attendanceRecords.filter(rec => teamIds.includes(rec.employeeId))}
                  kpis={kpis.filter(k => k.dashboard === 'Manager')}
                  onNavigate={onNavigate}
                />;
      case UserRole.HR_PAYROLL:
        const hrTeam = users.filter(u => u.department === user.department && u.id !== user.id);
        return <HRPayrollDashboard 
                  user={user}
                  team={hrTeam}
                  onboardingRequests={onboardingRequests.filter(req => req.status === 'Pending HR Approval')}
                  evaluations={evaluations}
                  attendanceRecords={attendanceRecords}
                  kpis={kpis}
                  onNavigate={onNavigate}
                />;
      case UserRole.MANAGEMENT:
        return <ManagementDashboard
                  user={user}
                  users={users}
                  evaluations={evaluations}
                  kpis={kpis}
                  onNavigate={onNavigate}
                  trainingSessions={trainingSessions}
                />;
      default:
        return <div className="p-4">Invalid user role.</div>;
    }
  };

  return (
    <div className="min-h-screen bg-brand-light">
      <header className="bg-brand-primary shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-4">
                <img src={LOGO_BASE_64} alt="Logo" className="h-14 w-auto" />
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">{COMPANY_NAME}</h1>
                    <p className="text-sm text-white opacity-80">HR & Payroll Portal</p>
                </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right text-white">
                <p className="font-semibold">{user.name}</p>
                <p className="text-sm opacity-80">{user.role} - {user.department}</p>
              </div>
              <button
                onClick={props.onLogout}
                className="p-2 rounded-full text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-primary focus:ring-white"
                aria-label="Logout"
              >
                <LogOutIcon className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </header>
       {notification && (
          <div className="bg-brand-accent border-b-2 border-yellow-500 text-brand-dark shadow-md" role="alert">
            <div className="max-w-7xl mx-auto py-2 px-4 sm:px-6 lg:px-8 flex items-center space-x-3">
                <BellIcon className="h-5 w-5" />
                <p className="font-semibold text-sm">{notification}</p>
            </div>
          </div>
      )}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {renderRoleDashboard()}
      </main>
    </div>
  );
};

export default Dashboard;
