const fs = require('fs');
const path = require('path');

const uaDir = 'c:/project/portfolio/.ua';
const intermediateDir = path.join(uaDir, 'intermediate');
const tmpDir = path.join(uaDir, 'tmp');

const batchesData = JSON.parse(fs.readFileSync(path.join(intermediateDir, 'batches.json'), 'utf8'));

// Indonesian descriptions & tags mapping
const fileMetadata = {
  "app/components/About.jsx": {
    type: "file",
    summary: "Komponen Tentang Saya yang menyajikan bio profesional, fokus keahlian, dan statistik portofolio.",
    tags: ["component", "about", "portfolio", "ui"],
    complexity: "moderate"
  },
  "app/components/Contact.jsx": {
    type: "file",
    summary: "Komponen kontak interaktif yang memfasilitasi komunikasi pengunjung dengan formulir dan tautan media sosial.",
    tags: ["component", "contact", "form", "ui"],
    complexity: "moderate"
  },
  "app/components/Experience.jsx": {
    type: "file",
    summary: "Komponen linimasa pengalaman kerja dan peran profesional dengan animasi transisi interaktif.",
    tags: ["component", "experience", "timeline", "career"],
    complexity: "moderate"
  },
  "app/components/GradientMesh.jsx": {
    type: "file",
    summary: "Komponen visualisasi grafis latar belakang berupa jaring gradien dan blueprint grid dinamis.",
    tags: ["component", "graphics", "canvas", "animation"],
    complexity: "simple"
  },
  "app/components/Hero.jsx": {
    type: "file",
    summary: "Komponen landing banner utama yang menampilkan salam pembuka, pengantar keahlian, dan tombol panggilan aksi.",
    tags: ["entry-point", "hero", "component", "ui"],
    complexity: "complex"
  },
  "app/components/LearningJourney.jsx": {
    type: "file",
    summary: "Komponen kartu perjalanan belajar teknologi, kursus, dan sertifikasi profesional.",
    tags: ["component", "learning", "education", "ui"],
    complexity: "moderate"
  },
  "app/components/MagneticButton.jsx": {
    type: "file",
    summary: "Komponen tombol interaktif berbasis efek magnetik yang dinamis mengikuti pergerakan kursor.",
    tags: ["component", "button", "animation", "interactive"],
    complexity: "simple"
  },
  "app/components/Projects.jsx": {
    type: "file",
    summary: "Komponen galeri proyek unggulan dengan filter teknologi, pratinjau antarmuka, dan tautan demo.",
    tags: ["component", "projects", "showcase", "portfolio"],
    complexity: "complex"
  },
  "app/components/ScrambleText.jsx": {
    type: "file",
    summary: "Komponen utilitas teks acak (scramble/decoder effect) dengan animasi karakter saat dimuat.",
    tags: ["component", "utility", "animation", "text"],
    complexity: "moderate"
  },
  "app/components/ScrollReveal.jsx": {
    type: "file",
    summary: "Komponen pembungkus animasi berbasis scroll viewport yang menggunakan integrasi Framer Motion.",
    tags: ["component", "animation", "scroll", "motion"],
    complexity: "complex"
  },
  "app/components/TechStack.jsx": {
    type: "file",
    summary: "Komponen tampilan daftar teknologi, bahasa pemrograman, dan alat pengembangan yang dikuasai.",
    tags: ["component", "skills", "tech-stack", "ui"],
    complexity: "moderate"
  },
  "app/page.js": {
    type: "file",
    summary: "Halaman beranda utama yang mengintegrasikan seluruh seksi konten portofolio dalam satu tampilan terpadu.",
    tags: ["entry-point", "page", "portfolio", "nextjs"],
    complexity: "simple"
  },
  "app/blog/[slug]/page.tsx": {
    type: "file",
    summary: "Halaman detail artikel blog dinamis berbasis Next.js App Router dengan integrasi komentar dan reaksi.",
    tags: ["entry-point", "blog", "page", "dynamic-route"],
    complexity: "complex"
  },
  "app/components/ArticleMetrics.tsx": {
    type: "file",
    summary: "Komponen pelacak statistik dan metrik interaksi pembaca artikel blog berbasis Supabase.",
    tags: ["component", "metrics", "analytics", "blog"],
    complexity: "moderate"
  },
  "app/components/Blog.jsx": {
    type: "file",
    summary: "Komponen cuplikan artikel blog terbaru yang ditampilkan pada halaman beranda portofolio.",
    tags: ["component", "blog", "showcase", "ui"],
    complexity: "complex"
  },
  "app/components/CommentItem.tsx": {
    type: "file",
    summary: "Komponen kartu tampilan komentar pembaca individu dengan format tanggal dan lencana nama.",
    tags: ["component", "comment", "blog", "ui"],
    complexity: "moderate"
  },
  "app/components/CommentSection.tsx": {
    type: "file",
    summary: "Bagian interaktif pengiriman komentar dan daftar tanggapan pembaca yang terhubung ke Supabase.",
    tags: ["component", "comments", "supabase", "form"],
    complexity: "complex"
  },
  "app/components/ReactionBar.tsx": {
    type: "file",
    summary: "Bilah reaksi emotikon interaktif untuk artikel blog dengan dukungan persistensi data Supabase.",
    tags: ["component", "reactions", "interactive", "supabase"],
    complexity: "complex"
  },
  "app/components/ShareMenu.jsx": {
    type: "file",
    summary: "Menu popover untuk membagikan tautan artikel blog ke berbagai platform jejaring sosial.",
    tags: ["component", "share", "social", "popover"],
    complexity: "moderate"
  },
  "app/data/blogData.js": {
    type: "file",
    summary: "Data sumber statis artikel blog lengkap dengan fungsi utilitas pencarian berdasarkan slug dan kategori.",
    tags: ["data-model", "blog", "mock-data", "utility"],
    complexity: "complex"
  },
  "lib/supabase/client.ts": {
    type: "file",
    summary: "Inisialisasi klien Supabase sisi browser untuk interaksi database publik dan realtime.",
    tags: ["utility", "database", "supabase", "client"],
    complexity: "simple"
  },
  "lib/utils/session.ts": {
    type: "file",
    summary: "Utilitas manajemen ID sesi pengunjung unik untuk melacak reaksi dan komentar anonim.",
    tags: ["utility", "session", "client", "tracking"],
    complexity: "simple"
  },
  "app/blog/page.tsx": {
    type: "file",
    summary: "Halaman katalog utama artikel blog yang menyediakan fitur pencarian, penyaringan kategori, dan pagination.",
    tags: ["entry-point", "blog", "page", "search"],
    complexity: "complex"
  },
  "app/components/blog/BlogEmptyState.tsx": {
    type: "file",
    summary: "Komponen placeholder visual ketika pencarian artikel tidak menemukan kecocokan data.",
    tags: ["component", "blog", "ui", "empty-state"],
    complexity: "simple"
  },
  "app/components/blog/BlogHeader.tsx": {
    type: "file",
    summary: "Komponen header katalog blog yang menyajikan judul, subjudul, dan navigasi balik.",
    tags: ["component", "blog", "header", "ui"],
    complexity: "simple"
  },
  "app/components/blog/CategoryFilter.tsx": {
    type: "file",
    summary: "Komponen bilah navigasi tab untuk memfilter posting blog berdasarkan topik atau kategori pilihan.",
    tags: ["component", "blog", "filter", "navigation"],
    complexity: "moderate"
  },
  "app/components/blog/FeaturedPost.tsx": {
    type: "file",
    summary: "Komponen kartu sorotan artikel utama yang menampilkan artikel unggulan di baris teratas blog.",
    tags: ["component", "blog", "featured", "card"],
    complexity: "moderate"
  },
  "app/components/blog/PostCard.tsx": {
    type: "file",
    summary: "Komponen kartu pratinjau artikel blog standar dengan gambar thumbnail, judul, dan estimasi waktu baca.",
    tags: ["component", "blog", "card", "ui"],
    complexity: "moderate"
  },
  "app/components/blog/PostCardSkeleton.tsx": {
    type: "file",
    summary: "Komponen placeholder skeleton untuk memberikan umpan balik animasi selama pemuatan daftar artikel.",
    tags: ["component", "skeleton", "loading", "ui"],
    complexity: "simple"
  },
  "app/components/blog/ShareButton.tsx": {
    type: "file",
    summary: "Tombol aksi cepat untuk membagikan tautan artikel atau menyalin URL ke papan klip.",
    tags: ["component", "share", "button", "clipboard"],
    complexity: "simple"
  },
  "app/actions/admin.ts": {
    type: "file",
    summary: "Server Actions Next.js yang menangani query, pembaruan status persetujuan, dan penghapusan komentar admin.",
    tags: ["api-handler", "server-actions", "admin", "supabase"],
    complexity: "moderate"
  },
  "app/actions/comments.ts": {
    type: "file",
    summary: "Server Actions untuk memproses validasi komentar baru, sanitasi input, pembatasan laju, dan penyimpanan data.",
    tags: ["api-handler", "server-actions", "comments", "moderation"],
    complexity: "moderate"
  },
  "app/admin/comments/page.tsx": {
    type: "file",
    summary: "Halaman dashboard admin terlindungi passcode untuk moderasi, persetujuan, dan manajemen komentar pembaca.",
    tags: ["entry-point", "admin", "dashboard", "page"],
    complexity: "complex"
  },
  "lib/supabase/admin.ts": {
    type: "file",
    summary: "Inisialisasi klien Supabase dengan service role key untuk operasi server-side dengan izin penuh.",
    tags: ["utility", "database", "supabase", "admin"],
    complexity: "simple"
  },
  "lib/utils/moderation.ts": {
    type: "file",
    summary: "Utilitas moderasi teks dan validasi skema Zod untuk menyaring kata-kata tidak pantas dan pola spam.",
    tags: ["utility", "moderation", "validation", "security"],
    complexity: "moderate"
  },
  "app/components/AnimatedBackground.jsx": {
    type: "file",
    summary: "Komponen latar belakang kanvas interaktif dengan animasi partikel halus dan koneksi garis dinamis.",
    tags: ["component", "canvas", "animation", "background"],
    complexity: "moderate"
  },
  "app/components/CustomCursor.jsx": {
    type: "file",
    summary: "Komponen kursor kustom interaktif yang memberikan efek visual jejak halus dan reaksi hover elemen.",
    tags: ["component", "cursor", "animation", "interactive"],
    complexity: "complex"
  },
  "app/components/Navbar.jsx": {
    type: "file",
    summary: "Komponen bilah navigasi responsif dengan menu tautan cepat dan pengalih tema warna.",
    tags: ["component", "navigation", "navbar", "responsive"],
    complexity: "complex"
  },
  "app/components/ThemeProvider.jsx": {
    type: "file",
    summary: "Konteks penyedia tema warna gelap/terang (theme context) dengan persistensi preferensi di browser.",
    tags: ["component", "theme", "context", "state"],
    complexity: "simple"
  },
  "app/layout.js": {
    type: "file",
    summary: "Tata letak dasar (root layout) aplikasi Next.js yang memuat font Geist, penyedia tema, dan metadata global.",
    tags: ["entry-point", "layout", "nextjs", "root"],
    complexity: "moderate"
  },
  ".agents/skills/page-mascot/scripts/generate.py": {
    type: "file",
    summary: "Skrip generator gambar AI untuk memproduksi variasi ekspresi dan sprite sheet maskot interaktif.",
    tags: ["script", "mascot", "image-generation", "python"],
    complexity: "complex"
  },
  ".agents/skills/page-mascot/scripts/key.py": {
    type: "file",
    summary: "Skrip pengolahan gambar untuk menghapus latar belakang (chroma keying) sprite maskot secara otomatis.",
    tags: ["script", "image-processing", "chroma-key", "python"],
    complexity: "complex"
  },
  ".agents/skills/page-mascot/scripts/screen.py": {
    type: "file",
    summary: "Skrip utilitas penangkap layar dan verifikasi visual untuk memastikan kualitas rendering sprite.",
    tags: ["script", "testing", "screenshot", "python"],
    complexity: "moderate"
  },
  ".agents/skills/page-mascot/reference/characters.md": {
    type: "document",
    summary: "Dokumentasi katalog karakter maskot bawaan yang dapat dipilih untuk integrasi halaman.",
    tags: ["documentation", "reference", "mascot", "characters"],
    complexity: "simple"
  },
  ".agents/skills/page-mascot/reference/design-rules.md": {
    type: "document",
    summary: "Pedoman teknis desain sprite atlas maskot, resolusi sel, tata letak sudut pandang, dan batas proporsi.",
    tags: ["documentation", "design-system", "guidelines", "rules"],
    complexity: "complex"
  },
  ".agents/skills/page-mascot/reference/prompts.md": {
    type: "document",
    summary: "Kumpulan template prompt AI terstruktur untuk menghasilkan variasi atlas arah dan reaksi karakter maskot.",
    tags: ["documentation", "prompts", "ai-generation", "templates"],
    complexity: "complex"
  },
  "README.md": {
    type: "document",
    summary: "Dokumentasi utama proyek portofolio yang menjelaskan panduan instalasi, teknologi, dan konfigurasi lokal.",
    tags: ["documentation", "entry-point", "readme", "getting-started"],
    complexity: "simple"
  },
  "package.json": {
    type: "config",
    summary: "Manifest paket Node.js yang mendefinisikan dependensi, skrip build, pustaka animasi, dan konfigurasi proyek.",
    tags: ["configuration", "dependencies", "package", "build-system"],
    complexity: "simple"
  },
  "skills-lock.json": {
    type: "config",
    summary: "File penguncian versi skill agen otomatis untuk melacak modul yang terpasang di workspace.",
    tags: ["configuration", "skills", "lockfile"],
    complexity: "simple"
  },
  "tsconfig.json": {
    type: "config",
    summary: "Konfigurasi kompilasi TypeScript Next.js dengan strict mode, path alias modul, dan modul resolusi modern.",
    tags: ["configuration", "typescript", "compiler", "paths"],
    complexity: "simple"
  },
  ".agents/skills/page-mascot/SKILL.md": {
    type: "document",
    summary: "Petunjuk alur kerja skill integrasi karakter maskot chibi pelacak kursor ke dalam halaman Next.js.",
    tags: ["documentation", "skill", "instructions", "workflow"],
    complexity: "complex"
  },
  ".agents/skills/page-mascot/mascot.tsx": {
    type: "file",
    summary: "Komponen React maskot chibi yang melacak pergerakan pointer mouse dan merespons saat diklik.",
    tags: ["component", "mascot", "interactive", "animation"],
    complexity: "complex"
  },
  ".agents/skills/page-mascot/scripts/build.py": {
    type: "file",
    summary: "Skrip penggabung dan penyelarasan sel sprite sheet menjadi file atlas optimal dengan perataan transparansi.",
    tags: ["script", "build", "image-processing", "python"],
    complexity: "complex"
  },
  ".agents/skills/page-mascot/scripts/mascot.py": {
    type: "file",
    summary: "Antarmuka baris perintah (CLI) terpadu untuk orkestrasi alur kerja pembuatan dan kalibrasi maskot.",
    tags: ["script", "cli", "orchestrator", "python"],
    complexity: "moderate"
  },
  ".agents/skills/page-mascot/scripts/requirements.txt": {
    type: "document",
    summary: "Daftar pustaka dependensi Python yang dibutuhkan untuk menjalankan skrip pengolahan gambar maskot.",
    tags: ["configuration", "dependencies", "python", "pip"],
    complexity: "simple"
  },
  ".agents/skills/page-mascot/scripts/verify.py": {
    type: "file",
    summary: "Skrip validasi konsistensi palet warna, shift pergerakan, dan batas tubuh sprite maskot.",
    tags: ["script", "validation", "testing", "python"],
    complexity: "moderate"
  },
  ".ua/config.json": {
    type: "config",
    summary: "File konfigurasi penyimpanan opsi bahasa keluaran untuk alat visualisasi arsitektur proyek.",
    tags: ["configuration", "settings", "localization"],
    complexity: "simple"
  },
  "app/components/TextReveal.jsx": {
    type: "file",
    summary: "Komponen utilitas animasi teks yang menampilkan karakter secara bertahap saat elemen terlihat di layar.",
    tags: ["component", "animation", "text", "typography"],
    complexity: "moderate"
  },
  "app/globals.css": {
    type: "file",
    summary: "Lembar gaya CSS utama aplikasi yang memuat konfigurasi Tailwind CSS, variabel tema warna, dan animasi khusus.",
    tags: ["markup", "css", "styling", "theme"],
    complexity: "complex"
  },
  "assets/assets.js": {
    type: "file",
    summary: "Kumpulan data aset statis yang mencakup data proyek, profil keahlian, ikon layanan, dan riwayat karier.",
    tags: ["data-model", "assets", "static-data", "portfolio"],
    complexity: "moderate"
  },
  "eslint.config.mjs": {
    type: "config",
    summary: "Konfigurasi linting ESLint format modular (flat config) untuk menegakkan standar kualitas kode Next.js.",
    tags: ["configuration", "linter", "eslint", "quality"],
    complexity: "simple"
  },
  "next.config.mjs": {
    type: "config",
    summary: "File konfigurasi framework Next.js untuk optimasi bundling, pengaturan runtime, dan dukungan remote images.",
    tags: ["configuration", "nextjs", "build-system", "bundler"],
    complexity: "simple"
  },
  "postcss.config.mjs": {
    type: "config",
    summary: "Konfigurasi plugin pemrosesan PostCSS untuk mengintegrasikan Tailwind CSS dan Autoprefixer.",
    tags: ["configuration", "postcss", "css-pipeline"],
    complexity: "simple"
  },
  "public/mascots/ikbal-directions.webp": {
    type: "file",
    summary: "File gambar WebP berisi sprite atlas maskot Ikbal dengan berbagai orientasi tatapan kursor.",
    tags: ["asset", "image", "sprite-sheet", "mascot"],
    complexity: "complex"
  },
  "public/mascots/ikbal-reactions.webp": {
    type: "file",
    summary: "File gambar WebP berisi sprite atlas maskot Ikbal dengan variasi reaksi ekspresi emosi interaktif.",
    tags: ["asset", "image", "sprite-sheet", "mascot"],
    complexity: "complex"
  },
  "tailwind.config.mjs": {
    type: "config",
    summary: "Konfigurasi desain Tailwind CSS yang memperluas palet warna tema, font, dan keyframe animasi kustom.",
    tags: ["configuration", "tailwindcss", "design-system", "styles"],
    complexity: "moderate"
  }
};

for (const batch of batchesData.batches) {
  const idx = batch.batchIndex;
  const extractResultsPath = path.join(tmpDir, `ua-file-extract-results-${idx}.json`);
  const extractData = JSON.parse(fs.readFileSync(extractResultsPath, 'utf8'));

  const nodes = [];
  const edges = [];
  const existingNodeIds = new Set();

  // Helper to add node safely
  function addNode(node) {
    if (!existingNodeIds.has(node.id)) {
      existingNodeIds.add(node.id);
      nodes.push(node);
    }
  }

  // 1. Process files from batch.files
  for (const fileObj of batch.files) {
    const filePath = fileObj.path;
    const fileResult = extractData.results ? extractData.results.find(r => r.path === filePath) : null;
    const meta = fileMetadata[filePath] || {
      type: fileObj.fileCategory === 'config' ? 'config' : fileObj.fileCategory === 'docs' ? 'document' : 'file',
      summary: `Komponen atau berkas ${path.basename(filePath)} pada proyek portofolio.`,
      tags: ["code", "portfolio"],
      complexity: fileObj.sizeLines > 200 ? "complex" : fileObj.sizeLines > 50 ? "moderate" : "simple"
    };

    const fileNodeId = `${meta.type}:${filePath}`;
    addNode({
      id: fileNodeId,
      type: meta.type,
      name: path.basename(filePath),
      filePath: filePath,
      summary: meta.summary,
      tags: meta.tags,
      complexity: meta.complexity
    });

    // Process significant functions in code files
    if (fileResult && fileResult.functions && Array.isArray(fileResult.functions)) {
      for (const fn of fileResult.functions) {
        const lineCount = (fn.endLine && fn.startLine) ? (fn.endLine - fn.startLine + 1) : 0;
        const isExported = fileResult.exports && fileResult.exports.some(e => e.name === fn.name);

        // Significance filter: >= 10 lines or exported
        if (lineCount >= 10 || isExported) {
          const fnNodeId = `function:${filePath}:${fn.name}`;
          addNode({
            id: fnNodeId,
            type: "function",
            name: fn.name,
            filePath: filePath,
            lineRange: [fn.startLine, fn.endLine],
            summary: `Fungsi ${fn.name} di dalam ${path.basename(filePath)} untuk memproses logika terkait.`,
            tags: ["function", "logic", isExported ? "exported" : "internal"],
            complexity: lineCount > 50 ? "complex" : lineCount > 20 ? "moderate" : "simple"
          });

          // Contains edge: file -> function
          edges.push({
            source: fileNodeId,
            target: fnNodeId,
            type: "contains",
            direction: "forward",
            weight: 1.0
          });

          // Exports edge if exported
          if (isExported) {
            edges.push({
              source: fileNodeId,
              target: fnNodeId,
              type: "exports",
              direction: "forward",
              weight: 0.8
            });
          }
        }
      }
    }

    // Process significant classes
    if (fileResult && fileResult.classes && Array.isArray(fileResult.classes)) {
      for (const cls of fileResult.classes) {
        const lineCount = (cls.endLine && cls.startLine) ? (cls.endLine - cls.startLine + 1) : 0;
        const clsNodeId = `class:${filePath}:${cls.name}`;
        addNode({
          id: clsNodeId,
          type: "class",
          name: cls.name,
          filePath: filePath,
          lineRange: [cls.startLine, cls.endLine],
          summary: `Kelas atau tipe ${cls.name} pada ${path.basename(filePath)}.`,
          tags: ["class", "data-structure"],
          complexity: lineCount > 50 ? "complex" : "moderate"
        });

        edges.push({
          source: fileNodeId,
          target: clsNodeId,
          type: "contains",
          direction: "forward",
          weight: 1.0
        });
      }
    }

    // 2. Add imports edges 1:1 strictly from batchImportData
    const importedPaths = (batch.batchImportData && batch.batchImportData[filePath]) || [];
    for (const imp of importedPaths) {
      const impMeta = fileMetadata[imp];
      const impType = impMeta ? impMeta.type : "file";
      edges.push({
        source: fileNodeId,
        target: `${impType}:${imp}`,
        type: "imports",
        direction: "forward",
        weight: 0.7
      });
    }

    // Special semantic edges for configs and docs
    if (meta.type === 'config' && filePath === 'package.json') {
      edges.push({
        source: fileNodeId,
        target: "file:app/page.js",
        type: "configures",
        direction: "forward",
        weight: 0.6
      });
    } else if (meta.type === 'config' && filePath === 'tsconfig.json') {
      edges.push({
        source: fileNodeId,
        target: "file:app/blog/page.tsx",
        type: "configures",
        direction: "forward",
        weight: 0.6
      });
    } else if (meta.type === 'document' && filePath === 'README.md') {
      edges.push({
        source: fileNodeId,
        target: "file:app/page.js",
        type: "documents",
        direction: "forward",
        weight: 0.5
      });
    }
  }

  const batchOutput = {
    nodes: nodes,
    edges: edges
  };

  const outputPath = path.join(intermediateDir, `batch-${idx}.json`);
  fs.writeFileSync(outputPath, JSON.stringify(batchOutput, null, 2));
  console.log(`Wrote batch-${idx}.json with ${nodes.length} nodes and ${edges.length} edges.`);
}
console.log('All batch files written.');
