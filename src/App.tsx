import { useState, useEffect } from "react";
import { AuthProvider, useAuth } from "./AuthContext";
import Header from "./Header";
import Navbar from "./Navbar";
import LoginPage from "./LoginPage";
import Dashboard from "./Dashboard";
import ViewAllEmployees from "./ViewAllEmployees";
import AddEmployeePage from "./AddEmployeePage";
import PendingRequestsPage from "./PendingRequestsPage";
import PayrollManagementPage from "./PayrollManagement";
import ReportsPage from "./ReportsPage";
import MyPayslipsPage from "./MyPayslipsPage";
import AttendanceManagementPage from "./AttendanceManagementPage";
import LeaveManagementPage from "./LeaveManagementPage";
import KioskModePage from "./KioskModePage";
import ClockInOutPage from "./ClockInOutPage";
import EmployeeProfilePage from "./EmployeeProfilePage";
import HolidayManagementPage from "./HolidayManagementPage";

function AppContent() {
  const { currentUser, isLoading } = useAuth();
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [pageData, setPageData] = useState<any>(null);
  const [showKiosk, setShowKiosk] = useState(false);

  // Listen for kiosk mode requests
  useEffect(() => {
    const handleKioskRequest = () => {
      setShowKiosk(true);
    };

    const handleHashChange = () => {
      if (window.location.hash === "#kiosk") {
        setShowKiosk(true);
      }
    };

    window.addEventListener("openKiosk", handleKioskRequest);
    window.addEventListener("hashchange", handleHashChange);

    // Check on mount
    if (window.location.hash === "#kiosk") {
      setShowKiosk(true);
    }

    return () => {
      window.removeEventListener("openKiosk", handleKioskRequest);
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  // Add navigation event listener
  useEffect(() => {
    const handleNavigate = (e: any) => {
      setCurrentPage(e.detail);
      // Handle extra data if present
      if (e.extraData) {
        setPageData(e.extraData);
      } else {
        setPageData(null);
      }
    };

    window.addEventListener("navigate", handleNavigate);
    return () => window.removeEventListener("navigate", handleNavigate);
  }, []);

  const renderPage = () => {
    if (!currentUser) return null;
    // DEBUG: Log current state
    console.log("Current Page:", currentPage);
    console.log("Current User:", currentUser);
    console.log("User Role:", currentUser.role);

    switch (currentPage) {
      case "dashboard":
        return <Dashboard />;

      case "employees":
        if (
          ["Manager", "HR/Payroll", "Management"].includes(currentUser.role)
        ) {
          return <ViewAllEmployees />;
        }
        return <UnauthorizedPage />;

      case "add-employee":
        if (["HR/Payroll", "Management"].includes(currentUser.role)) {
          return <AddEmployeePage />;
        }
        return <UnauthorizedPage />;

      case "pending-requests":
        if (
          ["Manager", "HR/Payroll", "Management"].includes(currentUser.role)
        ) {
          return <PendingRequestsPage />;
        }
        return <UnauthorizedPage />;

      case "payroll":
        if (["HR/Payroll", "Management"].includes(currentUser.role)) {
          return <PayrollManagementPage />;
        }
        return <UnauthorizedPage />;

      case "my-payslips":
        return <MyPayslipsPage />;

      case "clock-in-out":
        return <ClockInOutPage />;

      case "attendance":
        if (
          ["Manager", "HR/Payroll", "Management"].includes(currentUser.role)
        ) {
          return <AttendanceManagementPage />;
        }
        return <UnauthorizedPage />;

      case "leave-management":
        return <LeaveManagementPage />;

      case "reports":
        if (
          ["Manager", "HR/Payroll", "Management"].includes(currentUser.role)
        ) {
          return <ReportsPage />;
        }
        return <UnauthorizedPage />;
      case "my-profile":
        return <EmployeeProfilePage />;

      case "employee-profile":
        return <EmployeeProfilePage employeeId={pageData?.employeeId} />;
      default:
        return <Dashboard />;
      case "holidays":
        return <HolidayManagementPage />;
    }
  };

  // Kiosk Mode - No Authentication Required
  if (showKiosk) {
    return <KioskModePage />;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <LoginPage />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Navbar />
      <main className="ml-64 pt-20">{renderPage()}</main>
    </div>
  );
}

// Unauthorized page component
const UnauthorizedPage = () => (
  <div className="p-6">
    <div className="max-w-2xl mx-auto">
      <div className="bg-white p-8 rounded-lg shadow-sm text-center">
        <div className="text-6xl mb-4">🔒</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
        <p className="text-gray-600">
          You don't have permission to access this page.
        </p>
      </div>
    </div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
export default App;
