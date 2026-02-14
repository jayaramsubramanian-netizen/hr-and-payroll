import React, { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import { useAuth } from "./AuthContext";

interface OnboardingRequest {
  id: string;
  full_name: string;
  department: string;
  sub_department?: string;
  designation: string;
  role: string;
  status: string;
  created_at: string;
  form_data: any;
}

const PendingRequestsPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [requests, setRequests] = useState<OnboardingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] =
    useState<OnboardingRequest | null>(null);

  useEffect(() => {
    if (currentUser) {
      fetchRequests();
    }
  }, [currentUser]);

  const fetchRequests = async () => {
    if (!currentUser) return;

    try {
      setLoading(true);

      let query = supabase.from("onboarding_requests").select("*");

      // Filter by department for Managers
      if (currentUser.role === "manager") {
        query = query.eq("department", currentUser.department);
      }
      // HR and Management see all requests

      const { data, error } = await query.order("created_at", {
        ascending: false,
      });

      if (error) throw error;
      setRequests(data || []);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (request: OnboardingRequest) => {
    if (!currentUser) return;

    if (!confirm(`Approve onboarding for ${request.full_name}?`)) return;

    try {
      // If Manager approves, update status
      if (currentUser.role === "manager") {
        const { error: updateError } = await supabase
          .from("onboarding_requests")
          .update({ status: "Manager Approved" })
          .eq("id", request.id);

        if (updateError) throw updateError;

        alert(`✅ Request approved and forwarded to HR for final review`);
      }
      // If HR/Management approves, create employee
      else if (currentUser.role === "hr" || currentUser.role === "admin") {
        const { error: insertError } = await supabase.from("users").insert({
          id: request.id,
          name: request.full_name,
          role: request.role,
          department: request.department,
          personal_email: request.form_data.personalEmail,
          mobile_number: request.form_data.mobile,
        });

        if (insertError) throw insertError;

        // Delete the request after creating employee
        await supabase
          .from("onboarding_requests")
          .delete()
          .eq("id", request.id);

        alert(`✅ ${request.full_name} has been added as an employee!`);
      }

      fetchRequests();
      setSelectedRequest(null);
    } catch (error: any) {
      console.error("Error:", error);
      alert(`❌ Error: ${error.message}`);
    }
  };

  const handleReject = async (request: OnboardingRequest) => {
    const reason = prompt(
      `Reject ${request.full_name}'s onboarding?\n\nEnter rejection reason:`,
    );
    if (!reason) return;

    try {
      await supabase.from("onboarding_requests").delete().eq("id", request.id);

      alert(`❌ Request rejected: ${reason}`);
      fetchRequests();
      setSelectedRequest(null);
    } catch (error: any) {
      console.error("Error:", error);
      alert(`❌ Error: ${error.message}`);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Manager Approved":
        return "bg-blue-100 text-blue-800";
      case "Approved":
        return "bg-green-100 text-green-800";
      case "Rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const canApprove = (request: OnboardingRequest) => {
    if (!currentUser) return false;

    // Manager can approve if status is Pending
    if (currentUser.role === "manager" && request.status === "Pending") {
      return true;
    }

    // HR/Management can approve if Manager already approved or if status is Pending
    if (currentUser.role === "hr" || currentUser.role === "admin") {
      return true;
    }

    return false;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading requests...</p>
        </div>
      </div>
    );
  }

  if (selectedRequest) {
    return (
      <div className="p-6 max-w-5xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Review Onboarding Request
            </h2>
            <button
              onClick={() => setSelectedRequest(null)}
              className="px-4 py-2 text-gray-600 hover:text-gray-900"
            >
              ← Back to List
            </button>
          </div>

          <div className="space-y-6">
            {/* Employee Info */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">
                Employee Information
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Employee ID</p>
                  <p className="font-medium">{selectedRequest.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Full Name</p>
                  <p className="font-medium">{selectedRequest.full_name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Department</p>
                  <p className="font-medium">{selectedRequest.department}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Designation</p>
                  <p className="font-medium">{selectedRequest.designation}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Role</p>
                  <p className="font-medium">{selectedRequest.role}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${getStatusColor(selectedRequest.status)}`}
                  >
                    {selectedRequest.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            {selectedRequest.form_data && (
              <>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">
                    Contact Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium">
                        {selectedRequest.form_data.personalEmail || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Mobile</p>
                      <p className="font-medium">
                        {selectedRequest.form_data.mobile || "-"}
                      </p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm text-gray-600">Address</p>
                      <p className="font-medium">
                        {selectedRequest.form_data.address || "-"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Personal Info */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">
                    Personal Details
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Date of Birth</p>
                      <p className="font-medium">
                        {selectedRequest.form_data.dob || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Sex</p>
                      <p className="font-medium">
                        {selectedRequest.form_data.sex || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Nationality</p>
                      <p className="font-medium">
                        {selectedRequest.form_data.nationality || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Blood Group</p>
                      <p className="font-medium">
                        {selectedRequest.form_data.bloodGroup || "-"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Job Info */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">Job Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Date of Joining</p>
                      <p className="font-medium">
                        {selectedRequest.form_data.dateOfJoining || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Employment Type</p>
                      <p className="font-medium">
                        {selectedRequest.form_data.isContracted
                          ? "Contract (Short-term)"
                          : "Permanent (Full-time)"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">
                        Educational Qualification
                      </p>
                      <p className="font-medium">
                        {selectedRequest.form_data.educationalQualification ||
                          "-"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Emergency Contact */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">
                    Emergency Contact
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">
                        Primary Contact Name
                      </p>
                      <p className="font-medium">
                        {selectedRequest.form_data.primaryContactName || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">
                        Primary Contact Mobile
                      </p>
                      <p className="font-medium">
                        {selectedRequest.form_data.primaryContactMobile || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Relationship</p>
                      <p className="font-medium">
                        {selectedRequest.form_data.primaryContactRelationship ||
                          "-"}
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Action Buttons */}
            {canApprove(selectedRequest) && (
              <div className="flex gap-4 pt-6 border-t">
                <button
                  onClick={() => handleApprove(selectedRequest)}
                  className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all font-medium"
                >
                  ✓ Approve
                  {currentUser?.role === "manager" && " & Forward to HR"}
                  {(currentUser?.role === "hr" ||
                    currentUser?.role === "admin") &&
                    " & Create Employee"}
                </button>
                <button
                  onClick={() => handleReject(selectedRequest)}
                  className="flex-1 px-6 py-3 text-white rounded-lg hover:opacity-90 transition-all font-medium"
                  style={{ backgroundColor: "#AB2328" }}
                >
                  ✗ Reject
                </button>
              </div>
            )}

            {!canApprove(selectedRequest) && (
              <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                <p className="text-sm text-yellow-800">
                  {selectedRequest.status === "Manager Approved"
                    ? "This request has been approved by the manager and is awaiting HR approval."
                    : "You do not have permission to approve this request."}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Pending Onboarding Requests
          </h1>
          <p className="text-gray-600 mt-2">
            {currentUser?.role === "manager"
              ? `Reviewing requests for ${currentUser.department} department`
              : "Review and approve new employee onboarding requests"}
          </p>
        </div>

        {requests.length === 0 ? (
          <div className="bg-white p-12 rounded-lg shadow-sm text-center">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Pending Requests
            </h3>
            <p className="text-gray-600">
              {currentUser?.role === "manager"
                ? `No pending requests for ${currentUser.department} department`
                : "All onboarding requests have been processed"}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Designation
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Submitted
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {requests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium">
                      {request.id}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {request.department}
                      {request.sub_department && (
                        <div className="text-xs text-gray-500">
                          ({request.sub_department})
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm">{request.full_name}</td>
                    <td className="px-6 py-4 text-sm">{request.department}</td>
                    <td className="px-6 py-4 text-sm">{request.designation}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}
                      >
                        {request.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(request.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => setSelectedRequest(request)}
                        className="px-4 py-2 text-sm text-white rounded hover:opacity-90 transition-all"
                        style={{ backgroundColor: "#06038D" }}
                      >
                        Review
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default PendingRequestsPage;
