import React from "react";

interface Step3JobInfoProps {
  formData: any;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void;
}

const Step3JobInfo: React.FC<Step3JobInfoProps> = ({ formData, onChange }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">
        Job Information
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Department */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Department <span className="text-red-500">*</span>
          </label>
          <select
            name="department"
            value={formData.department}
            onChange={onChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select Department</option>
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

        {/* Sub-Department (conditional for Production) */}
        {formData.department === "Production" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sub-Department <span className="text-red-500">*</span>
            </label>
            <select
              name="subDepartment"
              value={formData.subDepartment || ""}
              onChange={onChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Sub-Department</option>
              <option value="Inventory">Inventory</option>
              <option value="Machining">Machining</option>
              <option value="Welding">Welding</option>
              <option value="Assembly">Assembly</option>
            </select>
          </div>
        )}

        {/* Designation */}
        <div
          className={
            formData.department === "Production" ? "" : "md:col-span-2"
          }
        >
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Designation <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="designation"
            value={formData.designation}
            onChange={onChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            required
            placeholder="e.g., Senior Engineer, HR Manager"
          />
        </div>

        {/* Date of Joining */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date of Joining <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            name="dateOfJoining"
            value={formData.dateOfJoining}
            onChange={onChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Employment Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Employment Status <span className="text-red-500">*</span>
          </label>
          <select
            name="employmentStatus"
            value={formData.employmentStatus}
            onChange={onChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="Active">Active</option>
            <option value="On Leave">On Leave</option>
            <option value="Resigned">Resigned</option>
            <option value="Terminated">Terminated</option>
          </select>
        </div>

        {/* Employment Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Employment Type <span className="text-red-500">*</span>
          </label>
          <select
            name="employmentType"
            value={formData.employmentType}
            onChange={onChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="Permanent">Permanent</option>
            <option value="Contract">Contract</option>
            <option value="Temporary">Temporary</option>
            <option value="Intern">Intern</option>
          </select>
        </div>

        {/* Probation Period */}
        {formData.employmentType === "Permanent" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Probation Period (months)
            </label>
            <input
              type="number"
              name="probationPeriod"
              value={formData.probationPeriod}
              onChange={onChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., 3"
              min="0"
              max="12"
            />
          </div>
        )}

        {/* Confirmation Date */}
        {formData.employmentType === "Permanent" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirmation Date
            </label>
            <input
              type="date"
              name="confirmationDate"
              value={formData.confirmationDate}
              onChange={onChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}

        {/* Reporting Manager */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Reporting Manager
          </label>
          <input
            type="text"
            name="reportingManager"
            value={formData.reportingManager}
            onChange={onChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Manager's Name"
          />
        </div>

        {/* Work Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Work Location
          </label>
          <input
            type="text"
            name="workLocation"
            value={formData.workLocation}
            onChange={onChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., Head Office, Factory"
          />
        </div>

        {/* Shift Timing */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Shift Timing
          </label>
          <select
            name="shiftTiming"
            value={formData.shiftTiming}
            onChange={onChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="Day Shift">Day Shift (9 AM - 6 PM)</option>
            <option value="Night Shift">Night Shift (9 PM - 6 AM)</option>
            <option value="Rotational">Rotational</option>
            <option value="Flexible">Flexible</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default Step3JobInfo;
