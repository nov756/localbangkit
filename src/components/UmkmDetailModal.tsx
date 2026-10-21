import React, { useState } from 'react';
import { X, MapPin, Clock, MessageCircle, Star, Heart, CheckCircle2, ShieldCheck, Sparkles, ShoppingBag, Plus, Minus } from 'lucide-react';
import { UmkmItem } from '../types';

interface UmkmDetailModalProps {
  umkm: UmkmItem | null;
  isOpen: boolean;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onOpenReviewModal: (umkm: UmkmItem) => void;
  averageRating: number;
  reviewCount: number;
}

export const UmkmDetailModal: React.FC<UmkmDetailModalProps> = ({
  umkm,
  isOpen,
  onClose,
  isFavorite,
  onToggleFavorite,
  onOpenReviewModal,
  averageRating,
  reviewCount,
}) => {
  const [selectedProducts, setSelectedProducts] = useState<Record<string, number>>({});

  if (!isOpen || !umkm) return null;

  const handleQuantityChange = (productName: string, delta: number) => {
    setSelectedProducts((prev) => {
      const current = prev[productName] || 0;
      const next = Math.max(0, current + delta);
      if (next === 0) {
        const copy = { ...prev };
        delete copy[productName];
        return copy;
      }
      return { ...prev, [productName]: next };
    });
  };

  const calculateTotalOrder = () => {
    if (!umkm.products) return 0;
    return umkm.products.reduce((acc, p) => {
      const qty = selectedProducts[p.name] || 0;
      return acc + qty * p.price;
    }, 0);
  };

  const getCustomWhatsappUrl = () => {
    const rawWa = umkm.whatsapp.replace(/\D/g, '');
    const cleanWa = rawWa.startsWith('0') ? '62' + rawWa.slice(1) : rawWa;

    const selectedList = Object.entries(selectedProducts);
    let itemsText = '';
    if (selectedList.length > 0) {
      itemsText = `\n\nSaya ingin memesan / menanyakan daftar berikut:\n` +
        selectedList.map(([name, qty]) => `- ${name} (${qty}x)`).join('\n') +
        `\nEstimasi Total: Rp ${calculateTotalOrder().toLocaleString('id-ID')}`;
    }

    const greeting = encodeURIComponent(
      `Halo ${umkm.name}, saya melihat profil usaha Anda di direktori gotong royong LokalBangkit.${itemsText}\n\nApakah stok / jadwal saat ini tersedia? Terima kasih banyak!`
    );
    return `https://wa.me/${cleanWa}?text=${greeting}`;
  };

  const totalCalculated = calculateTotalOrder();
  const selectedCount = Object.values(selectedProducts).reduce((a, b) => a + b, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fadeIn overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Header Image Bar */}
        <div className="relative h-56 sm:h-64 w-full bg-slate-100 dark:bg-slate-800 shrink-0">
          <img
            src={umkm.imageUrl}
            alt={umkm.name}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500&auto=format&fit=crop&q=80';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-black/30" />

          {/* Close button */}
          <button
            onClick={onClose}
            aria-label="Tutup detail"
            className="absolute top-4 right-4 p-2 rounded-full bg-black/50 hover:bg-black/75 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Favorite button */}
          <button
            onClick={() => onToggleFavorite(umkm.id)}
            aria-label={isFavorite ? 'Hapus favorit' : 'Tambah favorit'}
            className="absolute top-4 right-16 p-2 rounded-full bg-black/50 hover:bg-black/75 text-white transition-colors"
          >
            <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
          </button>

          {/* Badge Example or Custom */}
          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            {umkm.featuredBadge ? (
              <span className="px-3 py-1 rounded-full bg-red-600 text-white text-xs font-bold tracking-wide shadow-sm flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{umkm.featuredBadge}</span>
              </span>
            ) : (
              <span className="px-3 py-1 rounded-full bg-slate-900/80 text-white text-xs font-bold tracking-wide">
                Contoh Terverifikasi Warga
              </span>
            )}
            <span className="px-3 py-1 rounded-full bg-emerald-600/90 text-white text-xs font-bold tracking-wide flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Gotong Royong</span>
            </span>
          </div>

          {/* Title on image */}
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <span className="text-xs uppercase font-semibold text-red-300 tracking-wider">
              Kategori: {umkm.category} · {umkm.specialtyTag}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1 leading-tight">
              {umkm.name}
            </h2>
            <div className="flex items-center gap-3 mt-2 text-xs sm:text-sm text-slate-200">
              <div className="flex items-center gap-1 text-amber-300 font-bold">
                <Star className="w-4 h-4 fill-amber-300 text-amber-300" />
                <span>{averageRating}</span>
                <span className="text-slate-300">({reviewCount} ulasan warga)</span>
              </div>
              <span>·</span>
              <span className="text-emerald-300 font-semibold">{umkm.priceRange}</span>
            </div>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Business description */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Profil & Keunggulan Usaha
            </h3>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {umkm.description}
            </p>
          </div>

          {/* Key info boxes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300">
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">Lokasi Usaha</span>
                <span>{umkm.location}</span>
                {umkm.distance && (
                  <span className="block text-[11px] text-red-600 dark:text-red-400 font-medium mt-0.5">
                    📍 {umkm.distance}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Clock className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">Jam Operasional</span>
                <span>{umkm.operatingHours}</span>
                <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-bold mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Buka Melayani Warga
                </span>
              </div>
            </div>
          </div>

          {/* Detailed Product / Menu Listing (The Exemplary Part) */}
          {umkm.products && umkm.products.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <ShoppingBag className="w-4 h-4 text-red-600" />
                    <span>Daftar Menu & Tarif Contoh (Transparan)</span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Pilih jumlah porsi/layanan untuk hitung estimasi pesanan ke WhatsApp:
                  </p>
                </div>
                {selectedCount > 0 && (
                  <button
                    onClick={() => setSelectedProducts({})}
                    className="text-xs font-semibold text-red-600 hover:underline"
                  >
                    Reset Pilihan
                  </button>
                )}
              </div>

              <div className="space-y-2.5">
                {umkm.products.map((prod) => {
                  const qty = selectedProducts[prod.name] || 0;
                  return (
                    <div
                      key={prod.name}
                      className={`p-3 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                        qty > 0
                          ? 'bg-red-50/50 dark:bg-red-950/30 border-red-300 dark:border-red-800'
                          : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700/80 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex-1">
                        <span className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm block">
                          {prod.name}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          Rp {prod.price.toLocaleString('id-ID')} {prod.unit ? `/ ${prod.unit}` : ''}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleQuantityChange(prod.name, -1)}
                          disabled={qty === 0}
                          className="w-7 h-7 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-6 text-center font-bold text-xs tabular-nums text-slate-900 dark:text-white">
                          {qty}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleQuantityChange(prod.name, 1)}
                          className="w-7 h-7 rounded-lg bg-red-700 hover:bg-red-800 text-white flex items-center justify-center transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Order calculation preview */}
              {selectedCount > 0 && (
                <div className="mt-3 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-amber-900 dark:text-amber-200 block">
                      Estimasi Pesanan ({selectedCount} item dipilih):
                    </span>
                    <span className="text-slate-600 dark:text-slate-400">
                      Format pesanan otomatis disiapkan saat klik tombol WhatsApp di bawah.
                    </span>
                  </div>
                  <span className="text-base font-extrabold text-amber-700 dark:text-amber-300 tabular-nums">
                    Rp {totalCalculated.toLocaleString('id-ID')}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Testimonial & Review Trigger */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="flex items-center text-amber-400">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-4 h-4 ${star <= Math.round(averageRating) ? 'fill-amber-400' : 'text-slate-300 dark:text-slate-600'}`}
                  />
                ))}
              </div>
              <span className="text-xs font-bold text-slate-900 dark:text-white">
                {averageRating} / 5.0
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                ({reviewCount} testimoni warga)
              </span>
            </div>

            <button
              onClick={() => {
                onClose();
                onOpenReviewModal(umkm);
              }}
              className="px-4 py-2 text-xs font-bold text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/60 rounded-xl transition-colors border border-red-200 dark:border-red-900"
            >
              Lihat / Tambah Ulasan Warga
            </button>
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 shrink-0">
          <div>
            <span className="text-[10px] uppercase font-semibold text-slate-400 block">
              {selectedCount > 0 ? 'Total Estimasi' : 'Kisaran Harga'}
            </span>
            <span className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white tabular-nums">
              {selectedCount > 0
                ? `Rp ${totalCalculated.toLocaleString('id-ID')}`
                : umkm.priceRange}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              Tutup
            </button>
            <a
              href={getCustomWhatsappUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{selectedCount > 0 ? 'Kirim Pesanan ke WA' : 'Chat Penjual via WA'}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
