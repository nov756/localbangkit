import React from 'react';
import { Share2, Heart, ExternalLink } from 'lucide-react';
import { SectionId } from './Navbar';

interface FooterProps {
  onSelectSection?: (section: SectionId) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectSection }) => {
  const [currentUrl, setCurrentUrl] = React.useState<string>('https://lokalbangkit.vercel.app');

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentUrl(window.location.origin);
    }
  }, []);

  const shareText = encodeURIComponent(
    `Ayo dukung pedagang dan UMKM sekitar kita lewat platform LokalBangkit - Beli dari Tetangga, Bangkitkan Ekonomi Bersama! 🇮🇩\n\nBuka web direktori & katalog lengkapnya di sini:\n${currentUrl}`
  );
  const shareUrl = `https://wa.me/?text=${shareText}`;

  const handleNav = (sec: SectionId) => {
    onSelectSection?.(sec);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-slate-800">
          {/* Brand & Mission */}
          <div className="md:col-span-5 space-y-3">
            <button
              onClick={() => handleNav('beranda')}
              className="flex items-center gap-2 text-left"
            >
              <span className="w-7 h-7 rounded-lg bg-red-700 flex items-center justify-center text-white font-black text-xs">
                LB
              </span>
              <span className="text-xl font-black text-white tracking-tight">
                Lokal<span className="text-red-500">Bangkit</span>
              </span>
            </button>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Proyek Aksi Nyata Mahasiswa: Pengamalan Sila ke-5 (Keadilan Sosial) dan Sila ke-3 (Persatuan Indonesia) melalui digitalisasi inklusif pedagang mikro lokal.
            </p>
          </div>

          {/* Quick Navigation */}
          <div className="md:col-span-3 space-y-2">
            <p className="text-xs font-bold text-white uppercase tracking-wider mb-2">
              Navigasi Halaman
            </p>
            <ul className="space-y-1.5 text-xs">
              <li>
                <button
                  onClick={() => handleNav('beranda')}
                  className="hover:text-red-400 transition-colors"
                >
                  Beranda
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('pancasila')}
                  className="hover:text-red-400 transition-colors"
                >
                  Nilai Luhur Pancasila
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('dampak')}
                  className="hover:text-red-400 transition-colors"
                >
                  Kalkulator Dampak Warga
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('katalog')}
                  className="hover:text-red-400 transition-colors"
                >
                  Katalog UMKM
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('daftar')}
                  className="hover:text-red-400 transition-colors"
                >
                  Daftarkan Usaha Sekitar
                </button>
              </li>
            </ul>
          </div>

          {/* Social share & gotong royong action */}
          <div className="md:col-span-4 space-y-3">
            <p className="text-xs font-bold text-white uppercase tracking-wider mb-2">
              Sebarkan Semangat Gotong Royong
            </p>
            <p className="text-xs text-slate-400 leading-relaxed">
              Bantu tetangga mendapatkan lebih banyak pelanggan dengan membagikan platform ini ke grup WhatsApp RT, RW, atau kampus Anda.
            </p>
            <a
              href={shareUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 transition-colors"
            >
              <Share2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Bagikan ke Grup WhatsApp Warga</span>
              <ExternalLink className="w-3 h-3 text-slate-500" />
            </a>
          </div>
        </div>

        {/* Bottom copyright & attribution */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>
            &copy; {new Date().getFullYear()} LokalBangkit. Seluruh hak cipta dilindungi undang-undang.
          </p>
          <p className="flex items-center gap-1.5">
            <span>Dirancang dengan semangat gotong royong</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
            <span>untuk Indonesia</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
