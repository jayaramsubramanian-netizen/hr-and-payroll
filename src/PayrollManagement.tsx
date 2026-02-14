import React, { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";

interface Employee {
  id: string;
  name: string;
  department: string;
  role: string;
  basic_salary: number;
  hra: number;
  allowances: number;
  pf_enabled: boolean;
  pf_percentage: number;
  esi_enabled: boolean;
  esi_amount: number;
  bonus_enabled: boolean;
  bonus_percentage: number;
}

const PayrollManagementPage: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null,
  );
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .order("name");

      if (error) throw error;
      setEmployees(data || []);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateSalary = (emp: Employee) => {
    const gross =
      (emp.basic_salary || 0) + (emp.hra || 0) + (emp.allowances || 0);

    let pfDeduction = 0;
    if (emp.pf_enabled) {
      pfDeduction = (emp.basic_salary || 0) * ((emp.pf_percentage || 12) / 100);
    }

    const esiDeduction = emp.esi_enabled ? emp.esi_amount || 0 : 0;

    // Simple tax calculation (example: 10% if gross > 50000)
    const taxDeduction = gross > 50000 ? gross * 0.1 : 0;

    const totalDeductions = pfDeduction + esiDeduction + taxDeduction;
    const netSalary = gross - totalDeductions;

    return {
      gross,
      pfDeduction,
      esiDeduction,
      taxDeduction,
      totalDeductions,
      netSalary,
    };
  };

  const processMonthlyPayroll = async () => {
    if (
      !confirm(
        `Process payroll for ${employees.length} employees for current month?`,
      )
    ) {
      return;
    }

    setProcessing(true);
    const currentDate = new Date();
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();

    try {
      const payslips = employees.map((emp) => {
        const calc = calculateSalary(emp);
        const bonus = emp.bonus_enabled
          ? (emp.basic_salary || 0) * ((emp.bonus_percentage || 0) / 100)
          : 0;

        return {
          id: `PS-${emp.id}-${year}-${month}`,
          employee_id: emp.id,
          month,
          year,
          basic_salary: emp.basic_salary || 0,
          hra: emp.hra || 0,
          allowances: emp.allowances || 0,
          gross_salary: calc.gross,
          pf_deduction: calc.pfDeduction,
          esi_deduction: calc.esiDeduction,
          tax_deduction: calc.taxDeduction,
          other_deductions: 0,
          total_deductions: calc.totalDeductions,
          net_salary: calc.netSalary,
          bonus: bonus,
        };
      });

      const { error } = await supabase
        .from("payslips")
        .upsert(payslips, { onConflict: "employee_id,month,year" });

      if (error) throw error;

      alert(
        `✅ Payroll processed successfully for ${employees.length} employees!`,
      );
    } catch (error: any) {
      console.error("Error:", error);
      alert(`❌ Error processing payroll: ${error.message}`);
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading payroll data...</p>
        </div>
      </div>
    );
  }

  if (selectedEmployee) {
    const calc = calculateSalary(selectedEmployee);

    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Salary Details: {selectedEmployee.name}
            </h2>
            <button
              onClick={() => setSelectedEmployee(null)}
              className="px-4 py-2 text-gray-600 hover:text-gray-900"
            >
              ← Back
            </button>
          </div>

          <div className="space-y-6">
            {/* Earnings */}
            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                💰 Earnings
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-700">Basic Salary</span>
                  <span className="font-semibold">
                    ₹{selectedEmployee.basic_salary?.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">HRA</span>
                  <span className="font-semibold">
                    ₹{selectedEmployee.hra?.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Allowances</span>
                  <span className="font-semibold">
                    ₹{selectedEmployee.allowances?.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between pt-3 border-t-2 border-green-200">
                  <span className="text-lg font-bold text-gray-900">
                    Gross Salary
                  </span>
                  <span className="text-lg font-bold text-green-700">
                    ₹{calc.gross.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Deductions */}
            <div className="bg-red-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                📑 Deductions
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-700">
                    PF ({selectedEmployee.pf_percentage}%)
                  </span>
                  <span className="font-semibold">
                    ₹{calc.pfDeduction.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">ESI</span>
                  <span className="font-semibold">
                    ₹{calc.esiDeduction.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Tax</span>
                  <span className="font-semibold">
                    ₹{calc.taxDeduction.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between pt-3 border-t-2 border-red-200">
                  <span className="text-lg font-bold text-gray-900">
                    Total Deductions
                  </span>
                  <span className="text-lg font-bold text-red-700">
                    ₹{calc.totalDeductions.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Net Salary */}
            <div className="bg-blue-50 p-6 rounded-lg border-2 border-blue-300">
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-gray-900">
                  Net Salary
                </span>
                <span
                  className="text-3xl font-bold"
                  style={{ color: "#06038D" }}
                >
                  ₹{calc.netSalary.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Payroll Management
            </h1>
            <p className="text-gray-600 mt-2">
              Manage employee salaries and process monthly payroll
            </p>
          </div>
          <button
            onClick={processMonthlyPayroll}
            disabled={processing}
            className="px-6 py-3 text-white rounded-lg hover:opacity-90 disabled:opacity-50 transition-all flex items-center gap-2"
            style={{ backgroundColor: "#AB2328" }}
          >
            {processing ? "⏳ Processing..." : "💰 Process Monthly Payroll"}
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
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
                  Basic
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  HRA
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Allowances
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Gross
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Net
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {employees.map((emp) => {
                const calc = calculateSalary(emp);
                return (
                  <tr key={emp.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900">
                          {emp.name}
                        </div>
                        <div className="text-sm text-gray-500">{emp.id}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">{emp.department}</td>
                    <td className="px-6 py-4 text-sm">
                      ₹{emp.basic_salary?.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      ₹{emp.hra?.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      ₹{emp.allowances?.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-green-700">
                      ₹{calc.gross.toLocaleString()}
                    </td>
                    <td
                      className="px-6 py-4 text-sm font-semibold"
                      style={{ color: "#06038D" }}
                    >
                      ₹{calc.netSalary.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => setSelectedEmployee(emp)}
                        className="px-4 py-2 text-sm text-white rounded hover:opacity-90"
                        style={{ backgroundColor: "#06038D" }}
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PayrollManagementPage;
