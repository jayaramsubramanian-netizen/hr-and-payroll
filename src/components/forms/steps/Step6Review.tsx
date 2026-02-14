import React from "react";
import type { FormData } from "../AddEmployeeForm";

interface StepProps {
  formData: FormData;
}

const InfoRow = ({
  label,
  value,
}: {
  label: string;
  value: string | undefined;
}) => (
  <div className="grid grid-cols-3 gap-4 py-3 border-b border-gray-100">
    <div className="text-sm font-medium text-gray-600">{label}</div>
    <div className="col-span-2 text-sm text-gray-900">{value || "-"}</div>
  </div>
);

const Step6Review: React.FC<StepProps> = ({ formData }) => {
  return (
    <div className="space-y-6">
      <div
        className="bg-blue-50 border-l-4 p-4 mb-6"
        style={{ borderLeftColor: "#06038D" }}
      >
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          Review Employee Information
        </h2>
        <p className="text-sm text-gray-600">
          Please review all information carefully before submitting. Once
          submitted, the employee record will be created in the system.
        </p>
      </div>

      {/* Personal Information */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <span className="text-xl">👤</span> Personal Information
        </h3>
        <div className="bg-gray-50 rounded-lg p-4">
          <InfoRow label="Employee ID" value={formData.employeeId} />
          <InfoRow label="Full Name" value={formData.fullName} />
          <InfoRow label="Date of Birth" value={formData.dob} />
          <InfoRow label="Sex" value={formData.sex} />
          <InfoRow label="Nationality" value={formData.nationality} />
          <InfoRow label="Religion" value={formData.religion} />
          <InfoRow
            label="Educational Qualification"
            value={formData.educationalQualification}
          />
          <InfoRow label="Marital Status" value={formData.maritalStatus} />
          {formData.maritalStatus === "Married" && (
            <InfoRow label="Spouse Name" value={formData.spouseName} />
          )}
        </div>
      </div>

      {/* Contact Information */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <span className="text-xl">📞</span> Contact Information
        </h3>
        <div className="bg-gray-50 rounded-lg p-4">
          <InfoRow label="Address" value={formData.address} />
          <InfoRow label="Phone" value={formData.phone} />
          <InfoRow label="Mobile" value={formData.mobile} />
          <InfoRow label="Email" value={formData.personalEmail} />
        </div>
      </div>

      {/* Family Information */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <span className="text-xl">👨‍👩‍👧</span> Family Information
        </h3>
        <div className="bg-gray-50 rounded-lg p-4">
          <InfoRow label="Father's Name" value={formData.fatherName} />
          <InfoRow
            label="Father's Occupation"
            value={formData.fatherOccupation}
          />
          <InfoRow label="Mother's Name" value={formData.motherName} />
          <InfoRow
            label="Mother's Occupation"
            value={formData.motherOccupation}
          />
        </div>
      </div>

      {/* Job Information */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <span className="text-xl">💼</span> Job Information
        </h3>
        <div className="bg-gray-50 rounded-lg p-4">
          <InfoRow label="Department" value={formData.department} />
          <InfoRow label="Designation" value={formData.designation} />
          <InfoRow label="Role" value={formData.role} />
          <InfoRow label="Date of Joining" value={formData.dateOfJoining} />
          <InfoRow
            label="Employment Type"
            value={
              formData.isContracted
                ? "Contract (Short-term)"
                : "Permanent (Full-time)"
            }
          />
        </div>
      </div>

      {/* Contractor/Payroll Information */}
      {formData.isContracted ? (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <span className="text-xl">🏢</span> Contractor Information
          </h3>
          <div className="bg-gray-50 rounded-lg p-4">
            <InfoRow label="Contractor Name" value={formData.contractorName} />
            <InfoRow
              label="Contractor Address"
              value={formData.contractorAddress}
            />
            <InfoRow
              label="Contractor Phone"
              value={formData.contractorPhone}
            />
            <InfoRow
              label="Contractor Mobile"
              value={formData.contractorMobile}
            />
            <InfoRow
              label="Contractor Email"
              value={formData.contractorEmail}
            />
          </div>
        </div>
      ) : (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <span className="text-xl">💰</span> Payroll Information
          </h3>
          <div className="bg-gray-50 rounded-lg p-4">
            <InfoRow label="Bank Name" value={formData.bankName} />
            <InfoRow label="Account Name" value={formData.accountName} />
            <InfoRow label="Account Type" value={formData.accountType} />
            <InfoRow label="Account Number" value={formData.accountNumber} />
            <InfoRow label="IFSC Code" value={formData.routingNumber} />
            <InfoRow label="PAN Number" value={formData.panNumber} />
            <InfoRow label="Aadhaar Number" value={formData.aadhaarNumber} />
            <InfoRow label="ESI Number" value={formData.esiNumber} />
            <InfoRow label="PF Number" value={formData.pfNumber} />
          </div>
        </div>
      )}

      {/* Emergency Contact */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <span className="text-xl">🚨</span> Emergency Contact
        </h3>
        <div className="bg-gray-50 rounded-lg p-4">
          <InfoRow label="Blood Group" value={formData.bloodGroup} />
          <div className="pt-3 mt-3 border-t border-gray-200">
            <p className="text-sm font-semibold text-gray-700 mb-2">
              Primary Contact
            </p>
            <InfoRow label="Name" value={formData.primaryContactName} />
            <InfoRow label="Address" value={formData.primaryContactAddress} />
            <InfoRow label="Phone" value={formData.primaryContactPhone} />
            <InfoRow label="Mobile" value={formData.primaryContactMobile} />
            <InfoRow
              label="Relationship"
              value={formData.primaryContactRelationship}
            />
          </div>
          {formData.secondaryContactName && (
            <div className="pt-3 mt-3 border-t border-gray-200">
              <p className="text-sm font-semibold text-gray-700 mb-2">
                Secondary Contact
              </p>
              <InfoRow label="Name" value={formData.secondaryContactName} />
              <InfoRow
                label="Address"
                value={formData.secondaryContactAddress}
              />
              <InfoRow label="Phone" value={formData.secondaryContactPhone} />
              <InfoRow label="Mobile" value={formData.secondaryContactMobile} />
              <InfoRow
                label="Relationship"
                value={formData.secondaryContactRelationship}
              />
            </div>
          )}
        </div>
      </div>

      {/* Submit Notice */}
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
        <p className="text-sm text-yellow-800">
          <strong>Important:</strong> By clicking "Submit Employee Record", you
          confirm that all information provided is accurate and complete. The
          employee will be added to the system and can access their account
          immediately.
        </p>
      </div>
    </div>
  );
};

export default Step6Review;
