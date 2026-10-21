import React from 'react';
import { ArrowRight, ShoppingBag, HeartHandshake, ShieldCheck } from 'lucide-react';

interface HeroProps {
  totalUmkmCount: number;
}

export const Hero: React.FC<HeroProps> = ({ totalUmkmCount }) => {
  return (
    <section id="home" className="relative pt-12 pb-16 md:pt-20 md:pb-24 overflow-hidden">
      {/* Background soft ambient gradient */}
      <div
        className="absolute inset-0 -z-10 bg-radial from-red-100/40 via-transparent to-transparent dark:from-red-950/20 pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Headlines & Call to Actions */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-red-700 dark:text-red-400">
              <span className="w-2 h-2 rounded-full bg-red-600 dark:bg-red-500" aria-hidden="true" />
              <span>Gerakan Gotong Royong Digital</span>
              <span aria-hidden="true">·</span>
              <span>Aksi Nyata Pancasila</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.12]">
              Beli dari Tetangga, <br className="hidden sm:inline" />
              <span className="text-red-700 dark:text-red-500">
                Bangkitkan Ekonomi Bersama
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Platform digital gotong royong untuk mendukung keberlanjutan UMKM lokal di sekitar lingkungan kita. Wujud nyata pengamalan Keadilan Sosial bagi Seluruh Rakyat Indonesia.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
              <a
                href="#katalog"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-bold text-white bg-red-700 hover:bg-red-800 active:bg-red-900 rounded-xl shadow-md hover:shadow-lg transition-all"
              >
                <span>Jelajahi UMKM Lokal</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href="#daftar"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm transition-all"
              >
                <HeartHandshake className="w-4 h-4 text-red-700 dark:text-red-400" />
                <span>Bantu Daftarkan Usaha</span>
              </a>
            </div>

            {/* Micro proof points */}
            <div className="pt-6 border-t border-slate-200/80 dark:border-slate-800/80 grid grid-cols-3 gap-4 text-center sm:text-left">
              <div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white tabular-nums">
                  {totalUmkmCount}+
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  UMKM Terdaftar
                </p>
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white tabular-nums">
                  100%
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Bebas Biaya / Komisi
                </p>
              </div>
              <div>
                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                  Direct WA
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Tanpa Perantara
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Asset */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl bg-slate-100 dark:bg-slate-800">
              <img
                src="/src/assets/images/hero_umkm_indonesia_1792565608638.jpg"
                alt="Suasana gotong royong warung lokal di Indonesia"
                className="w-full h-80 sm:h-96 lg:h-[420px] object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
              
              <div className="absolute bottom-0 inset-x-0 p-5 text-white">
                <span className="text-xs font-semibold text-red-400 uppercase tracking-wider block">
                  Semangat Kerakyatan
                </span>
                <p className="text-sm sm:text-base font-bold mt-1 text-slate-100">
                  Uang yang dibelanjakan di tetangga, menghidupkan keluarga di sekitar kita.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
