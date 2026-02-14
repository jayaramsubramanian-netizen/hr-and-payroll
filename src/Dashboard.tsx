import React, { useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { supabase } from "./supabaseClient";
import UpcomingHolidaysWidget from "./components/UpcomingHolidaysWidget";
const Dashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState({
    totalEmployees: 0,
    totalDepartments: 0,
    pendingRequests: 0,
    activeEmployees: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser) {
      fetchStats();
    }
  }, [currentUser]);

  const fetchStats = async () => {
    try {
      setLoading(true);

      // Get all employees
      const { data: employees, error: empError } = await supabase
        .from("users")
        .select("department, employment_status");

      if (empError) throw empError;

      // Calculate stats
      const totalEmployees = employees?.length || 0;
      const activeEmployees =
        employees?.filter((e) => e.employment_status === "Active").length || 0;

      // Count unique departments
      const uniqueDepartments = new Set(
        employees?.map((e) => e.department).filter(Boolean),
      );
      const totalDepartments = uniqueDepartments.size;

      // Get pending onboarding requests
      let requestQuery = supabase
        .from("onboarding_requests")
        .select("id", { count: "exact" });

      if (currentUser?.role === "Manager") {
        requestQuery = requestQuery.eq("department", currentUser.department);
      }

      const { count: pendingCount } = await requestQuery;

      setStats({
        totalEmployees,
        totalDepartments,
        pendingRequests: pendingCount || 0,
        activeEmployees,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const getRoleSpecificGreeting = () => {
    switch (currentUser?.role) {
      case "Manager":
        return `Managing ${currentUser.department} Department`;
      case "HR/Payroll":
        return "Human Resources & Payroll Management";
      case "Management":
        return "Executive Dashboard";
      case "Employee":
        return "Employee Portal";
      default:
        return "Welcome to AVLM EL-MEC ERP";
    }
  };

  const pendingCount = stats.pendingRequests;

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Greeting */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {currentUser?.name}!
          </h1>
          <p className="text-gray-600 mt-2">{getRoleSpecificGreeting()}</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Employees</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {loading ? "..." : stats.totalEmployees}
                </p>
              </div>
              <div className="text-4xl">👥</div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Requests</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {loading ? "..." : stats.pendingRequests}
                </p>
              </div>
              <div className="text-4xl">⏳</div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">
                  {currentUser?.role === "Manager"
                    ? "Team Members"
                    : "Departments"}
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {loading ? "..." : stats.totalDepartments}
                </p>
              </div>
              <div className="text-4xl">🏢</div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Your Role</p>
                <p className="text-xl font-bold text-gray-900 mt-2">
                  {currentUser?.role}
                </p>
              </div>
              <div className="text-4xl">🎯</div>
            </div>
          </div>
        </div>
        {/* Upcoming Holidays Widget */}
        <div className="mb-6">
          <UpcomingHolidaysWidget />
        </div>
        {/* Quick Actions - Role Based */}
        {/* My Profile - All Users */}
        <div
          onClick={() => {
            const event = new CustomEvent("navigate", { detail: "my-profile" });
            window.dispatchEvent(event);
          }}
          className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-300 transition-all text-left cursor-pointer"
        >
          <div className="text-2xl mb-2">👤</div>
          <div className="font-semibold text-gray-900">My Profile</div>
          <div className="text-sm text-gray-600">
            View and update your information
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Kiosk Mode - HR & Management */}
            {(currentUser?.role === "HR/Payroll" ||
              currentUser?.role === "Management") && (
              <div
                onClick={() => {
                  window.location.hash = "kiosk";
                  window.dispatchEvent(new Event("openKiosk"));
                }}
                className="p-4 border-2 border-gray-200 rounded-lg hover:border-purple-300 transition-all text-left cursor-pointer"
              >
                <div className="text-2xl mb-2">🏭</div>
                <div className="font-semibold text-gray-900">Kiosk Mode</div>
                <div className="text-sm text-gray-600">
                  Shop floor attendance terminal
                </div>
              </div>
            )}

            {/* Add Employee - HR & Management */}
            {(currentUser?.role === "HR/Payroll" ||
              currentUser?.role === "Management") && (
              <div
                onClick={() => {
                  const event = new CustomEvent("navigate", {
                    detail: "add-employee",
                  });
                  window.dispatchEvent(event);
                }}
                className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-300 transition-all text-left cursor-pointer"
              >
                <div className="text-2xl mb-2">➕</div>
                <div className="font-semibold text-gray-900">Add Employee</div>
                <div className="text-sm text-gray-600">
                  Create new employee record
                </div>
              </div>
            )}

            {/* View Employees */}
            {currentUser?.role !== "Employee" && (
              <div
                onClick={() => {
                  const event = new CustomEvent("navigate", {
                    detail: "employees",
                  });
                  window.dispatchEvent(event);
                }}
                className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-300 transition-all text-left cursor-pointer"
              >
                <div className="text-2xl mb-2">👥</div>
                <div className="font-semibold text-gray-900">
                  View Employees
                </div>
                <div className="text-sm text-gray-600">
                  Browse employee directory
                </div>
              </div>
            )}

            {/* Leave Management - All Roles */}
            <div
              onClick={() => {
                const event = new CustomEvent("navigate", {
                  detail: "leave-management",
                });
                window.dispatchEvent(event);
              }}
              className="p-4 border-2 border-gray-200 rounded-lg hover:border-green-300 transition-all text-left cursor-pointer"
            >
              <div className="text-2xl mb-2">🏖️</div>
              <div className="font-semibold text-gray-900">
                Leave Management
              </div>
              <div className="text-sm text-gray-600">
                Request and approve leaves
              </div>
            </div>

            {/* Pending Requests */}
            {currentUser?.role !== "Employee" && pendingCount > 0 && (
              <div
                onClick={() => {
                  const event = new CustomEvent("navigate", {
                    detail: "pending-requests",
                  });
                  window.dispatchEvent(event);
                }}
                className="p-4 border-2 border-gray-200 rounded-lg hover:border-yellow-300 transition-all text-left cursor-pointer"
              >
                <div className="text-2xl mb-2">⏳</div>
                <div className="font-semibold text-gray-900">
                  Pending Requests
                </div>
                <div className="text-sm text-gray-600">
                  {pendingCount} request{pendingCount !== 1 ? "s" : ""} awaiting
                  review
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Recent Activity
          </h2>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 text-xl">✓</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  You logged in successfully
                </p>
                <p className="text-sm text-gray-600">
                  Welcome back, {currentUser?.name}
                </p>
              </div>
            </div>

            {pendingCount > 0 && (
              <div className="flex items-center gap-4 p-4 bg-yellow-50 rounded-lg">
                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                  <span className="text-yellow-600 text-xl">⏳</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {pendingCount} pending approval
                    {pendingCount !== 1 ? "s" : ""}
                  </p>
                  <p className="text-sm text-gray-600">
                    Review onboarding requests
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-xl">ℹ</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">System Status</p>
                <p className="text-sm text-gray-600">All systems operational</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
