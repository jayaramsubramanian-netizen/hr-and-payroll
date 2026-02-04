
import React from 'react';
import { COMPANY_NAME, LOGO_BASE_64 } from './Branding';
import { ArrowLeftIcon } from './Icons';

interface PageWrapperProps {
  title: string;
  onBack: () => void;
  children: React.ReactNode;
  isDocument?: boolean;
}

const PageWrapper: React.FC<PageWrapperProps> = ({ title, onBack, children, isDocument = false }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-50 print:bg-white">
      <header className="bg-brand-primary shadow-md no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <img src={LOGO_BASE_64} alt="Logo" className="h-12 w-auto" />
              <div>
                <h1 className="text-2xl font-bold text-white">{title}</h1>
                <p className="text-sm text-white opacity-80">{COMPANY_NAME}</p>
              </div>
            </div>
            <div className="flex space-x-3">
              {isDocument && (
                <button
                  onClick={handlePrint}
                  className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-brand-accent rounded-md hover:bg-blue-600 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
                  <span>Print</span>
                </button>
              )}
              <button
                onClick={onBack}
                className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-brand-secondary rounded-md hover:bg-red-700 transition-colors"
              >
                <ArrowLeftIcon className="h-5 w-5" />
                <span>Back</span>
              </button>
            </div>
          </div>
        </div>
      </header>
      
      <main className={`max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 print:p-0 print:max-w-none`}>
        {isDocument ? (
          <div className="flex justify-center print:block">
            {/* Mimic A4 proportions on screen: 210mm width */}
            <div className="w-full max-w-[210mm] bg-white p-[20mm] shadow-2xl border border-slate-200 print:shadow-none print:border-none print:p-0 print:max-w-none min-h-[297mm]">
              <div className="hidden print:flex items-center justify-between mb-8 pb-4 border-b-2 border-brand-primary">
                <div className="flex items-center space-x-4">
                  <img src={LOGO_BASE_64} alt="Logo" className="h-16 w-auto" />
                  <div>
                    <h2 className="text-2xl font-bold text-brand-primary">{title}</h2>
                    <p className="text-sm text-slate-600 font-semibold">{COMPANY_NAME}</p>
                  </div>
                </div>
                <div className="text-right text-xs text-slate-400">
                  <p>Printed on: {new Date().toLocaleDateString()}</p>
                  <p>HR & Payroll Portal</p>
                </div>
              </div>
              {children}
              <div className="hidden print:block mt-20 pt-8 border-t border-slate-200 text-center text-xs text-slate-400">
                <p>© {new Date().getFullYear()} {COMPANY_NAME}. All rights reserved.</p>
                <p>This is a system generated document and does not require a physical signature.</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200">
            {children}
          </div>
        )}
      </main>
    </div>
  );
};

export default PageWrapper;
