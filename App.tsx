
import React, { useState, useCallback, useEffect } from 'react';
import { User, UserRole, ViewMode, OnboardingRequest, PerformanceEvaluation, TrainingTopic, TrainingSession, AttendanceRecord, KPI, PayslipData } from './types';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Kiosk from './components/Kiosk';
import TrainingManagement from './components/hr/training/TrainingManagement';
import PageWrapper from './components/shared/PageWrapper';

// Import components for new pages
import AddNewEmployeeForm from './components/hr/AddNewEmployeeForm';
import ViewAllEmployees from './components/hr/ViewAllEmployees';
import ManageDepartments from './components/hr/ManageDepartments';
import ManagePayroll from './components/hr/ManagePayroll';
import EditPayrollForm from './components/hr/EditPayrollForm';
import SalaryRegister from './components/hr/reports/SalaryRegister';
import AttendanceTracker from './components/hr/attendance/AttendanceTracker';
import ViewAllEvaluations from './components/hr/performance/ViewAllEvaluations';
import ManageKpis from './components/hr/kpi/ManageKpis';
import ApprovalDetailsView from './components/hr/ApprovalDetailsView';
import PerformanceEvaluationForm from './components/hr/performance/PerformanceEvaluationForm';
import InitiateEvaluationForm from './components/hr/performance/InitiateEvaluationForm';
import ScheduleTrainingForm from './components/hr/training/ScheduleTrainingForm';
import SuggestTrainingTopicForm from './components/hr/training/SuggestTrainingTopicForm';
import PayslipDetailView from './components/hr/reports/PayslipDetailView';
import UpdateDetailsForm from './components/employee/UpdateDetailsForm';
import EmployeeProfilePage from './components/hr/EmployeeProfilePage';
import UpdateScorePage from './components/hr/training/UpdateScorePage';

const defaultBenefit = (enabled: boolean) => ({ enabled, valueType: 'PERCENTAGE' as 'PERCENTAGE' | 'FLAT_RUPEE', value: 0 });

// Mock data
const initialUsers: User[] = [
  { 
    id: 'EMP001', name: 'Arjun Sharma', role: UserRole.EMPLOYEE, department: 'Machining',
    payroll: { basic: 30000, hra: 15000, allowances: 5000 },
    eligibility: {
        pf: { enabled: true, valueType: 'PERCENTAGE', value: 12 },
        esi: { enabled: true, valueType: 'FLAT_RUPEE', value: 375 },
        bonus: { enabled: true, valueType: 'PERCENTAGE', value: 8.33 },
        medicalInsurance: { enabled: false, valueType: 'FLAT_RUPEE', value: 0 }
    },
    personalEmail: 'arjun.sharma@example.com', mobileNumber: '9876543210'
  },
  { id: 'EMP002', name: 'Sunita Devi', role: UserRole.EMPLOYEE, department: 'Machining' },
  { id: 'EMP003', name: 'Kavita Singh', role: UserRole.EMPLOYEE, department: 'Assembly' },
  { id: 'EMP004', name: 'Anil Kumar', role: UserRole.EMPLOYEE, department: 'Quality Control' },
  { 
    id: 'MAN001', name: 'Priya Patel', role: UserRole.MANAGER, department: 'Machining',
    payroll: { basic: 50000, hra: 25000, allowances: 10000 },
    eligibility: {
        pf: { enabled: true, valueType: 'PERCENTAGE', value: 12 },
        esi: { enabled: true, valueType: 'FLAT_RUPEE', value: 638 },
        bonus: { enabled: true, valueType: 'PERCENTAGE', value: 10 },
        medicalInsurance: { enabled: true, valueType: 'FLAT_RUPEE', value: 5000 }
    }
  },
  { id: 'MAN002', name: 'Vijay Verma', role: UserRole.MANAGER, department: 'Assembly' },
  { id: 'HR001', name: 'Rohan Mehta', role: UserRole.HR_PAYROLL, department: 'Administration' },
  { id: 'CEO001', name: 'Rajan Verma', role: UserRole.MANAGEMENT, department: 'Corporate' },
];
const mockOnboardingRequest: OnboardingRequest = {
  id: 'EMP753', status: 'Pending Manager Approval', managerId: 'MAN001',
  formData: { fullName: 'Suresh Gupta', department: 'Machining', designation: 'CNC Operator', role: UserRole.EMPLOYEE }
};
const mockPerformanceEvaluation: PerformanceEvaluation = {
  id: 'PE001', employeeId: 'EMP001', employeeName: 'Arjun Sharma', managerId: 'MAN001', status: 'Pending Employee Comments', evaluationPeriod: 'Q3 2024',
  kpis: { quality: 4, productivity: 5, technicalSkills: 4, safety: 5, teamwork: 4 },
  managerComments: { strengths: 'Excellent attention to detail.', improvements: 'Can be more proactive in team meetings.' },
  employeeComments: '', goals: ''
};
const mockTrainingTopics: TrainingTopic[] = [
    { id: 'TRN01', title: 'Advanced CNC Programming', department: 'Machining', status: 'Approved' },
    { id: 'TRN02', title: 'Geometric Dimensioning & Tolerancing (GD&T)', department: 'Quality Control', status: 'Approved' },
    { id: 'TRN03', title: 'Lean Manufacturing Principles', department: 'Assembly', status: 'Pending Approval' },
];
const mockTrainingSessions: TrainingSession[] = [
    { 
      id: 'SES01', topicId: 'TRN01', topicTitle: 'Advanced CNC Programming', department: 'Machining', scheduledDate: '2024-09-15', trainer: 'External Consultant', 
      attendees: [
        { employeeId: 'EMP001', score: 4 },
        { employeeId: 'EMP002', score: 5 }
      ], 
      status: 'Completed' 
    }
];
const mockAttendanceRecords: AttendanceRecord[] = [
    { id: 'ATT001', employeeId: 'EMP001', employeeName: 'Arjun Sharma', date: new Date().toISOString().split('T')[0], clockIn: '09:02', clockOut: '17:31' },
    { id: 'ATT002', employeeId: 'EMP002', employeeName: 'Sunita Devi', date: new Date().toISOString().split('T')[0], clockIn: '08:58', clockOut: null },
    { id: 'ATT003', employeeId: 'EMP003', employeeName: 'Kavita Singh', date: new Date().toISOString().split('T')[0], clockIn: '09:05', clockOut: '17:25' },
];
const initialKpis: KPI[] = [
  { id: 'kpi1', name: 'Time to Hire', value: '32 Days', target: 'Target: < 45 Days', progress: 71, lowerIsBetter: true, trend: 'down', dashboard: 'HR' },
  { id: 'kpi2', name: 'Employee Turnover Rate', value: '8.5%', target: 'Target: < 10%', progress: 85, lowerIsBetter: true, trend: 'stable', dashboard: 'HR' },
  { id: 'kpi3', name: 'Training Completion Rate', value: '92%', target: 'Target: > 90%', progress: 92, trend: 'up', dashboard: 'HR' },
  { id: 'kpi4', name: 'Onboarding Satisfaction', value: '95%', target: 'Target: > 90%', progress: 95, trend: 'up', dashboard: 'HR' },
  { id: 'kpi5', name: 'Machine Uptime', value: '96%', target: 'Target: > 95%', progress: 96, trend: 'up', dashboard: 'Manager' },
  { id: 'kpi6', name: 'Part Rejection Rate', value: '1.2%', target: 'Target: < 2%', progress: 40, lowerIsBetter: true, trend: 'down', dashboard: 'Manager' },
  { id: 'kpi7', name: 'On-Time Delivery', value: '98%', target: 'Target: > 97%', progress: 98, trend: 'stable', dashboard: 'Manager' },
  { id: 'kpi8', name: 'Safety Incidents', value: '0', target: 'Target: 0', progress: 100, lowerIsBetter: true, trend: 'stable', dashboard: 'Manager' },
];
// End Mock Data

const App: React.FC = () => {
  // Core state
  const [view, setView] = useState<ViewMode>(ViewMode.LOGIN);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [notification, setNotification] = useState('');

  // Contextual state for pages
  const [selectedOnboardingRequest, setSelectedOnboardingRequest] = useState<OnboardingRequest | null>(null);
  const [selectedEvaluation, setSelectedEvaluation] = useState<PerformanceEvaluation | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedPayslip, setSelectedPayslip] = useState<PayslipData | null>(null);
  const [selectedEmployeeProfile, setSelectedEmployeeProfile] = useState<User | null>(null);
  const [selectedScoreContext, setSelectedScoreContext] = useState<any>(null);

  // Data state
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [onboardingRequests, setOnboardingRequests] = useState<OnboardingRequest[]>([mockOnboardingRequest]);
  const [evaluations, setEvaluations] = useState<PerformanceEvaluation[]>([mockPerformanceEvaluation]);
  const [trainingTopics, setTrainingTopics] = useState<TrainingTopic[]>(mockTrainingTopics);
  const [trainingSessions, setTrainingSessions] = useState<TrainingSession[]>(mockTrainingSessions);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(mockAttendanceRecords);
  const [kpis, setKpis] = useState<KPI[]>(initialKpis);
  
  const showNotification = (message: string) => {
      setNotification(message);
      setTimeout(() => setNotification(''), 4000);
  };
  
  useEffect(() => {
    if (view === ViewMode.DASHBOARD && currentUser) {
        const firstName = currentUser.name.split(' ')[0];
        showNotification(`Welcome back, ${firstName}!`);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view, currentUser]);

  // --- Core Navigation ---
  const handleLogin = useCallback((username: string) => {
    const user = users.find(u => u.id === username.toUpperCase());
    if (user) { setCurrentUser(user); setView(ViewMode.DASHBOARD); return true; }
    return false;
  }, [users]);
  const handleLogout = useCallback(() => { setCurrentUser(null); setView(ViewMode.LOGIN); }, []);
  const switchToKiosk = useCallback(() => { setView(ViewMode.KIOSK); }, []);
  const switchToDashboard = useCallback(() => { 
    setView(ViewMode.DASHBOARD);
    // Clear context on return to dashboard
    setSelectedOnboardingRequest(null);
    setSelectedEvaluation(null);
    setSelectedUser(null);
    setSelectedPayslip(null);
    setSelectedEmployeeProfile(null);
    setSelectedScoreContext(null);
  }, []);

  // --- Page Navigation Handlers ---
  const handleNavigateTo = (targetView: ViewMode, data?: any) => {
      if (data) {
          if (targetView === ViewMode.APPROVAL_DETAILS) setSelectedOnboardingRequest(data);
          else if (targetView === ViewMode.EVALUATION_DETAILS) setSelectedEvaluation(data);
          else if (targetView === ViewMode.EDIT_PAYROLL) setSelectedUser(data);
          else if (targetView === ViewMode.VIEW_PAYSLIP) setSelectedPayslip(data);
          else if (targetView === ViewMode.VIEW_EMPLOYEE_DETAILS) setSelectedEmployeeProfile(data);
          else if (targetView === ViewMode.UPDATE_TRAINING_SCORE) setSelectedScoreContext(data);
      }
      setView(targetView);
  };

  // --- Data Mutation Handlers ---
  const handleNewOnboardingRequest = (request: OnboardingRequest) => setOnboardingRequests(prev => [...prev, request]);
  
  const handleAddNewEmployee = useCallback((newEmployeeData: any) => {
      const newUser: User = {
          id: newEmployeeData.employeeId, name: newEmployeeData.fullName, role: newEmployeeData.role as UserRole,
          department: newEmployeeData.department,
          payroll: { basic: newEmployeeData.basicSalary, hra: newEmployeeData.hra, allowances: newEmployeeData.allowances, },
          eligibility: {
            pf: defaultBenefit(newEmployeeData.pf), esi: defaultBenefit(newEmployeeData.esi),
            bonus: defaultBenefit(newEmployeeData.bonus), medicalInsurance: defaultBenefit(newEmployeeData.medicalInsurance),
          }
      };
      setUsers(prevUsers => [...prevUsers, newUser]);
  }, []);
  
  const handleUpdateOnboardingRequest = (requestId: string, newStatus: OnboardingRequest['status'], message: string) => {
     setOnboardingRequests(prev => prev.map(req => 
        req.id === requestId ? { ...req, status: newStatus } : req
      ).filter(req => newStatus !== 'Rejected' || req.id !== requestId)
    );
    showNotification(message);
    switchToDashboard();
  };
  
  const handleSuggestTopic = (topicData: { title: string, department: string }) => {
    const newTopic: TrainingTopic = {
      id: `TRN${Math.floor(10 + Math.random() * 90)}`, ...topicData, status: 'Pending Approval'
    };
    setTrainingTopics(prev => [...prev, newTopic]);
    showNotification(`Training topic "${topicData.title}" submitted for HR approval.`);
    switchToDashboard();
  };

  const handleUpdateTopicStatus = (topicId: string, newStatus: 'Approved' | 'Rejected') => {
    if (newStatus === 'Rejected') setTrainingTopics(prev => prev.filter(t => t.id !== topicId));
    else setTrainingTopics(prev => prev.map(t => t.id === topicId ? { ...t, status: newStatus } : t));
  };
  
  const handleInitiateEvaluation = (evalData: { employeeId: string, employeeName: string, managerId: string, evaluationPeriod: string }) => {
    const newEvaluation: PerformanceEvaluation = {
        id: `PE${Math.floor(100 + Math.random() * 900)}`, ...evalData, status: 'Pending Manager Review',
        kpis: { quality: 0, productivity: 0, technicalSkills: 0, safety: 0, teamwork: 0 },
        managerComments: { strengths: '', improvements: '' }, employeeComments: '', goals: '',
    };
    setEvaluations(prev => [...prev, newEvaluation]);
    showNotification(`Evaluation for ${evalData.employeeName} has been initiated.`);
    switchToDashboard();
  };
  
  const handleUpdateEvaluation = (evaluationId: string, updatedData: any) => {
    setEvaluations(prev => prev.map(ev => (ev.id === evaluationId ? { ...ev, status: 'Completed' } : ev)));
    showNotification(`Evaluation has been finalized.`);
    switchToDashboard();
  };
  
  const handleScheduleTraining = (sessionData: Omit<TrainingSession, 'id' | 'status'>) => {
      const newSession: TrainingSession = { id: `SES${Math.floor(10 + Math.random() * 90)}`, ...sessionData, status: 'Scheduled' };
      setTrainingSessions(prev => [...prev, newSession]);
      showNotification(`Training session "${sessionData.topicTitle}" has been scheduled.`);
      switchToDashboard();
  };
  
  const handleUpdateTrainingScore = (sessionId: string, employeeId: string, score: number) => {
    setTrainingSessions(prevSessions =>
        prevSessions.map(session => {
            if (session.id === sessionId) {
                return {
                    ...session,
                    attendees: session.attendees.map(attendee =>
                        attendee.employeeId === employeeId ? { ...attendee, score } : attendee
                    ),
                };
            }
            return session;
        })
    );
    showNotification(`Score updated successfully.`);
  };

  const handleUpdateMyDetails = (updatedData: Partial<User>) => {
    if (currentUser) {
      const updatedUser = { ...currentUser, ...updatedData };
      setCurrentUser(updatedUser);
      setUsers(users.map(u => u.id === currentUser.id ? updatedUser : u));
      showNotification('Your details have been updated successfully.');
      switchToDashboard();
    }
  };

  const handleClockAction = (employeeId: string, action: 'Clock In' | 'Clock Out') => { /* ... existing logic ... */ };
  const handleUpdateAttendance = (recordId: string, newClockIn: string, newClockOut: string | null) => { /* ... existing logic ... */ };

  const handleAddOrUpdateKpi = (kpiData: Omit<KPI, 'id'> & { id?: string }) => {
    setKpis(prev => {
      const existingIndex = kpiData.id ? prev.findIndex(k => k.id === kpiData.id) : -1;
      if (existingIndex > -1) {
        const updatedKpis = [...prev];
        updatedKpis[existingIndex] = { ...prev[existingIndex], ...kpiData };
        return updatedKpis;
      } else {
        const newKpi: KPI = { ...kpiData, id: `kpi${Date.now()}` };
        return [...prev, newKpi];
      }
    });
    showNotification(`KPI "${kpiData.name}" has been saved.`);
    handleNavigateTo(ViewMode.DASHBOARD);
  };
  
  // --- Main Render Logic ---
  const renderView = () => {
    switch (view) {
      case ViewMode.LOGIN: return <Login onLogin={handleLogin} onSwitchToKiosk={switchToKiosk} />;
      case ViewMode.KIOSK: return <Kiosk onExitKiosk={handleLogout} onClockAction={handleClockAction} />;
      
      case ViewMode.DASHBOARD:
        if (currentUser) {
          const managerTeam = users.filter(u => u.department === currentUser.department && u.role === UserRole.EMPLOYEE);
          return <Dashboard 
            user={currentUser} onLogout={handleLogout} onNavigate={handleNavigateTo} notification={notification}
            onboardingRequests={onboardingRequests} evaluations={evaluations}
            trainingTopics={trainingTopics} trainingSessions={trainingSessions}
            attendanceRecords={attendanceRecords} kpis={kpis}
            users={users} team={managerTeam}
          />;
        }
        setView(ViewMode.LOGIN); return null;
      
      case ViewMode.TRAINING_HUB:
        if (currentUser) {
            return (
              <PageWrapper title="Training Management Hub" onBack={switchToDashboard} isDocument={true}>
                <TrainingManagement 
                    users={users.filter(u => u.role === UserRole.EMPLOYEE || u.role === UserRole.MANAGER)}
                    topics={trainingTopics} 
                    sessions={trainingSessions} 
                    onUpdateTopicStatus={handleUpdateTopicStatus}
                    onNavigate={handleNavigateTo}
                    viewerRole={currentUser.role}
                />
              </PageWrapper>
            );
        }
        break;

      case ViewMode.ADD_EMPLOYEE:
        return <PageWrapper title="Add New Employee" onBack={switchToDashboard}>
            <AddNewEmployeeForm 
                onClose={switchToDashboard} 
                onSave={(formData) => {
                    const newRequest: OnboardingRequest = {
                        id: formData.employeeId, formData: formData, status: 'Pending Manager Approval', managerId: 'MAN001'
                    };
                    handleNewOnboardingRequest(newRequest);
                    showNotification(`Onboarding for ${formData.fullName} sent for manager approval.`);
                    switchToDashboard();
                }}
            />
        </PageWrapper>;
        
      case ViewMode.VIEW_EMPLOYEES:
        return <PageWrapper title="All Employees" onBack={switchToDashboard} isDocument={true}><ViewAllEmployees /></PageWrapper>;

      case ViewMode.MANAGE_DEPARTMENTS:
        return <PageWrapper title="Manage Departments" onBack={switchToDashboard}><ManageDepartments /></PageWrapper>;
        
      case ViewMode.MANAGE_PAYROLL:
        return <PageWrapper title="Manage Payroll & Benefits" onBack={switchToDashboard}>
            <ManagePayroll onEditUser={(user) => handleNavigateTo(ViewMode.EDIT_PAYROLL, user)} />
        </PageWrapper>;

      case ViewMode.EDIT_PAYROLL:
        if (selectedUser) {
            return <PageWrapper title={`Edit Payroll: ${selectedUser.name}`} onBack={() => handleNavigateTo(ViewMode.MANAGE_PAYROLL)}>
                <EditPayrollForm user={selectedUser} onCancel={() => handleNavigateTo(ViewMode.MANAGE_PAYROLL)} onSave={(data) => {
                    console.log('Saving payroll for:', selectedUser.id, data);
                    showNotification(`Payroll for ${selectedUser.name} has been updated.`);
                    handleNavigateTo(ViewMode.MANAGE_PAYROLL);
                }}/>
            </PageWrapper>;
        }
        break;
        
      case ViewMode.VIEW_SALARY_REGISTER:
        return <PageWrapper title="Salary Register" onBack={switchToDashboard} isDocument={true}><SalaryRegister /></PageWrapper>;

      case ViewMode.VIEW_ATTENDANCE_LOG:
        return <PageWrapper title="Attendance Management" onBack={switchToDashboard} isDocument={true}><AttendanceTracker records={attendanceRecords} onSave={handleUpdateAttendance} isEditable={true} /></PageWrapper>;
        
      case ViewMode.VIEW_ALL_EVALUATIONS:
        return <PageWrapper title="All Performance Evaluations" onBack={switchToDashboard} isDocument={true}>
            <ViewAllEvaluations evaluations={evaluations} onViewEvaluation={(evalItem) => handleNavigateTo(ViewMode.EVALUATION_DETAILS, evalItem)} />
        </PageWrapper>;

      case ViewMode.EVALUATION_DETAILS:
        if (selectedEvaluation && currentUser) {
            const isFinalized = selectedEvaluation.status === 'Completed';
            return <PageWrapper title={`Review: ${selectedEvaluation.employeeName}`} onBack={() => handleNavigateTo(ViewMode.VIEW_ALL_EVALUATIONS)} isDocument={isFinalized}>
                <PerformanceEvaluationForm evaluation={selectedEvaluation} userRole={currentUser.role} onSave={(data) => {
                    handleUpdateEvaluation(selectedEvaluation.id, data);
                }}/>
            </PageWrapper>;
        }
        break;
        
      case ViewMode.MANAGE_KPIS:
        if(currentUser) {
            const relevantKpis = currentUser.role === UserRole.MANAGER ? kpis.filter(k => k.dashboard === 'Manager') : kpis;
            return <PageWrapper title="Manage KPIs" onBack={switchToDashboard}>
                <ManageKpis allKpis={relevantKpis} onSave={handleAddOrUpdateKpi} userRole={currentUser.role} />
            </PageWrapper>;
        }
        break;

      case ViewMode.APPROVAL_DETAILS:
        if (selectedOnboardingRequest && currentUser) {
            return <PageWrapper title="Review Onboarding" onBack={switchToDashboard} isDocument={true}>
                <ApprovalDetailsView
                    request={selectedOnboardingRequest}
                    viewerRole={currentUser.role}
                    onApprove={() => {
                        if (currentUser.role === UserRole.HR_PAYROLL) {
                            handleAddNewEmployee(selectedOnboardingRequest.formData);
                            handleUpdateOnboardingRequest(selectedOnboardingRequest.id, 'Rejected', `Employee ${selectedOnboardingRequest.formData.fullName} approved and added.`);
                        } else {
                            handleUpdateOnboardingRequest(selectedOnboardingRequest.id, 'Pending HR Approval', `${selectedOnboardingRequest.formData.fullName} approved, sent to HR.`);
                        }
                    }}
                    onReject={() => handleUpdateOnboardingRequest(selectedOnboardingRequest.id, 'Rejected', `Onboarding for ${selectedOnboardingRequest.formData.fullName} was rejected.`)}
                />
            </PageWrapper>;
        }
        break;
        
      case ViewMode.INITIATE_EVALUATION:
         if (currentUser) {
            const teamMembers = users.filter(u => u.role === UserRole.EMPLOYEE && u.department === currentUser.department);
            return <PageWrapper title="Initiate Performance Evaluation" onBack={switchToDashboard}>
                <InitiateEvaluationForm teamMembers={teamMembers} onCancel={switchToDashboard} onSave={(data) => handleInitiateEvaluation({...data, managerId: currentUser.id})} />
            </PageWrapper>;
         }
         break;
         
      case ViewMode.SCHEDULE_TRAINING:
        if (currentUser) {
            const teamMembers = users.filter(u => u.role === UserRole.EMPLOYEE && u.department === currentUser.department);
            return <PageWrapper title="Schedule Training" onBack={switchToDashboard}>
                <ScheduleTrainingForm approvedTopics={trainingTopics.filter(t => t.status === 'Approved')} teamMembers={teamMembers} onCancel={switchToDashboard} onSave={(data) => handleScheduleTraining({ ...data, attendees: data.attendees.map(id => ({ employeeId: id, score: null })), department: currentUser.department })} />
            </PageWrapper>;
        }
        break;
        
      case ViewMode.SUGGEST_TRAINING_TOPIC:
        if (currentUser) {
            return <PageWrapper title="Suggest New Training Topic" onBack={switchToDashboard}>
                <SuggestTrainingTopicForm onCancel={switchToDashboard} onSave={(data) => handleSuggestTopic({ ...data, department: currentUser.department })} />
            </PageWrapper>;
        }
        break;

      case ViewMode.VIEW_PAYSLIP:
        if (selectedPayslip) {
          return <PageWrapper title={`Payslip: ${selectedPayslip.month} ${selectedPayslip.year}`} onBack={switchToDashboard} isDocument={true}>
              <PayslipDetailView payslip={selectedPayslip} />
          </PageWrapper>
        }
        break;

      case ViewMode.UPDATE_MY_DETAILS:
        if (currentUser) {
          return <PageWrapper title="Update My Details" onBack={switchToDashboard}>
            <UpdateDetailsForm user={currentUser} onSave={handleUpdateMyDetails} onCancel={switchToDashboard}/>
          </PageWrapper>
        }
        break;

      case ViewMode.VIEW_EMPLOYEE_DETAILS:
        if (selectedEmployeeProfile) {
           return <PageWrapper title={`Profile: ${selectedEmployeeProfile.name}`} onBack={switchToDashboard}>
              <EmployeeProfilePage
                employee={selectedEmployeeProfile}
                evaluations={evaluations.filter(e => e.employeeId === selectedEmployeeProfile.id)}
                sessions={trainingSessions.filter(s => s.attendees.some(a => a.employeeId === selectedEmployeeProfile.id))}
                topics={trainingTopics}
              />
          </PageWrapper>
        }
        break;
      
      case ViewMode.UPDATE_TRAINING_SCORE:
        if (selectedScoreContext) {
            return <PageWrapper title={`Update Score: ${selectedScoreContext.topicTitle}`} onBack={() => handleNavigateTo(ViewMode.TRAINING_HUB)}>
                <UpdateScorePage
                    employeeName={selectedScoreContext.employeeName}
                    topicTitle={selectedScoreContext.topicTitle}
                    currentScore={selectedScoreContext.currentScore}
                    onCancel={() => handleNavigateTo(ViewMode.TRAINING_HUB)}
                    onSave={(newScore) => {
                        handleUpdateTrainingScore(selectedScoreContext.sessionId, selectedScoreContext.employeeId, newScore);
                        handleNavigateTo(ViewMode.TRAINING_HUB);
                    }}
                />
            </PageWrapper>;
        }
        break;


      default: return <Login onLogin={handleLogin} onSwitchToKiosk={switchToKiosk} />;
    }
    // Fallback to dashboard if a page is rendered without necessary context
    switchToDashboard();
    return null;
  };

  return (
    <div className="min-h-screen font-sans text-slate-800">
      {renderView()}
    </div>
  );
};

export default App;
