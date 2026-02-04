
import React from 'react';
import { User, TrainingSession, TrainingTopic, PerformanceEvaluation } from '../../types';
import ScoreDisplayCard from '../shared/ScoreDisplayCard';
import { TrainingMatrix } from './training/TrainingManagement';

interface EmployeeProfilePageProps {
    employee: User;
    evaluations: PerformanceEvaluation[];
    sessions: TrainingSession[];
    topics: TrainingTopic[];
}

const EmployeeProfilePage: React.FC<EmployeeProfilePageProps> = ({ employee, evaluations, sessions, topics }) => {

    const avgTrainingScore = (() => {
        const scoredSessions = sessions
            .flatMap(s => s.attendees)
            .filter(a => a.employeeId === employee.id && a.score !== null);
        if (scoredSessions.length === 0) return null;
        const totalScore = scoredSessions.reduce((sum, a) => sum + a.score!, 0);
        return totalScore / scoredSessions.length;
    })();

    const avgEvaluationScore = (() => {
        const completedEvals = evaluations.filter(e => e.status === 'Completed' && e.employeeId === employee.id);
        if (completedEvals.length === 0) return null;
        const allKpiScores = completedEvals.flatMap(e => Object.values(e.kpis));
        if (allKpiScores.length === 0) return null;
        return allKpiScores.reduce((sum, score) => sum + score, 0) / allKpiScores.length;
    })();

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200">
                <h2 className="text-2xl font-bold text-brand-primary">{employee.name}</h2>
                <p className="text-slate-500">{employee.role} - {employee.department}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ScoreDisplayCard 
                    title="Avg. Training Score"
                    score={avgTrainingScore}
                    maxScore={5}
                    description="Average score from all completed training sessions."
                />
                <ScoreDisplayCard 
                    title="Avg. Performance Score"
                    score={avgEvaluationScore}
                    maxScore={5}
                    description="Average score from all completed performance evaluations."
                />
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200">
                 <h3 className="text-lg font-bold text-slate-800 mb-4">Training Matrix</h3>
                <TrainingMatrix
                    topics={topics.filter(t => t.department === employee.department && t.status === 'Approved')}
                    sessions={sessions}
                    users={[employee]}
                    isInteractive={false}
                    // FIX: Replaced non-existent `onOpenScoreModal` prop with the required `onNavigate` prop.
                    onNavigate={() => {}} // Dummy function, not interactive here
                />
            </div>
        </div>
    );
};

export default EmployeeProfilePage;
