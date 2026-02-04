
import React, { useState } from 'react';
import { User } from '../../types';

interface UpdateDetailsFormProps {
  user: User;
  onSave: (updatedData: Partial<User>) => void;
  onCancel: () => void;
}

const UpdateDetailsForm: React.FC<UpdateDetailsFormProps> = ({ user, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    permanentAddress: user.permanentAddress || '',
    currentAddress: user.currentAddress || '',
    personalEmail: user.personalEmail || '',
    mobileNumber: user.mobileNumber || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">Update My Contact Details</h3>
      <div>
        <label htmlFor="permanentAddress" className="block text-sm font-medium text-gray-700">Permanent Address</label>
        <textarea name="permanentAddress" id="permanentAddress" rows={3} value={formData.permanentAddress} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"></textarea>
      </div>
      <div>
        <label htmlFor="currentAddress" className="block text-sm font-medium text-gray-700">Current Address</label>
        <textarea name="currentAddress" id="currentAddress" rows={3} value={formData.currentAddress} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"></textarea>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="personalEmail" className="block text-sm font-medium text-gray-700">Personal Email</label>
          <input type="email" name="personalEmail" id="personalEmail" value={formData.personalEmail} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" />
        </div>
        <div>
          <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700">Mobile Number</label>
          <input type="tel" name="mobileNumber" id="mobileNumber" value={formData.mobileNumber} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" />
        </div>
      </div>
      <footer className="pt-4 flex justify-end space-x-3">
        <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">Cancel</button>
        <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-brand-primary rounded-md hover:bg-blue-700">Save Changes</button>
      </footer>
    </form>
  );
};

export default UpdateDetailsForm;
