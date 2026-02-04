
import React, { useState, useEffect } from 'react';
import { User, BenefitsEligibility } from '../../types';

interface EditPayrollFormProps {
  user: User;
  onSave: (updatedData: any) => void;
  onCancel: () => void;
}

const defaultBenefit = (enabled: boolean) => ({ enabled, valueType: 'PERCENTAGE' as 'PERCENTAGE' | 'FLAT_RUPEE', value: 0 });

const BenefitRow: React.FC<{
    benefitKey: keyof BenefitsEligibility,
    label: string,
    formData: any,
    handleBenefitChange: (key: keyof BenefitsEligibility, field: string, value: any) => void
}> = ({ benefitKey, label, formData, handleBenefitChange }) => {
    const benefit = formData[benefitKey];
    
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <label htmlFor={`${benefitKey}-enabled`} className="flex items-center cursor-pointer">
                <div className="relative">
                    <input 
                        type="checkbox" 
                        id={`${benefitKey}-enabled`} 
                        className="sr-only" 
                        checked={benefit.enabled} 
                        onChange={(e) => handleBenefitChange(benefitKey, 'enabled', e.target.checked)} 
                    />
                    <div className={`block w-14 h-8 rounded-full ${benefit.enabled ? 'bg-brand-accent' : 'bg-gray-300'}`}></div>
                    <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${benefit.enabled ? 'transform translate-x-6' : ''}`}></div>
                </div>
                <div className="ml-3 text-gray-700 font-medium">{label}</div>
            </label>

            {benefit.enabled && (
                <div className="flex items-center space-x-2">
                     <select 
                        value={benefit.valueType} 
                        onChange={(e) => handleBenefitChange(benefitKey, 'valueType', e.target.value)}
                        className="w-1/3 border-gray-300 rounded-md shadow-sm"
                    >
                        <option value="PERCENTAGE">%</option>
                        <option value="FLAT_RUPEE">₹</option>
                    </select>
                    <input 
                        type="number" 
                        value={benefit.value}
                        onChange={(e) => handleBenefitChange(benefitKey, 'value', parseFloat(e.target.value) || 0)}
                        className="w-2/3 block border border-gray-300 rounded-md shadow-sm py-2 px-3"
                    />
                </div>
            )}
        </div>
    );
};


const EditPayrollForm: React.FC<EditPayrollFormProps> = ({ user, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    basicSalary: user.payroll?.basic || 0,
    hra: user.payroll?.hra || 0,
    allowances: user.payroll?.allowances || 0,
    pf: user.eligibility?.pf || defaultBenefit(false),
    esi: user.eligibility?.esi || defaultBenefit(false),
    bonus: user.eligibility?.bonus || defaultBenefit(false),
    medicalInsurance: user.eligibility?.medicalInsurance || defaultBenefit(false),
  });
  const [grossSalary, setGrossSalary] = useState(0);

  useEffect(() => {
    const { basicSalary, hra, allowances } = formData;
    setGrossSalary(Number(basicSalary) + Number(hra) + Number(allowances));
  }, [formData.basicSalary, formData.hra, formData.allowances]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleBenefitChange = (key: keyof BenefitsEligibility, field: string, value: any) => {
      setFormData(prev => ({
          ...prev,
          [key]: {
              ...prev[key],
              [field]: value
          }
      }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3 className="text-xl font-bold text-brand-primary mb-4">Editing Payroll for {user.name}</h3>
      <div className="space-y-6">
        <div>
            <h4 className="text-lg font-medium text-gray-900 border-b pb-2">Salary Structure (Monthly)</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                 <div>
                    <label htmlFor="basicSalary" className="block text-sm font-medium text-gray-700">Basic Salary</label>
                    <input type="number" name="basicSalary" id="basicSalary" value={formData.basicSalary} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" required />
                </div>
                <div>
                    <label htmlFor="hra" className="block text-sm font-medium text-gray-700">HRA</label>
                    <input type="number" name="hra" id="hra" value={formData.hra} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" required />
                </div>
                <div>
                    <label htmlFor="allowances" className="block text-sm font-medium text-gray-700">Other Allowances</label>
                    <input type="number" name="allowances" id="allowances" value={formData.allowances} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" required />
                </div>
            </div>
            <p className="text-right font-bold text-lg mt-2 text-brand-primary">Gross Salary: ₹{grossSalary.toLocaleString('en-IN')}</p>
        </div>
        <div>
            <h4 className="text-lg font-medium text-gray-900 border-b pb-2">Benefits Eligibility & Contribution</h4>
            <div className="space-y-4 mt-4">
                <BenefitRow benefitKey="pf" label="Provident Fund (PF)" formData={formData} handleBenefitChange={handleBenefitChange} />
                <BenefitRow benefitKey="esi" label="Employee State Insurance (ESI)" formData={formData} handleBenefitChange={handleBenefitChange} />
                <BenefitRow benefitKey="bonus" label="Annual Bonus" formData={formData} handleBenefitChange={handleBenefitChange} />
                <BenefitRow benefitKey="medicalInsurance" label="Medical Insurance" formData={formData} handleBenefitChange={handleBenefitChange} />
            </div>
        </div>
      </div>
      <footer className="pt-6 flex justify-end space-x-3 border-t mt-6">
        <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">Cancel</button>
        <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-brand-secondary hover:bg-brand-primary rounded-md">Save Changes</button>
      </footer>
    </form>
  );
};

export default EditPayrollForm;
