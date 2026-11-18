/**
 * Data arsip proyek Akhmad Ikbal Khoir.
 * Urutan kronologis dari terbaru ke terlama.
 *
 * Catatan integritas data:
 * - DILARANG mengarang fakta, angka, nama, tanggal, atau link.
 * - Data kosong menggunakan placeholder [ISI: keterangan].
 * - Elemen yang bergantung pada placeholder TIDAK dirender di halaman publik.
 */

export const projectsData = [
  {
    id: "ideo-coffee",
    title: "Ideo Coffee",
    category: "Website Pemesanan",
    year: "2024",
    description:
      "Website pemesanan kopi dan menu online untuk Ideo Coffee yang memungkinkan pelanggan memilih menu, memesan langsung, dan menyelesaikan pembayaran secara digital melalui integrasi gateway pembayaran Midtrans.",
    role: null, // [ISI: solo / tim, bagian yang dikerjakan]
    problem:
      "Pelanggan kedai kopi membutuhkan sistem pemesanan online langsung tanpa harus mengantre manual di kasir, dengan alur pembayaran yang terverifikasi otomatis.",
    demoUrl: null, // [ISI: url demo Ideo Coffee]
    repoUrl: null, // [ISI: url repo Ideo Coffee]
    image: "/work-1.png",
    imageLight: "/work-1-light.png",
    alt: "Tampilan antarmuka website pemesanan online Ideo Coffee",
    tags: ["Laravel", "MySQL", "Midtrans", "Tailwind CSS"],
  },
  {
    id: "jinmoo-indonesia",
    title: "Jinmoo Indonesia",
    category: "Katalog Produk & Profil Perusahaan",
    year: "2024",
    description:
      "Website profil perusahaan manufaktur garmen Jinmoo Indonesia yang menampilkan katalog produk pakaian, informasi fasilitas pabrik, dan jalur kontak pemesanan langsung untuk calon mitra bisnis.",
    role: null, // [ISI: solo / tim, bagian yang dikerjakan]
    problem:
      "Mitra bisnis kesulitan melihat katalog manufaktur terbaru karena sebelumnya hanya mengandalkan dokumen PDF yang dibagikan manual.",
    demoUrl: null, // [ISI: url demo Jinmoo Indonesia]
    repoUrl: null, // [ISI: url repo Jinmoo Indonesia]
    image: "/work-2.png",
    imageLight: "/work-2-light.png",
    alt: "Tampilan website company profile dan katalog produk manufaktur Jinmoo Indonesia",
    tags: ["Laravel", "MySQL", "Tailwind CSS"],
  },
  {
    id: "kupas-co",
    title: "Kupas.Co",
    category: "Dashboard Inventaris & Analitik",
    year: "2023",
    description:
      "Sistem manajemen inventaris komoditas buah yang mengolah transaksi keluar masuk barang menjadi visualisasi grafik tren penjualan menggunakan Chart.js untuk membantu pengambilan keputusan stok.",
    role: null, // [ISI: solo / tim, bagian yang dikerjakan]
    problem:
      "Distributor buah kesulitan memprediksi komoditas yang cepat busuk karena rekap penjualan mingguan masih tercecer di nota fisik.",
    demoUrl: null, // [ISI: url demo Kupas.Co]
    repoUrl: null, // [ISI: url repo Kupas.Co]
    image: "/work-3.png",
    imageLight: "/work-3-light.png",
    alt: "Tampilan dashboard manajemen inventaris dan grafik penjualan Kupas.Co",
    tags: ["CodeIgniter", "MySQL", "Bootstrap", "Chart.js"],
  },
  {
    id: "brandku",
    title: "BrandKu",
    category: "Sistem Manajemen Konten Markdown",
    year: "2023",
    description:
      "Aplikasi pengelola konten berbasis Next.js dengan perenderan statis dan pembaca file Markdown lokal untuk menerbitkan artikel dan dokumentasi secara cepat tanpa perlu basis data terpisah.",
    role: null, // [ISI: solo / tim, bagian yang dikerjakan]
    problem:
      "Penulis konten membutuhkan alat penerbitan tulisan sederhana tanpa setup database rumit agar draf bisa langsung tayang dari file Markdown.",
    demoUrl: null, // [ISI: url demo BrandKu]
    repoUrl: null, // [ISI: url repo BrandKu]
    image: "/work-4.png",
    imageLight: "/work-4-light.png",
    alt: "Tampilan antarmuka generator halaman markdown dan editor konten BrandKu",
    tags: ["Next.js", "React", "Markdown", "Tailwind CSS"],
  },
]
