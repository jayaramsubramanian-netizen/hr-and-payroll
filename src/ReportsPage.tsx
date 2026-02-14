import React, { useState } from "react";
import { supabase } from "./supabaseClient";
import LoadingScreen from "./components/LoadingScreen";

type ReportType =
  | "salary"
  | "attendance"
  | "leave"
  | "department"
  | "payroll"
  | null;

const ReportsPage: React.FC = () => {
  const [selectedReport, setSelectedReport] = useState<ReportType>(null);
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState<any[]>([]);
  const [filters, setFilters] = useState({
    startDate: "2026-02-01", // Hardcode current month for now
    endDate: "2026-02-28",
    department: "",
  });

  const generateSalaryReport = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("users")
        .select(
          "id, name, department, sub_department, designation, role, basic_salary, hra, allowances, pf_enabled, pf_percentage, esi_enabled, esi_amount, employment_status",
        )
        .eq("employment_status", "Active");

      if (filters.department) {
        query = query.eq("department", filters.department);
      }

      const { data, error } = await query.order("name");

      if (error) {
        console.error("Database error:", error);
        throw error;
      }

      if (!data || data.length === 0) {
        alert("No employee data found");
        setLoading(false);
        return;
      }

      const processedData = data.map((emp) => {
        const basic = Number(emp.basic_salary) || 0;
        const hra = Number(emp.hra) || 0;
        const allowances = Number(emp.allowances) || 0;
        const gross = basic + hra + allowances;

        const pfPercentage = Number(emp.pf_percentage) || 12;
        const pfDeduction = emp.pf_enabled ? basic * (pfPercentage / 100) : 0;
        const esiDeduction = emp.esi_enabled ? Number(emp.esi_amount) || 0 : 0;
        const taxDeduction = gross > 50000 ? gross * 0.1 : 0;
        const totalDeductions = pfDeduction + esiDeduction + taxDeduction;
        const netSalary = gross - totalDeductions;

        return {
          "Employee ID": emp.id,
          Name: emp.name,
          Department: emp.department || "-",
          "Sub-Department": emp.sub_department || "-",
          Designation: emp.designation || "-",
          Role: emp.role,
          "Basic Salary": basic.toFixed(2),
          HRA: hra.toFixed(2),
          Allowances: allowances.toFixed(2),
          "Gross Salary": gross.toFixed(2),
          "PF Deduction": pfDeduction.toFixed(2),
          "ESI Deduction": esiDeduction.toFixed(2),
          "Tax Deduction": taxDeduction.toFixed(2),
          "Total Deductions": totalDeductions.toFixed(2),
          "Net Salary": netSalary.toFixed(2),
        };
      });

      setReportData(processedData);
    } catch (error: any) {
      console.error("Error generating salary report:", error);
      alert(
        `Error generating salary report: ${error.message || "Unknown error"}`,
      );
    } finally {
      setLoading(false);
    }
  };

  const generateAttendanceReport = async () => {
    setLoading(true);
    try {
      const { data: attendance, error } = await supabase
        .from("attendance")
        .select(
          `
          employee_id,
          date,
          clock_in,
          clock_out,
          total_hours,
          status,
          entry_number
        `,
        )
        .gte("date", filters.startDate)
        .lte("date", filters.endDate)
        .order("date", { ascending: false });

      if (error) {
        console.error("Database error:", error);
        throw error;
      }

      if (!attendance || attendance.length === 0) {
        alert("No attendance data found for the selected date range");
        setLoading(false);
        return;
      }

      // Fetch employee details for all employee IDs
      const employeeIds = [...new Set(attendance.map((att) => att.employee_id))];
      const { data: employees, error: empError } = await supabase
        .from("users")
        .select("id, name, department, sub_department")
        .in("id", employeeIds);

      if (empError) throw empError;

      const employeeMap = new Map(employees?.map((e) => [e.id, e]) || []);

      const processedData = attendance.map((att) => {
        const user = employeeMap.get(att.employee_id);
        return {
          Date: new Date(att.date).toLocaleDateString(),
          "Employee ID": att.employee_id,
          Name: user?.name || "-",
          Department: user?.department || "-",
          "Sub-Department": user?.sub_department || "-",
          "Clock In": att.clock_in || "-",
          "Clock Out": att.clock_out || "-",
          "Total Hours": att.total_hours || 0,
          Status: att.status,
          "Entry Number": att.entry_number || 1,
        };
      });

      setReportData(processedData);
    } catch (error: any) {
      console.error("Error generating attendance report:", error);
      alert(
        `Error generating attendance report: ${error.message || "Unknown error"}`,
      );
    } finally {
      setLoading(false);
    }
  };

  const generateLeaveReport = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("users")
        .select(
          "id, name, department, sub_department, casual_leave_balance, sick_leave_balance, earned_leave_balance, unpaid_leave_taken",
        )
        .eq("employment_status", "Active");

      if (filters.department) {
        query = query.eq("department", filters.department);
      }

      const { data: employees, error } = await query.order("name");

      if (error) {
        console.error("Database error:", error);
        throw error;
      }

      if (!employees || employees.length === 0) {
        alert("No employee data found");
        setLoading(false);
        return;
      }

      const processedData = employees.map((emp) => ({
        "Employee ID": emp.id,
        Name: emp.name,
        Department: emp.department,
        "Sub-Department": emp.sub_department || "-",
        "Casual Leave Balance": emp.casual_leave_balance || 0,
        "Sick Leave Balance": emp.sick_leave_balance || 0,
        "Earned Leave Balance": emp.earned_leave_balance || 0,
        "Unpaid Leave Taken": emp.unpaid_leave_taken || 0,
        "Total Leave Balance":
          (emp.casual_leave_balance || 0) +
          (emp.sick_leave_balance || 0) +
          (emp.earned_leave_balance || 0),
      }));

      setReportData(processedData);
    } catch (error: any) {
      console.error("Error generating leave report:", error);
      alert(
        `Error generating leave report: ${error.message || "Unknown error"}`,
      );
    } finally {
      setLoading(false);
    }
  };

  const generateDepartmentReport = async () => {
    setLoading(true);
    try {
      const { data: employees, error } = await supabase
        .from("users")
        .select("department, sub_department, employment_status, role")
        .order("department");

      if (error) {
        console.error("Database error:", error);
        throw error;
      }

      if (!employees || employees.length === 0) {
        alert("No employee data found");
        setLoading(false);
        return;
      }

      // Group by department
      const deptMap = new Map();

      employees.forEach((emp) => {
        const key = emp.department;
        if (!deptMap.has(key)) {
          deptMap.set(key, {
            department: emp.department,
            total: 0,
            active: 0,
            managers: 0,
            employees: 0,
          });
        }

        const dept = deptMap.get(key);
        dept.total++;
        if (emp.employment_status === "Active") dept.active++;
        if (emp.role === "Manager") dept.managers++;
        if (emp.role === "Employee") dept.employees++;
      });

      const processedData = Array.from(deptMap.values()).map((dept) => ({
        Department: dept.department,
        "Total Employees": dept.total,
        "Active Employees": dept.active,
        Managers: dept.managers,
        Employees: dept.employees,
      }));

      setReportData(processedData);
    } catch (error: any) {
      console.error("Error generating department report:", error);
      alert(
        `Error generating department report: ${error.message || "Unknown error"}`,
      );
    } finally {
      setLoading(false);
    }
  };
  const generateMonthlyPayrollReport = async () => {
    setLoading(true);
    try {
      // Extract month in YYYY-MM format
      const selectedMonth = filters.startDate.substring(0, 7); // "2026-02"

      console.log("Looking for payroll records for month:", selectedMonth);

      // First, let's check if ANY records exist
      const { data: allRecords, error: checkError } = await supabase
        .from("payroll_records")
        .select("month");

      console.log(
        "All payroll months in database:",
        allRecords?.map((r) => r.month),
      );

      // Now get the actual data
      let query = supabase
        .from("payroll_records")
        .select(
          `
        *,
        users!payroll_records_employee_id_fkey (name, department, sub_department, designation)
      `,
        )
        .eq("month", selectedMonth);

      if (filters.department) {
        // We'll filter after fetching since we need the join
      }

      const { data, error } = await query.order("employee_id");

      console.log("Query result:", { data, error, selectedMonth });

      if (error) {
        console.error("Database error:", error);
        throw error;
      }

      if (!data || data.length === 0) {
        // Try to be helpful with error message
        const { data: existingMonths } = await supabase
          .from("payroll_records")
          .select("month")
          .limit(5);

        const availableMonths =
          existingMonths?.map((r) => r.month).join(", ") || "none";
        alert(
          `No payroll data found for ${selectedMonth}.\n\nAvailable months: ${availableMonths}\n\nPlease run the SQL script to generate payroll data.`,
        );
        setLoading(false);
        return;
      }

      // Filter by department if needed (after fetching)
      let filteredData = data;
      if (filters.department) {
        filteredData = data.filter(
          (record) => record.users?.department === filters.department,
        );
      }

      if (filteredData.length === 0) {
        alert(`No payroll data found for department: ${filters.department}`);
        setLoading(false);
        return;
      }

      const processedData = filteredData.map((record) => ({
        "Employee ID": record.employee_id,
        Name: record.users?.name || "-",
        Department: record.users?.department || "-",
        "Sub-Department": record.users?.sub_department || "-",
        Designation: record.users?.designation || "-",
        Month: record.month,
        "Days Present": record.days_present,
        "Days Absent": record.days_absent,
        "Working Days": record.total_working_days,
        "Basic Salary": Number(record.basic_salary).toFixed(2),
        HRA: Number(record.hra).toFixed(2),
        Allowances: Number(record.allowances).toFixed(2),
        "Gross Salary": Number(record.gross_salary).toFixed(2),
        "PF Deduction": Number(record.pf_deduction).toFixed(2),
        "ESI Deduction": Number(record.esi_deduction).toFixed(2),
        "Tax Deduction": Number(record.tax_deduction).toFixed(2),
        "Total Deductions": Number(record.total_deductions).toFixed(2),
        "Net Salary": Number(record.net_salary).toFixed(2),
        "Payment Status": record.payment_status,
        "Payment Date": record.payment_date
          ? new Date(record.payment_date).toLocaleDateString()
          : "-",
      }));

      console.log("Processed data:", processedData);
      setReportData(processedData);
    } catch (error: any) {
      console.error("Error generating payroll report:", error);
      alert(
        `Error generating payroll report: ${error.message || "Unknown error"}`,
      );
    } finally {
      setLoading(false);
    }
  };

  const generateReport = (type: ReportType) => {
    setSelectedReport(type);
    switch (type) {
      case "salary":
        generateSalaryReport();
        break;
      case "attendance":
        generateAttendanceReport();
        break;
      case "leave":
        generateLeaveReport();
        break;
      case "department":
        generateDepartmentReport();
        break;
      case "payroll":
        generateMonthlyPayrollReport();
        break;
    }
  };

  const exportToCSV = () => {
    if (reportData.length === 0) {
      alert("No data to export");
      return;
    }

    // Convert data to CSV
    const headers = Object.keys(reportData[0]).join(",");
    const rows = reportData
      .map((row) =>
        Object.values(row)
          .map((val) =>
            typeof val === "string" && val.includes(",") ? `"${val}"` : val,
          )
          .join(","),
      )
      .join("\n");
    const csv = headers + "\n" + rows;

    // Create download link
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${selectedReport}_report_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const printReport = () => {
    window.print();
  };

  if (loading) {
    return <LoadingScreen message="Generating report..." />;
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Reports & Analytics
          </h1>
          <p className="text-gray-600 mt-2">
            Generate and export comprehensive reports
          </p>
        </div>

        {/* Filters - Show before report selection */}
        {!selectedReport && (
          <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Report Filters
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Month (for Payroll & Attendance)
                </label>
                <input
                  type="month"
                  value={filters.startDate.substring(0, 7)}
                  onChange={(e) => {
                    const year = e.target.value.split("-")[0];
                    const month = e.target.value.split("-")[1];
                    const lastDay = new Date(
                      parseInt(year),
                      parseInt(month),
                      0,
                    ).getDate();
                    setFilters({
                      ...filters,
                      startDate: e.target.value + "-01",
                      endDate: `${e.target.value}-${lastDay}`,
                    });
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department (Optional)
                </label>
                <select
                  value={filters.department}
                  onChange={(e) =>
                    setFilters({ ...filters, department: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Departments</option>
                  <option value="Corporate">Corporate</option>
                  <option value="HR & Admin">HR & Admin</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Purchasing">Purchasing</option>
                  <option value="Production">Production</option>
                  <option value="Quality Assurance and Control">
                    Quality Assurance and Control
                  </option>
                  <option value="Sales">Sales</option>
                  <option value="Shipping and Receiving">
                    Shipping and Receiving
                  </option>
                </select>
              </div>

              <div className="flex items-end">
                <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-3 w-full">
                  <p className="text-sm text-blue-800 font-medium">
                    Selected:{" "}
                    {new Date(filters.startDate).toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    {filters.department || "All Departments"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Report Type Selection */}
        {!selectedReport && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <button
              onClick={() => generateReport("salary")}
              className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all border-2 border-transparent hover:border-blue-500 group"
            >
              <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">
                💰
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Salary Register
              </h3>
              <p className="text-gray-600 text-sm">Current salary structure</p>
            </button>

            <button
              onClick={() => generateReport("attendance")}
              className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all border-2 border-transparent hover:border-green-500 group"
            >
              <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">
                📅
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Attendance Report
              </h3>
              <p className="text-gray-600 text-sm">Daily attendance records</p>
            </button>

            <button
              onClick={() => generateReport("leave")}
              className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all border-2 border-transparent hover:border-purple-500 group"
            >
              <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">
                🏖️
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Leave Balance
              </h3>
              <p className="text-gray-600 text-sm">
                Leave balances by employee
              </p>
            </button>

            <button
              onClick={() => generateReport("department")}
              className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all border-2 border-transparent hover:border-red-500 group"
            >
              <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">
                🏢
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Department Summary
              </h3>
              <p className="text-gray-600 text-sm">
                Employee count by department
              </p>
            </button>

            {/* Monthly Payroll Report */}
            <button
              onClick={() => generateReport("payroll")}
              className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all border-2 border-transparent hover:border-yellow-500 group"
            >
              <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">
                📊
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Monthly Payroll
              </h3>
              <p className="text-gray-600 text-sm">
                Salary disbursed per month
              </p>
            </button>
          </div>
        )}

        {/* Report Display */}
        {selectedReport && reportData.length > 0 && (
          <div>
            {/* Actions Bar */}
            <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex items-center justify-between no-print">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => {
                    setSelectedReport(null);
                    setReportData([]);
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium"
                >
                  ← Back to Reports
                </button>
                <div className="text-lg font-semibold text-gray-900 capitalize">
                  {selectedReport === "payroll"
                    ? "Monthly Payroll"
                    : selectedReport}{" "}
                  Report
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={exportToCSV}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all flex items-center gap-2"
                >
                  <span>📊</span>
                  Export to CSV
                </button>
                <button
                  onClick={printReport}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all flex items-center gap-2"
                >
                  <span>🖨️</span>
                  Print Report
                </button>
              </div>
            </div>

            {/* Report Table */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      {Object.keys(reportData[0]).map((key) => (
                        <th
                          key={key}
                          className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap"
                        >
                          {key}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {reportData.map((row, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        {Object.values(row).map((value: any, cellIdx) => (
                          <td
                            key={cellIdx}
                            className="px-4 py-3 text-gray-900 whitespace-nowrap"
                          >
                            {value}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Payroll Summary */}
            {selectedReport === "payroll" && reportData.length > 0 && (
              <div className="mt-6 bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200 rounded-lg p-6 no-print">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Payroll Summary
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Total Employees</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {reportData.length}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Gross Salary</p>
                    <p className="text-2xl font-bold text-blue-600">
                      ₹
                      {reportData
                        .reduce(
                          (sum, row) => sum + parseFloat(row["Gross Salary"]),
                          0,
                        )
                        .toLocaleString("en-IN", { maximumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Deductions</p>
                    <p className="text-2xl font-bold text-red-600">
                      ₹
                      {reportData
                        .reduce(
                          (sum, row) =>
                            sum + parseFloat(row["Total Deductions"]),
                          0,
                        )
                        .toLocaleString("en-IN", { maximumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Net Payable</p>
                    <p className="text-2xl font-bold text-green-600">
                      ₹
                      {reportData
                        .reduce(
                          (sum, row) => sum + parseFloat(row["Net Salary"]),
                          0,
                        )
                        .toLocaleString("en-IN", { maximumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* General Summary */}
            {selectedReport !== "payroll" && (
              <div className="mt-6 bg-blue-50 border-2 border-blue-200 rounded-lg p-4 no-print">
                <p className="text-blue-900 font-semibold">
                  📊 Total Records: {reportData.length}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          .no-print {
            display: none !important;
          }
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
        }
      `}</style>
    </div>
  );
};

export default ReportsPage;
