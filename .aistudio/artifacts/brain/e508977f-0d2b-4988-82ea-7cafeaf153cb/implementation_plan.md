# LokalBangkit - Pancasila dalam Aksi Digital

Membangun platform digital gotong royong yang memberdayakan UMKM lokal lingkungan sekitar melalui katalog interaktif, filter multi-dimensi, kalkulator perputaran ekonomi lokal, dan formulir pendaftaran usaha mandiri dengan penyimpanan lokal berkelanjutan.

### User Review & Critical Decisions

> [!IMPORTANT]
> Ringkasan keputusan hasil klarifikasi pengguna:
> - **Alur Pendaftaran UMKM**: Pendaftaran baru langsung diterbitkan ke katalog dan tersimpan secara persisten pada `localStorage` browser pengguna, disertai penanda badge status "Terdaftar Baru".
> - **Peralatan Eksplorasi Katalog**: Pencarian instan kata kunci produk/nama usaha, tab filter kategori (Semua, Kuliner, Jasa, Kerajinan), serta filter rentang harga dan lokasi lingkungan.
> - **Fitur Interaktif Pancasila**: Kalkulator dampak ekonomi gotong royong (*Local Economic Multiplier Calculator*) yang mengilustrasikan seberapa besar dampak perputaran uang di lingkungan sekitar saat warga berbelanja di UMKM tetangga.

---

### 1. Overview & Core Concept

- **Apa Fungsinya**: Platform web interaktif yang mempertemukan warga dengan pelaku usaha mikro/kecil (warung makan, penjahit, perajin, jasa reparasi, dsb.) di sekitar tempat tinggal atau kampus. Platform ini menerjemahkan nilai luhur Pancasila (terutama Sila ke-5: Keadilan Sosial dan Sila ke-3: Persatuan Indonesia) menjadi aksi ekonomi riil melalui digitalisasi inklusif tanpa pungutan biaya.
- **Target Pengguna**: Warga sekitar, mahasiswa, dan pemuda yang ingin memprioritaskan belanja dari tetangga, serta pemilik UMKM tradisional yang memerlukan akses promosi digital langsung ke WhatsApp pelanggan.
- **Nilai Utama**: Akses promosi tanpa batas bagi usaha mikro tanpa potongan komisi, transparansi kontak langsung via WhatsApp dengan pesan otomatis yang ramah, serta edukasi gotong royong yang terukur melalui kalkulator sirkulasi ekonomi lokal.

---

### 2. User Experience & Visual Design

- **Struktur Halaman Utama (5 Bagian + Modul Interaktif)**:
  1. **Top Bar Header**: Mengikuti *Top Bar Contract* (1 baris, 3 zona): Wordmark brand `LokalBangkit` bersahaja di kiri; navigasi horizontal ringkas (`Beranda`, `Nilai Pancasila`, `Katalog UMKM`, `Dampak Nyata`, `Daftarkan UMKM`); aksi kanan berupa Toggle Tema (Terang/Gelap) dan tombol aksi cepat `+ Daftarkan Usaha`.
  2. **Hero Section**: Slogan kuat *"Beli dari Tetangga, Bangkitkan Ekonomi Bersama"*, visualisasi suasana pasar/warung lokal yang hangat, statistik nyata (total UMKM terdaftar, estimasi transaksi gotong royong), dan tombol aksi ganda menuju katalog atau pendaftaran.
  3. **Implementasi Nilai Pancasila**: Tiga pilar pengamalan konkret:
     - *Sila ke-5 (Keadilan Sosial)*: Akses promosi digital gratis setara untuk pedagang kecil.
     - *Sila ke-3 (Persatuan Indonesia)*: Gerakan gotong royong memprioritaskan konsumsi produk buatan tetangga.
     - *Sila ke-2 (Kemanusiaan yang Adil dan Beradab)*: Kepekaan dan empati terhadap kesejahteraan sesama masyarakat pekerja informal.
  4. **Kalkulator Dampak Gotong Royong (Interaktif)**: Pengguna dapat memasukkan nominal belanja bulanan di tetangga (misal: Rp 50.000 - Rp 1.000.000) untuk melihat simulasi efek pengganda ekonomi (*economic multiplier effect*) uang yang tetap berputar di lingkungan lokal dibanding lari ke luar daerah.
  5. **Katalog UMKM Interaktif**:
     - *Bilah Pencarian & Filter Terpadu*: Pencarian cepat nama/menu/jasa, segmented tab kategori (Semua, Kuliner, Jasa, Kerajinan), serta rentang perkiraan harga (Ekonomis < Rp 20.000, Menengah Rp 20.000–50.000, Premium/Custom > Rp 50.000).
     - *Kartu UMKM Berstandar Desain Tinggi*: Foto produk/usaha beresolusi tajam, metadata bersih tanpa kotak kapsul bertumpuk, deskripsi informatif, lokasi/kelurahan, jam operasional, kisaran harga dalam format rupiah, dan tombol langsung WhatsApp dengan template pesan tersusun rapi.
     - *Aksi Favorit / Simpan*: Kemampuan menandai UMKM langganan untuk akses cepat.
  6. **Formulir "Daftarkan UMKM Tetanggamu"**: Input nama usaha, kategori, no WhatsApp, alamat/patokan lokasi, perkiraan harga, deskripsi produk unggulan, dan foto representatif. Terdapat validasi format WhatsApp Indonesia (`08...` atau `628...`).
  7. **Footer**: Identitas proyek aksi sosial mahasiswa, pengingat etika gotong royong, tautan ke bagian utama, dan hak cipta.

- **Identitas Visual & Tipografi**:
  - *Aesthetic Direction*: Hangat, berakar budaya lokal (*civic warmth*), ramah, bersih, dan modern.
  - *Palet Warna (60-30-10)*:
    - Dominan Netral (60%): Canvas putih bersih `bg-slate-50` / dark obsidian `dark:bg-slate-900`.
    - Struktural (30%): Permukaan kartu bergaris tipis halus `border-slate-200 dark:border-slate-800`, teks abu gelap `text-slate-800 dark:text-slate-100`.
    - Aksen Merah-Putih & Zamrud (10%): Merah marun patriotik khas Indonesia (`#b91c1c` / `text-red-700`) untuk penegasan identitas dan tombol CTA; hijau WhatsApp (`#16a34a` / `bg-emerald-600`) khusus untuk tombol interaksi pelanggan.
  - *Tipografi*: Display elegan `Plus Jakarta Sans` berbobot tegas untuk tajuk utama; body teks bersahabat dengan kontras tinggi; angka rupiah dengan `tabular-nums` yang rapi.
  - *Desain Tanpa AI-Slop*: Bebas dari komentar kode mekanik, bebas dari lencana status palsu, metadata disajikan dengan pemisah tipografi titik tengah (`·`), dan tanpa border tebal sisi kiri.

---

### 3. Key Product Decisions & Trade-Offs

- **Penyimpanan Data Sederhana & Tahan Lama (Local State + LocalStorage)**:
  - *Pendekatan*: Inisialisasi awal dengan daftar UMKM sampel riil dan berkualitas (warung nasi uduk, penjahit, kerajinan anyaman bambu, bengkel motor, warung sembako, dsb.). Pendaftaran UMKM baru dari formulir langsung diintegrasikan ke state React dan disimpan ke `localStorage`.
  - *Alasan*: Menjamin aplikasi bekerja cepat dan tanpa delay server, sekaligus memungkinkan penilai dan pengguna menguji penambahan UMKM secara mandiri dengan hasil yang langsung tampil seketika.
- **Direct WhatsApp Messaging dengan Template Otomatis**:
  - *Pendekatan*: Pembuatan tautan `https://wa.me/62...` dengan teks salam pembuka terformat, menyebutkan nama usaha dan asal platform LokalBangkit agar pedagang merasa dihargai.
  - *Alasan*: Menghilangkan hambatan belanja warga tanpa perlu sistem checkout rumit yang membebani pedagang informal.
- **Kalkulator Multiplier Ekonomi Lokal**:
  - *Pendekatan*: Menghitung proporsi belanja yang bertahan di komunitas (menggunakan koefisien rata-rata sirkulasi lokal 68% vs 43% ritel korporat besar) untuk mempertegas pemahaman Sila ke-5 secara nyata.

---

### 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                              App.tsx                                   │
│   (Tema Dark/Light, State UMKM, Filter Query, Storage Synchronizer)   │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
    ┌───────────────────────────────┼──────────────────────────────┐
    ▼                               ▼                              ▼
┌──────────────────┐    ┌───────────────────────┐   ┌──────────────────────┐
│  Navbar & Theme  │    │      Hero Section     │   │   Pancasila Values   │
│  (Brand, Links,  │    │  (Slogan, Metrik CTA, │   │ (Sila 5, 3, 2 cards, │
│   Toggle Mode)   │    │   Visual Banner)      │   │   Multiplier Calc)   │
└──────────────────┘    └───────────────────────┘   └──────────────────────┘
                                    │
    ┌───────────────────────────────┴──────────────────────────────┐
    ▼                                                              ▼
┌──────────────────────────────────────┐        ┌──────────────────────────┐
│         Katalog UMKM Interaktif      │        │ Form Daftarkan UMKM Baru │
│ (Search, Filter Tabs, Range, Cards,  │        │ (Validasi WA, Preview,   │
│  Direct WA Action, Toast Notif)      │        │  LocalStorage Storage)   │
└──────────────────────────────────────┘        └──────────────────────────┘
```

- **Entitas Data `UMKM`**:
  - `id: string`
  - `name: string`
  - `category: 'kuliner' | 'jasa' | 'kerajinan' | 'sembako'`
  - `description: string`
  - `location: string`
  - `priceRange: string` (misal: `"Rp 12.000 - Rp 25.000"`)
  - `priceTier: 'ekonomis' | 'menengah' | 'premium'`
  - `whatsapp: string`
  - `imageUrl: string`
  - `featured?: boolean`
  - `createdAt: string`
  - `isCustomAdded?: boolean`

- **Interaktivitas & State Transitions**:
  - Filter reaktif instan saat mengetik di input pencarian atau memilih tombol kategori.
  - Form pendaftaran dengan feedback visual langsung (notifikasi toast sukses dan auto-scroll ke kartu UMKM baru di katalog).
  - Sinkronisasi mode tema terang/gelap pada elemen root `<html>` yang konsisten dengan preferensi sistem maupun tombol toggle pengguna.
