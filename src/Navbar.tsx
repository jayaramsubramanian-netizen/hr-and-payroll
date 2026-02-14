import React from "react";
import { useAuth } from "./AuthContext";

interface MenuItem {
  name: string;
  page: string;
  icon: string;
  roles: string[];
}

const Navbar: React.FC = () => {
  const { currentUser } = useAuth();

  // All menu items with role-based access
  const menuItems: MenuItem[] = [
    // Universal items (all users)
    {
      name: "Dashboard",
      page: "dashboard",
      icon: "🏠",
      roles: ["Employee", "Manager", "HR/Payroll", "Management"],
    },
    {
      name: "My Profile",
      page: "my-profile",
      icon: "👤",
      roles: ["Employee", "Manager", "HR/Payroll", "Management"],
    },
    {
      name: "My Payslips",
      page: "my-payslips",
      icon: "💰",
      roles: ["Employee", "Manager", "HR/Payroll", "Management"],
    },
    {
      name: "Clock In/Out",
      page: "clock-in-out",
      icon: "⏰",
      roles: ["Employee", "Manager", "HR/Payroll", "Management"],
    },
    {
      name: "Leave Management",
      page: "leave-management",
      icon: "🏖️",
      roles: ["Employee", "Manager", "HR/Payroll", "Management"],
    },

    // Manager+ features
    {
      name: "Employees",
      page: "employees",
      icon: "👥",
      roles: ["Manager", "HR/Payroll", "Management"],
    },
    {
      name: "Pending Requests",
      page: "pending-requests",
      icon: "⏳",
      roles: ["Manager", "HR/Payroll", "Management"],
    },
    {
      name: "Attendance Records",
      page: "attendance",
      icon: "📅",
      roles: ["Manager", "HR/Payroll", "Management"],
    },
    {
      name: "Reports",
      page: "reports",
      icon: "📊",
      roles: ["Manager", "HR/Payroll", "Management"],
    },

    // HR/Management only features
    {
      name: "Add Employee",
      page: "add-employee",
      icon: "➕",
      roles: ["HR/Payroll", "Management"],
    },
    {
      name: "Payroll",
      page: "payroll",
      icon: "💵",
      roles: ["HR/Payroll", "Management"],
    },

    {
      name: "Add Employee",
      page: "add-employee",
      icon: "➕",
      roles: ["HR/Payroll", "Management"],
    },
    {
      name: "Payroll",
      page: "payroll",
      icon: "💵",
      roles: ["HR/Payroll", "Management"],
    },
    {
      name: "Holidays",
      page: "holidays",
      icon: "📅",
      roles: ["HR/Payroll", "Management"],
    },
  ];

  // Filter menu items based on current user's role
  const visibleItems = currentUser
    ? menuItems.filter((item) => item.roles.includes(currentUser.role))
    : [];

  const handleNavigation = (page: string) => {
    const event = new CustomEvent("navigate", { detail: page });
    window.dispatchEvent(event);
  };

  if (!currentUser) {
    return null; // Don't show navbar if not logged in
  }

  return (
    <nav className="fixed top-20 left-0 bottom-0 bg-gradient-to-b from-slate-800 to-slate-900 text-white w-64 p-4 shadow-xl overflow-y-auto">
      {/* Logo/Company Name */}
      <div className="mb-8 pb-4 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
            <span className="text-lg font-bold">AV</span>
          </div>
          <div>
            <div className="font-bold text-lg">AVLM EL-MEC</div>
            <div className="text-xs text-slate-400">ERP System</div>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="mb-6 p-3 bg-slate-700/50 rounded-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-sm font-bold">
            {currentUser.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-sm truncate">
              {currentUser.name}
            </div>
            <div className="text-xs text-slate-400 truncate">
              {currentUser.role}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <ul className="space-y-1">
        {visibleItems.map((item) => (
          <li key={item.page}>
            <button
              onClick={() => handleNavigation(item.page)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all hover:bg-slate-700/50 active:bg-slate-600/50 group"
            >
              <span className="text-xl group-hover:scale-110 transition-transform">
                {item.icon}
              </span>
              <span className="font-medium">{item.name}</span>
            </button>
          </li>
        ))}
      </ul>

      {/* Logout at bottom */}
      <div className="mt-auto pt-4 border-t border-slate-700">
        <button
          onClick={() => {
            if (confirm("Are you sure you want to logout?")) {
              const event = new CustomEvent("navigate", { detail: "logout" });
              window.dispatchEvent(event);
            }
          }}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all hover:bg-red-500/20 text-red-400 hover:text-red-300"
        >
          <span className="text-xl">🚪</span>
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
