const fs = require('fs');

const assembled = JSON.parse(fs.readFileSync('c:/project/portfolio/.ua/intermediate/assembled-graph.json', 'utf8'));
const allNodeIds = new Set(assembled.nodes.map(n => n.id));

const tour = [
  {
    "order": 1,
    "title": "Ikhtisar Proyek & Pengenalan",
    "description": "Memulai dengan README dan konfigurasi proyek untuk memahami tujuan aplikasi portofolio personal dan dependensi utamanya.",
    "nodeIds": [
      "document:README.md",
      "config:package.json"
    ]
  },
  {
    "order": 2,
    "title": "Titik Masuk & Tata Letak Aplikasi",
    "description": "Menjelajahi root layout dan halaman beranda utama (App Router) yang memuat gaya Tailwind CSS dan struktur navigasi global.",
    "nodeIds": [
      "file:app/layout.js",
      "file:app/page.js",
      "file:app/globals.css"
    ]
  },
  {
    "order": 3,
    "title": "Antarmuka & Komponen Interaktif Beranda",
    "description": "Komponen visual interaktif seperti Hero banner, galeri Projects, riwayat Experience, dan animasi partikel latar belakang.",
    "nodeIds": [
      "file:app/components/Hero.jsx",
      "file:app/components/Projects.jsx",
      "file:app/components/Experience.jsx",
      "file:app/components/AnimatedBackground.jsx"
    ]
  },
  {
    "order": 4,
    "title": "Katalog & Detail Artikel Blog",
    "description": "Arsitektur fitur blog yang mencakup halaman daftar artikel, filter kategori, dan halaman artikel dinamis berbasis slug.",
    "nodeIds": [
      "file:app/blog/page.tsx",
      "file:app/blog/[slug]/page.tsx",
      "file:app/data/blogData.js"
    ]
  },
  {
    "order": 5,
    "title": "Sistem Komentar & Reaksi Pengunjung",
    "description": "Integrasi pembaca interaktif untuk mengirim komentar dan reaksi emotikon menggunakan klien Supabase serta pelacakan sesi unik.",
    "nodeIds": [
      "file:app/components/CommentSection.tsx",
      "file:app/components/ReactionBar.tsx",
      "file:lib/supabase/client.ts"
    ]
  },
  {
    "order": 6,
    "title": "Moderasi Komentar & Dashboard Admin",
    "description": "Alur kerja validasi keamanan dan anti-spam Server Actions, deteksi kata toksik Zod, serta panel admin moderasi berproteksi passcode.",
    "nodeIds": [
      "file:app/actions/comments.ts",
      "file:app/actions/admin.ts",
      "file:lib/utils/moderation.ts",
      "file:app/admin/comments/page.tsx"
    ]
  },
  {
    "order": 7,
    "title": "Sistem Maskot Interaktif & Pipeline Gambar",
    "description": "Implementasi maskot chibi pelacak pointer mouse dan rangkaian skrip otomatisasi pemrosesan sprite sheet atlas.",
    "nodeIds": [
      "file:.agents/skills/page-mascot/mascot.tsx",
      "document:.agents/skills/page-mascot/SKILL.md",
      "file:.agents/skills/page-mascot/scripts/mascot.py"
    ]
  }
];

for (const step of tour) {
  for (const id of step.nodeIds) {
    if (!allNodeIds.has(id)) {
      console.error(`Tour step ${step.order} references missing node: ${id}`);
    }
  }
}

fs.writeFileSync('c:/project/portfolio/.ua/intermediate/tour.json', JSON.stringify(tour, null, 2));
console.log(`Validated and wrote tour with ${tour.length} steps.`);
