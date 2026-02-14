import React, { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import { useAuth } from "./AuthContext";
import LoadingScreen from "./components/LoadingScreen";

interface LeaveRequest {
  id: string;
  employee_id: string;
  from_date: string;
  to_date: string;
  leave_type: string;
  reason: string;
  status: string;
  manager_approved: boolean;
  hr_approved: boolean;
  created_at: string;
  users?: {
    name: string;
    department: string;
  };
}

const LeaveManagementPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [myLeaves, setMyLeaves] = useState<LeaveRequest[]>([]);
  const [teamLeaves, setTeamLeaves] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    fromDate: "",
    toDate: "",
    leaveType: "Casual Leave",
    reason: "",
  });

  useEffect(() => {
    if (currentUser) {
      fetchLeaves();
    }
  }, [currentUser]);

  const fetchLeaves = async () => {
    if (!currentUser) return;

    try {
      setLoading(true);

      // Fetch my leaves
      const { data: myData, error: myError } = await supabase
        .from("leave_requests")
        .select("*")
        .eq("employee_id", currentUser.id)
        .order("created_at", { ascending: false });

      if (myError) throw myError;
      setMyLeaves(myData || []);

      // Fetch team leaves (for managers/HR/Management)
      if (
        currentUser.role === "Manager" ||
        currentUser.role === "HR/Payroll" ||
        currentUser.role === "Management"
      ) {
        let query = supabase
          .from("leave_requests")
          .select(
            `
      *,
      users!leave_requests_employee_id_fkey (
        name, 
        department
      )
    `,
          )
          .neq("employee_id", currentUser.id);

        // Managers only see their department's requests
        if (currentUser.role === "Manager") {
          const { data: deptEmployees } = await supabase
            .from("users")
            .select("id")
            .eq("department", currentUser.department);

          const employeeIds = deptEmployees?.map((emp) => emp.id) || [];
          query = query.in("employee_id", employeeIds);
        }

        const { data: teamData, error: teamError } = await query.order(
          "created_at",
          { ascending: false },
        );

        if (teamError) throw teamError;
        setTeamLeaves(teamData || []);
      }
    } catch (error: any) {
      console.error("Error loading leaves:", error);
      alert(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser) return;

    setSubmitting(true);
    try {
      const { error } = await supabase.from("leave_requests").insert({
        id: `LR-${currentUser.id}-${Date.now()}`,
        employee_id: currentUser.id,
        from_date: formData.fromDate,
        to_date: formData.toDate,
        leave_type: formData.leaveType,
        reason: formData.reason,
        status: "Pending",
        manager_approved: false,
        hr_approved: false,
      });

      if (error) throw error;

      alert("✅ Leave request submitted successfully!");
      setShowForm(false);
      setFormData({
        fromDate: "",
        toDate: "",
        leaveType: "Casual Leave",
        reason: "",
      });
      fetchLeaves();
    } catch (error: any) {
      console.error("Error:", error);
      alert(`❌ Error: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleManagerApprove = async (leaveId: string) => {
    if (!confirm("Approve this leave request at manager level?")) return;

    try {
      const { error } = await supabase
        .from("leave_requests")
        .update({
          manager_approved: true,
          status: "Manager Approved - Pending HR",
        })
        .eq("id", leaveId);

      if (error) throw error;

      alert("✅ Leave approved by manager - Sent to HR for final approval");
      fetchLeaves();
    } catch (error: any) {
      alert(`❌ Error: ${error.message}`);
    }
  };

  const handleHRApprove = async (leaveId: string) => {
    if (!confirm("Give final approval for this leave request?")) return;

    try {
      // Get the leave request details
      const leave = teamLeaves.find((l) => l.id === leaveId);
      if (!leave) return;

      const daysRequested = calculateDays(leave.from_date, leave.to_date);

      // Update leave request status
      const { error: leaveError } = await supabase
        .from("leave_requests")
        .update({
          hr_approved: true,
          status: "Approved",
          approved_by: currentUser?.id,
        })
        .eq("id", leaveId);

      if (leaveError) throw leaveError;

      alert(
        `✅ Leave fully approved! ${daysRequested} days approved for ${leave.leave_type}`,
      );
      fetchLeaves();
    } catch (error: any) {
      alert(`❌ Error: ${error.message}`);
    }
  };

  const handleReject = async (leaveId: string) => {
    const reason = prompt("Enter reason for rejection (optional):");

    try {
      const { error } = await supabase
        .from("leave_requests")
        .update({
          status: "Rejected",
          rejection_reason: reason || "No reason provided",
        })
        .eq("id", leaveId);

      if (error) throw error;

      alert("❌ Leave request rejected");
      fetchLeaves();
    } catch (error: any) {
      alert(`❌ Error: ${error.message}`);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Manager Approved - Pending HR":
        return "bg-blue-100 text-blue-800";
      case "Approved":
        return "bg-green-100 text-green-800";
      case "Rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const calculateDays = (from: string, to: string) => {
    const diff = new Date(to).getTime() - new Date(from).getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1;
  };

  const canApprove = (leave: LeaveRequest) => {
    // Manager can approve if not yet manager approved
    if (
      currentUser?.role === "Manager" &&
      !leave.manager_approved &&
      leave.status === "Pending"
    ) {
      return "manager";
    }

    // HR/Management can give final approval if manager approved
    if (
      currentUser?.role === "HR/Payroll" ||
      currentUser?.role === "Management"
    ) {
      if (leave.manager_approved && !leave.hr_approved) {
        return "hr";
      }
      // HR/Management can also skip manager approval and approve directly
      if (!leave.manager_approved && leave.status === "Pending") {
        return "hr-direct";
      }
    }

    return null;
  };

  if (loading) {
    return <LoadingScreen message="Loading leave requests..." />;
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Leave Management
            </h1>
            <p className="text-gray-600 mt-2">
              Request and manage employee leaves
            </p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-6 py-3 text-white rounded-lg hover:opacity-90 transition-all"
            style={{ backgroundColor: "#AB2328" }}
          >
            {showForm ? "Cancel" : "+ New Leave Request"}
          </button>
        </div>

        {/* Leave Request Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Submit Leave Request
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    From Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.fromDate}
                    onChange={(e) =>
                      setFormData({ ...formData, fromDate: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    To Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.toDate}
                    onChange={(e) =>
                      setFormData({ ...formData, toDate: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                    min={
                      formData.fromDate ||
                      new Date().toISOString().split("T")[0]
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Leave Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.leaveType}
                    onChange={(e) =>
                      setFormData({ ...formData, leaveType: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="Casual Leave">Casual Leave</option>
                    <option value="Sick Leave">Sick Leave</option>
                    <option value="Earned Leave">Earned Leave</option>
                    <option value="Unpaid Leave">Unpaid Leave</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Total Days
                  </label>
                  <input
                    type="text"
                    value={
                      formData.fromDate && formData.toDate
                        ? calculateDays(formData.fromDate, formData.toDate)
                        : "0"
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                    disabled
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reason <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.reason}
                    onChange={(e) =>
                      setFormData({ ...formData, reason: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    required
                    placeholder="Please provide a reason for your leave request"
                  />
                </div>
              </div>

              <div className="mt-6">
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-8 py-3 text-white rounded-lg hover:opacity-90 disabled:opacity-50 transition-all"
                  style={{ backgroundColor: "#06038D" }}
                >
                  {submitting ? "⏳ Submitting..." : "Submit Request"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* My Leave Requests */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            My Leave Requests
          </h3>
          {myLeaves.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No leave requests yet
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full table-fixed">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="w-64 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Dates
                    </th>
                    <th className="w-20 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Days
                    </th>
                    <th className="w-32 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Type
                    </th>
                    <th className="w-auto px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Reason
                    </th>
                    <th className="w-48 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {myLeaves.map((leave) => (
                    <tr key={leave.id} className="hover:bg-gray-50">
                      <td className="w-64 px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {new Date(leave.from_date).toLocaleDateString(
                            "en-US",
                            { month: "short", day: "numeric" },
                          )}
                          {" - "}
                          {new Date(leave.to_date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </div>
                      </td>
                      <td className="w-20 px-6 py-4">
                        <div className="text-sm font-semibold text-gray-900">
                          {calculateDays(leave.from_date, leave.to_date)}
                        </div>
                      </td>
                      <td className="w-32 px-6 py-4">
                        <div className="text-sm text-gray-700">
                          {leave.leave_type}
                        </div>
                      </td>
                      <td className="w-auto px-6 py-4">
                        <div className="text-sm text-gray-700">
                          {leave.reason}
                        </div>
                      </td>
                      <td className="w-48 px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(leave.status)}`}
                        >
                          {leave.status === "Manager Approved - Pending HR"
                            ? "Pending HR Approval"
                            : leave.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Team Leave Requests (for managers/HR/Management) */}
        {(currentUser?.role === "Manager" ||
          currentUser?.role === "HR/Payroll" ||
          currentUser?.role === "Management") && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              {currentUser?.role === "Manager"
                ? "Team Leave Requests"
                : "All Leave Requests"}
            </h3>
            {teamLeaves.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No pending requests
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full table-fixed">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="w-32 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Employee
                      </th>
                      <th className="w-28 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Department
                      </th>
                      <th className="w-48 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Dates
                      </th>
                      <th className="w-16 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Days
                      </th>
                      <th className="w-28 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Type
                      </th>
                      <th className="w-20 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Balance
                      </th>
                      <th className="w-auto px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Reason
                      </th>
                      <th className="w-40 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Status
                      </th>
                      <th className="w-56 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {teamLeaves.map((leave) => {
                      const approvalType = canApprove(leave);
                      const daysRequested = calculateDays(
                        leave.from_date,
                        leave.to_date,
                      );

                      return (
                        <tr key={leave.id} className="hover:bg-gray-50">
                          <td className="w-32 px-4 py-4">
                            <div className="font-medium text-gray-900 text-sm truncate">
                              {leave.users?.name}
                            </div>
                          </td>
                          <td className="w-28 px-4 py-4">
                            <div className="text-sm text-gray-700 truncate">
                              {leave.users?.department}
                            </div>
                          </td>
                          <td className="w-48 px-4 py-4">
                            <div className="text-sm text-gray-700">
                              {new Date(leave.from_date).toLocaleDateString(
                                "en-US",
                                { month: "short", day: "numeric" },
                              )}
                              {" - "}
                              {new Date(leave.to_date).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                },
                              )}
                            </div>
                          </td>
                          <td className="w-16 px-4 py-4">
                            <div className="text-sm font-semibold text-gray-900">
                              {daysRequested}
                            </div>
                          </td>
                          <td className="w-28 px-4 py-4">
                            <div className="text-sm text-gray-700 truncate">
                              {leave.leave_type}
                            </div>
                          </td>
                          <td className="w-auto px-4 py-4">
                            <div className="text-sm text-gray-700 line-clamp-2">
                              {leave.reason}
                            </div>
                          </td>
                          <td className="w-40 px-4 py-4">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getStatusColor(leave.status)}`}
                            >
                              {leave.status === "Manager Approved - Pending HR"
                                ? "Mgr Approved"
                                : leave.status}
                            </span>
                          </td>
                          <td className="w-56 px-4 py-4">
                            {approvalType && (
                              <div className="flex flex-col gap-2">
                                {approvalType === "manager" && (
                                  <button
                                    onClick={() =>
                                      handleManagerApprove(leave.id)
                                    }
                                    className="px-3 py-1.5 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 whitespace-nowrap"
                                  >
                                    ✓ Approve (Mgr)
                                  </button>
                                )}
                                {(approvalType === "hr" ||
                                  approvalType === "hr-direct") && (
                                  <button
                                    onClick={() => handleHRApprove(leave.id)}
                                    className="px-3 py-1.5 text-xs bg-green-600 text-white rounded hover:bg-green-700 whitespace-nowrap"
                                  >
                                    {approvalType === "hr-direct"
                                      ? "✓ Approve (HR)"
                                      : "✓ Final Approve"}
                                  </button>
                                )}
                                <button
                                  onClick={() => handleReject(leave.id)}
                                  className="px-3 py-1.5 text-xs bg-red-600 text-white rounded hover:bg-red-700 whitespace-nowrap"
                                >
                                  ✗ Reject
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaveManagementPage;
