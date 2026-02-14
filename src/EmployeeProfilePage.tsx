import React, { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import { useAuth } from "./AuthContext";
import LoadingScreen from "./components/LoadingScreen";

interface EmployeeProfile {
  id: string;
  name: string;
  department: string;
  sub_department?: string;
  designation: string;
  role: string;
  employment_status: string;
  employment_type: string;
  date_of_joining?: string;
  date_of_birth?: string;
  gender?: string;
  blood_group?: string;
  marital_status?: string;
  nationality?: string;
  personal_email: string;
  mobile_number: string;
  current_address?: string;
  permanent_address?: string;
  emergency_contact_name?: string;
  emergency_contact_relation?: string;
  emergency_contact_number?: string;
  basic_salary?: number;
  hra?: number;
  allowances?: number;
  pf_enabled?: boolean;
  esi_enabled?: boolean;
  bank_name?: string;
  account_number?: string;
  ifsc_code?: string;
  pan_number?: string;
  casual_leave_balance?: number;
  sick_leave_balance?: number;
  earned_leave_balance?: number;
  unpaid_leave_taken?: number;
}

interface ProfilePageProps {
  employeeId?: string; // If provided, view this employee; otherwise view current user
}

const EmployeeProfilePage: React.FC<ProfilePageProps> = ({ employeeId }) => {
  const { currentUser } = useAuth();
  const [profile, setProfile] = useState<EmployeeProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<EmployeeProfile>>({});
  const [activeTab, setActiveTab] = useState<
    "personal" | "job" | "payroll" | "leave" | "attendance" | "documents"
  >("personal");
  const [recentAttendance, setRecentAttendance] = useState<any[]>([]);
  const viewingOwnProfile = !employeeId || employeeId === currentUser?.id;
  const canEdit =
    (viewingOwnProfile && ["personal", "emergency"].includes(activeTab)) ||
    ["HR/Payroll", "Management"].includes(currentUser?.role || "");
  const canViewPayroll =
    viewingOwnProfile ||
    ["HR/Payroll", "Management", "Manager"].includes(currentUser?.role || "");
  const [recentPayslips, setRecentPayslips] = useState<any[]>([]);

  const fetchRecentPayslips = async () => {
    if (!profile) return;

    console.log("Fetching payslips for employee:", profile.id);

    try {
      const { data, error } = await supabase
        .from("payroll_records")
        .select("*")
        .eq("employee_id", profile.id)
        .order("month", { ascending: false })
        .limit(3);

      console.log("Payslip query result:", { data, error });

      if (error) {
        console.error("Error fetching payslips:", error);
        return;
      }

      setRecentPayslips(data || []);
    } catch (error) {
      console.error("Exception fetching payslips:", error);
    }
  };
  useEffect(() => {
    if (profile) {
      fetchRecentAttendance();
      if (canViewPayroll) {
        fetchRecentPayslips();
      }
    }
  }, [profile, canViewPayroll]);
  useEffect(() => {
    fetchProfile();
  }, [employeeId, currentUser]);
  useEffect(() => {
    if (profile) {
      fetchRecentAttendance();
    }
  }, [profile]);
  const fetchProfile = async () => {
    if (!currentUser) return;

    try {
      setLoading(true);
      const targetId = employeeId || currentUser.id;
      console.log(
        "Fetching profile for ID:",
        targetId,
        "employeeId prop:",
        employeeId,
        "currentUser.id:",
        currentUser.id,
      );

      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", targetId)
        .single();

      if (error) throw error;
      console.log("Profile loaded successfully:", data.name);

      setProfile(data);
      setEditForm(data);
    } catch (error: any) {
      console.error("Error fetching profile:", error);
      alert("Error loading profile: " + error.message);
    } finally {
      setLoading(false);
    }
  };
  const fetchRecentAttendance = async () => {
    if (!profile) return;

    try {
      const { data, error } = await supabase
        .from("attendance")
        .select("*")
        .eq("employee_id", profile.id)
        .order("date", { ascending: false })
        .limit(10);

      if (error) throw error;
      setRecentAttendance(data || []);
    } catch (error) {
      console.error("Error fetching attendance:", error);
    }
  };
  const handleSave = async () => {
    if (!profile) return;

    try {
      setLoading(true);

      // Determine which fields can be updated
      const allowedFields = viewingOwnProfile
        ? {
            mobile_number: editForm.mobile_number,
            current_address: editForm.current_address,
            emergency_contact_name: editForm.emergency_contact_name,
            emergency_contact_relation: editForm.emergency_contact_relation,
            emergency_contact_number: editForm.emergency_contact_number,
          }
        : editForm; // HR can update everything

      const { error } = await supabase
        .from("users")
        .update(allowedFields)
        .eq("id", profile.id);

      if (error) throw error;

      alert("✅ Profile updated successfully");
      setEditing(false);
      fetchProfile();
    } catch (error: any) {
      console.error("Error updating profile:", error);
      alert(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingScreen message="Loading profile..." />;
  }

  if (!profile) {
    return (
      <div className="p-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-900">
            Profile Not Found
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-6">
              {/* Profile Picture Placeholder */}
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                {profile.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </div>

              {/* Basic Info */}
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {profile.name}
                </h1>
                <p className="text-lg text-gray-600 mt-1">
                  {profile.designation || "Employee"}
                </p>
                <div className="flex items-center gap-4 mt-2">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    {profile.id}
                  </span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                    {profile.role}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      profile.employment_status === "Active"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {profile.employment_status}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              {/* Back button if viewing another employee */}
              {!viewingOwnProfile && (
                <button
                  onClick={() => {
                    const event = new CustomEvent("navigate", {
                      detail: "employees",
                    });
                    window.dispatchEvent(event);
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-all"
                >
                  ← Back to Employees
                </button>
              )}

              {/* Edit button - show based on context */}
              {!editing &&
                ((viewingOwnProfile && ["personal"].includes(activeTab)) ||
                  ["HR/Payroll", "Management"].includes(
                    currentUser?.role || "",
                  )) && (
                  <button
                    onClick={() => setEditing(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
                  >
                    ✏️ Edit Profile
                  </button>
                )}

              {editing && (
                <>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all"
                  >
                    💾 Save Changes
                  </button>
                  <button
                    onClick={() => {
                      setEditing(false);
                      setEditForm(profile);
                    }}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-all"
                  >
                    ✖️ Cancel
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              {[
                { id: "personal", label: "Personal Info", icon: "👤" },
                { id: "job", label: "Job Details", icon: "💼" },
                ...(canViewPayroll
                  ? [{ id: "payroll", label: "Payroll", icon: "💰" }]
                  : []),
                { id: "leave", label: "Leave Balance", icon: "🏖️" },
                { id: "attendance", label: "Attendance", icon: "⏰" }, // Add this
                { id: "documents", label: "Documents", icon: "📄" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-6 py-4 text-sm font-medium border-b-2 transition-all ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Personal Info Tab */}
            {activeTab === "personal" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={
                      editing ? editForm.personal_email : profile.personal_email
                    }
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        personal_email: e.target.value,
                      })
                    }
                    disabled={!editing || viewingOwnProfile}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg disabled:bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mobile Number
                  </label>
                  <input
                    type="tel"
                    value={
                      editing ? editForm.mobile_number : profile.mobile_number
                    }
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        mobile_number: e.target.value,
                      })
                    }
                    disabled={!editing}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg disabled:bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={
                      editing ? editForm.date_of_birth : profile.date_of_birth
                    }
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        date_of_birth: e.target.value,
                      })
                    }
                    disabled={!editing || viewingOwnProfile}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg disabled:bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gender
                  </label>
                  <input
                    type="text"
                    value={profile.gender || "-"}
                    disabled
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Blood Group
                  </label>
                  <input
                    type="text"
                    value={profile.blood_group || "-"}
                    disabled={!editing || viewingOwnProfile}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg disabled:bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Marital Status
                  </label>
                  <input
                    type="text"
                    value={profile.marital_status || "-"}
                    disabled={!editing || viewingOwnProfile}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg disabled:bg-gray-50"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Address
                  </label>
                  <textarea
                    value={
                      editing
                        ? editForm.current_address
                        : profile.current_address
                    }
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        current_address: e.target.value,
                      })
                    }
                    disabled={!editing}
                    rows={2}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg disabled:bg-gray-50"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Permanent Address
                  </label>
                  <textarea
                    value={
                      editing
                        ? editForm.permanent_address
                        : profile.permanent_address
                    }
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        permanent_address: e.target.value,
                      })
                    }
                    disabled={!editing || viewingOwnProfile}
                    rows={2}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg disabled:bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Emergency Contact Name
                  </label>
                  <input
                    type="text"
                    value={
                      editing
                        ? editForm.emergency_contact_name
                        : profile.emergency_contact_name
                    }
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        emergency_contact_name: e.target.value,
                      })
                    }
                    disabled={!editing}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg disabled:bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Relationship
                  </label>
                  <input
                    type="text"
                    value={
                      editing
                        ? editForm.emergency_contact_relation
                        : profile.emergency_contact_relation
                    }
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        emergency_contact_relation: e.target.value,
                      })
                    }
                    disabled={!editing}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg disabled:bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Emergency Contact Number
                  </label>
                  <input
                    type="tel"
                    value={
                      editing
                        ? editForm.emergency_contact_number
                        : profile.emergency_contact_number
                    }
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        emergency_contact_number: e.target.value,
                      })
                    }
                    disabled={!editing}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg disabled:bg-gray-50"
                  />
                </div>
              </div>
            )}

            {/* Job Details Tab */}
            {activeTab === "job" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Employee ID
                  </label>
                  <input
                    type="text"
                    value={profile.id}
                    disabled
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Department
                  </label>
                  <input
                    type="text"
                    value={profile.department}
                    disabled
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  />
                </div>

                {profile.sub_department && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sub-Department
                    </label>
                    <input
                      type="text"
                      value={profile.sub_department}
                      disabled
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Designation
                  </label>
                  <input
                    type="text"
                    value={profile.designation || "-"}
                    disabled
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role
                  </label>
                  <input
                    type="text"
                    value={profile.role}
                    disabled
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Employment Type
                  </label>
                  <input
                    type="text"
                    value={profile.employment_type || "-"}
                    disabled
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date of Joining
                  </label>
                  <input
                    type="date"
                    value={profile.date_of_joining || ""}
                    disabled
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Employment Status
                  </label>
                  <input
                    type="text"
                    value={profile.employment_status}
                    disabled
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  />
                </div>
              </div>
            )}

            {/* Payroll Tab */}
            {activeTab === "payroll" && canViewPayroll && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Basic Salary
                  </label>
                  <input
                    type="text"
                    value={
                      profile.basic_salary
                        ? `₹${profile.basic_salary.toLocaleString("en-IN")}`
                        : "-"
                    }
                    disabled
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    HRA
                  </label>
                  <input
                    type="text"
                    value={
                      profile.hra
                        ? `₹${profile.hra.toLocaleString("en-IN")}`
                        : "-"
                    }
                    disabled
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Allowances
                  </label>
                  <input
                    type="text"
                    value={
                      profile.allowances
                        ? `₹${profile.allowances.toLocaleString("en-IN")}`
                        : "-"
                    }
                    disabled
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gross Salary
                  </label>
                  <input
                    type="text"
                    value={`₹${((profile.basic_salary || 0) + (profile.hra || 0) + (profile.allowances || 0)).toLocaleString("en-IN")}`}
                    disabled
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-green-50 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    PF Enabled
                  </label>
                  <input
                    type="text"
                    value={profile.pf_enabled ? "Yes" : "No"}
                    disabled
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ESI Enabled
                  </label>
                  <input
                    type="text"
                    value={profile.esi_enabled ? "Yes" : "No"}
                    disabled
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bank Name
                  </label>
                  <input
                    type="text"
                    value={profile.bank_name || "-"}
                    disabled
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Account Number
                  </label>
                  <input
                    type="text"
                    value={
                      profile.account_number
                        ? `****${profile.account_number.slice(-4)}`
                        : "-"
                    }
                    disabled
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    IFSC Code
                  </label>
                  <input
                    type="text"
                    value={profile.ifsc_code || "-"}
                    disabled
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    PAN Number
                  </label>
                  <input
                    type="text"
                    value={
                      profile.pan_number
                        ? `${profile.pan_number.slice(0, 2)}****${profile.pan_number.slice(-2)}`
                        : "-"
                    }
                    disabled
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 font-mono"
                  />
                </div>
                {/* Existing payroll fields above... */}

                {/* Recent Payslips Section */}
                <div className="md:col-span-2 mt-6 pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Recent Payslips
                  </h3>

                  {recentPayslips.length === 0 ? (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                      <div className="text-4xl mb-2">📄</div>
                      <p className="text-gray-600">No payslip records found</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {recentPayslips.map((payslip) => (
                        <div
                          key={payslip.id}
                          className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200 hover:shadow-md transition-all"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center text-white text-xl">
                              💰
                            </div>
                            <div>
                              <div className="font-semibold text-gray-900">
                                {new Date(
                                  payslip.month + "-01",
                                ).toLocaleDateString("en-IN", {
                                  month: "long",
                                  year: "numeric",
                                })}
                              </div>
                              <div className="text-sm text-gray-600">
                                Net Salary: ₹
                                {Number(payslip.net_salary).toLocaleString(
                                  "en-IN",
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${
                                payslip.payment_status === "Paid"
                                  ? "bg-green-100 text-green-800"
                                  : payslip.payment_status === "Pending"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {payslip.payment_status}
                            </span>
                            <button
                              onClick={() => {
                                const event = new CustomEvent("navigate", {
                                  detail: "my-payslips",
                                });
                                window.dispatchEvent(event);
                              }}
                              className="px-3 py-1 text-blue-600 hover:text-blue-800 text-sm font-medium"
                            >
                              View Details →
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {/* Existing payroll fields above... */}

                  {/* Recent Payslips Section */}
                  <div className="md:col-span-2 mt-6 pt-6 border-t border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Recent Payslips
                    </h3>

                    {recentPayslips.length === 0 ? (
                      <div className="text-center py-8 bg-gray-50 rounded-lg">
                        <div className="text-4xl mb-2">📄</div>
                        <p className="text-gray-600">
                          No payslip records found
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {recentPayslips.map((payslip) => (
                          <div
                            key={payslip.id}
                            className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200 hover:shadow-md transition-all"
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center text-white text-xl">
                                💰
                              </div>
                              <div>
                                <div className="font-semibold text-gray-900">
                                  {new Date(
                                    payslip.month + "-01",
                                  ).toLocaleDateString("en-IN", {
                                    month: "long",
                                    year: "numeric",
                                  })}
                                </div>
                                <div className="text-sm text-gray-600">
                                  Net Salary: ₹
                                  {Number(payslip.net_salary).toLocaleString(
                                    "en-IN",
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-medium ${
                                  payslip.payment_status === "Paid"
                                    ? "bg-green-100 text-green-800"
                                    : payslip.payment_status === "Pending"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {payslip.payment_status}
                              </span>
                              <button
                                onClick={() => {
                                  const event = new CustomEvent("navigate", {
                                    detail: "my-payslips",
                                  });
                                  window.dispatchEvent(event);
                                }}
                                className="px-3 py-1 text-blue-600 hover:text-blue-800 text-sm font-medium"
                              >
                                View Details →
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    {/* Recent Payslips Section */}
                    <div className="md:col-span-2 mt-6 pt-6 border-t border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Recent Payslips
                      </h3>
                      {recentPayslips.length > 0 && (
                        <div className="mt-4 text-center">
                          <button
                            onClick={() => {
                              const event = new CustomEvent("navigate", {
                                detail: "my-payslips",
                              });
                              window.dispatchEvent(event);
                            }}
                            className="px-4 py-2 text-blue-600 hover:text-blue-800 font-medium text-sm"
                          >
                            View All Payslips →
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Leave Balance Tab */}
            {activeTab === "leave" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg border-2 border-blue-200">
                  <div className="text-blue-600 text-3xl mb-2">🏖️</div>
                  <div className="text-sm text-blue-700 font-medium mb-1">
                    Casual Leave
                  </div>
                  <div className="text-3xl font-bold text-blue-900">
                    {profile.casual_leave_balance || 0}
                  </div>
                  <div className="text-xs text-blue-600 mt-1">
                    days remaining
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg border-2 border-green-200">
                  <div className="text-green-600 text-3xl mb-2">🏥</div>
                  <div className="text-sm text-green-700 font-medium mb-1">
                    Sick Leave
                  </div>
                  <div className="text-3xl font-bold text-green-900">
                    {profile.sick_leave_balance || 0}
                  </div>
                  <div className="text-xs text-green-600 mt-1">
                    days remaining
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg border-2 border-purple-200">
                  <div className="text-purple-600 text-3xl mb-2">✈️</div>
                  <div className="text-sm text-purple-700 font-medium mb-1">
                    Earned Leave
                  </div>
                  <div className="text-3xl font-bold text-purple-900">
                    {profile.earned_leave_balance || 0}
                  </div>
                  <div className="text-xs text-purple-600 mt-1">
                    days remaining
                  </div>
                </div>

                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-lg border-2 border-gray-200">
                  <div className="text-gray-600 text-3xl mb-2">📊</div>
                  <div className="text-sm text-gray-700 font-medium mb-1">
                    Unpaid Leave
                  </div>
                  <div className="text-3xl font-bold text-gray-900">
                    {profile.unpaid_leave_taken || 0}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">days taken</div>
                </div>
              </div>
            )}
            {/* Attendance History Tab */}
            {activeTab === "attendance" && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Recent Attendance
                </h3>

                {recentAttendance.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">📅</div>
                    <p className="text-gray-600">No attendance records found</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead className="bg-gray-50 border-b">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Date
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Clock In
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Clock Out
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Hours
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Status
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Entry
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {recentAttendance.map((record, idx) => (
                          <tr key={idx} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm font-medium">
                              {new Date(record.date).toLocaleDateString(
                                "en-IN",
                                {
                                  weekday: "short",
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                },
                              )}
                            </td>
                            <td className="px-4 py-3 text-sm font-mono">
                              {record.clock_in || "-"}
                            </td>
                            <td className="px-4 py-3 text-sm font-mono">
                              {record.clock_out || "-"}
                            </td>
                            <td className="px-4 py-3 text-sm font-semibold">
                              {record.total_hours
                                ? `${record.total_hours.toFixed(2)}h`
                                : "-"}
                            </td>
                            <td className="px-4 py-3">
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  record.status === "Present"
                                    ? "bg-green-100 text-green-800"
                                    : record.status === "Absent"
                                      ? "bg-red-100 text-red-800"
                                      : record.status === "Half Day"
                                        ? "bg-yellow-100 text-yellow-800"
                                        : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {record.status}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">
                              Entry #{record.entry_number || 1}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {recentAttendance.length > 0 && (
                  <div className="mt-4 text-center">
                    <button
                      onClick={() => {
                        const event = new CustomEvent("navigate", {
                          detail: "attendance",
                        });
                        window.dispatchEvent(event);
                      }}
                      className="px-4 py-2 text-blue-600 hover:text-blue-800 font-medium text-sm"
                    >
                      View Full Attendance History →
                    </button>
                  </div>
                )}
              </div>
            )}
            {/* Documents Tab */}
            {activeTab === "documents" && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📄</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Document Management
                </h3>
                <p className="text-gray-600 mb-4">
                  Upload and manage employee documents
                </p>
                <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  📤 Upload Document
                </button>
                <p className="text-sm text-gray-500 mt-4">
                  Coming soon: Offer letter, contracts, certifications
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeProfilePage;
