"use client";

export default function BlogHeader() {
  return (
    <header className="mb-8 sm:mb-10">
      <h1 className="font-sans font-bold text-2xl sm:text-3xl md:text-4xl text-text tracking-tight">
        Blog
      </h1>
      <p className="text-text-muted text-xs sm:text-sm mt-2 max-w-xl leading-relaxed">
        Kumpulan catatan belajar, eksplorasi development, dan refleksi
        perjalanan dari ruang organisasi hingga panggung kompetisi.
      </p>
    </header>
  );
}
