
import React from 'react';
import { PayslipData } from '../../../types';

interface PayslipDetailViewProps {
  payslip: PayslipData;
}

const formatCurrency = (amount: number) => `₹ ${amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const DetailRow: React.FC<{ label: string; value: string | number; isBold?: boolean }> = ({ label, value, isBold }) => (
    <div className="flex justify-between py-2 border-b">
        <span className={`text-sm ${isBold ? 'font-bold text-gray-800' : 'text-gray-600'}`}>{label}</span>
        <span className={`text-sm ${isBold ? 'font-bold text-gray-800' : 'text-gray-800'}`}>{typeof value === 'number' ? formatCurrency(value) : value}</span>
    </div>
);

const PayslipDetailView: React.FC<PayslipDetailViewProps> = ({ payslip }) => {
    const totalDeductions = payslip.pf + payslip.esi + payslip.professionalTax;
    
    return (
        <div className="bg-gray-50 p-6 rounded-lg font-sans print:bg-white">
            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-brand-primary">{payslip.employeeName} ({payslip.employeeId})</h2>
                <p className="text-gray-600">Payslip for the month of {payslip.month} {payslip.year}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <h3 className="text-lg font-semibold text-green-700 border-b-2 border-green-200 pb-2 mb-3">Earnings</h3>
                    <div className="space-y-1">
                        <DetailRow label="Basic Salary" value={payslip.earnings.basic} />
                        <DetailRow label="House Rent Allowance (HRA)" value={payslip.earnings.hra} />
                        <DetailRow label="Other Allowances" value={payslip.earnings.allowances} />
                    </div>
                </div>
                 <div>
                    <h3 className="text-lg font-semibold text-red-700 border-b-2 border-red-200 pb-2 mb-3">Deductions</h3>
                     <div className="space-y-1">
                        <DetailRow label="Provident Fund (PF)" value={payslip.pf} />
                        <DetailRow label="Employee State Insurance (ESI)" value={payslip.esi} />
                        <DetailRow label="Professional Tax" value={payslip.professionalTax} />
                    </div>
                </div>
            </div>
            
            <div className="mt-8 pt-4 border-t-2 border-dashed">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                         <DetailRow label="Gross Earnings" value={payslip.gross} isBold={true} />
                    </div>
                     <div>
                         <DetailRow label="Total Deductions" value={totalDeductions} isBold={true} />
                    </div>
                </div>
                <div className="mt-4 bg-brand-light p-4 rounded-lg text-center print:bg-slate-100">
                    <p className="text-sm font-medium text-gray-600 uppercase">Net Salary</p>
                    <p className="text-3xl font-extrabold text-brand-primary">{formatCurrency(payslip.net)}</p>
                </div>
            </div>
        </div>
    );
};

export default PayslipDetailView;