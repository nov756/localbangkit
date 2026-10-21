import React from 'react';
import { Scale, Users, HeartHandshake, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const PancasilaValues: React.FC = () => {
  const values = [
    {
      sila: 'Sila ke-5',
      title: 'Keadilan Sosial bagi Seluruh Rakyat Indonesia',
      icon: Scale,
      color: 'red',
      description:
        'Memberikan akses promosi digital secara adil, inklusif, dan 100% gratis bagi para pedagang kecil dan usaha mikro yang selama ini terpinggirkan oleh algoritma e-commerce korporat.',
      actions: [
        'Tanpa biaya pendaftaran & tanpa potongan komisi per transaksi',
        'Visibilitas setara antara warung rumahan dan penyedia jasa lokal',
        'Pemberdayaan ekonomi informal tanpa hambatan birokrasi digital',
      ],
    },
    {
      sila: 'Sila ke-3',
      title: 'Persatuan Indonesia',
      icon: Users,
      color: 'blue',
      description:
        'Menghidupkan kembali tradisi luhur gotong royong warga, memperkuat solidaritas antartetangga, dan merajut kohesi sosial melalui kepedulian terhadap rezeki sesama saudara sebangsa.',
      actions: [
        'Mengutamakan belanja kebutuhan sehari-hari ke tetangga terdekat',
        'Mahasiswa & pemuda bahu-membahu mendata UMKM lingkungan sekitar',
        'Memperkuat ketahanan ekonomi mikro dari level komunitas rukun warga (RW)',
      ],
    },
    {
      sila: 'Sila ke-2',
      title: 'Kemanusiaan yang Adil dan Beradab',
      icon: HeartHandshake,
      color: 'emerald',
      description:
        'Menghargai jerih payah keringat pekerja mandiri dengan transaksi yang saling memanusiakan, menjunjung etika santun saat bertransaksi langsung tanpa sistem perantara eksploitatif.',
      actions: [
        'Menghubungi penjual dengan salam dan tutur kata yang menghormati',
        'Membayar harga wajar tanpa menawar berlebihan kepada pedagang kecil',
        'Membantu menyebarkan info usaha tetangga kepada rekan dan keluarga',
      ],
    },
  ];

  return (
    <section id="pancasila" className="py-16 md:py-24 bg-white dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center space-y-3 mb-14">
          <div className="inline-flex items-center gap-2 text-xs font-bold tracking-wider text-red-700 dark:text-red-400 uppercase">
            <span>Landasan Moralitas & Kebangsaan</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Implementasi Nilai Pancasila dalam Aksi Digital
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg">
            Teknologi bukan sekadar alat efisiensi, melainkan jembatan pengamalan nilai-nilai luhur bangsa demi keadilan sosial dan persatuan warga.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {values.map((v) => {
            const Icon = v.icon;
            return (
              <div
                key={v.sila}
                className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-7 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-xs font-bold tracking-wider uppercase text-red-700 dark:text-red-400">
                      {v.sila}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-400 flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                    {v.title}
                  </h3>

                  <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-6">
                    {v.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-200 dark:border-slate-700 space-y-2">
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Bentuk Pengamalan Riil:
                  </p>
                  {v.actions.map((act, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-400">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                      <span>{act}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
