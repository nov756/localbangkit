import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Google GenAI with User-Agent header for aistudio-build
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// System instruction for BangkitBot
const BANGKIT_BOT_SYSTEM_INSTRUCTION = `Anda adalah BangkitBot, konsultan pemberdayaan UMKM lokal dan asisten cerdas aksi nyata Pancasila di platform LokalBangkit.
Tugas utama Anda:
1. Membantu warga menemukan ide usaha mikro atau cara mendukung UMKM tetangga di lingkungan sekitar.
2. Memberikan saran praktis pengembangan usaha rumahan (kuliner, jasa permak/servis, kerajinan lokal, sembako).
3. Menjelaskan secara hangat bagaimana berbelanja di tetangga mengamalkan Sila ke-5 (Keadilan Sosial) dan Sila ke-3 (Persatuan Indonesia) melalui perputaran ekonomi lokal (multiplier effect).
4. Menjawab pertanyaan tentang tren pasar, kisaran harga komoditas terkini di Indonesia dengan data Google Search yang akurat.
Gunakan bahasa Indonesia yang santun, ramah, bersahaja, dan penuh semangat gotong royong.`;

// Multi-turn Chat API with Google Search Grounding
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, message } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Pesan pengguna harus diisi' });
    }

    // Convert client message history into Gemini Content format
    const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

    if (Array.isArray(messages)) {
      for (const m of messages) {
        if (m.text && (m.role === 'user' || m.role === 'model')) {
          contents.push({
            role: m.role,
            parts: [{ text: m.text }],
          });
        }
      }
    }

    // Add current user message
    contents.push({
      role: 'user',
      parts: [{ text: message }],
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction: BANGKIT_BOT_SYSTEM_INSTRUCTION,
        tools: [{ googleSearch: {} }],
      },
    });

    const replyText = response.text || 'Maaf, saya belum dapat memproses jawaban saat ini.';

    // Extract search grounding sources if present
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const searchSources: Array<{ title: string; url: string }> = [];

    for (const chunk of groundingChunks) {
      if (chunk.web?.uri && chunk.web?.title) {
        searchSources.push({
          title: chunk.web.title,
          url: chunk.web.uri,
        });
      }
    }

    return res.json({
      reply: replyText,
      searchSources,
    });
  } catch (error: any) {
    console.error('Error calling Gemini chat API:', error);

    // If quota exceeded or temporary network issue, provide an intelligent expert fallback
    const userPrompt = req.body?.message?.toLowerCase() || '';
    let fallbackReply = 'Sebagai konsultan UMKM LokalBangkit, saya merekomendasikan untuk memprioritaskan 3 pilar gotong royong: (1) Jaga kualitas rasa dan kebersihan produk, (2) Gunakan promosi WhatsApp status dan grup RT/RW tetangga tanpa perantara, dan (3) Terapkan harga wajar yang saling mensejahterakan warga.';

    if (userPrompt.includes('nasi') || userPrompt.includes('makan') || userPrompt.includes('kuliner') || userPrompt.includes('warung')) {
      fallbackReply = 'Untuk mempromosikan warung makan/kuliner rumahan di tetangga: \n\n1. **Kekuatan WhatsApp Status & Grup Warga**: Foto makanan saat masih hangat (misal: nasi uduk jam 6 pagi saat warga berangkat kerja/sekolah). Tulis menu hari ini dan tawarkan pesan antar radius 500m gratis.\n2. **Paket Hemat Tetangga**: Buat paket sarapan hemat (misal: Nasi Uduk + Telur Balado + Teh Hangat Rp 15.000).\n3. **Prinsip Keadilan Sosial (Sila ke-5)**: Transparansi harga tanpa biaya tambahan, dan sediakan porsi berkah di hari Jumat.';
    } else if (userPrompt.includes('jahit') || userPrompt.includes('permak') || userPrompt.includes('jasa')) {
      fallbackReply = 'Untuk jasa permak atau penjahit lokal: \n\n1. **Kecepatan & Kerapian**: Tawarkan layanan permak kilat 1-2 jam untuk potong celana atau ganti resleting.\n2. **Tanda Terima Jelas**: Informasikan estimasi biaya di depan lewat WhatsApp sebelum dikerjakan agar pelanggan tetangga merasa tenang.\n3. **Jemput Antar**: Untuk tetangga satu kompleks atau perumahan, berikan kemudahan jemput cucian/pakaian.';
    } else if (userPrompt.includes('pancasila') || userPrompt.includes('sila') || userPrompt.includes('keadilan')) {
      fallbackReply = 'Kaitan belanja di tetangga dengan Pancasila sangat erat:\n\n• **Sila ke-5 (Keadilan Sosial)**: Membeli langsung dari pedagang kecil memastikan keuntungan dinikmati langsung oleh keluarga pekerja, bukan tersedot oleh dividen korporasi multinasional.\n• **Sila ke-3 (Persatuan Indonesia)**: Interaksi jual beli antartetangga mempererat tali silaturahmi dan gotong royong di tingkat akar rumput.';
    } else if (userPrompt.includes('harga') || userPrompt.includes('pasar') || userPrompt.includes('tren')) {
      fallbackReply = 'Tren pasar UMKM Indonesia saat ini: produk makanan siap santap higienis, kerajinan ramah lingkungan, dan jasa servis mikro rumahan tetap menjadi kebutuhan primer yang stabil. Utamakan kepastian rasa dan kemudahan pemesanan via WhatsApp langsung.';
    }

    return res.json({
      reply: `${fallbackReply}\n\n*(Catatan: Mode siaga aktif — respon disajikan dari panduan lokal pemberdayaan UMKM).*`,
      searchSources: [
        {
          title: 'Kementerian Koperasi dan UKM RI',
          url: 'https://kemenkopukm.go.id',
        },
        {
          title: 'Direktori Gotong Royong LokalBangkit',
          url: 'https://lokalbangkit.id',
        },
      ],
    });
  }
});

// Market insight / search grounding API endpoint
app.post('/api/market-insights', async (req, res) => {
  try {
    const { topic } = req.body;
    const prompt = topic
      ? `Berikan ringkasan tren pasar terkini, kisaran harga wajar, dan tips peluang usaha untuk topik: "${topic}" di Indonesia saat ini. Berikan fakta terkini.`
      : 'Berikan 3 tren produk UMKM lokal terlaris dan paling dicari warga di Indonesia bulan ini beserta kisaran modal awalnya.';

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: 'Anda adalah analis pasar UMKM Indonesia. Berikan informasi ringkas, berbasis data terkini dengan Google Search, dan mudah dipahami oleh pedagang kecil.',
        tools: [{ googleSearch: {} }],
      },
    });

    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const searchSources = groundingChunks
      .filter((c: any) => c.web?.uri)
      .map((c: any) => ({
        title: c.web.title || 'Sumber Informasi Pasar',
        url: c.web.uri,
      }));

    return res.json({
      insight: response.text,
      sources: searchSources,
    });
  } catch (error: any) {
    console.error('Error getting market insights:', error);
    return res.status(500).json({
      error: 'Gagal memuat wawasan pasar terkini.',
      details: error?.message,
    });
  }
});

// Mount Vite or serve static
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`LokalBangkit server running at http://localhost:${PORT}`);
  });
}

startServer();
