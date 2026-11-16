'use client'

import { useEffect, useRef, useState, useMemo } from 'react'
import Link from 'next/link'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Navbar from '../components/Navbar'
import Contact from '../components/Contact'
import { useLoading } from '../context/LoadingContext'
import { experienceData } from '../data/experienceData'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

/**
 * Sanitasi string periode:
 * Menghilangkan placeholder [ISI: ...] sepenuhnya agar tidak tampil ke publik.
 * Jika setelah disanitasi kosong, mengembalikan null agar tidak menyisakan ruang/titik pemisah.
 */
function getCleanPeriod(period) {
  if (!period) return null
  const cleaned = period
    .replace(/\s*-\s*\[ISI:[^\]]+\]/gi, '')
    .replace(/\[ISI:[^\]]+\]/gi, '')
    .trim()
  return cleaned.length > 0 ? cleaned : null
}

export default function ExperienceContent() {
  const { isLoaded } = useLoading()
  const listRef = useRef(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [prefersReduced, setPrefersReduced] = useState(false)

  // Urutkan dari terbaru ke terlama berdasarkan sortDate
  const sortedExperiences = useMemo(() => {
    return [...experienceData].sort(
      (a, b) => new Date(b.sortDate).getTime() - new Date(a.sortDate).getTime()
    )
  }, [experienceData])

  // Deteksi prefers-reduced-motion
  useEffect(() => {
    if (typeof window === 'undefined') return
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReduced(mq.matches)
    const handler = (e) => setPrefersReduced(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  // Animasi GSAP: Scrub garis vertikal, active tracker, & entrance reveal
  useEffect(() => {
    if (typeof window === 'undefined' || !isLoaded) return

    const ctx = gsap.context(() => {
      const items = listRef.current?.querySelectorAll('[data-experience-item]')
      if (!items || items.length === 0) return

      // Entrance animation untuk konten teks pengalaman (tanpa menggeser rel garis)
      if (!prefersReduced) {
        const contents = listRef.current?.querySelectorAll('[data-experience-content]')
        contents?.forEach((el) => {
          gsap.fromTo(
            el,
            { opacity: 0, y: 16 },
            {
              opacity: 1,
              y: 0,
              duration: 0.35,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: el,
                start: 'top 92%',
                once: true,
              },
            }
          )
        })
      }

      // Active index tracker saat di-scroll
      items.forEach((el, index) => {
        ScrollTrigger.create({
          trigger: el,
          start: 'top 55%',
          end: 'bottom 45%',
          onEnter: () => setActiveIndex(index),
          onEnterBack: () => setActiveIndex(index),
        })

        // Scrub animasi garis pengisi vertikal dari satu node ke node berikutnya
        if (!prefersReduced && index < items.length - 1) {
          const nextEl = items[index + 1]
          const fill = el.querySelector('[data-timeline-fill]')
          if (fill && nextEl) {
            gsap.fromTo(
              fill,
              { scaleY: 0 },
              {
                scaleY: 1,
                ease: 'none',
                transformOrigin: 'top center',
                scrollTrigger: {
                  trigger: el,
                  start: () =>
                    index === 0
                      ? `top top+=${Math.round(el.getBoundingClientRect().top + window.scrollY)}`
                      : 'top 55%',
                  endTrigger: nextEl,
                  end: 'top 55%',
                  scrub: true,
                  invalidateOnRefresh: true,
                },
              }
            )
          }
        }
      })
    }, listRef)

    return () => ctx.revert()
  }, [prefersReduced, isLoaded, sortedExperiences])

  // Menentukan tahun aktif berdasarkan entri yang sedang dilihat
  const activeYear = useMemo(() => {
    const activeItem = sortedExperiences[activeIndex]
    return activeItem?.sortDate ? activeItem.sortDate.slice(0, 4) : '2026'
  }, [activeIndex, sortedExperiences])

  return (
    <div
      className="relative overflow-x-clip w-full min-h-screen"
      style={{
        visibility: isLoaded ? 'visible' : 'hidden',
        opacity: isLoaded ? 1 : 0,
      }}
    >
      <Navbar />

      <main id="main-content" className="relative pt-20 sm:pt-24 md:pt-28 pb-16 w-full">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8">
          {/* Header */}
          <header className="mb-10 sm:mb-14">
            <h1 className="font-sans font-bold text-2xl sm:text-3xl md:text-4xl text-text tracking-tight">
              Pengalaman
            </h1>
            <p className="text-text-muted text-sm sm:text-base mt-2 max-w-xl leading-relaxed">
              Rekam jejak kepemimpinan organisasi, aktivitas edukasi teknologi, dan keterlibatan proyek perangkat lunak.
            </p>
          </header>

          {/* Timeline Stream berurut dari terbaru ke terlama */}
          <div ref={listRef} className="relative">
            {sortedExperiences.map((item, index) => {
              const cleanPeriod = getCleanPeriod(item.period)
              const year = item.sortDate ? item.sortDate.slice(0, 4) : ''
              const prevYear =
                index > 0 && sortedExperiences[index - 1]?.sortDate
                  ? sortedExperiences[index - 1].sortDate.slice(0, 4)
                  : null
              const isFirstOfYear = year !== prevYear

              const isActive = activeIndex === index
              const isPassed = activeIndex > index
              const isLast = index === sortedExperiences.length - 1

              return (
                <article
                  key={item.id}
                  data-experience-item
                  className="group relative flex gap-3 sm:gap-4 md:gap-6"
                >
                  {/* 1. Kolom Tahun (Desktop: sisi kiri dengan highlight interaktif tahun aktif) */}
                  <div className="hidden md:block w-16 lg:w-20 flex-shrink-0 text-right pt-0.5 select-none">
                    {isFirstOfYear && (
                      <span
                        className={`font-sans text-sm sm:text-base transition-colors duration-300 ${
                          activeYear === year
                            ? 'text-accent font-semibold'
                            : 'text-text-muted/70 font-normal'
                        }`}
                      >
                        {year}
                      </span>
                    )}
                  </div>

                  {/* 2. Rail Garis Timeline Vertikal & Node Indikator */}
                  <div className="relative flex flex-col items-center flex-shrink-0 self-stretch pt-1 w-5 sm:w-6">
                    {/* Garis konektor dari atas (untuk entri setelah entri pertama) */}
                    {index > 0 && (
                      <div className="absolute top-0 h-3 w-[2px] bg-[var(--timeline-line)] left-1/2 -translate-x-1/2">
                        <div
                          className={`w-full h-full bg-accent transition-opacity duration-300 ${
                            isActive || isPassed ? 'opacity-100' : 'opacity-0'
                          }`}
                        />
                      </div>
                    )}

                    {/* Garis pengisi vertikal yang di-scrub GSAP ke entri berikutnya */}
                    {!isLast ? (
                      <div className="absolute top-3 bottom-0 w-[2px] bg-[var(--timeline-line)] left-1/2 -translate-x-1/2">
                        <div
                          data-timeline-fill
                          className="w-full h-full bg-accent origin-top scale-y-0"
                          style={
                            prefersReduced
                              ? { transform: isPassed ? 'scaleY(1)' : 'scaleY(0)' }
                              : undefined
                          }
                        />
                      </div>
                    ) : (
                      /* Ekor gradien halus di bawah entri terakhir */
                      <div className="absolute top-3 w-[2px] h-16 bg-gradient-to-b from-[var(--timeline-line)] to-transparent left-1/2 -translate-x-1/2 pointer-events-none">
                        <div
                          className={`w-full h-10 bg-gradient-to-b from-accent to-transparent transition-opacity duration-500 ${
                            isActive ? 'opacity-100' : 'opacity-0'
                          }`}
                        />
                      </div>
                    )}

                    {/* Node Lingkaran Interaktif (centered at top-3 / 12px) */}
                    <div className="relative z-10 flex items-center justify-center">
                      <div
                        className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full border-2 bg-bg flex items-center justify-center transition-all duration-300 group-hover:scale-125 ${
                          isActive
                            ? 'border-accent shadow-[0_0_10px_rgba(var(--accent-rgb),0.5)]'
                            : isPassed
                            ? 'border-accent/80'
                            : 'border-[var(--timeline-node-border)] group-hover:border-accent/60'
                        }`}
                        aria-hidden="true"
                      >
                        {/* Dot tengah aktif */}
                        <div
                          className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                            isActive
                              ? 'bg-accent scale-100'
                              : isPassed
                              ? 'bg-accent/70 scale-100'
                              : 'bg-transparent scale-0 group-hover:scale-75 group-hover:bg-accent/40'
                          }`}
                        />
                      </div>
                    </div>
                  </div>

                  {/* 3. Kolom Konten Teks */}
                  <div data-experience-content className="flex-1 max-w-[65ch] pb-10 sm:pb-12">
                    {/* Tahun di layar Mobile (< md) jika entri pertama tahun tersebut */}
                    {isFirstOfYear && (
                      <div className="md:hidden mb-2">
                        <span
                          className={`font-sans text-xs sm:text-sm transition-colors duration-300 ${
                            activeYear === year
                              ? 'text-accent font-semibold'
                              : 'text-text-muted/70 font-normal'
                          }`}
                        >
                          {year}
                        </span>
                      </div>
                    )}

                    {/* Baris abu-abu: Periode · Organisasi */}
                    <p className="text-text-muted text-xs sm:text-sm font-normal mb-1">
                      {cleanPeriod
                        ? `${cleanPeriod} · ${item.organization}`
                        : item.organization}
                    </p>

                    {/* Role sebagai judul (hover interaktif) */}
                    <h2 className="font-sans font-bold text-base sm:text-lg text-text tracking-tight mb-1.5 transition-colors duration-200 group-hover:text-accent">
                      {item.role}
                    </h2>

                    {/* Deskripsi satu sampai dua kalimat */}
                    <p className="text-text/80 text-sm sm:text-base leading-relaxed">
                      {item.description}
                    </p>

                    {/* Tautan khusus entri 8 ke /awards */}
                    {item.awardsUrl && (
                      <div className="mt-2.5">
                        <Link
                          href={item.awardsUrl}
                          className="inline-flex items-center gap-1 text-xs text-text-muted hover:text-accent transition-colors duration-150"
                        >
                          <span>Lihat penghargaan</span>
                          <span aria-hidden="true">→</span>
                        </Link>
                      </div>
                    )}
                  </div>
                </article>
              )
            })}
          </div>
        </div>

        <div className="section-divider mt-16 sm:mt-24" />
        <Contact />
      </main>
    </div>
  )
}
