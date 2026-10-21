import React, { useState } from 'react';
import { Sun, Moon, Menu, X, PlusCircle, Sparkles } from 'lucide-react';
import { User } from 'firebase/auth';
import { AuthStatus } from './AuthStatus';

export type SectionId = 'beranda' | 'pancasila' | 'dampak' | 'katalog' | 'daftar' | 'asisten-ai';

interface NavbarProps {
  darkMode: boolean;
  onToggleTheme: () => void;
  activeSection: SectionId;
  onSelectSection: (section: SectionId) => void;
  user: User | null;
  authLoading: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  darkMode,
  onToggleTheme,
  activeSection,
  onSelectSection,
  user,
  authLoading,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks: { id: SectionId; label: string; badge?: string }[] = [
    { id: 'beranda', label: 'Beranda' },
    { id: 'pancasila', label: 'Nilai Pancasila' },
    { id: 'dampak', label: 'Dampak Nyata' },
    { id: 'katalog', label: 'Katalog UMKM' },
    { id: 'daftar', label: 'Daftarkan UMKM' },
    { id: 'asisten-ai', label: 'Asisten AI', badge: 'Gemini' },
  ];

  const handleNavClick = (id: SectionId) => {
    onSelectSection(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 md:gap-8 h-16">
          {/* Zone 1: Brand wordmark (single element line) */}
          <button
            onClick={() => handleNavClick('beranda')}
            className="flex items-center gap-2 text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white whitespace-nowrap shrink-0 group text-left"
          >
            <span className="w-8 h-8 rounded-lg bg-red-700 flex items-center justify-center text-white font-black text-sm shadow-sm group-hover:bg-red-800 transition-colors">
              LB
            </span>
            <span>
              Lokal<span className="text-red-700 dark:text-red-500">Bangkit</span>
            </span>
          </button>

          {/* Zone 2: Navigation links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-sm font-medium">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`px-3 py-1.5 rounded-lg whitespace-nowrap shrink-0 transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'text-red-700 dark:text-red-400 font-bold bg-red-50 dark:bg-red-950/60 shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-red-700 dark:hover:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-red-100 dark:bg-red-900/70 text-red-700 dark:text-red-300 font-bold">
                      {link.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Firebase Auth + Theme + Primary Action */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Firebase Google Auth Badge */}
            <AuthStatus user={user} loading={authLoading} />

            {/* Dark / Light Toggle */}
            <button
              onClick={onToggleTheme}
              aria-label={darkMode ? 'Beralih ke mode terang' : 'Beralih ke mode gelap'}
              className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
              title={darkMode ? 'Mode Terang' : 'Mode Gelap'}
            >
              {darkMode ? (
                <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600" />
              )}
            </button>

            <button
              onClick={() => handleNavClick('daftar')}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-red-700 hover:bg-red-800 active:bg-red-900 rounded-lg shadow-sm transition-colors whitespace-nowrap shrink-0"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Daftarkan UMKM</span>
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Buka menu navigasi"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-slate-200 dark:border-slate-800 space-y-1">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-between ${
                    isActive
                      ? 'bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-400 font-bold'
                      : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-red-100 dark:bg-red-900/70 text-red-700 dark:text-red-300 font-bold">
                      {link.badge}
                    </span>
                  )}
                </button>
              );
            })}
            <div className="pt-2">
              <button
                onClick={() => handleNavClick('daftar')}
                className="flex items-center justify-center gap-2 w-full px-4 py-2.5 text-sm font-semibold text-white bg-red-700 hover:bg-red-800 rounded-lg shadow-sm"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Daftarkan UMKM Tetangga</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
