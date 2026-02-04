
import React from 'react';
import { User, PerformanceEvaluation, KPI, ViewMode, TrainingSession } from '../../types';
import Card from '../shared/Card';
import ScoreDisplayCard from '../shared/ScoreDisplayCard';
import { UsersIcon, TrendingUpIcon, DollarSignIcon, BookOpenIcon, CheckCircleIcon, ArrowRightIcon } from '../shared/Icons';

interface ManagementDashboardProps {
  user: User;
  users: User[];
  evaluations: PerformanceEvaluation[];
  kpis: KPI[];
  onNavigate: (view: ViewMode) => void;
  trainingSessions: TrainingSession[];
}

const StatCard: React.FC<{icon: React.ReactNode, label: string, value: string | number}> = ({icon, label, value}) => (
    <div className="bg-white p-6 rounded-lg shadow-lg border border-slate-200 flex items-center space-x-4 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
        <div className="bg-brand-light p-4 rounded-full">
            {icon}
        </div>
        <div>
            <p className="text-4xl font-extrabold text-brand-primary">{value}</p>
            <p className="text-sm text-slate-500 font-medium">{label}</p>
        </div>
    </div>
);

const ManagementDashboard: React.FC<ManagementDashboardProps> = ({ user, users, evaluations, kpis, onNavigate, trainingSessions }) => {
  const firstName = user.name.split(' ')[0];

  const totalEmployees = users.length;
  const totalDepartments = [...new Set(users.map(u => u.department))].length;

  const avgEvaluationScore = (() => {
    const completedEvals = evaluations.filter(e => e.status === 'Completed');
    if (completedEvals.length === 0) return null;
    const allKpiScores = completedEvals.flatMap(e => Object.values(e.kpis)).filter(s => s > 0);
    if (allKpiScores.length === 0) return null;
    return allKpiScores.reduce((sum, score) => sum + score, 0) / allKpiScores.length;
  })();

  const avgTrainingScore = (() => {
    const allScoredAttendees = trainingSessions
        .flatMap(s => s.attendees)
        .filter(a => a.score !== null);
    
    if (allScoredAttendees.length === 0) return null;
    
    const totalScore = allScoredAttendees.reduce((sum, a) => sum + a.score!, 0);
    return totalScore / allScoredAttendees.length;
  })();
  
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-brand-dark">Executive Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard icon={<UsersIcon className="h-8 w-8 text-brand-primary" />} label="Total Employees" value={totalEmployees} />
          <StatCard icon={<CheckCircleIcon className="h-8 w-8 text-brand-secondary" />} label="Total Departments" value={totalDepartments} />
          <ScoreDisplayCard 
                title="Company Performance"
                score={avgEvaluationScore}
                maxScore={5}
                description="Avg. from all evaluations."
            />
            <ScoreDisplayCard 
                title="Company Training Score"
                score={avgTrainingScore}
                maxScore={5}
                description="Avg. from all trainings."
            />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
              <Card title="Quick Access" icon={<ArrowRightIcon className="h-6 w-6"/>}>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <button onClick={() => onNavigate(ViewMode.VIEW_EMPLOYEES)} className="p-4 font-semibold text-brand-dark border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-brand-primary transition-colors">All Employees</button>
                      <button onClick={() => onNavigate(ViewMode.VIEW_SALARY_REGISTER)} className="p-4 font-semibold text-brand-dark border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-brand-primary transition-colors">Salary Register</button>
                      <button onClick={() => onNavigate(ViewMode.VIEW_ALL_EVALUATIONS)} className="p-4 font-semibold text-brand-dark border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-brand-primary transition-colors">All Evaluations</button>
                      <button onClick={() => onNavigate(ViewMode.TRAINING_HUB)} className="p-4 font-semibold text-brand-dark border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-brand-primary transition-colors">Training Hub</button>
                      <button onClick={() => onNavigate(ViewMode.VIEW_ATTENDANCE_LOG)} className="p-4 font-semibold text-brand-dark border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-brand-primary transition-colors">Attendance Log</button>
                      <button onClick={() => onNavigate(ViewMode.MANAGE_DEPARTMENTS)} className="p-4 font-semibold text-brand-dark border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-brand-primary transition-colors">Departments</button>
                  </div>
              </Card>
               <Card title="Department Performance Snapshot" icon={<TrendingUpIcon className="h-6 w-6" />}>
                   <div className="space-y-3">
                       <div className="flex justify-between items-center p-3 bg-brand-light rounded-lg">
                           <p className="font-bold text-brand-primary">Machining</p>
                           <p className="font-semibold text-green-600">Avg. Score: 4.5</p>
                       </div>
                       <div className="flex justify-between items-center p-3 bg-brand-light rounded-lg">
                           <p className="font-bold text-brand-primary">Assembly</p>
                           <p className="font-semibold text-yellow-600">Avg. Score: 3.8</p>
                       </div>
                       <div className="flex justify-between items-center p-3 bg-brand-light rounded-lg">
                           <p className="font-bold text-brand-primary">Quality Control</p>
                           <p className="font-semibold text-green-600">Avg. Score: 4.2</p>
                       </div>
                   </div>
               </Card>
          </div>
          <div className="space-y-6">
               <Card title="Training Effectiveness" icon={<BookOpenIcon className="h-6 w-6" />}>
                   <ul className="space-y-3">
                       <li className="flex justify-between">
                           <span className="font-semibold text-brand-dark">Advanced CNC</span><span className="font-bold text-green-600">4.8</span>
                       </li>
                       <li className="flex justify-between">
                           <span className="font-semibold text-brand-dark">GD&T</span><span className="font-bold text-green-600">4.5</span>
                       </li>
                       <li className="flex justify-between">
                           <span className="font-semibold text-brand-dark">Safety Protocols</span><span className="font-bold text-yellow-500">3.5</span>
                       </li>
                   </ul>
               </Card>
          </div>
      </div>
    </div>
  );
};

export default ManagementDashboard;
