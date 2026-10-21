import React, { useState } from 'react';
import { Send, CheckCircle2, AlertCircle, Sparkles, Image as ImageIcon } from 'lucide-react';
import { UmkmItem, UmkmCategory, PriceTier } from '../types';

import { User } from 'firebase/auth';
import { SectionId } from './Navbar';

interface RegisterUmkmFormProps {
  onAddUmkm: (newItem: UmkmItem) => void;
  onNavigate?: (section: SectionId) => void;
  user?: User | null;
}

export const RegisterUmkmForm: React.FC<RegisterUmkmFormProps> = ({ onAddUmkm, onNavigate, user }) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<UmkmCategory>('kuliner');
  const [whatsapp, setWhatsapp] = useState('');
  const [location, setLocation] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [priceTier, setPriceTier] = useState<PriceTier>('ekonomis');
  const [operatingHours, setOperatingHours] = useState('08:00 - 17:00 WIB');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [submittedItem, setSubmittedItem] = useState<UmkmItem | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Preset illustrative images for easy selection by users who don't have custom URLs
  const presetPhotos = [
    {
      label: 'Kuliner / Makanan',
      url: '/src/assets/images/umkm_kuliner_warung_1792565609835.jpg',
    },
    {
      label: 'Jasa / Permak / Bengkel',
      url: '/src/assets/images/umkm_jasa_penjahit_1792565611532.jpg',
    },
    {
      label: 'Kerajinan / Anyaman',
      url: '/src/assets/images/umkm_kerajinan_anyaman_1792565609751.jpg',
    },
    {
      label: 'Toko / Warung Kelontong',
      url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80',
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // WhatsApp format validation (Indonesian format 08... or 628...)
    const cleanWa = whatsapp.replace(/\D/g, '');
    if (cleanWa.length < 10) {
      setErrorMsg('Nomor WhatsApp harus minimal 10 digit (contoh: 081234567890).');
      return;
    }

    const defaultImg =
      imageUrl.trim() ||
      presetPhotos.find((p) => p.label.toLowerCase().includes(category))?.url ||
      presetPhotos[0].url;

    const newItem: UmkmItem = {
      id: `umkm-${Date.now()}`,
      name: name.trim(),
      category,
      description: description.trim(),
      location: location.trim(),
      priceRange: priceRange.trim() || 'Rp 10.000 - Rp 50.000',
      priceTier,
      whatsapp: cleanWa,
      imageUrl: defaultImg,
      operatingHours: operatingHours.trim() || '08:00 - 18:00 WIB',
      specialtyTag: `${category.toUpperCase()} Pilihan Warga`,
      isCustomAdded: true,
      authorId: user?.uid || 'warga-lokal',
      authorName: user?.displayName || user?.email || 'Warga Sekitar',
      createdAt: new Date().toISOString().split('T')[0],
    };

    onAddUmkm(newItem);
    setSubmittedItem(newItem);

    // Reset fields
    setName('');
    setWhatsapp('');
    setLocation('');
    setPriceRange('');
    setDescription('');
    setImageUrl('');
  };

  return (
    <section id="daftar" className="py-16 md:py-24 bg-slate-50 dark:bg-slate-950 transition-colors">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 space-y-2">
          <span className="text-xs font-bold tracking-wider text-red-700 dark:text-red-400 uppercase">
            Aksi Gotong Royong Warga
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Daftarkan UMKM Sekitarmu
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base">
            Tahu usaha kecil yang butuh bantuan promosi digital? Bantu daftarkan secara gratis tanpa biaya sepeser pun.
          </p>
        </div>

        {submittedItem ? (
          <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-8 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-600 dark:text-emerald-300 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Alhamdulillah! &quot;{submittedItem.name}&quot; Berhasil Didaftarkan
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto">
              Data usaha telah langsung diterbitkan ke Katalog UMKM dan tersimpan di perangkat Anda. Warga lain kini dapat menemukan dan menghubungi usaha ini.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => onNavigate?.('katalog')}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors"
              >
                Lihat di Katalog
              </button>
              <button
                type="button"
                onClick={() => setSubmittedItem(null)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-50 transition-colors"
              >
                Daftarkan UMKM Lainnya
              </button>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-5"
          >
            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-xs text-red-700 dark:text-red-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Nama Usaha / Pedagang *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Warung Nasi Goreng Mas Budi / Jahit Bu Ani"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-600 transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Kategori Usaha *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as UmkmCategory)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-600"
                >
                  <option value="kuliner">Kuliner (Makanan / Minuman)</option>
                  <option value="jasa">Jasa (Permak, Servis, Cuci, dll.)</option>
                  <option value="kerajinan">Kerajinan Tangan / Kriya</option>
                  <option value="sembako">Sembako / Toko Kelontong</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Nomor WhatsApp *
                </label>
                <input
                  type="tel"
                  required
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="08xxxxxxxxxx / 628xxxxxxxxxx"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-600 transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Alamat Singkat / Patokan *
                </label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Contoh: Jl. Pisangan Timur No. 12 (Dekat Masjid)"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-600 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Jam Buka / Operasional
                </label>
                <input
                  type="text"
                  value={operatingHours}
                  onChange={(e) => setOperatingHours(e.target.value)}
                  placeholder="Contoh: 07:00 - 19:00 WIB"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-600 transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Kisaran Harga Produk / Jasa
                </label>
                <input
                  type="text"
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  placeholder="Contoh: Rp 15.000 - Rp 35.000"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-600 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Tingkat Harga
                </label>
                <select
                  value={priceTier}
                  onChange={(e) => setPriceTier(e.target.value as PriceTier)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-600"
                >
                  <option value="ekonomis">Ekonomis (&lt; Rp 25.000)</option>
                  <option value="menengah">Menengah (Rp 25.000 - Rp 100.000)</option>
                  <option value="premium">Premium / Pesanan Khusus (&gt; Rp 100.000)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Deskripsi Singkat & Keunggulan Usaha *
              </label>
              <textarea
                required
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ceritakan apa produk unggulannya, bahan yang digunakan, atau keramahan pelayanannya..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-600 transition-colors"
              />
            </div>

            {/* Photo preset chooser */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Pilih Foto Representatif Usaha (Atau Masukkan URL)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2">
                {presetPhotos.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => setImageUrl(preset.url)}
                    className={`p-2 rounded-xl border text-left text-xs transition-all flex flex-col gap-1.5 ${
                      imageUrl === preset.url
                        ? 'border-red-700 bg-red-50/50 dark:bg-red-950/30 font-semibold'
                        : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <img
                      src={preset.url}
                      alt={preset.label}
                      className="w-full h-14 object-cover rounded-lg"
                      referrerPolicy="no-referrer"
                    />
                    <span className="truncate text-[11px] text-slate-700 dark:text-slate-300">
                      {preset.label}
                    </span>
                  </button>
                ))}
              </div>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Atau tempel URL gambar custom (opsional)"
                className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-red-600 transition-colors"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-xl bg-red-700 hover:bg-red-800 active:bg-red-900 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Kirim & Terbitkan Data UMKM</span>
            </button>
            <p className="text-[11px] text-center text-slate-500 dark:text-slate-400">
              Data yang Anda kirimkan tidak dipungut biaya apa pun dan langsung dapat diakses oleh warga sekitar.
            </p>
          </form>
        )}
      </div>
    </section>
  );
};
