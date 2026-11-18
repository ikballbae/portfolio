'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useTheme } from './ThemeProvider'
import ProjectLightbox from './ProjectLightbox'
import { projectsData } from '../data/projectsData'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

/**
 * Pembersih teks: memastikan tidak ada placeholder [ISI: ...] yang muncul ke publik.
 */
function sanitizeText(text) {
  if (!text || typeof text !== 'string') return null
  if (text.includes('[ISI')) return null
  const cleaned = text.replace(/\[ISI:[^\]]+\]/gi, '').trim()
  return cleaned.length > 0 ? cleaned : null
}

export default function Projects({ hideHeader = false }) {
  const { theme } = useTheme()
  const isLight = theme === 'light'
  const containerRef = useRef(null)
  const [lightboxProject, setLightboxProject] = useState(null)
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const [prefersReduced, setPrefersReduced] = useState(false)

  // Deteksi preferensi reduced motion
  useEffect(() => {
    if (typeof window === 'undefined') return
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReduced(mq.matches)
    const handler = (e) => setPrefersReduced(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  // Animasi entrance halus menggunakan GSAP ScrollTrigger
  useEffect(() => {
    if (typeof window === 'undefined' || !containerRef.current) return

    const items = containerRef.current.querySelectorAll('[data-project-item]')
    if (!items || items.length === 0) return

    const ctx = gsap.context(() => {
      if (!prefersReduced) {
        items.forEach((item) => {
          gsap.fromTo(
            item,
            { opacity: 0, y: 20 },
            {
              opacity: 1,
              y: 0,
              duration: 0.45,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: item,
                start: 'top 88%',
                once: true,
              },
            }
          )
        })
      }
    }, containerRef)

    return () => ctx.revert()
  }, [prefersReduced])

  const handleOpenLightbox = (project, index) => {
    setLightboxProject(project)
    setLightboxIndex(index)
  }

  const handleCloseLightbox = () => {
    setLightboxProject(null)
  }

  const handleNavigateLightbox = (newIndex) => {
    if (projectsData[newIndex]) {
      setLightboxProject(projectsData[newIndex])
      setLightboxIndex(newIndex)
    }
  }

  return (
    <section id="projects" className={`${hideHeader ? 'py-2 sm:py-4' : 'section-padding'} relative`}>
      <div ref={containerRef} className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8">
        {!hideHeader && (
          <header className="mb-10 sm:mb-14">
            <h2 className="font-sans font-bold text-2xl sm:text-3xl md:text-4xl text-text tracking-tight mb-2">
              Proyek
            </h2>
            <p className="text-text-muted text-xs sm:text-sm max-w-xl leading-relaxed">
              Koleksi aplikasi web dan sistem informasi yang dibangun untuk memecahkan masalah nyata.
            </p>
          </header>
        )}

        {/* Daftar Proyek (Tata Letak Editorial & Tipografi Manusiawi) */}
        <div className="space-y-16 sm:space-y-20 md:space-y-24">
          {projectsData.map((project, index) => {
            const cleanProblem = sanitizeText(project.problem)
            const cleanDesc = sanitizeText(project.description)
            const cleanRole = sanitizeText(project.role)
            const isEven = index % 2 === 0
            const displayImage = isLight ? (project.imageLight || project.image) : project.image

            const hasValidDemo = project.demoUrl && !project.demoUrl.startsWith('[ISI')
            const hasValidRepo = project.repoUrl && !project.repoUrl.startsWith('[ISI')

            return (
              <article
                key={project.id || project.title}
                data-project-item
                className={`flex flex-col ${
                  isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'
                } gap-6 sm:gap-8 lg:gap-12 items-center`}
              >
                {/* Tangkapan Layar Antarmuka */}
                <div className="w-full lg:w-7/12 flex-shrink-0">
                  <div
                    onClick={() => handleOpenLightbox(project, index)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        handleOpenLightbox(project, index)
                      }
                    }}
                    aria-label={`Buka pratinjau penuh ${project.title}`}
                    className="group relative aspect-[16/10] w-full rounded-xl sm:rounded-2xl overflow-hidden border border-text/10 bg-surface shadow-sm hover:border-text/25 transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent"
                  >
                    <Image
                      src={displayImage}
                      alt={project.alt || `Tampilan antarmuka ${project.title}`}
                      fill
                      className={`transition-transform duration-500 ease-out group-hover:scale-[1.02] ${
                        isLight ? 'object-contain p-2 sm:p-4' : 'object-cover'
                      }`}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 620px"
                    />

                    {/* Indikator klik halus di sudut */}
                    <div className="absolute bottom-2.5 right-2.5 px-2 py-1 rounded bg-black/60 text-white/80 text-[11px] opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                      Lihat pratinjau
                    </div>
                  </div>
                </div>

                {/* Deskripsi & Konteks Editorial */}
                <div className="w-full lg:w-5/12 flex flex-col justify-center">
                  {/* Baris Periode & Kategori (Gaya Konsisten dengan /experience dan /awards) */}
                  <p className="text-xs sm:text-sm text-text-muted mb-1.5 font-normal">
                    {project.year ? `${project.year} · ` : ''}
                    {project.category}
                  </p>

                  {/* Judul Proyek */}
                  <h3 className="font-sans font-bold text-xl sm:text-2xl md:text-3xl text-text tracking-tight mb-3">
                    {project.title}
                  </h3>

                  {/* Narasi Deskripsi */}
                  {cleanDesc && (
                    <p className="text-xs sm:text-sm text-text/85 leading-relaxed mb-3">
                      {cleanDesc}
                    </p>
                  )}

                  {/* Tantangan Lapangan */}
                  {cleanProblem && (
                    <p className="text-xs sm:text-sm text-text-muted leading-relaxed mb-3">
                      <strong className="text-text font-medium">Tantangan: </strong>
                      {cleanProblem}
                    </p>
                  )}

                  {/* Peran Saya (Hanya jika bukan placeholder) */}
                  {cleanRole && (
                    <p className="text-xs sm:text-sm text-text-muted mb-3">
                      <strong className="text-text font-medium">Peran: </strong>
                      {cleanRole}
                    </p>
                  )}

                  {/* Teknologi (Daftar koma alami, tanpa badge monospace/pill neon) */}
                  {project.tags && project.tags.length > 0 && (
                    <p className="text-xs sm:text-sm text-text-muted mb-4">
                      <strong className="text-text font-medium">Teknologi: </strong>
                      {project.tags.join(', ')}
                    </p>
                  )}

                  {/* Tautan Proyek (Hanya tampil jika ada URL valid) */}
                  {(hasValidDemo || hasValidRepo) && (
                    <div className="flex items-center gap-4 pt-1">
                      {hasValidDemo && (
                        <a
                          href={project.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs sm:text-sm text-text hover:text-accent transition-colors underline underline-offset-4 inline-flex items-center gap-1 select-none"
                        >
                          <span>Kunjungi situs</span>
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      )}

                      {hasValidRepo && (
                        <a
                          href={project.repoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs sm:text-sm text-text hover:text-accent transition-colors underline underline-offset-4 inline-flex items-center gap-1 select-none"
                        >
                          <span>Kode sumber</span>
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </article>
            )
          })}
        </div>
      </div>

      {/* Lightbox Pratinjau Tangkapan Layar */}
      {lightboxProject && (
        <ProjectLightbox
          project={lightboxProject}
          projects={projectsData}
          currentIndex={lightboxIndex}
          onClose={handleCloseLightbox}
          onNavigate={handleNavigateLightbox}
        />
      )}
    </section>
  )
}
