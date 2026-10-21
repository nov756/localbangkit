import React, { useState, useEffect } from 'react';
import {
  Search,
  MapPin,
  Clock,
  MessageCircle,
  Heart,
  X,
  Sparkles,
  Filter,
  Star,
  MessageSquare,
  Eye,
  Utensils,
  Wrench,
  Palette,
  ShoppingBag,
  Info,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react';
import { User } from 'firebase/auth';
import { UmkmItem, UmkmCategory, PriceTier } from '../types';
import { UmkmReviewModal } from './UmkmReviewModal';
import { UmkmDetailModal } from './UmkmDetailModal';
import { INITIAL_REVIEWS_MAP } from '../data/initialReviews';
import { db } from '../firebase';
import { collection, onSnapshot } from 'firebase/firestore';

interface UmkmCatalogProps {
  items: UmkmItem[];
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  user?: User | null;
}

export const UmkmCatalog: React.FC<UmkmCatalogProps> = ({
  items,
  favorites,
  onToggleFavorite,
  user = null,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('semua');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [priceTierFilter, setPriceTierFilter] = useState<string>('all');
  const [onlyFavorites, setOnlyFavorites] = useState<boolean>(false);
  const [activeReviewUmkm, setActiveReviewUmkm] = useState<UmkmItem | null>(null);
  const [activeDetailUmkm, setActiveDetailUmkm] = useState<UmkmItem | null>(null);

  // Ratings map: { [umkmId]: { avg: number, count: number } }
  const [ratingsMap, setRatingsMap] = useState<Record<string, { avg: number; count: number }>>(() => {
    const initial: Record<string, { avg: number; count: number }> = {};
    Object.entries(INITIAL_REVIEWS_MAP).forEach(([id, revs]) => {
      const total = revs.reduce((acc, r) => acc + r.rating, 0);
      initial[id] = {
        avg: Number((total / revs.length).toFixed(1)),
        count: revs.length,
      };
    });
    return initial;
  });

  // Listen to reviews collection across items to keep counts up to date
  useEffect(() => {
    const unsubs: (() => void)[] = [];

    items.forEach((item) => {
      try {
        const revCol = collection(db, 'umkm', item.id, 'reviews');
        const unsub = onSnapshot(revCol, (snap) => {
          if (!snap.empty) {
            let total = 0;
            snap.forEach((d) => {
              const data = d.data();
              if (typeof data.rating === 'number') total += data.rating;
            });
            const avg = Number((total / snap.size).toFixed(1));
            setRatingsMap((prev) => ({
              ...prev,
              [item.id]: { avg, count: snap.size },
            }));
          }
        });
        unsubs.push(unsub);
      } catch (e) {
        // ignore
      }
    });

    return () => {
      unsubs.forEach((u) => u());
    };
  }, [items]);

  const categoryPresets = [
    { id: 'semua', label: 'Semua Contoh', icon: null, badge: `${items.length} UMKM` },
    { id: 'kuliner', label: 'Kuliner', icon: Utensils, badge: 'Nasi, Martabak, Jamu' },
    { id: 'jasa', label: 'Jasa', icon: Wrench, badge: 'Jahit, Bengkel, Laundry' },
    { id: 'kerajinan', label: 'Kerajinan', icon: Palette, badge: 'Bambu & Pandan' },
    { id: 'sembako', label: 'Sembako & Toko', icon: ShoppingBag, badge: 'Sayur & Kelontong' },
  ];

  const priceTiers = [
    { id: 'all', label: 'Semua Kisaran Harga' },
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
      const inBadge = item.featuredBadge?.toLowerCase().includes(q);
      const inProducts = item.products?.some((p) => p.name.toLowerCase().includes(q));
      return inName || inDesc || inLoc || inTag || Boolean(inBadge) || Boolean(inProducts);
    }

    return true;
  });

  const getWhatsappUrl = (item: UmkmItem) => {
    const rawWa = item.whatsapp.replace(/\D/g, '');
    const cleanWa = rawWa.startsWith('0') ? '62' + rawWa.slice(1) : rawWa;
    const currentUrl = typeof window !== 'undefined' ? window.location.origin : 'https://lokalbangkit.vercel.app';
    const greeting = encodeURIComponent(
      `Halo ${item.name}, saya melihat profil usaha Anda di direktori gotong royong LokalBangkit (${currentUrl}). Saya ingin bertanya ketersediaan / memesan produk Anda:`
    );
    return `https://wa.me/${cleanWa}?text=${greeting}`;
  };

  const getShareCatalogUrl = () => {
    const currentUrl = typeof window !== 'undefined' ? window.location.origin : 'https://lokalbangkit.vercel.app';
    const text = encodeURIComponent(
      `Ayo dukung dan belanja di pedagang, perajin, serta UMKM tetangga sekitar kita! 🇮🇩\n\nBuka katalog lengkap LokalBangkit di sini:\n${currentUrl}#katalog`
    );
    return `https://wa.me/?text=${text}`;
  };

  const handleReviewAdded = (umkmId: string, newAvgRating: number, newCount: number) => {
    setRatingsMap((prev) => ({
      ...prev,
      [umkmId]: { avg: newAvgRating, count: newCount },
    }));
  };

  const getCategoryTheme = (category: string) => {
    switch (category) {
      case 'kuliner':
        return {
          bg: 'bg-amber-50 dark:bg-amber-950/40',
          text: 'text-amber-700 dark:text-amber-400',
          border: 'border-amber-200 dark:border-amber-800',
          pill: 'bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300',
        };
      case 'jasa':
        return {
          bg: 'bg-blue-50 dark:bg-blue-950/40',
          text: 'text-blue-700 dark:text-blue-400',
          border: 'border-blue-200 dark:border-blue-800',
          pill: 'bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-300',
        };
      case 'kerajinan':
        return {
          bg: 'bg-purple-50 dark:bg-purple-950/40',
          text: 'text-purple-700 dark:text-purple-400',
          border: 'border-purple-200 dark:border-purple-800',
          pill: 'bg-purple-100 dark:bg-purple-900/60 text-purple-800 dark:text-purple-300',
        };
      case 'sembako':
        return {
          bg: 'bg-emerald-50 dark:bg-emerald-950/40',
          text: 'text-emerald-700 dark:text-emerald-400',
          border: 'border-emerald-200 dark:border-emerald-800',
          pill: 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300',
        };
      default:
        return {
          bg: 'bg-slate-50 dark:bg-slate-800',
          text: 'text-slate-700 dark:text-slate-300',
          border: 'border-slate-200 dark:border-slate-700',
          pill: 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200',
        };
    }
  };

  return (
    <section id="katalog" className="py-12 md:py-20 bg-slate-50/60 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading with Clarified Context */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 dark:bg-red-950/80 text-red-800 dark:text-red-300 text-xs font-bold tracking-wide border border-red-200 dark:border-red-900">
              <Sparkles className="w-3.5 h-3.5 text-red-600" />
              <span>Katalog Terverifikasi & Contoh Nyata</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Katalog UMKM Lingkungan Sekitar
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base max-w-2xl">
              Berikut adalah contoh terperinci profil usaha warga di sekitar kita: dari warung sarapan, jajanan malam, jamu herbal, jasa jahit, bengkel, laundry, hingga kerajinan anyaman dan toko sembako.
            </p>
          </div>

          <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 shrink-0 bg-white dark:bg-slate-800 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs">
            Menampilkan <span className="font-extrabold text-red-700 dark:text-red-400">{filteredItems.length}</span> dari {items.length} Contoh UMKM
          </div>
        </div>

        {/* Informative Guidance Banner for Clarity (Tetapkan Contoh Agar Jelas) */}
        <div className="bg-gradient-to-r from-red-900/90 via-red-800/95 to-slate-900 text-white rounded-2xl p-5 sm:p-6 mb-8 shadow-md border border-red-700/50">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
            <div className="space-y-1.5 max-w-3xl">
              <div className="flex items-center gap-2">
                <Info className="w-5 h-5 text-amber-300 shrink-0" />
                <h3 className="text-base sm:text-lg font-bold text-white">
                  Tolok Ukur Contoh UMKM Lokal
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                Setiap kartu di bawah ini telah dilengkapi <strong>foto autentik usaha</strong>, <strong>daftar produk & tarif transparan</strong>, <strong>jam buka</strong>, <strong>rating bintang dari warga</strong>, serta <strong>tombol pesan langsung ke WhatsApp</strong> pemilik usaha tanpa potongan komisi platform.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full lg:w-auto shrink-0">
              <div className="bg-white/10 backdrop-blur-xs p-2.5 rounded-xl border border-white/15 text-center">
                <span className="text-[10px] uppercase font-bold text-red-200 block">Kuliner</span>
                <span className="text-xs font-semibold text-white">3 Contoh</span>
              </div>
              <div className="bg-white/10 backdrop-blur-xs p-2.5 rounded-xl border border-white/15 text-center">
                <span className="text-[10px] uppercase font-bold text-blue-200 block">Jasa</span>
                <span className="text-xs font-semibold text-white">3 Contoh</span>
              </div>
              <div className="bg-white/10 backdrop-blur-xs p-2.5 rounded-xl border border-white/15 text-center">
                <span className="text-[10px] uppercase font-bold text-purple-200 block">Kerajinan</span>
                <span className="text-xs font-semibold text-white">2 Contoh</span>
              </div>
              <div className="bg-white/10 backdrop-blur-xs p-2.5 rounded-xl border border-white/15 text-center">
                <span className="text-[10px] uppercase font-bold text-emerald-200 block">Sembako</span>
                <span className="text-xs font-semibold text-white">2 Contoh</span>
              </div>
            </div>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="bg-white dark:bg-slate-800 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs mb-8 space-y-4">
          {/* Top row: Search input + Favorites toggle */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Cari nama warung, lontong, martabak, jamu, levis, bengkel, laundry, anyaman, atau beras..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-red-600 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  aria-label="Hapus kata kunci"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setOnlyFavorites(!onlyFavorites)}
                className={`inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold border transition-colors whitespace-nowrap ${
                  onlyFavorites
                    ? 'bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-400 border-red-300 dark:border-red-800'
                    : 'bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                }`}
              >
                <Heart className={`w-4 h-4 ${onlyFavorites ? 'fill-red-600 text-red-600' : ''}`} />
                <span>Langganan ({favorites.length})</span>
              </button>

              <a
                href={getShareCatalogUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors whitespace-nowrap shadow-xs"
                title="Bagikan katalog UMKM ini ke WhatsApp warga"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Bagikan ke WA</span>
              </a>
            </div>
          </div>

          {/* Bottom row: Category Tabs + Price Selector */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-700/80">
            {/* Category tabs */}
            <div className="flex flex-wrap items-center gap-1.5">
              {categoryPresets.map((c) => {
                const Icon = c.icon;
                const isSelected = selectedCategory === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCategory(c.id)}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
                      isSelected
                        ? 'bg-red-700 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-700/60 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {Icon && <Icon className="w-3.5 h-3.5" />}
                    <span>{c.label}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                        isSelected
                          ? 'bg-red-800 text-white'
                          : 'bg-white/80 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      {c.badge}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Price filter dropdown */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" />
                <span>Kisaran Tarif:</span>
              </span>
              <select
                value={priceTierFilter}
                onChange={(e) => setPriceTierFilter(e.target.value)}
                className="py-1.5 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-200 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-red-600"
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
          <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 p-8">
            <ShoppingBag className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <h4 className="text-base font-bold text-slate-900 dark:text-white mb-1">
              Tidak Ada UMKM yang Sesuai
            </h4>
            <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm max-w-md mx-auto">
              Tidak ditemukan contoh UMKM dengan kriteria pencarian "{searchQuery}" pada kategori ini.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('semua');
                setSearchQuery('');
                setPriceTierFilter('all');
                setOnlyFavorites(false);
              }}
              className="mt-4 px-4 py-2 text-xs font-bold text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950/60 rounded-xl hover:bg-red-100 transition-colors"
            >
              Reset Semua Filter & Tampilkan 10 Contoh
            </button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
            {filteredItems.map((item) => {
              const isFav = favorites.includes(item.id);
              const ratingData = ratingsMap[item.id] || { avg: item.averageRating || 5.0, count: item.reviewCount || 0 };
              const theme = getCategoryTheme(item.category);

              return (
                <div
                  key={item.id}
                  className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
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
                          (e.target as HTMLImageElement).src =
                            'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500&auto=format&fit=crop&q=80';
                        }}
                      />

                      {/* Dark overlay top bar for badge visibility */}
                      <div className="absolute inset-x-0 top-0 h-14 bg-gradient-to-b from-black/60 to-transparent pointer-events-none" />

                      {/* Favorite Button */}
                      <button
                        onClick={() => onToggleFavorite(item.id)}
                        aria-label={isFav ? 'Hapus dari langganan' : 'Simpan langganan'}
                        className="absolute top-3 right-3 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-sm transition-colors z-10"
                      >
                        <Heart className={`w-4 h-4 ${isFav ? 'fill-red-500 text-red-500' : ''}`} />
                      </button>

                      {/* Prominent Example Tag Badge */}
                      <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
                        {item.featuredBadge ? (
                          <span className="px-2.5 py-1 rounded-md bg-red-700 text-white text-[11px] font-bold tracking-wide shadow-sm flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            <span>{item.featuredBadge}</span>
                          </span>
                        ) : item.isCustomAdded ? (
                          <span className="px-2.5 py-1 rounded-md bg-emerald-700 text-white text-[11px] font-bold tracking-wide shadow-sm">
                            Daftaran Warga Baru
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-md bg-slate-900/80 text-white text-[11px] font-bold tracking-wide">
                            Contoh Terverifikasi
                          </span>
                        )}
                      </div>

                      {/* Operational status bottom-left */}
                      <div className="absolute bottom-2 left-3 px-2 py-0.5 rounded bg-black/60 backdrop-blur-xs text-white text-[10px] font-semibold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span>Buka Hari Ini</span>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-5">
                      {/* Category & Specialty Tag */}
                      <div className="flex items-center gap-2 text-xs font-semibold">
                        <span className={`px-2 py-0.5 rounded uppercase text-[10px] tracking-wider font-bold ${theme.pill}`}>
                          {item.category}
                        </span>
                        <span className="text-slate-400">·</span>
                        <span className="text-slate-600 dark:text-slate-300 text-xs truncate">
                          {item.specialtyTag}
                        </span>
                      </div>

                      {/* UMKM Name */}
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-2 group-hover:text-red-700 dark:group-hover:text-red-400 transition-colors line-clamp-1">
                        {item.name}
                      </h3>

                      {/* Rating & Review Summary Line */}
                      <div className="flex items-center justify-between mt-2.5 pt-2.5 border-t border-slate-100 dark:border-slate-700/60 text-xs">
                        <div className="flex items-center gap-1 text-amber-500 font-bold">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span className="tabular-nums">{ratingData.avg}</span>
                          <span className="text-[11px] font-normal text-slate-500 dark:text-slate-400">
                            ({ratingData.count} testimoni)
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => setActiveReviewUmkm(item)}
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-red-700 dark:text-red-400 hover:underline"
                        >
                          <MessageSquare className="w-3 h-3" />
                          <span>Beri Ulasan</span>
                        </button>
                      </div>

                      {/* Brief Description */}
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-2.5 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>

                      {/* Product Highlights Chips (Sample Menu/Tariff) */}
                      {item.menuHighlights && item.menuHighlights.length > 0 && (
                        <div className="mt-3">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                            Menu / Layanan Unggulan:
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {item.menuHighlights.slice(0, 3).map((hl, idx) => (
                              <span
                                key={idx}
                                className="inline-block text-[11px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700/60 text-slate-700 dark:text-slate-300"
                              >
                                {hl}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Location & Hours */}
                      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/60 space-y-1.5 text-xs text-slate-500 dark:text-slate-400">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-red-600 dark:text-red-400 shrink-0" />
                          <span className="truncate">{item.location}</span>
                          {item.distance && (
                            <span className="text-[10px] font-semibold text-slate-400 shrink-0">
                              ({item.distance})
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{item.operatingHours}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Bottom: Price + Detail & WhatsApp CTA Buttons */}
                  <div className="p-5 pt-0">
                    <div className="pt-3 border-t border-slate-100 dark:border-slate-700/60">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] uppercase font-bold text-slate-400">
                          Kisaran Tarif / Harga
                        </span>
                        <span className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white tabular-nums">
                          {item.priceRange}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setActiveDetailUmkm(item)}
                          className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-700/70 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Lihat Menu</span>
                        </button>

                        <a
                          href={getWhatsappUrl(item)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-colors"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>Hubungi WA</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Review & Rating Modal */}
      {activeReviewUmkm && (
        <UmkmReviewModal
          umkm={activeReviewUmkm}
          isOpen={true}
          onClose={() => setActiveReviewUmkm(null)}
          user={user}
          onReviewAdded={handleReviewAdded}
        />
      )}

      {/* Detailed Menu & Product Specification Modal */}
      {activeDetailUmkm && (
        <UmkmDetailModal
          umkm={activeDetailUmkm}
          isOpen={true}
          onClose={() => setActiveDetailUmkm(null)}
          isFavorite={favorites.includes(activeDetailUmkm.id)}
          onToggleFavorite={onToggleFavorite}
          onOpenReviewModal={(umkm) => {
            setActiveDetailUmkm(null);
            setActiveReviewUmkm(umkm);
          }}
          averageRating={ratingsMap[activeDetailUmkm.id]?.avg || activeDetailUmkm.averageRating || 5.0}
          reviewCount={ratingsMap[activeDetailUmkm.id]?.count || activeDetailUmkm.reviewCount || 0}
        />
      )}
    </section>
  );
};
