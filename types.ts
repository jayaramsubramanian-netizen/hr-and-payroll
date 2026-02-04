
export enum UserRole {
  EMPLOYEE = 'Employee',
  MANAGER = 'Manager',
  HR_PAYROLL = 'HR/Payroll',
  MANAGEMENT = 'Management',
}

export interface PayrollInfo {
  basic: number;
  hra: number;
  allowances: number;
}

export interface BenefitConfig {
  enabled: boolean;
  valueType: 'PERCENTAGE' | 'FLAT_RUPEE';
  value: number;
}


export interface BenefitsEligibility {
  pf: BenefitConfig;
  esi: BenefitConfig;
  bonus: BenefitConfig;
  medicalInsurance: BenefitConfig;
}

export interface User {
  id: string;
  name:string;
  role: UserRole;
  department: string;
  payroll?: PayrollInfo;
  eligibility?: BenefitsEligibility;
  permanentAddress?: string;
  currentAddress?: string;
  personalEmail?: string;
  mobileNumber?: string;
}

export enum ViewMode {
  LOGIN = 'login',
  DASHBOARD = 'dashboard',
  KIOSK = 'kiosk',
  TRAINING_HUB = 'training_hub',
  
  // HR Pages
  ADD_EMPLOYEE = 'add_employee',
  VIEW_EMPLOYEES = 'view_employees',
  MANAGE_DEPARTMENTS = 'manage_departments',
  MANAGE_PAYROLL = 'manage_payroll',
  VIEW_SALARY_REGISTER = 'view_salary_register',
  VIEW_ATTENDANCE_LOG = 'view_attendance_log',
  VIEW_ALL_EVALUATIONS = 'view_all_evaluations',
  MANAGE_KPIS = 'manage_kpis',

  // Manager Pages
  INITIATE_EVALUATION = 'initiate_evaluation',
  SCHEDULE_TRAINING = 'schedule_training',
  SUGGEST_TRAINING_TOPIC = 'suggest_training_topic',
  
  // Pages with context
  APPROVAL_DETAILS = 'approval_details',
  EVALUATION_DETAILS = 'evaluation_details',
  EDIT_PAYROLL = 'edit_payroll',
  VIEW_PAYSLIP = 'view_payslip',
  UPDATE_MY_DETAILS = 'update_my_details',
  VIEW_EMPLOYEE_DETAILS = 'view_employee_details',
  UPDATE_TRAINING_SCORE = 'update_training_score',
}


export interface LeaveRequest {
  id: string;
  employeeName: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

export interface PayslipData {
    id: string;
    employeeId: string;
    employeeName: string;
    month: string;
    year: number;
    gross: number;
    pf: number;
    esi: number;
    professionalTax: number;
    net: number;
    earnings: {
        basic: number;
        hra: number;
        allowances: number;
    };
}

export interface OnboardingRequest {
  id: string; // Use employeeId as the unique ID for the request
  formData: any;
  status: 'Pending Manager Approval' | 'Pending HR Approval' | 'Rejected';
  managerId: string; // ID of the manager for the department
}

export interface PerformanceEvaluation {
    id: string;
    employeeId: string;
    employeeName: string;
    managerId: string;
    status: 'Pending Manager Review' | 'Pending Employee Comments' | 'Pending HR Finalization' | 'Completed';
    evaluationPeriod: string;
    kpis: {
        quality: number;
        productivity: number;
        technicalSkills: number;
        safety: number;
        teamwork: number;
    };
    managerComments: {
        strengths: string;
        improvements: string;
    };
    employeeComments: string;
    goals: string;
}

export interface TrainingTopic {
    id: string;
    title: string;
    department: string;
    status: 'Pending Approval' | 'Approved';
}

export interface TrainingAttendee {
    employeeId: string;
    score: number | null; // Score from 1-5, null if not scored yet
}

export interface TrainingSession {
    id: string;
    topicId: string;
    topicTitle: string;
    department: string;
    scheduledDate: string;
    trainer: string;
    attendees: TrainingAttendee[]; // array of employee IDs and their scores
    status: 'Scheduled' | 'Completed';
}

export interface AttendanceRecord {
    id: string;
    employeeId: string;
    employeeName: string;
    date: string; // YYYY-MM-DD
    clockIn: string; // HH:MM
    clockOut: string | null; // HH:MM or null if not clocked out
}

export interface KPI {
  id: string;
  name: string;
  value: string;
  target: string;
  progress: number; // 0-100
  lowerIsBetter?: boolean;
  trend: 'up' | 'down' | 'stable';
  dashboard: 'HR' | 'Manager'; // Specifies which dashboard to show on
}