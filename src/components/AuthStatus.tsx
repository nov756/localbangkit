import React, { useState } from 'react';
import { User, LogIn, LogOut, CheckCircle, ShieldCheck } from 'lucide-react';
import { User as FirebaseUser } from 'firebase/auth';
import { loginWithGoogle, logoutUser } from '../firebase';

interface AuthStatusProps {
  user: FirebaseUser | null;
  loading: boolean;
}

export const AuthStatus: React.FC<AuthStatusProps> = ({ user, loading }) => {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSignIn = async () => {
    try {
      setIsLoggingIn(true);
      setErrorMessage(null);
      await loginWithGoogle();
    } catch (err: any) {
      console.error('Google sign in error:', err);
      setErrorMessage(err?.message || 'Gagal login dengan Google');
      setTimeout(() => setErrorMessage(null), 5000);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await logoutUser();
      setDropdownOpen(false);
    } catch (err) {
      console.error('Sign out error:', err);
    }
  };

  if (loading) {
    return (
      <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse" />
    );
  }

  if (!user) {
    return (
      <div className="relative">
        <button
          onClick={handleSignIn}
          disabled={isLoggingIn}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors shadow-xs"
          title="Masuk dengan Akun Google"
        >
          <LogIn className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
          <span className="hidden sm:inline">Masuk Google</span>
        </button>
        {errorMessage && (
          <div className="absolute right-0 top-full mt-1.5 w-60 p-2 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg text-[11px] text-red-700 dark:text-red-300 shadow-lg z-50">
            {errorMessage}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-2 p-1 pl-1.5 pr-2.5 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-xs"
      >
        {user.photoURL ? (
          <img
            src={user.photoURL}
            alt={user.displayName || 'Pengguna'}
            className="w-6 h-6 rounded-full object-cover"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-6 h-6 rounded-full bg-red-700 text-white flex items-center justify-center text-xs font-bold">
            {user.displayName?.[0] || 'U'}
          </div>
        )}
        <span className="text-xs font-bold text-slate-800 dark:text-slate-200 max-w-[100px] truncate hidden sm:inline">
          {user.displayName || 'Warga'}
        </span>
      </button>

      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xl py-2 z-50">
          <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
            <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
              {user.displayName}
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
              {user.email}
            </p>
            <div className="flex items-center gap-1 mt-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
              <ShieldCheck className="w-3 h-3" />
              <span>Terverifikasi Firebase Auth</span>
            </div>
          </div>

          <button
            onClick={handleSignOut}
            className="w-full text-left px-4 py-2 text-xs text-red-600 dark:text-red-400 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 font-medium"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Keluar Akun</span>
          </button>
        </div>
      )}
    </div>
  );
};
