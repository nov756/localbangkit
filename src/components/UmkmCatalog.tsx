import React, { useState } from 'react';
import { Search, MapPin, Clock, MessageCircle, Heart, X, Sparkles, Filter } from 'lucide-react';
import { UmkmItem, UmkmCategory, PriceTier } from '../types';

interface UmkmCatalogProps {
  items: UmkmItem[];
  favorites: string[];
  onToggleFavorite: (id: string) => void;
}

export const UmkmCatalog: React.FC<UmkmCatalogProps> = ({
  items,
  favorites,
  onToggleFavorite,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('semua');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [priceTierFilter, setPriceTierFilter] = useState<string>('all');
  const [onlyFavorites, setOnlyFavorites] = useState<boolean>(false);

  const categories = [
    { id: 'semua', label: 'Semua Kategori' },
    { id: 'kuliner', label: 'Kuliner' },
    { id: 'jasa', label: 'Jasa' },
    { id: 'kerajinan', label: 'Kerajinan' },
    { id: 'sembako', label: 'Sembako & Toko' },
  ];

  const priceTiers = [
    { id: 'all', label: 'Semua Harga' },
    { id: 'ekonomis', label: 'Ekonomis (< 25rb)' },
    { id: 'menengah', label: 'Menengah (25rb - 100rb)' },
    { id: 'premium', label: 'Premium (> 100rb)' },
  ];

  const filteredItems = items.filter((item) => {
    // Category match
    if (selectedCategory !== 'semua' && item.category !== selectedCategory) {
      return false;
    }

    // Price tier match
    if (priceTierFilter !== 'all' && item.priceTier !== priceTierFilter) {
      return false;
    }

    // Favorites match
    if (onlyFavorites && !favorites.includes(item.id)) {
      return false;
    }

    // Search query match
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const inName = item.name.toLowerCase().includes(q);
      const inDesc = item.description.toLowerCase().includes(q);
      const inLoc = item.location.toLowerCase().includes(q);
      const inTag = item.specialtyTag.toLowerCase().includes(q);
      return inName || inDesc || inLoc || inTag;
    }

    return true;
  });

  const getWhatsappUrl = (item: UmkmItem) => {
    const rawWa = item.whatsapp.replace(/\D/g, '');
    const cleanWa = rawWa.startsWith('0') ? '62' + rawWa.slice(1) : rawWa;
    const greeting = encodeURIComponent(
      `Halo ${item.name}, saya melihat usaha Anda di platform gotong royong LokalBangkit. Saya ingin bertanya / memesan produk Anda:`
    );
    return `https://wa.me/${cleanWa}?text=${greeting}`;
  };

  return (
    <section id="katalog" className="py-16 md:py-24 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div className="space-y-2">
            <span className="text-xs font-bold tracking-wider text-red-700 dark:text-red-400 uppercase">
              Direktori Komunitas Lokal
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Katalog UMKM Sekitar Kita
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base max-w-2xl">
              Cari dan hubungi langsung pedagang, perajin, dan penyedia jasa tetangga terdekat Anda tanpa potongan biaya aplikasi.
            </p>
          </div>

          <div className="text-sm text-slate-500 dark:text-slate-400 shrink-0">
            Menampilkan <span className="font-bold text-slate-900 dark:text-white">{filteredItems.length}</span> dari {items.length} UMKM
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="bg-slate-50 dark:bg-slate-800/70 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-700/80 mb-10 space-y-4">
          {/* Top row: Search input + Favorites toggle */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Cari nama warung, makanan, jasa jahit, anyaman, atau jalan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-600 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <button
              onClick={() => setOnlyFavorites(!onlyFavorites)}
              className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold border transition-colors whitespace-nowrap ${
                onlyFavorites
                  ? 'bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-400 border-red-300 dark:border-red-800'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
              }`}
            >
              <Heart className={`w-4 h-4 ${onlyFavorites ? 'fill-red-600 text-red-600' : ''}`} />
              <span>Langganan Tersimpan ({favorites.length})</span>
            </button>
          </div>

          {/* Bottom row: Category Tabs + Price Selector */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-200/80 dark:border-slate-700/80">
            {/* Category tabs */}
            <div className="flex flex-wrap items-center gap-1.5">
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCategory(c.id)}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                    selectedCategory === c.id
                      ? 'bg-red-700 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 hover:bg-slate-200/60 dark:hover:bg-slate-700/60'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>

            {/* Price filter segmented dropdown */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" />
                <span>Kisaran:</span>
              </span>
              <select
                value={priceTierFilter}
                onChange={(e) => setPriceTierFilter(e.target.value)}
                className="py-1.5 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-red-600"
              >
                {priceTiers.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* UMKM Cards Grid */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-16 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Tidak ada UMKM yang cocok dengan filter pencarian Anda.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('semua');
                setSearchQuery('');
                setPriceTierFilter('all');
                setOnlyFavorites(false);
              }}
              className="mt-4 px-4 py-2 text-xs font-bold text-red-700 dark:text-red-400 hover:underline"
            >
              Reset Semua Filter
            </button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {filteredItems.map((item) => {
              const isFav = favorites.includes(item.id);
              return (
                <div
                  key={item.id}
                  className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <div>
                    {/* Image with fallback */}
                    <div className="relative h-48 w-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          // Resilient fallback image if any external url fails
                          (e.target as HTMLImageElement).src =
                            'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500&auto=format&fit=crop&q=80';
                        }}
                      />

                      {/* Favorite Button */}
                      <button
                        onClick={() => onToggleFavorite(item.id)}
                        aria-label={isFav ? 'Hapus dari langganan' : 'Simpan langganan'}
                        className="absolute top-3 right-3 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-sm transition-colors"
                      >
                        <Heart className={`w-4 h-4 ${isFav ? 'fill-red-500 text-red-500' : ''}`} />
                      </button>

                      {/* Fresh submission badge if registered by user */}
                      {item.isCustomAdded && (
                        <div className="absolute top-3 left-3 px-2.5 py-1 rounded bg-red-700/90 text-white text-[11px] font-bold tracking-wide flex items-center gap-1 shadow-sm">
                          <Sparkles className="w-3 h-3" />
                          <span>Daftaran Warga</span>
                        </div>
                      )}
                    </div>

                    {/* Card Content */}
                    <div className="p-5">
                      {/* Zero-Pill Metadata line with middot separators */}
                      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium capitalize">
                        <span className="font-semibold text-red-700 dark:text-red-400">
                          {item.category}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className="truncate">{item.specialtyTag}</span>
                      </div>

                      <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1.5 group-hover:text-red-700 dark:group-hover:text-red-400 transition-colors">
                        {item.name}
                      </h3>

                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>

                      {/* Location & Hours */}
                      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/60 space-y-1.5 text-xs text-slate-500 dark:text-slate-400">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-red-600 dark:text-red-400 shrink-0" />
                          <span className="truncate">{item.location}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{item.operatingHours}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Bottom: Price + WhatsApp CTA */}
                  <div className="p-5 pt-0">
                    <div className="pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between gap-3">
                      <div>
                        <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                          Kisaran Harga
                        </span>
                        <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white tabular-nums">
                          {item.priceRange}
                        </span>
                      </div>

                      <a
                        href={getWhatsappUrl(item)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-xl shadow-sm transition-colors whitespace-nowrap"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>Hubungi WA</span>
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
