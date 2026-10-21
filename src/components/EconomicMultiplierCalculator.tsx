import React, { useState, useEffect } from 'react';
import { Calculator, TrendingUp, Users, HeartHandshake, CheckCircle, Share2 } from 'lucide-react';
import { User } from 'firebase/auth';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { collection, doc, setDoc, onSnapshot } from 'firebase/firestore';
import { getAppBaseUrl } from '../config';

interface EconomicMultiplierCalculatorProps {
  user?: User | null;
}

export const EconomicMultiplierCalculator: React.FC<EconomicMultiplierCalculatorProps> = ({ user }) => {
  const [monthlySpend, setMonthlySpend] = useState<number>(350000);
  const [pledgeCount, setPledgeCount] = useState<number>(142);
  const [hasPledged, setHasPledged] = useState<boolean>(false);

  useEffect(() => {
    const savedPledge = localStorage.getItem('lokalbangkit_pledged');
    if (savedPledge === 'true') {
      setHasPledged(true);
    }
    const savedCount = localStorage.getItem('lokalbangkit_pledge_count');
    if (savedCount) {
      setPledgeCount(parseInt(savedCount, 10));
    }

    // Real-time Firestore pledge listener
    try {
      const unsub = onSnapshot(
        collection(db, 'pledges'),
        (snapshot) => {
          if (!snapshot.empty) {
            setPledgeCount(142 + snapshot.size);
          }
        },
        (error) => {
          handleFirestoreError(error, OperationType.GET, 'pledges');
        }
      );
      return () => unsub();
    } catch (e) {
      console.warn('Firestore pledges listener initializing or offline:', e);
    }
  }, []);

  const handlePledge = async () => {
    if (!hasPledged) {
      const nextCount = pledgeCount + 1;
      setPledgeCount(nextCount);
      setHasPledged(true);
      localStorage.setItem('lokalbangkit_pledged', 'true');
      localStorage.setItem('lokalbangkit_pledge_count', nextCount.toString());

      if (user) {
        try {
          const pledgeDoc = doc(db, 'pledges', `pledge-${user.uid}`);
          await setDoc(pledgeDoc, {
            id: `pledge-${user.uid}`,
            userId: user.uid,
            userName: user.displayName || 'Warga Gotong Royong',
            monthlySpend,
            createdAt: new Date().toISOString(),
          });
        } catch (err) {
          handleFirestoreError(err, OperationType.WRITE, 'pledges');
        }
      }
    }
  };

  // Economic multiplier math:
  const annualLocalRetained = Math.round(monthlySpend * 12 * 0.68);
  const chainRetained = Math.round(monthlySpend * 12 * 0.18);
  const economicSurplus = annualLocalRetained - chainRetained;
  const estimatedMealsProvided = Math.floor(annualLocalRetained / 15000);

  const presets = [100000, 250000, 500000, 1000000];

  return (
    <section id="dampak" className="py-16 md:py-24 bg-slate-50 dark:bg-slate-950 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-bold tracking-wider text-red-700 dark:text-red-400 uppercase">
            <span>Simulasi Dampak Nyata</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Kalkulator Efek Pengganda Ekonomi Lokal
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base">
            Setiap rupiah yang Anda belanjakan ke pedagang tetangga berlipat ganda menghidupkan ekosistem warga sekitar, bukan menguap ke luar daerah.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-stretch">
          {/* Controls Column */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-400 flex items-center justify-center">
                  <Calculator className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">
                    Alokasi Belanja Bulanan
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Geser atau pilih nominal belanja rutin di UMKM tetangga
                  </p>
                </div>
              </div>

              {/* Slider & Input */}
              <div className="space-y-4">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs font-semibold text-slate-500 uppercase">Nominal / Bulan:</span>
                  <span className="text-2xl font-black text-slate-900 dark:text-white tabular-nums">
                    Rp {monthlySpend.toLocaleString('id-ID')}
                  </span>
                </div>

                <input
                  type="range"
                  min="50000"
                  max="2000000"
                  step="25000"
                  value={monthlySpend}
                  onChange={(e) => setMonthlySpend(Number(e.target.value))}
                  className="w-full accent-red-700 cursor-pointer h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none"
                />

                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Rp 50.000</span>
                  <span>Rp 1.000.000</span>
                  <span>Rp 2.000.000</span>
                </div>

                {/* Preset buttons */}
                <div className="grid grid-cols-4 gap-2 pt-2">
                  {presets.map((val) => (
                    <button
                      key={val}
                      onClick={() => setMonthlySpend(val)}
                      className={`py-2 text-xs font-semibold rounded-lg border transition-colors whitespace-nowrap ${
                        monthlySpend === val
                          ? 'bg-red-700 text-white border-red-700 shadow-sm'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {val >= 1000000 ? `${val / 1000000} Jt` : `${val / 1000} Rb`}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Gotong Royong Pledge button */}
            <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                <span className="flex items-center gap-1.5 font-medium">
                  <Users className="w-4 h-4 text-red-600" />
                  Warga Telah Berkomitmen:
                </span>
                <span className="font-bold text-slate-900 dark:text-white tabular-nums">
                  {pledgeCount} Orang
                </span>
              </div>

              <button
                onClick={handlePledge}
                disabled={hasPledged}
                className={`w-full py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  hasPledged
                    ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800'
                    : 'bg-red-700 hover:bg-red-800 text-white shadow-sm'
                }`}
              >
                {hasPledged ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>Terima Kasih atas Komitmen Gotong Royong Anda!</span>
                  </>
                ) : (
                  <>
                    <HeartHandshake className="w-4 h-4" />
                    <span>Ikut Berkomitmen: Prioritaskan Belanja Tetangga</span>
                  </>
                )}
              </button>

              {hasPledged && (
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(
                    `Saya telah bergabung berkomitmen memprioritaskan belanja di UMKM tetangga lingkungan sekitar lewat platform gotong royong LokalBangkit! 🇮🇩\n\nYuk hitung dampak perputaran ekonomi warga di sini:\n${getAppBaseUrl()}#dampak`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white transition-all shadow-xs"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Ajak Warga Lain Berkomitmen via WA</span>
                </a>
              )}
            </div>
          </div>

          {/* Results Display Column */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
                <div>
                  <span className="text-xs font-bold text-red-700 dark:text-red-400 uppercase tracking-wider">
                    Hasil Proyeksi 1 Tahun
                  </span>
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                    Uang Rakyat yang Tetap Berputar di Lingkungan
                  </h4>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-500 dark:text-slate-400 block">
                    Retensi Lokal
                  </span>
                  <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">
                    68% vs 18%
                  </span>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 my-6">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700">
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    Jika Belanja di Tetangga (1 Thn)
                  </p>
                  <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1 tabular-nums">
                    Rp {annualLocalRetained.toLocaleString('id-ID')}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                    Beredar membayar upah pekerja tetangga, bahan baku pasar, & sewa lokal.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700">
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    Surplus Kesejahteraan Warga
                  </p>
                  <p className="text-2xl font-black text-red-700 dark:text-red-400 mt-1 tabular-nums">
                    +Rp {economicSurplus.toLocaleString('id-ID')}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                    Selisih dana yang terselamatkan dari arus keluar ke korporasi luar.
                  </p>
                </div>
              </div>

              {/* Explanatory impact row */}
              <div className="p-4 rounded-xl bg-red-50/60 dark:bg-red-950/20 border border-red-100 dark:border-red-900/50 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-red-800 dark:text-red-300">
                  <TrendingUp className="w-4 h-4" />
                  <span>Makna Nyata Sila ke-5 (Keadilan Sosial):</span>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  Dengan alokasi <span className="font-semibold text-slate-900 dark:text-white">Rp {monthlySpend.toLocaleString('id-ID')} / bulan</span>, Anda setara dengan menyokong <span className="font-semibold text-red-700 dark:text-red-400">{estimatedMealsProvided} porsi makanan bernutrisi</span> bagi keluarga pekerja informal di lingkungan kita selama setahun.
                </p>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-4 text-center sm:text-left">
              *Model perhitungan berbasis riset Local Economic Multiplier Effect (Civic Economics & ISEI).
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
