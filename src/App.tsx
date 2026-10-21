/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar, SectionId } from './components/Navbar';
import { Hero } from './components/Hero';
import { PancasilaValues } from './components/PancasilaValues';
import { EconomicMultiplierCalculator } from './components/EconomicMultiplierCalculator';
import { UmkmCatalog } from './components/UmkmCatalog';
import { RegisterUmkmForm } from './components/RegisterUmkmForm';
import { BangkitBotChat } from './components/BangkitBotChat';
import { Footer } from './components/Footer';
import { INITIAL_UMKM_LIST } from './data/initialUmkm';
import { UmkmItem } from './types';
import {
  ArrowLeft,
  ArrowRight,
  LayoutGrid,
  Layers,
  Home,
  BookOpen,
  Calculator,
  ShoppingBag,
  PlusCircle,
  Bot,
  Sparkles,
} from 'lucide-react';
import { auth, db, handleFirestoreError, OperationType, testFirestoreConnection } from './firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { collection, doc, setDoc, onSnapshot, getDocs } from 'firebase/firestore';

export default function App() {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        return savedTheme === 'dark';
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  const [activeSection, setActiveSection] = useState<SectionId>('beranda');
  const [viewMode, setViewMode] = useState<'separated' | 'all'>('separated');
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);

  const [umkmList, setUmkmList] = useState<UmkmItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('lokalbangkit_umkm');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            // Merge newly registered custom items with our updated canonical initial examples
            const customItems = parsed.filter(
              (item: UmkmItem) => item.isCustomAdded || !INITIAL_UMKM_LIST.some((init) => init.id === item.id)
            );
            return [...customItems, ...INITIAL_UMKM_LIST];
          }
        } catch (e) {
          console.error('Failed to parse saved UMKM list', e);
        }
      }
    }
    return INITIAL_UMKM_LIST;
  });

  const [favorites, setFavorites] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const savedFavs = localStorage.getItem('lokalbangkit_favs');
      if (savedFavs) {
        try {
          return JSON.parse(savedFavs);
        } catch (e) {
          console.error('Failed to parse favorites', e);
        }
      }
    }
    return [];
  });

  // Test connection & monitor Firebase Auth state
  useEffect(() => {
    testFirestoreConnection();

    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);

      if (currentUser) {
        try {
          // Sync user profile to Firestore
          const userDocRef = doc(db, 'users', currentUser.uid);
          await setDoc(
            userDocRef,
            {
              id: currentUser.uid,
              email: currentUser.email || '',
              displayName: currentUser.displayName || 'Warga Lokal',
              photoURL: currentUser.photoURL || '',
              createdAt: new Date().toISOString(),
            },
            { merge: true }
          );
        } catch (error) {
          console.warn('Could not sync user profile to Firestore:', error);
        }
      }
    });

    return () => unsubscribeAuth();
  }, []);

  // Sync UMKM with Firestore in real-time
  useEffect(() => {
    let unsubscribeFirestore: (() => void) | undefined;

    try {
      const umkmCol = collection(db, 'umkm');
      unsubscribeFirestore = onSnapshot(
        umkmCol,
        async (snapshot) => {
          if (!snapshot.empty) {
            const firestoreItems: UmkmItem[] = [];
            snapshot.forEach((docSnap) => {
              const data = docSnap.data() as UmkmItem;
              firestoreItems.push(data);
            });
            // Keep canonical examples updated while retaining any custom citizen registrations
            const canonicalIds = new Set(INITIAL_UMKM_LIST.map((i) => i.id));
            const customItems = firestoreItems.filter((i) => !canonicalIds.has(i.id));
            const merged = [...customItems, ...INITIAL_UMKM_LIST];
            setUmkmList(merged);
            localStorage.setItem('lokalbangkit_umkm', JSON.stringify(merged));
          } else {
            // First time seeding initial dataset to Firestore
            for (const item of INITIAL_UMKM_LIST) {
              try {
                await setDoc(doc(db, 'umkm', item.id), {
                  ...item,
                  authorId: 'sistem-lokalbangkit',
                  authorName: 'Tim Mahasiswa Gotong Royong',
                });
              } catch (e) {
                // Ignore seeding errors if permissions restrict write before auth
              }
            }
          }
        },
        (error) => {
          console.warn('Firestore snapshot notice (fallback to local state):', error.message);
        }
      );
    } catch (err) {
      console.warn('Failed to attach Firestore snapshot:', err);
    }

    return () => {
      if (unsubscribeFirestore) unsubscribeFirestore();
    };
  }, []);

  // Handle URL hash changes
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash === 'home' || hash === 'beranda') setActiveSection('beranda');
      else if (hash === 'pancasila') setActiveSection('pancasila');
      else if (hash === 'dampak') setActiveSection('dampak');
      else if (hash === 'katalog') setActiveSection('katalog');
      else if (hash === 'daftar') setActiveSection('daftar');
      else if (hash === 'asisten-ai') setActiveSection('asisten-ai');
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  // Sync theme changes with HTML document element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const handleToggleTheme = () => {
    setDarkMode((prev) => !prev);
  };

  const handleSelectSection = (section: SectionId) => {
    setActiveSection(section);
    window.location.hash = section === 'beranda' ? 'home' : section;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddUmkm = async (newItem: UmkmItem) => {
    // 1. Update local state immediately
    setUmkmList((prev) => {
      const updated = [newItem, ...prev.filter((p) => p.id !== newItem.id)];
      try {
        localStorage.setItem('lokalbangkit_umkm', JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to save to localStorage', e);
      }
      return updated;
    });

    // 2. Persist to Firestore
    try {
      await setDoc(doc(db, 'umkm', newItem.id), {
        ...newItem,
        authorId: user?.uid || 'warga-anonim',
        authorName: user?.displayName || user?.email || 'Warga Lingkungan',
      });
    } catch (error) {
      console.warn('Persisted locally. Firestore save returned:', error);
    }
  };

  const handleToggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      try {
        localStorage.setItem('lokalbangkit_favs', JSON.stringify(next));
      } catch (e) {
        console.error('Failed to save favorites to localStorage', e);
      }
      return next;
    });
  };

  const sectionsList: { id: SectionId; name: string; icon: React.ElementType }[] = [
    { id: 'beranda', name: '1. Beranda', icon: Home },
    { id: 'pancasila', name: '2. Nilai Pancasila', icon: BookOpen },
    { id: 'dampak', name: '3. Dampak Ekonomi', icon: Calculator },
    { id: 'katalog', name: '4. Katalog UMKM', icon: ShoppingBag },
    { id: 'daftar', name: '5. Daftarkan UMKM', icon: PlusCircle },
    { id: 'asisten-ai', name: '6. Asisten AI', icon: Bot },
  ];

  const currentIndex = sectionsList.findIndex((s) => s.id === activeSection);
  const prevSection = currentIndex > 0 ? sectionsList[currentIndex - 1] : null;
  const nextSection = currentIndex < sectionsList.length - 1 ? sectionsList[currentIndex + 1] : null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200 flex flex-col justify-between relative">
      <div>
        <Navbar
          darkMode={darkMode}
          onToggleTheme={handleToggleTheme}
          activeSection={activeSection}
          onSelectSection={handleSelectSection}
          user={user}
          authLoading={authLoading}
        />

        {/* Section Navigation Strip */}
        <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-16 z-40 shadow-xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              {/* Stepper Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
                {sectionsList.map((sec) => {
                  const Icon = sec.icon;
                  const isActive = activeSection === sec.id;
                  return (
                    <button
                      key={sec.id}
                      onClick={() => handleSelectSection(sec.id)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                        isActive
                          ? 'bg-red-700 text-white shadow-xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5 shrink-0" />
                      <span>{sec.name}</span>
                    </button>
                  );
                })}
              </div>

              {/* View Mode Toggle: Halaman Terpisah vs Mode Gulir Lengkap */}
              <div className="hidden lg:flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/90 rounded-lg text-xs font-medium self-end sm:self-auto shrink-0">
                <button
                  onClick={() => setViewMode('separated')}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md transition-colors ${
                    viewMode === 'separated'
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-bold'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                  title="Tampilkan satu section per halaman secara terpisah"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Halaman Terpisah</span>
                </button>
                <button
                  onClick={() => setViewMode('all')}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md transition-colors ${
                    viewMode === 'all'
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-bold'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                  title="Tampilkan semua section sekaligus (scroll)"
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span>Mode Gulir Lengkap</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <main className="min-h-[60vh]">
          {viewMode === 'separated' ? (
            /* SEPARATED SECTION VIEW */
            <div>
              {activeSection === 'beranda' && (
                <div>
                  <Hero totalUmkmCount={umkmList.length} onNavigate={handleSelectSection} />

                  {/* Quick Section Directory Jump Cards on Home */}
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
                    <div className="border-t border-slate-200 dark:border-slate-800 pt-10">
                      <div className="text-center max-w-xl mx-auto mb-8">
                        <span className="text-xs font-bold uppercase tracking-wider text-red-700 dark:text-red-400">
                          Jelajahi Bagian
                        </span>
                        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
                          Pilihan Halaman Platform
                        </h2>
                      </div>

                      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                        <button
                          onClick={() => handleSelectSection('pancasila')}
                          className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-left hover:border-red-600 dark:hover:border-red-500 hover:shadow-md transition-all group"
                        >
                          <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                            <BookOpen className="w-5 h-5" />
                          </div>
                          <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                            Nilai Pancasila
                          </h3>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            Aksi konkret Sila 5, Sila 3, & Sila 2.
                          </p>
                        </button>

                        <button
                          onClick={() => handleSelectSection('dampak')}
                          className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-left hover:border-red-600 dark:hover:border-red-500 hover:shadow-md transition-all group"
                        >
                          <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                            <Calculator className="w-5 h-5" />
                          </div>
                          <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                            Dampak Ekonomi
                          </h3>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            Hitung perputaran rupiah lokal & komitmen warga.
                          </p>
                        </button>

                        <button
                          onClick={() => handleSelectSection('katalog')}
                          className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-left hover:border-red-600 dark:hover:border-red-500 hover:shadow-md transition-all group"
                        >
                          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                            <ShoppingBag className="w-5 h-5" />
                          </div>
                          <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                            Katalog UMKM
                          </h3>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            Pedagang, perajin, & jasa WhatsApp langsung.
                          </p>
                        </button>

                        <button
                          onClick={() => handleSelectSection('daftar')}
                          className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-left hover:border-red-600 dark:hover:border-red-500 hover:shadow-md transition-all group"
                        >
                          <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                            <PlusCircle className="w-5 h-5" />
                          </div>
                          <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                            Daftarkan UMKM
                          </h3>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            Bantu daftarkan usaha tetangga secara gratis.
                          </p>
                        </button>

                        <button
                          onClick={() => handleSelectSection('asisten-ai')}
                          className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-left hover:border-red-600 dark:hover:border-red-500 hover:shadow-md transition-all group"
                        >
                          <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                            <Bot className="w-5 h-5" />
                          </div>
                          <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                            BangkitBot (AI)
                          </h3>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            Konsultan UMKM & data Google Search live.
                          </p>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'pancasila' && <PancasilaValues />}

              {activeSection === 'dampak' && (
                <EconomicMultiplierCalculator user={user} />
              )}

              {activeSection === 'katalog' && (
                <UmkmCatalog
                  items={umkmList}
                  favorites={favorites}
                  onToggleFavorite={handleToggleFavorite}
                  user={user}
                />
              )}

              {activeSection === 'daftar' && (
                <RegisterUmkmForm
                  onAddUmkm={handleAddUmkm}
                  onNavigate={handleSelectSection}
                  user={user}
                />
              )}

              {activeSection === 'asisten-ai' && <BangkitBotChat />}

              {/* Section Stepper / Bottom Pagination */}
              <div className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
                  {prevSection ? (
                    <button
                      onClick={() => handleSelectSection(prevSection.id)}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Kembali ke: {prevSection.name}</span>
                    </button>
                  ) : (
                    <div />
                  )}

                  {nextSection ? (
                    <button
                      onClick={() => handleSelectSection(nextSection.id)}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-700 hover:bg-red-800 text-white text-xs font-bold shadow-sm transition-colors"
                    >
                      <span>Lanjut ke: {nextSection.name}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={() => handleSelectSection('beranda')}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-700 hover:bg-red-800 text-white text-xs font-bold shadow-sm transition-colors"
                    >
                      <Home className="w-4 h-4" />
                      <span>Kembali ke Beranda Utama</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* ALL SECTIONS COMBINED (Continuous Scroll) */
            <div>
              <Hero totalUmkmCount={umkmList.length} onNavigate={handleSelectSection} />
              <PancasilaValues />
              <EconomicMultiplierCalculator user={user} />
              <UmkmCatalog
                items={umkmList}
                favorites={favorites}
                onToggleFavorite={handleToggleFavorite}
                user={user}
              />
              <RegisterUmkmForm
                onAddUmkm={handleAddUmkm}
                onNavigate={handleSelectSection}
                user={user}
              />
              <BangkitBotChat />
            </div>
          )}
        </main>
      </div>

      {/* Floating Quick BangkitBot Button for any page */}
      {activeSection !== 'asisten-ai' && (
        <button
          onClick={() => handleSelectSection('asisten-ai')}
          className="fixed bottom-6 right-6 z-50 p-3.5 rounded-full bg-red-700 hover:bg-red-800 text-white shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
          title="Tanya BangkitBot (AI Konsultan)"
        >
          <Bot className="w-5 h-5" />
          <span className="text-xs font-bold hidden sm:inline">Tanya BangkitBot</span>
        </button>
      )}

      <Footer onSelectSection={handleSelectSection} />
    </div>
  );
}
