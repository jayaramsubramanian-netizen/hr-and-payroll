
import React, { useState, useMemo } from 'react';
import { TrainingTopic, TrainingSession, UserRole, User, ViewMode } from '../../../types';

interface TrainingManagementProps {
    topics: TrainingTopic[];
    sessions: TrainingSession[];
    users: User[];
    onUpdateTopicStatus: (topicId: string, newStatus: 'Approved' | 'Rejected') => void;
    onNavigate: (view: ViewMode, data?: any) => void;
    viewerRole: UserRole;
}

const TrainingManagement: React.FC<TrainingManagementProps> = ({ topics, sessions, users, onUpdateTopicStatus, onNavigate, viewerRole }) => {
    const [activeTab, setActiveTab] = useState('matrix');

    const renderContent = () => {
        switch (activeTab) {
            case 'topics':
                return <ApproveTopics topics={topics} onUpdateTopicStatus={onUpdateTopicStatus} />;
            case 'sessions':
                return <ViewSessions sessions={sessions} />;
            case 'matrix':
            default:
                return <TrainingMatrix 
                    users={users}
                    topics={topics.filter(t => t.status === 'Approved')} 
                    sessions={sessions}
                    isInteractive={viewerRole !== UserRole.EMPLOYEE}
                    onNavigate={onNavigate}
                />;
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200">
            <div className="border-b border-slate-200">
                <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                    <button onClick={() => setActiveTab('matrix')} className={`py-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'matrix' ? 'border-brand-accent text-brand-primary' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}>
                        Training Matrix
                    </button>
                     <button onClick={() => setActiveTab('topics')} className={`py-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'topics' ? 'border-brand-accent text-brand-primary' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}>
                        Approve Topics
                    </button>
                    <button onClick={() => setActiveTab('sessions')} className={`py-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'sessions' ? 'border-brand-accent text-brand-primary' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}>
                        Scheduled Sessions
                    </button>
                </nav>
            </div>
            <div className="pt-6">
                {renderContent()}
            </div>
        </div>
    );
};

// Sub-components for tabs
const ApproveTopics: React.FC<{ topics: TrainingTopic[], onUpdateTopicStatus: (topicId: string, status: 'Approved' | 'Rejected') => void }> = ({ topics, onUpdateTopicStatus }) => {
    const pendingTopics = topics.filter(t => t.status === 'Pending Approval');
    return (
        <div>
            <h3 className="font-semibold text-slate-800 mb-3">Pending Topic Approvals</h3>
            {pendingTopics.length > 0 ? (
                <ul className="space-y-2">
                {pendingTopics.map(topic => (
                    <li key={topic.id} className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex justify-between items-center">
                        <div>
                            <p className="font-bold text-yellow-800">{topic.title}</p>
                            <p className="text-sm text-slate-600">Department: {topic.department}</p>
                        </div>
                        <div className="space-x-2">
                            <button onClick={() => onUpdateTopicStatus(topic.id, 'Approved')} className="px-3 py-1 text-xs font-medium text-white bg-green-500 rounded-md hover:bg-green-600">Approve</button>
                            <button onClick={() => onUpdateTopicStatus(topic.id, 'Rejected')} className="px-3 py-1 text-xs font-medium text-white bg-red-500 rounded-md hover:bg-red-600">Reject</button>
                        </div>
                    </li>
                ))}
                </ul>
            ) : <p className="text-slate-500">No topics are pending approval.</p>}
        </div>
    );
};

const ViewSessions: React.FC<{ sessions: TrainingSession[] }> = ({ sessions }) => {
    const [filterTopic, setFilterTopic] = useState('all');
    const [filterTrainer, setFilterTrainer] = useState('all');
    const [sortBy, setSortBy] = useState('date-desc');

    const uniqueTopics = useMemo(() => [...new Set(sessions.map(s => s.topicTitle))], [sessions]);
    const uniqueTrainers = useMemo(() => [...new Set(sessions.map(s => s.trainer))], [sessions]);

    const filteredAndSortedSessions = useMemo(() => {
        let result = [...sessions];

        if (filterTopic !== 'all') {
            result = result.filter(s => s.topicTitle === filterTopic);
        }
        if (filterTrainer !== 'all') {
            result = result.filter(s => s.trainer === filterTrainer);
        }

        result.sort((a, b) => {
            if (sortBy === 'date-asc') {
                return a.scheduledDate.localeCompare(b.scheduledDate);
            }
            return b.scheduledDate.localeCompare(a.scheduledDate);
        });

        return result;
    }, [sessions, filterTopic, filterTrainer, sortBy]);

    const handleReset = () => {
        setFilterTopic('all');
        setFilterTrainer('all');
        setSortBy('date-desc');
    };

    return (
        <div>
            <div className="flex flex-wrap items-center gap-4 mb-4 p-3 bg-slate-50 rounded-lg border">
                <div className="flex-1 min-w-[150px]">
                    <label htmlFor="topic-filter" className="block text-xs font-medium text-slate-600">Filter by Topic</label>
                    <select id="topic-filter" value={filterTopic} onChange={e => setFilterTopic(e.target.value)} className="mt-1 block w-full border-slate-300 rounded-md shadow-sm text-sm p-2">
                        <option value="all">All Topics</option>
                        {uniqueTopics.map(topic => <option key={topic} value={topic}>{topic}</option>)}
                    </select>
                </div>
                <div className="flex-1 min-w-[150px]">
                     <label htmlFor="trainer-filter" className="block text-xs font-medium text-slate-600">Filter by Trainer</label>
                    <select id="trainer-filter" value={filterTrainer} onChange={e => setFilterTrainer(e.target.value)} className="mt-1 block w-full border-slate-300 rounded-md shadow-sm text-sm p-2">
                        <option value="all">All Trainers</option>
                        {uniqueTrainers.map(trainer => <option key={trainer} value={trainer}>{trainer}</option>)}
                    </select>
                </div>
                <div className="flex-1 min-w-[150px]">
                    <label htmlFor="date-sort" className="block text-xs font-medium text-slate-600">Sort by Date</label>
                    <select id="date-sort" value={sortBy} onChange={e => setSortBy(e.target.value)} className="mt-1 block w-full border-slate-300 rounded-md shadow-sm text-sm p-2">
                        <option value="date-desc">Newest First</option>
                        <option value="date-asc">Oldest First</option>
                    </select>
                </div>
                 <div className="self-end">
                    <button onClick={handleReset} className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-100">Reset</button>
                </div>
            </div>

            {filteredAndSortedSessions.length > 0 ? (
                <ul className="space-y-3">
                    {filteredAndSortedSessions.map(s => (
                        <li key={s.id} className="p-3 border border-slate-200 rounded-lg">
                            <p className="font-bold text-brand-primary">{s.topicTitle}</p>
                            <p className="text-sm text-slate-600">Date: {s.scheduledDate} | Trainer: {s.trainer}</p>
                            <p className="text-sm text-slate-600">Attendees: {s.attendees.length}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <div className="text-center py-10">
                    <p className="text-slate-500 font-semibold">No scheduled sessions match your criteria.</p>
                </div>
            )}
        </div>
    );
};

const Scorecard: React.FC<{ score: number | null }> = ({ score }) => {
    if (score === null) {
        return <span className="text-xs text-slate-500 italic">Not Scored</span>;
    }
    return (
        <div className="flex items-center justify-center space-x-1">
            {[1, 2, 3, 4, 5].map(dot => (
                <div key={dot} className={`w-3 h-3 rounded-full ${score >= dot ? 'bg-brand-primary' : 'bg-slate-200'}`}></div>
            ))}
        </div>
    );
};

interface TrainingMatrixProps {
    users: { id: string, name: string }[];
    topics: TrainingTopic[];
    sessions: TrainingSession[];
    isInteractive: boolean;
    onNavigate: (view: ViewMode, data?: any) => void;
}

export const TrainingMatrix: React.FC<TrainingMatrixProps> = ({ users, topics, sessions, isInteractive, onNavigate }) => {
    const renderCellContent = (user: {id: string; name: string}, topic: TrainingTopic) => {
        const session = sessions.find(s => s.topicId === topic.id);
        const attendee = session?.attendees.find(a => a.employeeId === user.id);

        if (!session || !attendee) {
             return <span className="px-2 py-1 text-xs font-medium rounded-full bg-slate-100 text-slate-600">Not Scheduled</span>;
        }

        if (session.status === 'Scheduled') {
             return <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">Scheduled</span>;
        }

        if (session.status === 'Completed') {
            if (isInteractive) {
                return (
                    <button 
                        onClick={() => onNavigate(ViewMode.UPDATE_TRAINING_SCORE, {
                            sessionId: session.id,
                            employeeId: user.id,
                            employeeName: user.name,
                            topicTitle: topic.title,
                            currentScore: attendee.score
                        })}
                        className="w-full h-full flex items-center justify-center p-2 rounded-md hover:bg-blue-50 transition-colors"
                        aria-label={`Set score for ${user.name} on ${topic.title}`}
                    >
                        <Scorecard score={attendee.score} />
                    </button>
                );
            }
            return <div className="p-2"><Scorecard score={attendee.score} /></div>;
        }
    };


    return (
        <div className="overflow-x-auto border border-slate-200 rounded-lg">
            <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                    <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase sticky left-0 bg-slate-50 z-10">Employee</th>
                        {topics.map(topic => (
                            <th key={topic.id} className="px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase whitespace-nowrap">{topic.title}</th>
                        ))}
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                    {users.map(user => (
                        <tr key={user.id}>
                            <td className="px-4 py-4 text-sm font-medium text-slate-900 sticky left-0 bg-white z-10">{user.name}</td>
                            {topics.map(topic => (
                                <td key={topic.id} className="px-4 py-4 text-center">
                                    {renderCellContent(user, topic)}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};


export default TrainingManagement;