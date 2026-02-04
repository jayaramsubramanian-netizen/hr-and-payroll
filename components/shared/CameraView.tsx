
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { CameraIcon, RefreshCwIcon, UserCheckIcon, AlertTriangleIcon } from './Icons';

interface CameraViewProps {
  onCapture: (imageDataUrl: string) => void;
  verificationStatus: 'idle' | 'verifying' | 'success' | 'error';
}

export const CameraView: React.FC<CameraViewProps> = ({ onCapture, verificationStatus }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [errorType, setErrorType] = useState<'permission' | 'not-found' | 'other' | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const startCamera = useCallback(async () => {
    try {
      setErrorMessage(null);
      setErrorType(null);
      
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Browser does not support camera access.");
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'user',
          width: { ideal: 640 },
          height: { ideal: 480 }
        } 
      });
      
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err: any) {
      console.error("Error accessing camera:", err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setErrorType('permission');
        setErrorMessage("Camera access denied. Please enable permissions in your browser settings.");
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setErrorType('not-found');
        setErrorMessage("No camera detected. Please check if a camera is connected to this device.");
      } else {
        setErrorType('other');
        setErrorMessage(err.message || "An unexpected error occurred while accessing the camera.");
      }
    }
  }, []);

  useEffect(() => {
    startCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageDataUrl = canvas.toDataURL('image/png');
        onCapture(imageDataUrl);
      }
    }
  };

  const simulateCapture = () => {
    // Fallback for development/testing or broken hardware environments
    const mockCanvas = document.createElement('canvas');
    mockCanvas.width = 400;
    mockCanvas.height = 400;
    const ctx = mockCanvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#0033A0';
      ctx.fillRect(0, 0, 400, 400);
      ctx.fillStyle = 'white';
      ctx.font = '20px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Simulated Biometric Data', 200, 200);
      onCapture(mockCanvas.toDataURL());
    }
  };

  const getOverlay = () => {
    switch (verificationStatus) {
      case 'verifying':
        return (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center text-white z-10">
            <svg className="animate-spin h-10 w-10 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="mt-4 text-lg">Verifying Face...</p>
          </div>
        );
      case 'success':
        return (
          <div className="absolute inset-0 bg-green-500 bg-opacity-70 flex flex-col items-center justify-center text-white z-10">
            <UserCheckIcon className="h-16 w-16" />
            <p className="mt-4 text-2xl font-bold">Identity Verified</p>
          </div>
        );
      case 'error':
        return (
          <div className="absolute inset-0 bg-red-500 bg-opacity-70 flex flex-col items-center justify-center text-white text-center p-4 z-10">
            <AlertTriangleIcon className="h-16 w-16" />
            <p className="mt-4 text-2xl font-bold">Verification Failed</p>
            <p className="text-sm mt-2">Biometric mismatch. Please try again.</p>
          </div>
        );
      default:
        return null;
    }
  };

  if (errorMessage) {
    return (
      <div className="w-full h-72 bg-slate-100 rounded-lg flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-slate-300">
        <AlertTriangleIcon className="h-12 w-12 text-red-500 mb-4" />
        <h3 className="font-bold text-slate-800">Camera Availability Issue</h3>
        <p className="text-sm text-slate-600 mt-2 max-w-xs">{errorMessage}</p>
        
        <div className="mt-6 flex flex-col gap-3 w-full max-w-xs">
          <button 
            onClick={startCamera} 
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-brand-primary hover:bg-blue-700 focus:outline-none"
          >
            <RefreshCwIcon className="h-4 w-4 mr-2" />
            Retry Camera Access
          </button>
          
          <button 
            type="button"
            onClick={simulateCapture}
            className="inline-flex items-center justify-center px-4 py-2 border border-slate-300 text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 focus:outline-none"
          >
            Simulate Identification
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full relative">
      <div className="relative w-full h-64 bg-black rounded-lg overflow-hidden border-4 border-slate-200">
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          muted
          className="w-full h-full object-cover transform -scale-x-100" 
        />
        {getOverlay()}
      </div>
      <canvas ref={canvasRef} className="hidden" />
      
      {verificationStatus === 'idle' && (
        <button 
          onClick={handleCapture}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-xl hover:bg-slate-100 transition-all active:scale-95 focus:outline-none ring-4 ring-white ring-opacity-50"
          aria-label="Capture biometric scan"
        >
          <div className="w-10 h-10 rounded-full border-2 border-brand-primary flex items-center justify-center">
            <div className="w-8 h-8 rounded-full bg-brand-primary"></div>
          </div>
        </button>
      )}
    </div>
  );
};
