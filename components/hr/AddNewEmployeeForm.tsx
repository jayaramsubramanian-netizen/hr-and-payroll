
import React, { useState, useEffect } from 'react';
import { UserRole } from '../../types';
import { PersonalDetailsStep, ContactDetailsStep, JobDetailsStep, StatutoryDetailsStep, CredentialsStep } from './EmployeeFormSteps';
import { validateStep1, validateStep3, validateStep4 } from './validation';

interface AddNewEmployeeFormProps {
  onClose: () => void;
  onSave: (newEmployee: any) => void;
}

const AddNewEmployeeForm: React.FC<AddNewEmployeeFormProps> = ({ onClose, onSave }) => {
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<any>({});
  const [formData, setFormData] = useState({
    // Step 1: Personal Details
    fullName: '', fatherSpouseName: '', dob: '', gender: 'Male', aadhaar: '', pan: '',
    // Step 2: Contact Details
    permanentAddress: '', currentAddress: '', personalEmail: '', mobileNumber: '',
    // Step 3: Job Details
    doj: '', department: 'Machining', designation: '', employmentType: 'Permanent', role: UserRole.EMPLOYEE,
    // Step 4: Statutory, Bank & Payroll Details
    bankAccountNumber: '', bankName: '', ifscCode: '', uan: '', esiNumber: '',
    basicSalary: '', hra: '', allowances: '',
    pf: true, esi: true, bonus: true, medicalInsurance: true,
    // Step 5: Credentials
    employeeId: '', tempPassword: '', faceImage: null as string | null,
  });

  useEffect(() => {
    const newId = `EMP${Math.floor(100 + Math.random() * 900)}`;
    setFormData(prev => ({ ...prev, employeeId: newId }));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
     if (errors[name]) {
        setErrors((prev: any) => ({ ...prev, [name]: undefined }));
    }
  };
  
  const setFormDataValue = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateCurrentStep = () => {
    let stepErrors: any = {};
    if (step === 1) stepErrors = validateStep1(formData);
    if (step === 3) stepErrors = validateStep3(formData);
    if (step === 4) stepErrors = validateStep4(formData);
    
    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const nextStep = () => {
    if (validateCurrentStep()) {
        setStep(prev => prev + 1);
    }
  };
  const prevStep = () => setStep(prev => prev - 1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.faceImage) {
        alert("Please capture the employee's face image before saving.");
        return;
    }
    onSave(formData);
  };
  
  const STEPS = 5;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <div className="flex justify-between mb-1">
          <span className="text-base font-medium text-brand-secondary">Step {step} of {STEPS}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div className="bg-brand-accent h-2.5 rounded-full" style={{ width: `${(step / STEPS) * 100}%` }}></div>
        </div>
      </div>

      <div className="min-h-[350px]">
        {step === 1 && <PersonalDetailsStep data={formData} handleChange={handleChange} errors={errors} />}
        {step === 2 && <ContactDetailsStep data={formData} handleChange={handleChange} errors={errors} />}
        {step === 3 && <JobDetailsStep data={formData} handleChange={handleChange} errors={errors} />}
        {step === 4 && <StatutoryDetailsStep data={formData} handleChange={handleChange} errors={errors} />}
        {step === 5 && <CredentialsStep data={formData} setFormDataValue={setFormDataValue} errors={errors} />}
      </div>
      
      <footer className="pt-4 flex justify-between items-center">
        <div>
            {step > 1 && (<button type="button" onClick={prevStep} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">Back</button>)}
        </div>
        <div>
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 mr-2">Cancel</button>
            {step < STEPS && (<button type="button" onClick={nextStep} className="px-4 py-2 text-sm font-medium text-white bg-brand-secondary hover:bg-brand-primary rounded-md">Next</button>)}
            {step === STEPS && (<button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md">Submit for Approval</button>)}
        </div>
      </footer>
    </form>
  );
};

export default AddNewEmployeeForm;
