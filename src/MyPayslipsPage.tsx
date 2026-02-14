import React, { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import { useAuth } from "./AuthContext";
import jsPDF from "jspdf";
import "jspdf-autotable";

// Add print styles
const printStyles = `
  @media print {
    body * {
      visibility: hidden;
    }
    #payslip-print-area, #payslip-print-area * {
      visibility: visible;
    }
    #payslip-print-area {
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
  }
  .print-only {
    display: none;
  }
`;
interface Payslip {
  id: string;
  employee_id: string;
  month: number;
  year: number;
  basic_salary: number;
  hra: number;
  allowances: number;
  gross_salary: number;
  pf_deduction: number;
  esi_deduction: number;
  tax_deduction: number;
  total_deductions: number;
  net_salary: number;
  bonus: number;
  created_at: string;
}

const MyPayslipsPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [payslips, setPayslips] = useState<Payslip[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPayslip, setSelectedPayslip] = useState<Payslip | null>(null);

  useEffect(() => {
    if (currentUser) {
      fetchPayslips();
    }
  }, [currentUser]);

  const fetchPayslips = async () => {
    if (!currentUser) return;

    try {
      setLoading(true);
      console.log("Fetching payslips for employee:", currentUser.id);
      const { data, error } = await supabase
        .from("payslips")
        .select("*")
        .eq("employee_id", currentUser.id)
        .order("year", { ascending: false })
        .order("month", { ascending: false });

      if (error) throw error;
      console.log("Payslips fetched:", data?.length || 0, "records");
      setPayslips(data || []);
    } catch (error) {
      console.error("Error fetching payslips:", error);
    } finally {
      setLoading(false);
    }
  };

  const getMonthName = (month: number) => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return months[month - 1];
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading payslips...</p>
        </div>
      </div>
    );
  }

  if (selectedPayslip) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <style>{printStyles}</style>

        {/* Back button - hidden in print */}
        <div className="flex justify-between items-center mb-6 no-print">
          <h2 className="text-2xl font-bold text-gray-900">
            Payslip - {getMonthName(selectedPayslip.month)}{" "}
            {selectedPayslip.year}
          </h2>
          <button
            onClick={() => setSelectedPayslip(null)}
            className="px-4 py-2 text-gray-600 hover:text-gray-900"
          >
            ← Back to List
          </button>
        </div>

        {/* Printable area */}
        <div
          id="payslip-print-area"
          className="bg-white rounded-lg shadow-lg p-8"
        >
          {/* Print-only header */}
          <div className="print-only text-center mb-6">
            <h1 className="text-3xl font-bold" style={{ color: "#06038D" }}>
              AKSHAYVIPRA EL-MEC PRIVATE LIMITED
            </h1>
            <p className="text-sm text-gray-600 mt-2">
              Payslip for {getMonthName(selectedPayslip.month)}{" "}
              {selectedPayslip.year}
            </p>
          </div>

          {/* Company Header - screen only */}
          <div
            className="text-center mb-8 pb-6 border-b-2 no-print"
            style={{ borderColor: "#AB2328" }}
          >
            <h1 className="text-2xl font-bold" style={{ color: "#06038D" }}>
              AKSHAYVIPRA EL-MEC PRIVATE LIMITED
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Payslip for the month of {getMonthName(selectedPayslip.month)}{" "}
              {selectedPayslip.year}
            </p>
          </div>

          {/* Rest of payslip content stays the same... */}
          {/* Employee Info */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div>
              <p className="text-sm text-gray-600">Employee Name</p>
              <p className="font-semibold text-gray-900">{currentUser?.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Employee ID</p>
              <p className="font-semibold text-gray-900">{currentUser?.id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Department</p>
              <p className="font-semibold text-gray-900">
                {currentUser?.department}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Designation</p>
              <p className="font-semibold text-gray-900">{currentUser?.role}</p>
            </div>
          </div>

          {/* Salary Breakdown */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            {/* Earnings */}
            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Earnings
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-700">Basic Salary</span>
                  <span className="font-semibold">
                    ₹{selectedPayslip.basic_salary.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">HRA</span>
                  <span className="font-semibold">
                    ₹{selectedPayslip.hra.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Allowances</span>
                  <span className="font-semibold">
                    ₹{selectedPayslip.allowances.toLocaleString()}
                  </span>
                </div>
                {selectedPayslip.bonus > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-700">Bonus</span>
                    <span className="font-semibold">
                      ₹{selectedPayslip.bonus.toLocaleString()}
                    </span>
                  </div>
                )}
                <div className="flex justify-between pt-3 border-t-2 border-green-200">
                  <span className="font-bold text-gray-900">Gross Salary</span>
                  <span className="font-bold text-green-700">
                    ₹{selectedPayslip.gross_salary.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Deductions */}
            <div className="bg-red-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Deductions
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-700">Provident Fund</span>
                  <span className="font-semibold">
                    ₹{selectedPayslip.pf_deduction.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">ESI</span>
                  <span className="font-semibold">
                    ₹{selectedPayslip.esi_deduction.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Tax</span>
                  <span className="font-semibold">
                    ₹{selectedPayslip.tax_deduction.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between pt-3 border-t-2 border-red-200">
                  <span className="font-bold text-gray-900">
                    Total Deductions
                  </span>
                  <span className="font-bold text-red-700">
                    ₹{selectedPayslip.total_deductions.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Net Salary */}
          <div className="bg-blue-50 p-6 rounded-lg border-2 border-blue-300 mb-6">
            <div className="flex justify-between items-center">
              <span className="text-2xl font-bold text-gray-900">
                Net Salary (Take Home)
              </span>
              <span className="text-3xl font-bold" style={{ color: "#06038D" }}>
                ₹{selectedPayslip.net_salary.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Print-only footer */}
          <div className="print-only text-center text-sm text-gray-600 mt-8 pt-4 border-t">
            <p>
              This is a computer-generated payslip and does not require a
              signature.
            </p>
            <p className="mt-2">
              Generated on {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Action Buttons - hidden in print */}
        <div className="flex gap-4 mt-6 no-print">
          <button
            onClick={() => window.print()}
            className="flex-1 px-6 py-3 text-white rounded-lg hover:opacity-90 transition-all flex items-center justify-center gap-2"
            style={{ backgroundColor: "#06038D" }}
          >
            <span className="text-xl">🖨️</span>
            Print Payslip
          </button>
          <button
            onClick={() => generatePDF(selectedPayslip)}
            className="flex-1 px-6 py-3 text-white rounded-lg hover:opacity-90 transition-all flex items-center justify-center gap-2"
            style={{ backgroundColor: "#AB2328" }}
          >
            <span className="text-xl">📥</span>
            Download PDF
          </button>
        </div>
      </div>
    );
  }
  const generatePDF = (payslip: Payslip) => {
    const doc = new jsPDF();

    // Add company header
    doc.setFontSize(20);
    doc.setTextColor(6, 3, 141); // Blue
    doc.text("AKSHAYVIPRA EL-MEC PRIVATE LIMITED", 105, 20, {
      align: "center",
    });

    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text(
      `Payslip for ${getMonthName(payslip.month)} ${payslip.year}`,
      105,
      30,
      { align: "center" },
    );

    // Add line
    doc.setDrawColor(171, 35, 40); // Red
    doc.setLineWidth(1);
    doc.line(20, 35, 190, 35);

    // Employee details
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text("Employee Details:", 20, 45);
    doc.text(`Name: ${currentUser?.name}`, 20, 52);
    doc.text(`ID: ${currentUser?.id}`, 20, 59);
    doc.text(`Department: ${currentUser?.department}`, 120, 52);
    doc.text(`Designation: ${currentUser?.role}`, 120, 59);

    // Earnings table
    const earningsData = [
      ["Basic Salary", `₹${payslip.basic_salary.toLocaleString()}`],
      ["HRA", `₹${payslip.hra.toLocaleString()}`],
      ["Allowances", `₹${payslip.allowances.toLocaleString()}`],
    ];

    if (payslip.bonus > 0) {
      earningsData.push(["Bonus", `₹${payslip.bonus.toLocaleString()}`]);
    }

    earningsData.push([
      "Gross Salary",
      `₹${payslip.gross_salary.toLocaleString()}`,
    ]);

    (doc as any).autoTable({
      startY: 70,
      head: [["Earnings", "Amount"]],
      body: earningsData,
      theme: "grid",
      headStyles: { fillColor: [34, 197, 94] }, // Green
      footStyles: { fillColor: [240, 240, 240] },
      margin: { left: 20, right: 110 },
    });

    // Deductions table
    const deductionsData = [
      ["Provident Fund", `₹${payslip.pf_deduction.toLocaleString()}`],
      ["ESI", `₹${payslip.esi_deduction.toLocaleString()}`],
      ["Tax", `₹${payslip.tax_deduction.toLocaleString()}`],
      ["Total Deductions", `₹${payslip.total_deductions.toLocaleString()}`],
    ];

    (doc as any).autoTable({
      startY: 70,
      head: [["Deductions", "Amount"]],
      body: deductionsData,
      theme: "grid",
      headStyles: { fillColor: [239, 68, 68] }, // Red
      margin: { left: 110, right: 20 },
    });

    // Net salary
    const finalY = (doc as any).lastAutoTable.finalY + 10;
    doc.setFillColor(219, 234, 254); // Light blue
    doc.rect(20, finalY, 170, 15, "F");
    doc.setFontSize(14);
    doc.setFont("Helvetica", "bold");
    doc.text("Net Salary (Take Home):", 25, finalY + 10);
    doc.setTextColor(6, 3, 141); // Blue
    doc.text(`₹${payslip.net_salary.toLocaleString()}`, 185, finalY + 10, {
      align: "right",
    });

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text(
      "This is a computer-generated payslip and does not require a signature.",
      105,
      280,
      { align: "center" },
    );
    doc.text(`Generated on ${new Date().toLocaleString()}`, 105, 285, {
      align: "center",
    });

    // Save
    doc.save(
      `Payslip_${currentUser?.id}_${getMonthName(payslip.month)}_${payslip.year}.pdf`,
    );
  };
  return (
    <div className="p-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">My Payslips</h1>
          <p className="text-gray-600 mt-2">
            View and download your salary payslips
          </p>
        </div>

        {payslips.length === 0 ? (
          <div className="bg-white p-12 rounded-lg shadow-sm text-center">
            <div className="text-6xl mb-4">💵</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Payslips Available
            </h3>
            <p className="text-gray-600">
              Your payslips will appear here once payroll is processed
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {payslips.map((payslip) => (
              <div
                key={payslip.id}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer border-2 border-gray-200 hover:border-blue-300"
                onClick={() => setSelectedPayslip(payslip)}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-4xl">💵</div>
                    <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                      Paid
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {getMonthName(payslip.month)} {payslip.year}
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Gross Salary</span>
                      <span className="font-semibold">
                        ₹{payslip.gross_salary.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Deductions</span>
                      <span className="font-semibold text-red-600">
                        -₹{payslip.total_deductions.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between pt-2 border-t">
                      <span className="font-bold text-gray-900">
                        Net Salary
                      </span>
                      <span className="font-bold" style={{ color: "#06038D" }}>
                        ₹{payslip.net_salary.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <button
                    className="w-full mt-4 px-4 py-2 text-sm text-white rounded hover:opacity-90 transition-all"
                    style={{ backgroundColor: "#06038D" }}
                  >
                    View Details →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyPayslipsPage;
