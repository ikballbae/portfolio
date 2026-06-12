import { z } from 'zod';

// Zod Schema untuk Validasi Awal
export const CommentSchema = z.object({
  author_name: z.string().min(2, "Nama minimal 2 karakter").max(50, "Nama maksimal 50 karakter"),
  content: z.string().min(5, "Komentar minimal 5 karakter").max(1000, "Komentar maksimal 1000 karakter"),
  article_slug: z.string().min(1),
});

// Daftar Regex Berbahaya / Spam
const BLOCK_PATTERNS = [
  // Link & Domain (http, https, www, .com, .id, dll)
  /(https?:\/\/[^\s]+)/i,
  /(www\.[^\s]+)/i,
  /[a-zA-Z0-9\-\.]+\.(com|id|net|org|xyz|io|co|me|info)/i,
  
  // Script / XSS Injection
  /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/i,
  /javascript:/i,
  /eval\(/i,
  /on(load|click|error|mouseover|submit)=/i,
  /<[^>]+>/i, // Blokir semua tag HTML dasar
  
  // SQL Injection
  /\b(SELECT|INSERT|UPDATE|DELETE|DROP TABLE|UNION SELECT|ALTER TABLE)\b/i,
  /--\s*$/i, // SQL Comment
  
  /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/i,
  /(\+62|62|08)[0-9]{8,12}/i,
];

export const TOXIC_WORDS = [
  // Indonesian - Makian Hewan & Umum
  'anjing', 'babi', 'monyet', 'bangsat', 'bajingan', 'kampret', 'asu',
  'jancok', 'dancok', 'pantek', 'brengsek', 'keparat', 'taik', 'tai',
  
  // Indonesian - Umpatan Seksual, Kasar & Konteks X (Twitter)
  'kontol', 'memek', 'ngentot', 'jembut', 'peler', 'pepek', 'pukimak',
  'lonte', 'pelacur', 'perek', 'jablay', 'binal', 'open bo', 'smean',
  
  // Indonesian - Hinaan Intelektual, Fisik & Mental
  'tolol', 'bego', 'goblok', 'idiot', 'dungu', 'sinting', 'sarap', 
  'autis', 'skizo', 'cacat', 'bisu', 'budek', 'pincang', 'tidak berguna', 

  // Kata Sifat Negatif / Nyinyir
  'males', 'kasihan', 'nyolot', 'jelek', 'terpaksa', 

  // Filter Sentimen AI, Politik & Tokoh
  'ai', 'vibe coding', 'bias', 'jokowi', 'prabowo', 'mbg', 'fufufafa', 
  'mulyono', 'anis', 'ganjar', 'cebong', 'kadrun', 'buzzerp',

  // Internet Slang, Toxic X/Sosmed & Cyberbullying (Trending)
  'sdm rendah', 'ndasmu', 'bocil epep', 'bocil kematian', 'anak dajjal',
  'jamet', 'ngabers', 'cringe', 'pick me', 'caper', 'pansos', 'menyala abangkuh',
  
  // Tech & Coding Memes / Ejekan Programmer
  'script kiddie', 'programmer indosiar', 'kuli ketik', 'spaghetti code',
  'copas', 'hasil chatgpt', 'kodingan ai', 'skill issue', 'rtfm', 'noob',
  'error 404 otak not found', 'inspect element', 'sipaling koding',

  // English - General Profanity
  'fuck', 'fck', 'fcking', 'motherfucker', 'shit', 'bullshit', 'crap',
  'bitch', 'asshole', 'bastard', 'douchebag', 'jackass', 'wanker',
  
  // English - Sexual & Anatomical Insults
  'cunt', 'dick', 'pussy', 'cock', 'twat', 'prick', 'slut', 'whore',
  
  // English - Intellectual Insults
  'dumbass', 'moron', 'stupid', 'dipshit', 'retard'
];

// Opsional: Fungsi bantuan untuk mengecek teks
export function containsToxicWords(text: string): boolean {
  if (!text) return false;
  
  // Ubah teks ke lowercase untuk pengecekan yang lebih akurat
  const normalizedText = text.toLowerCase();
  
  // Cek apakah ada kata toxic yang muncul di dalam teks
  return TOXIC_WORDS.some(word => {
    // Menggunakan regex word boundary (\b) agar tidak salah deteksi kata yang mirip
    // Contoh: mencegah "analisis" terdeteksi hanya karena mengandung kata tertentu
    const regex = new RegExp(`\\b${word}\\b`, 'i');
    return regex.test(normalizedText);
  });
}

export type ModerationResult = {
  status: 'approved' | 'pending' | 'rejected';
  reason: string | null;
};

/**
 * Fungsi moderasi utama untuk mengecek konten komentar.
 */
export function moderateComment(content: string, authorName: string): ModerationResult {
  const textToCheck = `${authorName} ${content}`.toLowerCase();

  // 1. Cek Pola Berbahaya (Links, Scripts, SQLi, Spam)
  for (const pattern of BLOCK_PATTERNS) {
    if (pattern.test(textToCheck)) {
      return {
        status: 'rejected',
        reason: 'Mengandung link, kontak pribadi, atau script berbahaya.',
      };
    }
  }

  // 2. Cek Kata-kata Kasar / Toxic
  for (const word of TOXIC_WORDS) {
    if (textToCheck.includes(word)) {
      return {
        status: 'rejected',
        reason: 'Mengandung kata-kata yang melanggar pedoman komunitas.',
      };
    }
  }

  // 3. Cek Pola Mencurigakan (Misal: Terlalu banyak huruf kapital, spam karakter)
  const spamCharRegex = /(.)\1{4,}/; // Karakter yang diulang 5 kali (contoh: aaaaa)
  if (spamCharRegex.test(textToCheck)) {
    return {
      status: 'pending',
      reason: 'Pola karakter mencurigakan (Spam).',
    };
  }

  // Jika aman
  return {
    status: 'approved',
    reason: null,
  };
}
