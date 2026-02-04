
import React, { useState } from 'react';
import { CameraView } from './shared/CameraView';
import { LogInIcon, UserIcon, LockIcon, ClockIcon } from './shared/Icons';
import { LOGO_BASE_64, COMPANY_NAME } from './shared/Branding';

interface LoginProps {
  onLogin: (username: string) => boolean;
  onSwitchToKiosk: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onSwitchToKiosk }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showFaceLogin, setShowFaceLogin] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'verifying' | 'success' | 'error'>('idle');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (onLogin(username)) {
      setError('');
    } else {
      setError('Invalid Employee ID or Password.');
    }
  };
  
  const handleFaceCapture = (imageDataUrl: string) => {
    setVerificationStatus('verifying');
    // Mock verification
    setTimeout(() => {
        // In a real app, you'd send this to a backend for comparison
        const isVerified = onLogin('EMP001'); // Hardcoded for demo
        if (isVerified) {
            setVerificationStatus('success');
            // The onLogin function will handle redirecting to the dashboard
        } else {
            setVerificationStatus('error');
            setTimeout(() => setVerificationStatus('idle'), 2000);
        }
    }, 1500);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-brand-light p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
            <img src={LOGO_BASE_64} alt="Akshayvipra El-Mec Logo" className="mx-auto h-20 w-auto"/>
            <h1 className="text-3xl font-bold text-brand-primary mt-4 tracking-tight">{COMPANY_NAME}</h1>
            <p className="text-brand-dark opacity-80 mt-1">Welcome to the Employee Portal</p>
        </div>

        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="p-8">
            <h2 className="text-2xl font-bold text-center text-brand-dark mb-1">{showFaceLogin ? 'Face Recognition' : 'Employee Login'}</h2>
            <p className="text-center text-slate-500 mb-6">{showFaceLogin ? 'Position your face in the center of the frame.' : 'Sign in to access your dashboard.'}</p>
            
            {error && <p className="bg-red-100 text-red-700 p-3 rounded-md text-center mb-4">{error}</p>}
            
            {!showFaceLogin ? (
                <form onSubmit={handleLogin} className="space-y-6">
                <div>
                    <label htmlFor="username" className="sr-only">Employee ID</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <UserIcon className="h-5 w-5 text-slate-400" />
                        </div>
                        <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Employee ID"
                        required
                        className="w-full pl-10 pr-3 py-3 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-secondary focus:border-transparent"
                        />
                    </div>
                </div>
                <div>
                    <label htmlFor="password"  className="sr-only">Password</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <LockIcon className="h-5 w-5 text-slate-400" />
                        </div>
                        <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        required
                        className="w-full pl-10 pr-3 py-3 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-secondary focus:border-transparent"
                        />
                    </div>
                </div>
                <button type="submit" className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-brand-primary hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary transition-colors">
                    <LogInIcon className="h-5 w-5 mr-2" />
                    Sign In
                </button>
                </form>
            ) : (
                <CameraView onCapture={handleFaceCapture} verificationStatus={verificationStatus} />
            )}

            <div className="mt-6 relative">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-slate-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-slate-500">Or</span>
              </div>
            </div>

            <button
                onClick={() => setShowFaceLogin(!showFaceLogin)}
                className="mt-6 w-full flex justify-center items-center py-3 px-4 border border-slate-300 rounded-md shadow-sm text-lg font-medium text-brand-dark bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-secondary transition-colors">
                {showFaceLogin ? 'Use Password Instead' : 'Login with Face ID'}
            </button>
          </div>
          <button 
            onClick={onSwitchToKiosk} 
            className="w-full flex items-center justify-center p-4 bg-slate-50 hover:bg-slate-100 text-brand-secondary font-semibold transition-colors"
          >
            <ClockIcon className="h-5 w-5 mr-2"/>
            Switch to Clock-In Kiosk
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
