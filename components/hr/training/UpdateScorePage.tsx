
import React, { useState } from 'react';

interface UpdateScorePageProps {
  employeeName: string;
  topicTitle: string;
  currentScore: number | null;
  onSave: (score: number) => void;
  onCancel: () => void;
}

const StarRating: React.FC<{ score: number; setScore: (score: number) => void }> = ({ score, setScore }) => (
  <div className="flex justify-center space-x-2">
    {[1, 2, 3, 4, 5].map(v => (
      <button
        key={v}
        type="button"
        onClick={() => setScore(v)}
        aria-label={`Set score to ${v}`}
        className={`w-12 h-12 rounded-full text-lg font-bold transition-transform transform hover:scale-110 ${
          score >= v ? 'bg-yellow-400 text-white' : 'bg-slate-200 text-slate-600'
        }`}
      >
        {v}
      </button>
    ))}
  </div>
);

const UpdateScorePage: React.FC<UpdateScorePageProps> = ({ employeeName, topicTitle, currentScore, onSave, onCancel }) => {
    const [score, setScore] = useState(currentScore || 0);

    const handleSave = () => {
        if (score > 0) {
            onSave(score);
        }
    };

    return (
        <div className="text-center max-w-lg mx-auto">
            <p className="text-lg text-slate-700 mb-2">Set performance score for <span className="font-bold">{employeeName}</span>.</p>
            <p className="text-sm text-slate-500 mb-6">Score is based on performance and understanding demonstrated during the training for the topic: <span className="font-semibold">{topicTitle}</span>.</p>
            <StarRating score={score} setScore={setScore} />
            <div className="mt-8 flex justify-end space-x-3">
                <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50">Cancel</button>
                <button type="button" onClick={handleSave} disabled={score === 0} className="px-4 py-2 text-sm font-medium text-white bg-brand-primary rounded-md hover:bg-blue-700 disabled:bg-slate-300">Save Score</button>
            </div>
        </div>
    );
};

export default UpdateScorePage;
