import React from 'react';
import { ArrowRight, HeartHandshake, MessageCircle, Sparkles, ShieldCheck, Users } from 'lucide-react';
import { SectionId } from './Navbar';
import { getAppBaseUrl } from '../config';

interface HeroProps {
  totalUmkmCount: number;
  onNavigate?: (section: SectionId) => void;
}

export const Hero: React.FC<HeroProps> = ({ totalUmkmCount, onNavigate }) => {
  return (
    <section id="home" className="relative pt-8 pb-16 md:pt-14 md:pb-20 overflow-hidden">
      {/* Background soft ambient gradient */}
      <div
        className="absolute inset-0 -z-10 bg-radial from-red-100/40 via-transparent to-transparent dark:from-red-950/20 pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-6 sm:space-y-8">
          {/* Top Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900/60 text-xs font-bold uppercase tracking-wider text-red-700 dark:text-red-400 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-red-600 dark:bg-red-500 animate-pulse" aria-hidden="true" />
            <span>Gerakan Gotong Royong Digital</span>
            <span aria-hidden="true">·</span>
            <span>Aksi Nyata Pancasila</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.15] max-w-4xl mx-auto">
            Beli dari Tetangga, <br className="hidden sm:inline" />
            <span className="text-red-700 dark:text-red-500">
              Bangkitkan Ekonomi Bersama
            </span>
          </h1>

          {/* Subtitle / Description */}
          <p className="text-base sm:text-lg lg:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed font-normal">
            Platform gotong royong warga untuk mendukung kemandirian dan keberlanjutan usaha mikro di lingkungan sekitar kita. Menghidupkan Sila ke-5: <span className="font-semibold text-slate-900 dark:text-white">Keadilan Sosial bagi Seluruh Rakyat Indonesia</span>.
          </p>

          {/* Call to Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 max-w-xl mx-auto">
            <button
              onClick={() => onNavigate?.('katalog')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-bold text-white bg-red-700 hover:bg-red-800 active:bg-red-900 rounded-xl shadow-md hover:shadow-lg transition-all"
            >
              <span>Jelajahi Katalog UMKM</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate?.('daftar')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xs transition-all"
            >
              <HeartHandshake className="w-4 h-4 text-red-700 dark:text-red-400" />
              <span>Daftarkan Usaha Tetangga</span>
            </button>

            <a
              href={`https://wa.me/?text=${encodeURIComponent(
                `Ayo dukung pedagang dan UMKM sekitar kita lewat platform LokalBangkit - Beli dari Tetangga, Bangkitkan Ekonomi Bersama! 🇮🇩\n\nBuka web direktori & katalog lengkapnya di sini:\n${getAppBaseUrl()}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-3.5 text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 border border-emerald-200 dark:border-emerald-800 rounded-xl transition-colors shadow-xs"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span>Bagikan ke WA</span>
            </a>
          </div>

          {/* Micro proof points & statistics */}
          <div className="pt-6 max-w-2xl mx-auto border-t border-slate-200 dark:border-slate-800">
            <div className="grid grid-cols-3 gap-4 sm:gap-8 text-center">
              <div className="p-3 rounded-xl bg-white/60 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800">
                <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tabular-nums">
                  {totalUmkmCount}+
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                  UMKM Terdaftar
                </p>
              </div>
              <div className="p-3 rounded-xl bg-white/60 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800">
                <p className="text-2xl sm:text-3xl font-extrabold text-red-700 dark:text-red-500 tabular-nums">
                  100%
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                  Bebas Biaya & Komisi
                </p>
              </div>
              <div className="p-3 rounded-xl bg-white/60 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800">
                <p className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 tabular-nums">
                  Direct WA
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                  Tanpa Perantara
                </p>
              </div>
            </div>

            {/* Civic Commitment Message (clean card without image) */}
            <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-red-50/70 via-white to-amber-50/70 dark:from-red-950/20 dark:via-slate-900 dark:to-amber-950/20 border border-red-100 dark:border-red-900/40 text-xs sm:text-sm text-slate-700 dark:text-slate-300 flex items-center justify-center gap-2 shadow-xs">
              <Sparkles className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0" />
              <span>
                <strong>Semangat Kerakyatan:</strong> Uang yang dibelanjakan di tetangga, langsung menghidupkan keluarga di sekitar kita.
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
