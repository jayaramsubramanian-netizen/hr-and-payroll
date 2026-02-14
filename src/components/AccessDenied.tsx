import React from "react";

interface AccessDeniedProps {
  message?: string;
  onGoHome?: () => void;
  homeLabel?: string;
}

const AccessDenied: React.FC<AccessDeniedProps> = ({
  message = "You do not have permission to view this page.",
  onGoHome,
  homeLabel = "Go to Dashboard",
}) => {
  return (
    <div className="p-6">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-sm p-10 text-center">
        <div className="text-6xl mb-4">🔒</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Access Denied
        </h1>
        <p className="text-gray-600 mb-6">{message}</p>
        {onGoHome && (
          <button
            onClick={onGoHome}
            className="px-5 py-2 text-white rounded-md hover:opacity-90"
            style={{ backgroundColor: "#06038D" }}
          >
            {homeLabel}
          </button>
        )}
      </div>
    </div>
  );
};

export default AccessDenied;
