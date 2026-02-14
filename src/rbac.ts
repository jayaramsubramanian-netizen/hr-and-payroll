export type Role = "admin" | "hr" | "manager" | "employee";

export type PageId =
  | "dashboard"
  | "employees"
  | "add-employee"
  | "pending-requests"
  | "reports";

export type Action =
  | "approve_onboarding"
  | "create_employee"
  | "view_reports";

export const roleLabels: Record<Role, string> = {
  admin: "Admin",
  hr: "HR",
  manager: "Manager",
  employee: "Employee",
};

const rolePermissions: Record<Role, PageId[]> = {
  admin: [
    "dashboard",
    "employees",
    "add-employee",
    "pending-requests",
    "reports",
  ],
  hr: ["dashboard", "employees", "add-employee", "pending-requests"],
  manager: ["dashboard", "employees", "reports"],
  employee: ["dashboard"],
};

const roleActions: Record<Role, Action[]> = {
  admin: ["approve_onboarding", "create_employee", "view_reports"],
  hr: ["approve_onboarding", "create_employee"],
  manager: ["view_reports"],
  employee: [],
};

export const canAccessPage = (role: Role, pageId: PageId) =>
  rolePermissions[role].includes(pageId);

export const getAllowedPages = (role: Role) => rolePermissions[role];

export const getDefaultPageForRole = (role: Role): PageId =>
  rolePermissions[role][0] ?? "dashboard";

export const canPerformAction = (role: Role, action: Action) =>
  roleActions[role].includes(action);
