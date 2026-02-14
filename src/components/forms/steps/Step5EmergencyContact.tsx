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

const Step5EmergencyContact: React.FC<StepProps> = ({
  formData,
  handleChange,
}) => {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Emergency Contact Information
      </h2>

      {/* Blood Group */}
      <div className="max-w-xs">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Blood Group <span className="text-red-500">*</span>
        </label>
        <select
          name="bloodGroup"
          value={formData.bloodGroup}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-avlm-blue focus:border-transparent"
        >
          <option value="A+">A+</option>
          <option value="A-">A-</option>
          <option value="B+">B+</option>
          <option value="B-">B-</option>
          <option value="AB+">AB+</option>
          <option value="AB-">AB-</option>
          <option value="O+">O+</option>
          <option value="O-">O-</option>
        </select>
      </div>

      {/* Primary Contact */}
      <div className="pt-6 border-t">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Primary Contact Person
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contact Person Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="primaryContactName"
              value={formData.primaryContactName}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-avlm-blue focus:border-transparent"
              placeholder="Full name of emergency contact"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contact Address
            </label>
            <textarea
              name="primaryContactAddress"
              value={formData.primaryContactAddress}
              onChange={handleChange}
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-avlm-blue focus:border-transparent"
              placeholder="Emergency contact address"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact # (Phone)
              </label>
              <input
                type="tel"
                name="primaryContactPhone"
                value={formData.primaryContactPhone}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-avlm-blue focus:border-transparent"
                placeholder="Landline"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mobile # <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="primaryContactMobile"
                value={formData.primaryContactMobile}
                onChange={handleChange}
                maxLength={10}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-avlm-blue focus:border-transparent"
                placeholder="Mobile number"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Relationship to Employee
              </label>
              <input
                type="text"
                name="primaryContactRelationship"
                value={formData.primaryContactRelationship}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-avlm-blue focus:border-transparent"
                placeholder="e.g., Spouse, Parent, Sibling"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Contact */}
      <div className="pt-6 border-t">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Secondary Contact Person
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Optional - Provide alternate emergency contact
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contact Person Name
            </label>
            <input
              type="text"
              name="secondaryContactName"
              value={formData.secondaryContactName}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-avlm-blue focus:border-transparent"
              placeholder="Full name of secondary contact"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contact Address
            </label>
            <textarea
              name="secondaryContactAddress"
              value={formData.secondaryContactAddress}
              onChange={handleChange}
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-avlm-blue focus:border-transparent"
              placeholder="Secondary contact address"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact # (Phone)
              </label>
              <input
                type="tel"
                name="secondaryContactPhone"
                value={formData.secondaryContactPhone}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-avlm-blue focus:border-transparent"
                placeholder="Landline"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mobile #
              </label>
              <input
                type="tel"
                name="secondaryContactMobile"
                value={formData.secondaryContactMobile}
                onChange={handleChange}
                maxLength={10}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-avlm-blue focus:border-transparent"
                placeholder="Mobile number"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Relationship to Employee
              </label>
              <input
                type="text"
                name="secondaryContactRelationship"
                value={formData.secondaryContactRelationship}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-avlm-blue focus:border-transparent"
                placeholder="e.g., Friend, Relative"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step5EmergencyContact;
