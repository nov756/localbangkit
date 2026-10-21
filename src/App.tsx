/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { PancasilaValues } from './components/PancasilaValues';
import { EconomicMultiplierCalculator } from './components/EconomicMultiplierCalculator';
import { UmkmCatalog } from './components/UmkmCatalog';
import { RegisterUmkmForm } from './components/RegisterUmkmForm';
import { Footer } from './components/Footer';
import { INITIAL_UMKM_LIST } from './data/initialUmkm';
import { UmkmItem } from './types';

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

  const [umkmList, setUmkmList] = useState<UmkmItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('lokalbangkit_umkm');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
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

  const handleAddUmkm = (newItem: UmkmItem) => {
    setUmkmList((prev) => {
      const updated = [newItem, ...prev];
      try {
        localStorage.setItem('lokalbangkit_umkm', JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to save to localStorage', e);
      }
      return updated;
    });
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

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200">
      <Navbar darkMode={darkMode} onToggleTheme={handleToggleTheme} />
      <main>
        <Hero totalUmkmCount={umkmList.length} />
        <PancasilaValues />
        <EconomicMultiplierCalculator />
        <UmkmCatalog
          items={umkmList}
          favorites={favorites}
          onToggleFavorite={handleToggleFavorite}
        />
        <RegisterUmkmForm onAddUmkm={handleAddUmkm} />
      </main>
      <Footer />
    </div>
  );
}
