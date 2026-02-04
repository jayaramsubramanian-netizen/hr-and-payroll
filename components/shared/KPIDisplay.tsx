
import React from 'react';
import { KPI } from '../../types';
import { ArrowUpIcon, ArrowDownIcon, MinusIcon } from './Icons';

interface KPIDisplayProps {
  kpis: KPI[];
}

const TrendIcon: React.FC<{ trend: KPI['trend'] }> = ({ trend }) => {
  const commonClasses = "w-4 h-4";
  switch (trend) {
    case 'up':
      return <ArrowUpIcon className={`${commonClasses} text-green-500`} />;
    case 'down':
      return <ArrowDownIcon className={`${commonClasses} text-red-500`} />;
    case 'stable':
      return <MinusIcon className={`${commonClasses} text-gray-500`} />;
  }
};

const getProgressBarColor = (progress: number, lowerIsBetter?: boolean) => {
    if (lowerIsBetter) {
      if (progress <= 33) return 'bg-green-500';
      if (progress <= 66) return 'bg-yellow-500';
      return 'bg-red-500';
    }
    if (progress >= 90) return 'bg-green-500';
    if (progress >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
};

const KPIDisplay: React.FC<KPIDisplayProps> = ({ kpis }) => {
  return (
    <div className="space-y-4">
      {kpis.map((kpi) => (
        <div key={kpi.id}>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-gray-700">{kpi.name}</span>
            <div className="flex items-center space-x-2">
                <span className="text-sm font-bold text-brand-primary">{kpi.value}</span>
                <TrendIcon trend={kpi.trend} />
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className={`h-2.5 rounded-full ${getProgressBarColor(kpi.progress, kpi.lowerIsBetter)}`}
              style={{ width: `${kpi.progress}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 text-right mt-1">{kpi.target}</p>
        </div>
      ))}
    </div>
  );
};

export default KPIDisplay;
