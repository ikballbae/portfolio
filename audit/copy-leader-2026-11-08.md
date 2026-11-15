# Audit Penggunaan Istilah "Leader", "Leadership", "Chairperson", & "Ketua" di Seluruh Repositori

Tanggal Audit: 8 November 2026 (Diperbarui 9 November 2026)  
Cakupan: Seluruh file kode sumber (`app/**`, `lib/**`, data blog, dan komponen)  
Tujuan: Mengidentifikasi seluruh kemunculan istilah peran kepemimpinan untuk memastikan konsistensi personal branding sebagai **Full-Stack Web Developer**, serta membedakan antara riwayat organisasi masa lalu/faktual yang valid dengan klaim peran aktif.

> **Catatan Kepatuhan:** Sesuai arahan, file di luar komponen `Hero` **TIDAK DIUBAH** dalam sprint ini. Audit ini memberikan rekomendasi tindakan untuk sesi berikutnya.

---

## Ringkasan Temuan

| No | File | Baris | Istilah Ditemukan | Konteks | Rekomendasi |
|---|---|---|---|---|---|
| 1 | `app/layout.js` | 37 | `Chairperson` | Metadata SEO deskripsi website | **Ubah (Disarankan)**: Ubah menjadi *"Former Chairperson of UKM Pengembangan Komputer"* jika masa jabatan telah selesai, atau prioritaskan *"Full-Stack Web Developer & UI/UX Designer"* agar fokus teknis lebih kuat di snippet pencarian Google. |
| 2 | `app/components/About.jsx` | 18 | `Tech Leadership` | Judul pilar keahlian di kartu About | **Biarkan / Perjelas**: Merupakan representasi soft skills manajemen tim. Bisa dipertahankan atau diperhalus menjadi *"Technical Mentorship & Community"* agar tidak terkesan over-claiming. |
| 3 | `app/components/About.jsx` | 19 | `Chairperson`, `developer communities` | Deskripsi kartu Tech Leadership | **Biarkan (Riwayat Faktual)**: Menjelaskan peran nyata membina UKM Pengembangan Komputer melalui workshop teknis. |
| 4 | `app/components/About.jsx` | 55 | `Chairperson` | Paragraf bio personal | **Biarkan / Beri Periode**: Valid sebagai pencapaian kepemimpinan mahasiswa. Rekomendasi: cantumkan periode kepengurusan (mis. `(2025–2026)`). |
| 5 | `app/components/Experience.jsx` | 7 | `Chairperson` | Riwayat posisi di timeline organisasi UKM PK | **Biarkan (Riwayat Faktual)**: Ini adalah rekam jejak resmi pengalaman organisasi di kampus. Sangat relevan untuk portofolio magang. |
| 6 | `app/components/Experience.jsx` | 11 | `Leadership`, `Community` | Tag kompetensi pengalaman | **Biarkan**: Metadata tag untuk pengalaman manajerial. |
| 7 | `app/components/Experience.jsx` | 106 | `Leadership & ` | Judul heading section: *"Leadership & Experience"* | **Biarkan**: Menjadi target anchor dari CTA Hero (`#experience`). |
| 8 | `app/components/LearningJourney.jsx` | 8 | `LEADERSHIP` | Tipe badge milestone PKFest | **Biarkan (Arsip Kegiatan)**: Program kerja tech festival mahasiswa. |
| 9 | `app/components/LearningJourney.jsx` | 17 | `LEADERSHIP` | Tipe badge milestone Study Club | **Biarkan (Arsip Kegiatan)**: Fasilitator sesi belajar database, UI/UX, dan web dev. |
| 10 | `app/components/LearningJourney.jsx` | 25 | `LEADERSHIP` | Tipe badge milestone Diklat | **Biarkan (Arsip Kegiatan)**: Pelatihan kepemimpinan dan kaderisasi UKM. |
| 11 | `app/components/LearningJourney.jsx` | 33 | `LEADERSHIP` | Skema warna badge kategori | **Biarkan**: Kode styling tampilan badge. |
| 12 | `app/components/Blog.jsx` | 13 | `Leadership` | Konfigurasi kategori blog | **Biarkan**: Kategori artikel untuk topik kepemimpinan. |
| 13 | `app/components/Blog.jsx` | 300 | `leadership` | Subjudul deskripsi bagian blog | **Biarkan**: Refleksi perjalanan dari kompetisi, leadership, hingga code & design. |
| 14 | `app/components/blog/CategoryFilter.tsx` | 19 | `Leadership` | Filter tab kategori blog | **Biarkan**: Komponen filter kategori. |
| 15 | `app/components/blog/FeaturedPost.tsx` | 24 | `Leadership` | Badge kategori post unggulan | **Biarkan**: Komponen visual blog. |
| 16 | `app/components/blog/PostCard.tsx` | 23 | `Leadership` | Badge kategori kartu artikel | **Biarkan**: Komponen visual blog. |
| 17 | `app/blog/[slug]/page.tsx` | 14 | `LEADERSHIP` | Badge kategori pada detail artikel | **Biarkan**: Komponen visual blog detail. |
| 18 | `app/data/blogData.js` | 3 | `ketua-umum` | Slug URL artikel perjalanan UKM PK | **Biarkan**: URL permanen artikel blog. |
| 19 | `app/data/blogData.js` | 7 | `Ketua Umum` | Judul artikel: *"Dari Anggota menjadi Ketua Umum UKM PK"* | **Biarkan (Narasi Nyata)**: Menceritakan proses berproses dari staf divisi hingga menjadi ketua umum. Humanis dan disukai HRD. |
| 20 | `app/data/blogData.js` | 12, 13 | `Leadership`, `LEADERSHIP` | Tags & Kategori data artikel | **Biarkan**: Klasifikasi artikel. |
| 21 | `app/data/blogData.js` | 16 | `Ketua Umum` | Isi paragraf artikel blog | **Biarkan (Fakta Historis)**: Penjelasan amanah periode kepengurusan 2025/2026. |
| 22 | `app/components/Hero.tsx` | 15, 486, 517, 626 | `TECH LEADER`, `I Lead Communities` | Headline dan role switcher Hero | **DIREVISI / DIHAPUS**: Telah dihapus pada revisi Hero ini dan digantikan dengan single static role *"FULL-STACK WEB DEVELOPER"* serta headline 2 baris *"From Pixel / to Query."*. |
| 23 | `app/components/useHeroAnimation.ts` | 97 | `Tech Leader` | Array `ROLES` dan loop animasi role scramble | **DIREVISI / DIHAPUS**: Loop switcher dihentikan dan digantikan animasi typewriter tunggal untuk *"FULL-STACK WEB DEVELOPER"*. |

---

## Analisis & Rekomendasi Strategis untuk HRD / Recruiter

1. **Pemisahan Jelas Antara Posisi yang Dilamar vs Rekam Jejak Organisasi**:
   - Di bagian **Hero**, kandidat memposisikan diri secara tegas dan spesifik sebagai **Full-Stack Web Developer** (dengan keunggulan pemahaman dari Pixel/UI hingga Query/Database). Ini mencegah kesan "terlalu generalis" atau "belum memutuskan fokus".
   - Riwayat sebagai Ketua Umum UKM Pengembangan Komputer di bagian **Experience**, **About**, dan **Blog** berfungsi sebagai nilai tambah soft skills yang kuat: kandidat tidak hanya bisa coding mandiri, tapi juga terbukti mampu mengoordinasi tim, mengadakan event tech festival, dan memfasilitasi mentoring rekan-rekannya.

2. **Rencana Pembaruan Mendatang (Opsional)**:
   - Jika masa kepengurusan di UKM PK telah demisioner/selesai, kata "Chairperson" pada `app/layout.js` dan bio ringkas `app/components/About.jsx` dapat disesuaikan menjadi "Former Chairperson" atau "Ex-Chairperson (2025)".
   - Tautan sekunder di Hero (`Leadership & Achievements`) mengarah dengan tepat ke `#experience`, sehingga alur eksplorasi recruiter tetap koheren.

