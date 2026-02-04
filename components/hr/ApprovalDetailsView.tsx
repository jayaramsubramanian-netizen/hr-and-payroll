
import React from 'react';
import { OnboardingRequest, UserRole } from '../../types';
import { UserIcon } from '../shared/Icons';

interface ApprovalDetailsViewProps {
  request: OnboardingRequest;
  onApprove: () => void;
  onReject: () => void;
  viewerRole: UserRole;
}

const DetailItem: React.FC<{ label: string; value?: string | number | null; isProtected?: boolean }> = ({ label, value, isProtected }) => {
  const displayValue = isProtected ? '**********' : (value || '-');
  return (
    <div>
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-1 text-sm text-slate-900">{displayValue}</p>
    </div>
  );
};

const ApprovalDetailsView: React.FC<ApprovalDetailsViewProps> = ({ request, onApprove, onReject, viewerRole }) => {
  const { formData } = request;
  const isManagerView = viewerRole === UserRole.MANAGER;

  const grossSalary = Number(formData.basicSalary || 0) + Number(formData.hra || 0) + Number(formData.allowances || 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
        {isManagerView ? (
          <div className="w-32 h-32 rounded-full bg-slate-200 flex items-center justify-center border-4 border-slate-300">
            <UserIcon className="w-16 h-16 text-slate-400"/>
          </div>
        ) : (
           formData.faceImage && (
            <img src={formData.faceImage} alt="Employee" className="w-32 h-32 rounded-full object-cover border-4 border-slate-200" />
          )
        )}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-4 flex-grow">
            <div className="col-span-full">
                <p className="text-sm font-medium text-slate-500">Employee Name</p>
                <p className="text-2xl font-bold text-brand-primary">{formData.fullName}</p>
            </div>
            <DetailItem label="Employee ID" value={formData.employeeId} />
            <DetailItem label="Designation" value={formData.designation} />
            <DetailItem label="Department" value={formData.department} />
        </div>
      </div>

      <div className="space-y-4">
        <div>
            <h4 className="text-md font-bold text-slate-700 border-b border-slate-200 pb-1 mb-2">Personal Details</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <DetailItem label="Father's/Spouse's Name" value={formData.fatherSpouseName} />
                <DetailItem label="Date of Birth" value={formData.dob} />
                <DetailItem label="Gender" value={formData.gender} />
                <DetailItem label="Aadhaar" value={formData.aadhaar} isProtected={isManagerView} />
                <DetailItem label="PAN" value={formData.pan} isProtected={isManagerView} />
            </div>
        </div>

        <div>
            <h4 className="text-md font-bold text-slate-700 border-b border-slate-200 pb-1 mb-2">Salary & Benefits</h4>
             <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <DetailItem label="Gross Salary" value={`₹${grossSalary.toLocaleString('en-IN')}`} isProtected={isManagerView} />
                <DetailItem label="PF Eligible" value={formData.pf ? 'Yes' : 'No'} />
                <DetailItem label="ESI Eligible" value={formData.esi ? 'Yes' : 'No'} />
            </div>
        </div>

        <div>
            <h4 className="text-md font-bold text-slate-700 border-b border-slate-200 pb-1 mb-2">Bank Details</h4>
             <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <DetailItem label="Bank Name" value={formData.bankName} isProtected={isManagerView} />
                <DetailItem label="Account Number" value={formData.bankAccountNumber} isProtected={isManagerView} />
                <DetailItem label="IFSC Code" value={formData.ifscCode} isProtected={isManagerView} />
            </div>
        </div>
      </div>
      
      <footer className="pt-4 flex justify-end space-x-3 border-t border-slate-200">
        <button onClick={onReject} className="px-6 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md">Reject</button>
        <button onClick={onApprove} className="px-6 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md">Approve</button>
      </footer>
    </div>
  );
};

export default ApprovalDetailsView;