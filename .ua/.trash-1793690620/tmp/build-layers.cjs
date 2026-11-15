const fs = require('fs');

const assembled = JSON.parse(fs.readFileSync('c:/project/portfolio/.ua/intermediate/assembled-graph.json', 'utf8'));
const fileTypes = new Set(['file', 'config', 'document', 'service', 'pipeline', 'table', 'schema', 'resource', 'endpoint']);
const allFileNodes = assembled.nodes.filter(n => fileTypes.has(n.type));

const layers = [
  {
    id: "layer:core-app",
    name: "Aplikasi Utama & Tata Letak",
    description: "Komponen inti Next.js yang menangani tata letak akar, halaman beranda, dan konfigurasi styling global.",
    nodeIds: [
      "file:app/layout.js",
      "file:app/page.js",
      "file:app/globals.css",
      "config:next.config.mjs",
      "config:postcss.config.mjs",
      "config:tailwind.config.mjs"
    ]
  },
  {
    id: "layer:ui-components",
    name: "Komponen Antarmuka Portofolio",
    description: "Koleksi komponen visual interaktif, seksi profil, portofolio proyek, keahlian, dan animasi Framer Motion/GSAP.",
    nodeIds: [
      "file:app/components/Hero.jsx",
      "file:app/components/About.jsx",
      "file:app/components/Experience.jsx",
      "file:app/components/Projects.jsx",
      "file:app/components/TechStack.jsx",
      "file:app/components/LearningJourney.jsx",
      "file:app/components/Contact.jsx",
      "file:app/components/Navbar.jsx",
      "file:app/components/AnimatedBackground.jsx",
      "file:app/components/CustomCursor.jsx",
      "file:app/components/GradientMesh.jsx",
      "file:app/components/MagneticButton.jsx",
      "file:app/components/ScrambleText.jsx",
      "file:app/components/ScrollReveal.jsx",
      "file:app/components/TextReveal.jsx",
      "file:app/components/ThemeProvider.jsx",
      "file:assets/assets.js"
    ]
  },
  {
    id: "layer:blog-system",
    name: "Sistem & Katalog Blog",
    description: "Halaman katalog, pembaca artikel blog dinamis, filter kategori, kartu artikel, dan analitik pembaca.",
    nodeIds: [
      "file:app/blog/page.tsx",
      "file:app/blog/[slug]/page.tsx",
      "file:app/components/Blog.jsx",
      "file:app/components/blog/BlogHeader.tsx",
      "file:app/components/blog/BlogEmptyState.tsx",
      "file:app/components/blog/CategoryFilter.tsx",
      "file:app/components/blog/FeaturedPost.tsx",
      "file:app/components/blog/PostCard.tsx",
      "file:app/components/blog/PostCardSkeleton.tsx",
      "file:app/components/blog/ShareButton.tsx",
      "file:app/components/ShareMenu.jsx",
      "file:app/components/ArticleMetrics.tsx",
      "file:app/data/blogData.js"
    ]
  },
  {
    id: "layer:comments-moderation",
    name: "Layanan Komentar & Moderasi",
    description: "Backend interaktif untuk komentar pembaca, reaksi emotikon, validasi moderasi toksisitas, dan dashboard admin Supabase.",
    nodeIds: [
      "file:app/components/CommentSection.tsx",
      "file:app/components/CommentItem.tsx",
      "file:app/components/ReactionBar.tsx",
      "file:app/admin/comments/page.tsx",
      "file:app/actions/comments.ts",
      "file:app/actions/admin.ts",
      "file:lib/supabase/client.ts",
      "file:lib/supabase/admin.ts",
      "file:lib/utils/moderation.ts",
      "file:lib/utils/session.ts"
    ]
  },
  {
    id: "layer:mascot-system",
    name: "Sistem Maskot Interaktif",
    description: "Modul maskot chibi pelacak kursor beserta rangkaian skrip pemrosesan gambar dan sprite sheet atlas.",
    nodeIds: [
      "document:.agents/skills/page-mascot/SKILL.md",
      "file:.agents/skills/page-mascot/mascot.tsx",
      "file:.agents/skills/page-mascot/scripts/build.py",
      "file:.agents/skills/page-mascot/scripts/generate.py",
      "file:.agents/skills/page-mascot/scripts/key.py",
      "file:.agents/skills/page-mascot/scripts/mascot.py",
      "document:.agents/skills/page-mascot/scripts/requirements.txt",
      "file:.agents/skills/page-mascot/scripts/screen.py",
      "file:.agents/skills/page-mascot/scripts/verify.py",
      "document:.agents/skills/page-mascot/reference/characters.md",
      "document:.agents/skills/page-mascot/reference/design-rules.md",
      "document:.agents/skills/page-mascot/reference/prompts.md",
      "file:public/mascots/ikbal-directions.webp",
      "file:public/mascots/ikbal-reactions.webp"
    ]
  },
  {
    id: "layer:project-config-docs",
    name: "Konfigurasi & Dokumentasi Proyek",
    description: "Dokumentasi umum, dependensi paket Node.js, aturan linter ESLint, dan konfigurasi compiler TypeScript.",
    nodeIds: [
      "document:README.md",
      "config:package.json",
      "config:tsconfig.json",
      "config:eslint.config.mjs",
      "config:skills-lock.json",
      "config:.ua/config.json"
    ]
  }
];

// Verification
const assigned = new Set();
for (const layer of layers) {
  for (const id of layer.nodeIds) {
    if (assigned.has(id)) {
      console.error('Duplicate node in layers:', id);
    }
    assigned.add(id);
  }
}

const fileNodeIds = new Set(allFileNodes.map(n => n.id));
for (const id of assigned) {
  if (!fileNodeIds.has(id)) {
    console.error('Layer references non-existent file node:', id);
  }
}
for (const id of fileNodeIds) {
  if (!assigned.has(id)) {
    console.error('File node not assigned to any layer:', id);
  }
}

console.log(`Verified ${assigned.size} of ${allFileNodes.length} file nodes assigned across ${layers.length} layers.`);
fs.writeFileSync('c:/project/portfolio/.ua/intermediate/layers.json', JSON.stringify(layers, null, 2));
