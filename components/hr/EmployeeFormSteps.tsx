
import React from 'react';
import { CameraView } from '../shared/CameraView';
import { RefreshCwIcon } from '../shared/Icons';
import { UserRole } from '../../types';

interface StepProps {
    data: any;
    errors: any;
    handleChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
    setFormDataValue?: (name: string, value: any) => void;
}

const a11yProps = (errors: any, name: string) => ({
    'aria-invalid': !!errors[name],
    'aria-describedby': errors[name] ? `${name}-error` : undefined,
});

const ErrorMessage: React.FC<{ errors: any, name: string }> = ({ errors, name }) => {
    if (!errors[name]) return null;
    return <p id={`${name}-error`} className="mt-1 text-xs text-red-600">{errors[name]}</p>
};

// Step 1: Personal Details
export const PersonalDetailsStep: React.FC<StepProps> = ({ data, handleChange, errors }) => (
    <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Personal Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Full Name (as per AADHAAR)</label>
                <input type="text" name="fullName" id="fullName" value={data.fullName} onChange={handleChange} className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-accent focus:border-brand-accent ${errors.fullName ? 'border-red-500' : 'border-gray-300'}`} {...a11yProps(errors, 'fullName')} />
                 <ErrorMessage errors={errors} name="fullName"/>
            </div>
            <div>
                <label htmlFor="fatherSpouseName" className="block text-sm font-medium text-gray-700">Father's/Spouse's Name</label>
                <input type="text" name="fatherSpouseName" id="fatherSpouseName" value={data.fatherSpouseName} onChange={handleChange} className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-accent focus:border-brand-accent ${errors.fatherSpouseName ? 'border-red-500' : 'border-gray-300'}`} {...a11yProps(errors, 'fatherSpouseName')}/>
                <ErrorMessage errors={errors} name="fatherSpouseName"/>
            </div>
            <div>
                <label htmlFor="dob" className="block text-sm font-medium text-gray-700">Date of Birth</label>
                <input type="date" name="dob" id="dob" value={data.dob} onChange={handleChange} className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-accent focus:border-brand-accent ${errors.dob ? 'border-red-500' : 'border-gray-300'}`} {...a11yProps(errors, 'dob')}/>
                <ErrorMessage errors={errors} name="dob"/>
            </div>
             <div>
                <label htmlFor="gender" className="block text-sm font-medium text-gray-700">Gender</label>
                <select name="gender" id="gender" value={data.gender} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-accent focus:border-brand-accent">
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                </select>
            </div>
            <div>
                <label htmlFor="aadhaar" className="block text-sm font-medium text-gray-700">AADHAAR Number</label>
                <input type="text" name="aadhaar" id="aadhaar" value={data.aadhaar} onChange={handleChange} placeholder="XXXX XXXX XXXX" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-accent focus:border-brand-accent" />
            </div>
            <div>
                <label htmlFor="pan" className="block text-sm font-medium text-gray-700">PAN Number</label>
                <input type="text" name="pan" id="pan" value={data.pan} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-accent focus:border-brand-accent" />
            </div>
        </div>
    </div>
);

// Step 2: Contact Details
export const ContactDetailsStep: React.FC<StepProps> = ({ data, handleChange, errors }) => (
    <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Contact Details</h3>
        <div>
            <label htmlFor="permanentAddress" className="block text-sm font-medium text-gray-700">Permanent Address</label>
            <textarea name="permanentAddress" id="permanentAddress" rows={3} value={data.permanentAddress} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-accent focus:border-brand-accent"></textarea>
        </div>
        <div>
            <label htmlFor="currentAddress" className="block text-sm font-medium text-gray-700">Current Address</label>
            <textarea name="currentAddress" id="currentAddress" rows={3} value={data.currentAddress} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-accent focus:border-brand-accent"></textarea>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label htmlFor="personalEmail" className="block text-sm font-medium text-gray-700">Personal Email</label>
                <input type="email" name="personalEmail" id="personalEmail" value={data.personalEmail} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-accent focus:border-brand-accent" />
            </div>
            <div>
                <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700">Mobile Number</label>
                <input type="tel" name="mobileNumber" id="mobileNumber" value={data.mobileNumber} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-accent focus:border-brand-accent" />
            </div>
        </div>
    </div>
);

// Step 3: Job Details
export const JobDetailsStep: React.FC<StepProps> = ({ data, handleChange, errors }) => (
    <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Job Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label htmlFor="doj" className="block text-sm font-medium text-gray-700">Date of Joining</label>
                <input type="date" name="doj" id="doj" value={data.doj} onChange={handleChange} className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-accent focus:border-brand-accent ${errors.doj ? 'border-red-500' : 'border-gray-300'}`} {...a11yProps(errors, 'doj')} />
                 <ErrorMessage errors={errors} name="doj"/>
            </div>
            <div>
                <label htmlFor="department" className="block text-sm font-medium text-gray-700">Department</label>
                <select name="department" id="department" value={data.department} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-accent focus:border-brand-accent">
                    <option>Machining</option><option>Assembly</option><option>Quality Control</option><option>Administration</option><option>Maintenance</option><option>Logistics</option>
                </select>
            </div>
            <div>
                <label htmlFor="designation" className="block text-sm font-medium text-gray-700">Designation</label>
                <input type="text" name="designation" id="designation" value={data.designation} onChange={handleChange} className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-accent focus:border-brand-accent ${errors.designation ? 'border-red-500' : 'border-gray-300'}`} {...a11yProps(errors, 'designation')}/>
                <ErrorMessage errors={errors} name="designation"/>
            </div>
            <div>
                <label htmlFor="employmentType" className="block text-sm font-medium text-gray-700">Employment Type</label>
                <select name="employmentType" id="employmentType" value={data.employmentType} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-accent focus:border-brand-accent">
                    <option>Permanent</option><option>Contract</option><option>Intern</option>
                </select>
            </div>
             <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
                <select name="role" id="role" value={data.role} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-accent focus:border-brand-accent">
                    <option value={UserRole.EMPLOYEE}>Employee</option><option value={UserRole.MANAGER}>Manager</option><option value={UserRole.HR_PAYROLL}>HR/Payroll</option>
                </select>
            </div>
        </div>
    </div>
);

const ToggleSwitch: React.FC<{
    name: string;
    label: string;
    checked: boolean;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ name, label, checked, onChange }) => {
    return (
        <label htmlFor={name} className="flex items-center cursor-pointer">
            <div className="relative">
                <input
                    type="checkbox"
                    id={name}
                    name={name}
                    className="sr-only"
                    checked={checked}
                    onChange={onChange}
                />
                <div className={`block w-14 h-8 rounded-full ${checked ? 'bg-brand-accent' : 'bg-gray-300'}`}></div>
                <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${checked ? 'transform translate-x-6' : ''}`}></div>
            </div>
            <div className="ml-3 text-gray-700 font-medium">{label}</div>
        </label>
    );
};

// Step 4: Statutory & Bank Details
export const StatutoryDetailsStep: React.FC<StepProps> = ({ data, handleChange, errors }) => {
    const grossSalary = Number(data.basicSalary || 0) + Number(data.hra || 0) + Number(data.allowances || 0);

    return (
    <div className="space-y-6">
        <div>
            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Statutory & Bank Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                    <label htmlFor="bankAccountNumber" className="block text-sm font-medium text-gray-700">Bank Account Number</label>
                    <input type="text" name="bankAccountNumber" id="bankAccountNumber" value={data.bankAccountNumber} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" />
                </div>
                <div>
                    <label htmlFor="ifscCode" className="block text-sm font-medium text-gray-700">IFSC Code</label>
                    <input type="text" name="ifscCode" id="ifscCode" value={data.ifscCode} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" />
                </div>
                <div className="md:col-span-2">
                    <label htmlFor="bankName" className="block text-sm font-medium text-gray-700">Bank Name</label>
                    <input type="text" name="bankName" id="bankName" value={data.bankName} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" />
                </div>
                <div>
                    <label htmlFor="uan" className="block text-sm font-medium text-gray-700">UAN (PF Number)</label>
                    <input type="text" name="uan" id="uan" value={data.uan} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" />
                </div>
                <div>
                    <label htmlFor="esiNumber" className="block text-sm font-medium text-gray-700">ESI Number</label>
                    <input type="text" name="esiNumber" id="esiNumber" value={data.esiNumber} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" />
                </div>
            </div>
        </div>
        <div>
            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Salary Structure (Monthly)</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                 <div>
                    <label htmlFor="basicSalary" className="block text-sm font-medium text-gray-700">Basic Salary</label>
                    <input type="number" name="basicSalary" id="basicSalary" value={data.basicSalary} onChange={handleChange} className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 ${errors.basicSalary ? 'border-red-500' : 'border-gray-300'}`} {...a11yProps(errors, 'basicSalary')} />
                    <ErrorMessage errors={errors} name="basicSalary"/>
                </div>
                <div>
                    <label htmlFor="hra" className="block text-sm font-medium text-gray-700">HRA</label>
                    <input type="number" name="hra" id="hra" value={data.hra} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" />
                </div>
                <div>
                    <label htmlFor="allowances" className="block text-sm font-medium text-gray-700">Other Allowances</label>
                    <input type="number" name="allowances" id="allowances" value={data.allowances} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" />
                </div>
            </div>
            <p className="text-right font-bold text-lg mt-2 text-brand-primary">Gross Salary: ₹{grossSalary.toLocaleString('en-IN')}</p>
        </div>
        <div>
            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Benefits Eligibility</h3>
            <div className="grid grid-cols-2 gap-4 mt-4">
                <ToggleSwitch name="pf" label="PF" checked={data.pf} onChange={handleChange} />
                <ToggleSwitch name="esi" label="ESI" checked={data.esi} onChange={handleChange} />
                <ToggleSwitch name="bonus" label="Bonus" checked={data.bonus} onChange={handleChange} />
                <ToggleSwitch name="medicalInsurance" label="Medical Insurance" checked={data.medicalInsurance} onChange={handleChange} />
            </div>
        </div>
    </div>
    );
};

// Step 5: Credentials
export const CredentialsStep: React.FC<StepProps> = ({ data, setFormDataValue, errors }) => {
    const generatePassword = () => {
        const newPass = Math.random().toString(36).slice(-8).toUpperCase();
        setFormDataValue?.('tempPassword', newPass);
    };

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Login Credentials</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Generated Employee ID</label>
                        <input type="text" value={data.employeeId} readOnly className="mt-1 block w-full bg-gray-100 border border-gray-300 rounded-md shadow-sm py-2 px-3" />
                    </div>
                    <div>
                        <label htmlFor="tempPassword" className="block text-sm font-medium text-gray-700">Temporary Password</label>
                        <div className="mt-1 flex rounded-md shadow-sm">
                            <input type="text" name="tempPassword" id="tempPassword" value={data.tempPassword} onChange={(e) => setFormDataValue?.('tempPassword', e.target.value)} className="block w-full flex-1 rounded-none rounded-l-md border-gray-300 focus:border-brand-accent focus:ring-brand-accent" />
                            <button type="button" onClick={generatePassword} className="inline-flex items-center space-x-2 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 px-3 text-sm text-gray-500 hover:bg-gray-100">
                                <RefreshCwIcon className="h-4 w-4" /> <span>Generate</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Face Scan for Login</label>
                    {data.faceImage ? (
                        <div className="text-center p-4 border-2 border-dashed border-green-500 rounded-lg bg-green-50">
                            <img src={data.faceImage} alt="Employee snapshot" className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-white shadow-md" />
                            <p className="text-green-700 font-semibold mt-2">Image Captured!</p>
                            <button type="button" onClick={() => setFormDataValue?.('faceImage', null)} className="mt-2 text-sm text-brand-secondary hover:underline">Retake Photo</button>
                        </div>
                    ) : (
                        <div className="p-2 border-2 border-dashed rounded-lg">
                            <CameraView onCapture={(img) => setFormDataValue?.('faceImage', img)} verificationStatus="idle" />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
