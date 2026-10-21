/**
 * App configuration & Official Domain URL
 * Tautan resmi yang dapat langsung diakses publik/warga tanpa perlu deploy ke Vercel
 */
export const OFFICIAL_APP_URL = 'https://ais-dev-wgvu7z54uul7dhbfyyzbxl-925129623634.asia-east1.run.app';

/**
 * Mendapatkan URL basis aplikasi secara dinamis.
 * Jika dibuka di browser yang sudah memiliki domain aktif, gunakan domain tersebut.
 * Jika di iframe dev, gunakan tautan Shared App resmi agar link yang dibagikan ke WhatsApp langsung dapat dibuka oleh siapa saja.
 */
export const getAppBaseUrl = (): string => {
  if (typeof window !== 'undefined') {
    const origin = window.location.origin;
    // Jika sedang di dev server atau localhost, prioritaskan tautan publik resmi agar link di WhatsApp bisa diakses orang lain
    if (origin.includes('localhost') || origin.includes('127.0.0.1') || origin.includes('ais-dev')) {
      return OFFICIAL_APP_URL;
    }
    return origin;
  }
  return OFFICIAL_APP_URL;
};
