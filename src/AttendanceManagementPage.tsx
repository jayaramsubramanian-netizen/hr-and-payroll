import React, { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import { useAuth } from "./AuthContext";

const LoadingScreen: React.FC<{ message?: string }> = ({
  message = "Loading...",
}) => (
  <div className="flex items-center justify-center h-screen">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900 mb-4" />
      <div>{message}</div>
    </div>
  </div>
);

// Print styles for A4
const printStyles = `
  @media print {
    @page {
      size: A4;
      margin: 1cm;
    }
    
    body * {
      visibility: hidden;
    }
    
    #attendance-print-area,
    #attendance-print-area * {
      visibility: visible;
    }
    
    #attendance-print-area {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
    }
    
    .no-print {
      display: none !important;
    }
    
    .print-only {
      display: block !important;
    }
    
    table {
      page-break-inside: auto;
      font-size: 10pt;
    }
    
    tr {
      page-break-inside: avoid;
      page-break-after: auto;
    }
    
    thead {
      display: table-header-group;
    }
    
    tfoot {
      display: table-footer-group;
    }
    
    th, td {
      padding: 8px 12px !important;
    }
  }
  
  .print-only {
    display: none;
  }
`;

const AttendanceManagementPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [attendanceData, setAttendanceData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"daily" | "monthly">("daily");
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().substring(0, 7),
  );

  useEffect(() => {
    if (currentUser) {
      if (viewMode === "daily") {
        fetchDailyAttendance();
      } else {
        fetchMonthlyAttendance();
      }
    }
  }, [currentUser, selectedDate, viewMode, selectedMonth]);

  const fetchDailyAttendance = async () => {
    if (!currentUser) return;

    try {
      setLoading(true);

      // Get all employees
      let employeeQuery = supabase
        .from("users")
        .select("id, name, department, role");

      // Filter by department for managers
      if (currentUser.role === "manager") {
        employeeQuery = employeeQuery.eq("department", currentUser.department);
      }

      const { data: employees, error: empError } = await employeeQuery;
      if (empError) throw empError;

      // Get attendance for selected date
      const { data: attendance, error: attError } = await supabase
        .from("attendance")
        .select("*")
        .eq("date", selectedDate);

      if (attError) throw attError;

      // Combine data
      const combined =
        employees?.map((emp) => {
          const attRecord = attendance?.find(
            (att) => att.employee_id === emp.id,
          );
          return {
            ...emp,
            attendance: attRecord,
            status: attRecord ? attRecord.status : "Absent",
            clock_in: attRecord?.clock_in || "-",
            clock_out: attRecord?.clock_out || "-",
            total_hours: attRecord?.total_hours || 0,
          };
        }) || [];

      setAttendanceData(combined);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMonthlyAttendance = async () => {
    if (!currentUser) return;

    try {
      setLoading(true);

      // Get all employees
      let employeeQuery = supabase
        .from("users")
        .select("id, name, department, role");

      if (currentUser.role === "manager") {
        employeeQuery = employeeQuery.eq("department", currentUser.department);
      }

      const { data: employees, error: empError } = await employeeQuery;
      if (empError) throw empError;

      // Get attendance for selected month
      const startDate = `${selectedMonth}-01`;
      const endDate = `${selectedMonth}-31`;

      const { data: attendance, error: attError } = await supabase
        .from("attendance")
        .select("*")
        .gte("date", startDate)
        .lte("date", endDate);

      if (attError) throw attError;

      // Calculate monthly summary
      const summary =
        employees?.map((emp) => {
          const empAttendance =
            attendance?.filter((att) => att.employee_id === emp.id) || [];
          const totalPresent = empAttendance.filter(
            (a) => a.status === "Present",
          ).length;
          const totalHours = empAttendance.reduce(
            (sum, a) => sum + (a.total_hours || 0),
            0,
          );

          return {
            ...emp,
            totalPresent,
            totalAbsent: getDaysInMonth(selectedMonth) - totalPresent,
            totalHours: totalHours.toFixed(2),
            attendancePercentage: (
              (totalPresent / getDaysInMonth(selectedMonth)) *
              100
            ).toFixed(1),
          };
        }) || [];

      setAttendanceData(summary);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const getDaysInMonth = (yearMonth: string) => {
    const [year, month] = yearMonth.split("-").map(Number);
    return new Date(year, month, 0).getDate();
  };

  const markAttendance = async (
    employeeId: string,
    status: "Present" | "Absent" | "Leave",
  ) => {
    try {
      const attendanceId = `ATT-${employeeId}-${selectedDate}-1`;

      const { error } = await supabase.from("attendance").upsert(
        {
          id: attendanceId,
          employee_id: employeeId,
          date: selectedDate,
          status: status,
          clock_in: status === "Present" ? "09:00" : null,
          clock_out: status === "Present" ? "17:00" : null,
          total_hours: status === "Present" ? 8 : 0,
          entry_number: 1,
        },
        { onConflict: "employee_id,date,entry_number" },
      );

      if (error) throw error;

      alert(`✅ Attendance marked as ${status}`);
      fetchDailyAttendance();
    } catch (error: any) {
      console.error("Error:", error);
      alert(`❌ Error: ${error.message}`);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Present":
        return "bg-green-100 text-green-800";
      case "Absent":
        return "bg-red-100 text-red-800";
      case "Leave":
        return "bg-blue-100 text-blue-800";
      case "Half Day":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return <LoadingScreen message="Loading attendance data..." />;
  }

  return (
    <div className="p-6">
      <style>{printStyles}</style>
      <div className="max-w-7xl mx-auto">
        {/* Header - No Print */}
        <div className="mb-6 no-print">
          <h1 className="text-3xl font-bold text-gray-900">
            Attendance Management
          </h1>
          <p className="text-gray-600 mt-2">
            {currentUser?.role === "manager"
              ? `Managing attendance for ${currentUser.department} department`
              : "Manage employee attendance records"}
          </p>
        </div>

        {/* Controls - No Print */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6 no-print">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* View Mode Toggle */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                View Mode
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode("daily")}
                  className={`flex-1 px-4 py-2 rounded-lg transition-all ${
                    viewMode === "daily"
                      ? "text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                  style={
                    viewMode === "daily" ? { backgroundColor: "#AB2328" } : {}
                  }
                >
                  Daily
                </button>
                <button
                  onClick={() => setViewMode("monthly")}
                  className={`flex-1 px-4 py-2 rounded-lg transition-all ${
                    viewMode === "monthly"
                      ? "text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                  style={
                    viewMode === "monthly" ? { backgroundColor: "#AB2328" } : {}
                  }
                >
                  Monthly
                </button>
              </div>
            </div>

            {/* Date/Month Selector */}
            {viewMode === "daily" ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Date
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Month
                </label>
                <input
                  type="month"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            {/* Summary Stats */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">
                {viewMode === "daily" ? "Today's Summary" : "Monthly Summary"}
              </p>
              <p className="text-2xl font-bold" style={{ color: "#06038D" }}>
                {attendanceData.length}{" "}
                {attendanceData.length === 1 ? "Employee" : "Employees"}
              </p>
            </div>

            {/* Print Button */}
            <div className="flex items-end">
              <button
                onClick={() => window.print()}
                className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all flex items-center justify-center gap-2"
              >
                <span>🖨️</span>
                Print Report
              </button>
            </div>
          </div>
        </div>

        {/* Printable Area */}
        <div id="attendance-print-area">
          {/* Print Header - Only shows when printing */}
          <div className="print-only mb-6">
            <div
              className="text-center border-b-2 pb-4"
              style={{ borderColor: "#AB2328" }}
            >
              <div className="flex items-center justify-center gap-4 mb-2">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white"
                  style={{ backgroundColor: "#AB2328" }}
                >
                  AV
                </div>
                <div>
                  <h1
                    className="text-2xl font-bold"
                    style={{ color: "#06038D" }}
                  >
                    AKSHAYVIPRA EL-MEC PRIVATE LIMITED
                  </h1>
                  <p className="text-sm text-gray-600">Attendance Report</p>
                </div>
              </div>
              <div className="flex justify-between text-sm mt-2 px-4">
                <span>
                  {viewMode === "daily"
                    ? `Date: ${new Date(selectedDate).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}`
                    : `Month: ${new Date(selectedMonth + "-01").toLocaleDateString("en-US", { year: "numeric", month: "long" })}`}
                </span>
                <span>Generated: {new Date().toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Attendance Table */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {viewMode === "daily" ? (
              // Daily View
              <table className="min-w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Employee
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Department
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Clock In
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Clock Out
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Hours
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase no-print">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {attendanceData.map((record) => (
                    <tr key={record.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">
                          {record.name}
                        </div>
                        <div className="text-sm text-gray-500">{record.id}</div>
                      </td>
                      <td className="px-6 py-4 text-sm">{record.department}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(record.status)}`}
                        >
                          {record.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">{record.clock_in}</td>
                      <td className="px-6 py-4 text-sm">{record.clock_out}</td>
                      <td className="px-6 py-4 text-sm font-semibold">
                        {record.total_hours || 0} hrs
                      </td>
                      <td className="px-6 py-4 no-print">
                        {!record.attendance && (
                          <div className="flex gap-2">
                            <button
                              onClick={() =>
                                markAttendance(record.id, "Present")
                              }
                              className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
                            >
                              Present
                            </button>
                            <button
                              onClick={() =>
                                markAttendance(record.id, "Absent")
                              }
                              className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
                            >
                              Absent
                            </button>
                            <button
                              onClick={() => markAttendance(record.id, "Leave")}
                              className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                              Leave
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              // Monthly View
              <table className="min-w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Employee
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Department
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Present Days
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Absent Days
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Total Hours
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Attendance %
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {attendanceData.map((record) => (
                    <tr key={record.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">
                          {record.name}
                        </div>
                        <div className="text-sm text-gray-500">{record.id}</div>
                      </td>
                      <td className="px-6 py-4 text-sm">{record.department}</td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                          {record.totalPresent} days
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                          {record.totalAbsent} days
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold">
                        {record.totalHours} hrs
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-green-600 h-2 rounded-full"
                              style={{
                                width: `${record.attendancePercentage}%`,
                              }}
                            />
                          </div>
                          <span
                            className="text-sm font-medium"
                            style={{ color: "#06038D" }}
                          >
                            {record.attendancePercentage}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Print Footer - Only shows when printing */}
          <div className="print-only mt-6 text-center text-sm text-gray-600">
            <p>
              This is a computer-generated report and does not require a
              signature.
            </p>
            <p className="mt-1">
              © {new Date().getFullYear()} Akshayvipra El-Mec Private Limited
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceManagementPage;
