import React from "react";

interface LoadingScreenProps {
  message?: string;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({
  message = "Loading...",
}) => {
  return (
    <div className="fixed inset-0 bg-white bg-opacity-95 z-50 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block relative">
          <div className="w-20 h-20 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="w-12 h-12 border-4 border-transparent border-t-red-600 rounded-full animate-spin"
              style={{ animationDirection: "reverse", animationDuration: "1s" }}
            ></div>
          </div>
        </div>
        <p className="mt-6 text-xl font-semibold text-gray-900">{message}</p>
        <p className="mt-2 text-sm text-gray-600">
          Please wait, do not close this window
        </p>
      </div>
    </div>
  );
};

export default LoadingScreen;
