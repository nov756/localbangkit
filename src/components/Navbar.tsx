import React, { useState } from 'react';
import { Sun, Moon, Menu, X, PlusCircle } from 'lucide-react';

interface NavbarProps {
  darkMode: boolean;
  onToggleTheme: () => void;
  onOpenRegisterModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  darkMode,
  onToggleTheme,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Beranda', href: '#home' },
    { label: 'Nilai Pancasila', href: '#pancasila' },
    { label: 'Dampak Nyata', href: '#dampak' },
    { label: 'Katalog UMKM', href: '#katalog' },
    { label: 'Daftarkan', href: '#daftar' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Brand wordmark (single element line) */}
          <a
            href="#home"
            className="flex items-center gap-2 text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white whitespace-nowrap shrink-0 group"
          >
            <span className="w-8 h-8 rounded-lg bg-red-700 flex items-center justify-center text-white font-black text-sm shadow-sm group-hover:bg-red-800 transition-colors">
              LB
            </span>
            <span>
              Lokal<span className="text-red-700 dark:text-red-500">Bangkit</span>
            </span>
          </a>

          {/* Zone 2: 4-5 clean single-line navigation links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600 dark:text-slate-300">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="whitespace-nowrap shrink-0 hover:text-red-700 dark:hover:text-red-400 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Zone 3: Theme switch & Primary Action */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onToggleTheme}
              aria-label={darkMode ? 'Beralih ke mode terang' : 'Beralih ke mode gelap'}
              className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
              title={darkMode ? 'Mode Terang' : 'Mode Gelap'}
            >
              {darkMode ? (
                <Sun className="w-5 h-5 text-amber-400" />
              ) : (
                <Moon className="w-5 h-5 text-slate-600" />
              )}
            </button>

            <a
              href="#daftar"
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-red-700 hover:bg-red-800 active:bg-red-900 rounded-lg shadow-sm transition-colors whitespace-nowrap shrink-0"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Daftarkan UMKM</span>
            </a>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Buka menu navigasi"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-2">
              <a
                href="#daftar"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full px-4 py-2 text-sm font-semibold text-white bg-red-700 hover:bg-red-800 rounded-lg shadow-sm"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Daftarkan UMKM Tetangga</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
