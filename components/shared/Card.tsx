
import React from 'react';

interface CardProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ title, icon, children, className }) => {
  return (
    <div className={`bg-white shadow-lg rounded-lg border border-slate-200 overflow-hidden h-full flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${className}`}>
      <div className="p-5 bg-brand-primary text-white">
        <div className="flex items-center space-x-3">
          {icon}
          <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
        </div>
      </div>
      <div className="p-6 flex-grow">
        {children}
      </div>
    </div>
  );
};

export default Card;
