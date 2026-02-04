
import React, { useState, useEffect, useCallback } from 'react';
import { CameraView } from './shared/CameraView';
import { PowerIcon, CheckCircleIcon, AlertTriangleIcon, MapPinIcon } from './shared/Icons';
import { COMPANY_NAME } from './shared/Branding';

interface KioskProps {
  onExitKiosk: () => void;
  onClockAction: (employeeId: string, action: 'Clock In' | 'Clock Out') => void;
}

// --- Geolocation Configuration ---
const COMPANY_LATITUDE = 28.6139; // Example: New Delhi, India
const COMPANY_LONGITUDE = 77.2090;
const ALLOWED_RADIUS_METERS = 500; // 500 meters (0.5 km)

/**
 * Calculates the distance between two geographical coordinates using the Haversine formula.
 * @returns The distance in meters.
 */
function getDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3; // Earth's radius in metres
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}
// --- End Geolocation Configuration ---

const Kiosk: React.FC<KioskProps> = ({ onExitKiosk, onClockAction }) => {
  const [time, setTime] = useState(new Date());
  const [employeeId, setEmployeeId] = useState('');
  const [showCamera, setShowCamera] = useState(false);
  const [action, setAction] = useState<'Clock In' | 'Clock Out' | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'verifying' | 'success' | 'error'>('idle');

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleAction = (selectedAction: 'Clock In' | 'Clock Out') => {
    if (!employeeId) {
      setMessage({ type: 'error', text: 'Please enter your Employee ID.' });
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    setMessage({ type: 'info', text: 'Verifying your location...' });

    if (!navigator.geolocation) {
      setMessage({ type: 'error', text: 'Geolocation is not supported by your browser.' });
      setTimeout(() => setMessage(null), 5000);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const distance = getDistance(latitude, longitude, COMPANY_LATITUDE, COMPANY_LONGITUDE);

        if (distance <= ALLOWED_RADIUS_METERS) {
          setMessage(null); // Location verified, clear message and proceed
          setAction(selectedAction);
          setShowCamera(true);
        } else {
          setMessage({
            type: 'error',
            text: `You are too far from the office to ${selectedAction}. Please ensure you are on-site.`,
          });
          setTimeout(() => setMessage(null), 5000);
        }
      },
      (error) => {
        let errorMessage = 'Could not get your location. Please try again.';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied. Please enable location services in your browser settings.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable.';
            break;
          case error.TIMEOUT:
            errorMessage = 'The request to get your location timed out.';
            break;
        }
        setMessage({ type: 'error', text: errorMessage });
        setTimeout(() => setMessage(null), 5000);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const resetState = useCallback(() => {
    setEmployeeId('');
    setShowCamera(false);
    setAction(null);
    setVerificationStatus('idle');
  }, []);

  const handleFaceCapture = (imageDataUrl: string) => {
    setVerificationStatus('verifying');
    setTimeout(() => {
      setVerificationStatus('success');
      onClockAction(employeeId, action!);
      setMessage({ type: 'success', text: `Successfully ${action === 'Clock In' ? 'Clocked In' : 'Clocked Out'}`});
      
      setTimeout(() => {
        setMessage(null);
        resetState();
      }, 3000);
    }, 1500);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-brand-primary text-white p-4 relative">
      <button onClick={onExitKiosk} className="absolute top-4 right-4 p-2 bg-white/20 rounded-full hover:bg-white/40 transition-colors">
        <PowerIcon className="h-6 w-6 text-white"/>
      </button>

      <div className="w-full max-w-lg text-center">
        <h1 className="text-6xl md:text-8xl font-bold font-mono">
          {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </h1>
        <p className="text-xl md:text-2xl opacity-80 mt-2">
          {time.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>

        {!showCamera ? (
            message ? (
                <div className={`mt-12 p-8 rounded-lg transition-all duration-300 ${
                  message.type === 'success' ? 'bg-green-500' :
                  message.type === 'error' ? 'bg-red-500' :
                  'bg-blue-500'
                }`}>
                    {message.type === 'success' && <CheckCircleIcon className="h-16 w-16 mx-auto mb-4" />}
                    {message.type === 'error' && <AlertTriangleIcon className="h-16 w-16 mx-auto mb-4" />}
                    {message.type === 'info' && <MapPinIcon className="h-16 w-16 mx-auto mb-4 animate-pulse" />}
                    <p className="text-2xl font-bold">{message.text}</p>
                    {message.type === 'success' && <p className="text-lg opacity-90">ID: {employeeId} at {time.toLocaleTimeString()}</p>}
                </div>
            ) : (
              <div className="mt-12 w-full mx-auto max-w-sm">
                <input
                  type="text"
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  placeholder="Enter Your Employee ID"
                  className="w-full px-4 py-4 text-2xl text-center bg-white/20 rounded-lg placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white"
                />
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <button onClick={() => handleAction('Clock In')} className="py-6 text-2xl font-bold bg-green-500 rounded-lg hover:bg-green-600 transition-transform transform hover:scale-105">
                    Clock In
                  </button>
                  <button onClick={() => handleAction('Clock Out')} className="py-6 text-2xl font-bold bg-red-500 rounded-lg hover:bg-red-600 transition-transform transform hover:scale-105">
                    Clock Out
                  </button>
                </div>
              </div>
            )
        ) : (
          <div className="mt-8 p-6 bg-white/10 rounded-xl">
             <h2 className="text-2xl font-bold mb-1">Face Verification</h2>
             <p className="mb-4 opacity-80">{action} for ID: <span className="font-bold">{employeeId}</span></p>
            <CameraView onCapture={handleFaceCapture} verificationStatus={verificationStatus} />
            <button onClick={resetState} className="mt-4 w-full max-w-xs mx-auto py-3 px-4 border border-white/50 rounded-md text-lg font-semibold text-white bg-white/20 hover:bg-white/30 transition-colors">
                Cancel
            </button>
          </div>
        )}
      </div>
      <footer className="absolute bottom-4 text-center text-white/70 text-sm">
        {COMPANY_NAME}
      </footer>
    </div>
  );
};

export default Kiosk;
