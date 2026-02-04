
import React from 'react';

interface ScoreDisplayCardProps {
  title: string;
  score: number | null;
  maxScore: number;
  description: string;
}

const ScoreDisplayCard: React.FC<ScoreDisplayCardProps> = ({ title, score, maxScore, description }) => {
  const percentage = score !== null && score > 0 ? (score / maxScore) * 100 : 0;

  // SVG dimensions
  const svgSize = 128;
  const strokeWidth = 10;
  const radius = (svgSize / 2) - (strokeWidth / 2);
  const circumference = 2 * Math.PI * radius;
  
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const getScoreColor = () => {
    if (score === null) return 'text-slate-500';
    const ratio = score / maxScore;
    if (ratio >= 0.8) return 'text-green-500';
    if (ratio >= 0.6) return 'text-brand-accent';
    return 'text-brand-secondary';
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg border border-slate-200 text-center h-full flex flex-col justify-center items-center transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <h4 className="text-md font-semibold text-brand-dark mb-4">{title}</h4>
      <div className="relative inline-flex items-center justify-center w-32 h-32">
        <svg className="w-full h-full" viewBox={`0 0 ${svgSize} ${svgSize}`}>
          <circle
            className="text-slate-200"
            strokeWidth={strokeWidth}
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx={svgSize / 2}
            cy={svgSize / 2}
          />
          <circle
            className={`transition-all duration-500 ease-in-out ${getScoreColor()}`}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx={svgSize / 2}
            cy={svgSize / 2}
            style={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }}
          />
        </svg>
        <span className={`absolute text-3xl font-bold ${getScoreColor()}`}>
          {score !== null ? score.toFixed(1) : 'N/A'}
        </span>
      </div>
      <p className="text-sm text-slate-500 mt-4 max-w-xs">{description}</p>
    </div>
  );
};

export default ScoreDisplayCard;
