'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { useTheme } from './ThemeProvider'

export default function ProjectLightbox({
  project,
  projects = [],
  currentIndex = 0,
  onClose,
  onNavigate,
}) {
  const { theme } = useTheme()
  const isLight = theme === 'light'
  const closeBtnRef = useRef(null)
  const total = projects.length

  // Focus close button on mount
  useEffect(() => {
    closeBtnRef.current?.focus()
  }, [])

  // Keyboard accessibility: Escape, Left, Right
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose()
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        if (currentIndex > 0) {
          onNavigate(currentIndex - 1)
        }
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        if (currentIndex < total - 1) {
          onNavigate(currentIndex + 1)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [currentIndex, total, onClose, onNavigate])

  if (!project) return null

  const displayImage = isLight ? (project.imageLight || project.image) : project.image

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Pratinjau antarmuka ${project.title}`}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-10 bg-black/85 backdrop-blur-md"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="relative w-full max-w-5xl max-h-[92vh] flex flex-col items-center">
        {/* Top Control Bar */}
        <div className="w-full flex items-center justify-between pb-3 text-white/80 select-none">
          <div className="flex items-center gap-2 truncate pr-4">
            <span className="font-sans font-bold text-sm sm:text-base text-white">
              {project.title}
            </span>
            {project.category && (
              <>
                <span className="text-white/40">·</span>
                <span className="text-xs text-white/70 hidden sm:inline truncate">
                  {project.category}
                </span>
              </>
            )}
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Indikator Urutan */}
            <span className="text-xs text-white/70 mr-2">
              {currentIndex + 1} dari {total}
            </span>

            {/* Prev Button */}
            <button
              type="button"
              onClick={() => onNavigate(Math.max(0, currentIndex - 1))}
              disabled={currentIndex === 0}
              aria-label="Proyek sebelumnya"
              className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:pointer-events-none transition-colors"
            >
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Next Button */}
            <button
              type="button"
              onClick={() => onNavigate(Math.min(total - 1, currentIndex + 1))}
              disabled={currentIndex === total - 1}
              aria-label="Proyek berikutnya"
              className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:pointer-events-none transition-colors"
            >
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Close Button */}
            <button
              ref={closeBtnRef}
              type="button"
              onClick={onClose}
              aria-label="Tutup pratinjau"
              className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/10 hover:bg-white/20 hover:text-white transition-colors ml-1"
            >
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Image Frame */}
        <div className="relative w-full max-h-[80vh] flex items-center justify-center rounded-xl overflow-hidden border border-white/10 bg-black/60 p-2 sm:p-4 shadow-2xl">
          <div className="relative w-full h-[60vh] max-h-[750px]">
            <Image
              src={displayImage}
              alt={project.alt || `Tampilan antarmuka ${project.title}`}
              fill
              className="object-contain"
              sizes="(max-width: 1024px) 95vw, 1200px"
              priority
            />
          </div>
        </div>

        {/* Caption below */}
        {project.alt && (
          <p className="text-[11px] sm:text-xs text-white/60 text-center mt-2.5 max-w-xl truncate">
            {project.alt}
          </p>
        )}
      </div>
    </div>
  )
}
