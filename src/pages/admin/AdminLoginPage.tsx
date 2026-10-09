import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { ShieldCheck, Lock, ArrowRight, AlertCircle, KeyRound } from 'lucide-react';
import { storageService } from '../../services/storageService';

export const AdminLoginPage: React.FC = () => {
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from || '/admin';

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcode.trim()) {
      setError('Please enter the administrative key or passcode.');
      return;
    }

    const success = storageService.loginAdmin(passcode.trim());
    if (success) {
      navigate(from, { replace: true });
    } else {
      setError('Invalid administrative passcode. Please verify your credentials.');
    }
  };

  const handleDemoFill = () => {
    setPasscode('buildwise2026');
    setError('');
  };

  return (
    <div className="min-h-screen bg-neutral-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl border border-neutral-200 p-8 space-y-6 shadow-xs">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-neutral-900 text-white rounded-lg flex items-center justify-center mx-auto">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold text-neutral-900 tracking-tight">
            Administrator Authentication
          </h1>
          <p className="text-xs text-neutral-500">
            Sign in to access lead management, project submissions, and solution configuration.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div>
            <label className="font-semibold text-neutral-800 block mb-1">
              Admin Access Passkey / Password
            </label>
            <input
              type="password"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder="Enter admin passcode"
              className="w-full px-3 py-2.5 border border-neutral-200 rounded-md focus:border-neutral-900 focus:outline-hidden font-mono"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 px-4 text-xs font-bold text-white bg-neutral-950 hover:bg-neutral-800 rounded-md transition-colors flex items-center justify-center gap-2"
          >
            <span>Authenticate Session</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Demo Helper Box */}
        <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200 text-xs text-neutral-600 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-neutral-900 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-neutral-500" />
              Sales Demo Credentials:
            </span>
            <button
              type="button"
              onClick={handleDemoFill}
              className="text-[11px] font-semibold text-neutral-900 hover:underline"
            >
              Auto-Fill
            </button>
          </div>
          <p className="text-[11px] text-neutral-500 font-mono">
            Passkey: <span className="bg-neutral-200 px-1 py-0.5 rounded">buildwise2026</span>
          </p>
        </div>

        <div className="text-center pt-2 border-t border-neutral-100">
          <Link to="/" className="text-xs text-neutral-500 hover:text-neutral-900">
            ← Return to Public Storefront
          </Link>
        </div>
      </div>
    </div>
  );
};
