import React from "react";
import type { FormData } from "../AddEmployeeForm";

interface StepProps {
  formData: FormData;
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => void;
}

const Step4PayrollContractor: React.FC<StepProps> = ({
  formData,
  handleChange,
}) => {
  return (
    <div className="space-y-8">
      {formData.isContracted ? (
        // Contractor Information
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Contractor Information
          </h2>
          <p
            className="text-sm text-gray-600 mb-6 bg-yellow-50 border-l-4 p-4 rounded"
            style={{ borderLeftColor: "#AB2328" }}
          >
            <strong>Contract Employee:</strong> This employee is on a short-term
            contract and hired through a contractor. Please provide the
            contractor's details below. Payroll information is not required.
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name of the Contractor <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="contractorName"
                value={formData.contractorName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-avlm-blue focus:border-transparent"
                placeholder="Contractor company/person name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contractor Address
              </label>
              <textarea
                name="contractorAddress"
                value={formData.contractorAddress}
                onChange={handleChange}
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-avlm-blue focus:border-transparent"
                placeholder="Contractor's business address"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone #
                </label>
                <input
                  type="tel"
                  name="contractorPhone"
                  value={formData.contractorPhone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-avlm-blue focus:border-transparent"
                  placeholder="Contractor phone"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mobile #
                </label>
                <input
                  type="tel"
                  name="contractorMobile"
                  value={formData.contractorMobile}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-avlm-blue focus:border-transparent"
                  placeholder="Contractor mobile"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  E-mail Address
                </label>
                <input
                  type="email"
                  name="contractorEmail"
                  value={formData.contractorEmail}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-avlm-blue focus:border-transparent"
                  placeholder="contractor@example.com"
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Payroll Information
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Payroll Information
          </h2>

          <div className="space-y-6">
            {/* Bank Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Bank Account Details
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bank Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="bankName"
                    value={formData.bankName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-avlm-blue focus:border-transparent"
                    placeholder="e.g., State Bank of India"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Submit a copy of voided check
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Name on Account
                    </label>
                    <input
                      type="text"
                      name="accountName"
                      value={formData.accountName}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-avlm-blue focus:border-transparent"
                      placeholder="Account holder name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Account Type
                    </label>
                    <select
                      name="accountType"
                      value={formData.accountType}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-avlm-blue focus:border-transparent"
                    >
                      <option value="Savings">Savings</option>
                      <option value="Current">Current</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Account Number
                    </label>
                    <input
                      type="text"
                      name="accountNumber"
                      value={formData.accountNumber}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-avlm-blue focus:border-transparent"
                      placeholder="Bank account number"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Account Routing Number (IFSC)
                    </label>
                    <input
                      type="text"
                      name="routingNumber"
                      value={formData.routingNumber}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-avlm-blue focus:border-transparent"
                      placeholder="IFSC Code"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Statutory Information */}
            <div className="pt-6 border-t">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Statutory Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    PAN Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="panNumber"
                    value={formData.panNumber}
                    onChange={handleChange}
                    maxLength={10}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-avlm-blue focus:border-transparent uppercase"
                    placeholder="ABCDE1234F"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Submit copy of PAN Card
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Aadhaar Card Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="aadhaarNumber"
                    value={formData.aadhaarNumber}
                    onChange={handleChange}
                    maxLength={12}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-avlm-blue focus:border-transparent"
                    placeholder="12-digit Aadhaar number"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Submit copy of Aadhaar Card
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ESI Number
                  </label>
                  <input
                    type="text"
                    name="esiNumber"
                    value={formData.esiNumber}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-avlm-blue focus:border-transparent"
                    placeholder="ESI registration number"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Submit copy of Registration Card
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Provident Fund Account Number
                  </label>
                  <input
                    type="text"
                    name="pfNumber"
                    value={formData.pfNumber}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-avlm-blue focus:border-transparent"
                    placeholder="PF account number"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Step4PayrollContractor;
