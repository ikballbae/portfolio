'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'

export default function AwardsLightbox({
  award,
  awards = [],
  currentIndex = 0,
  onClose,
  onNavigate,
}) {
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const dragStart = useRef({ x: 0, y: 0 })
  const closeBtnRef = useRef(null)

  const total = awards.length

  // Reset zoom & pan when award changes
  useEffect(() => {
    setZoom(1)
    setPan({ x: 0, y: 0 })
  }, [award?.id])

  // Focus close button on mount
  useEffect(() => {
    closeBtnRef.current?.focus()
  }, [])

  // Keyboard navigation: Escape to close, ArrowLeft / ArrowRight to navigate
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

  // Toggle 2x zoom on image click (unless dragging)
  const hasDragged = useRef(false)

  const handleImageClick = (e) => {
    if (hasDragged.current) return
    setZoom((prev) => (prev > 1 ? 1 : 2))
    setPan({ x: 0, y: 0 })
  }

  // Drag to pan when zoomed in
  const handleMouseDown = (e) => {
    if (zoom <= 1) return
    setIsDragging(true)
    hasDragged.current = false
    dragStart.current = { x: e.clientX - pan.x, y: e.clientY - pan.y }
  }

  const handleMouseMove = (e) => {
    if (!isDragging || zoom <= 1) return
    const dx = e.clientX - (dragStart.current.x + pan.x)
    const dy = e.clientY - (dragStart.current.y + pan.y)
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
      hasDragged.current = true
    }
    const maxPan = (zoom - 1) * 320
    const newX = Math.min(maxPan, Math.max(-maxPan, e.clientX - dragStart.current.x))
    const newY = Math.min(maxPan, Math.max(-maxPan, e.clientY - dragStart.current.y))
    setPan({ x: newX, y: newY })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  if (!award) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="lightbox-title"
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-sm select-none transition-opacity duration-200"
      onClick={onClose}
    >
      <div
        className="relative max-w-4xl w-full bg-surface border border-text/15 rounded-lg p-4 sm:p-5 shadow-2xl flex flex-col gap-3 overflow-hidden transform scale-100 transition-transform duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header: Title, Navigation, Close */}
        <div className="flex items-center justify-between gap-4 pb-2.5 border-b border-text/10">
          <div className="min-w-0">
            <h2
              id="lightbox-title"
              className="font-sans font-bold text-sm sm:text-base text-text tracking-tight truncate"
            >
              {award.title}
            </h2>
            <p className="text-xs text-text-muted truncate mt-0.5">
              {award.meta} — {award.issuer}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Prev / Next Buttons */}
            <div className="flex items-center border border-text/15 rounded overflow-hidden">
              <button
                type="button"
                onClick={() => currentIndex > 0 && onNavigate(currentIndex - 1)}
                disabled={currentIndex === 0}
                aria-label="Sertifikat sebelumnya"
                className="w-7 h-7 flex items-center justify-center text-text hover:bg-text/[0.08] disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
              >
                <span className="text-xs">←</span>
              </button>
              <div className="w-px h-3.5 bg-text/15" />
              <button
                type="button"
                onClick={() =>
                  currentIndex < total - 1 && onNavigate(currentIndex + 1)
                }
                disabled={currentIndex === total - 1}
                aria-label="Sertifikat selanjutnya"
                className="w-7 h-7 flex items-center justify-center text-text hover:bg-text/[0.08] disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
              >
                <span className="text-xs">→</span>
              </button>
            </div>

            {/* Close Button */}
            <button
              ref={closeBtnRef}
              type="button"
              onClick={onClose}
              aria-label="Tutup pratinjau sertifikat"
              className="w-7 h-7 rounded flex items-center justify-center text-text-muted hover:text-text hover:bg-text/[0.08] border border-text/15 transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Certificate Display Area (Click to toggle 2x zoom, drag to pan) */}
        <div
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onClick={handleImageClick}
          className={`relative w-full h-[62vh] min-h-[280px] max-h-[560px] rounded bg-white flex items-center justify-center overflow-hidden ${
            zoom > 1
              ? isDragging
                ? 'cursor-grabbing'
                : 'cursor-grab'
              : 'cursor-zoom-in'
          }`}
          title={zoom > 1 ? 'Klik untuk ukuran normal' : 'Klik untuk perbesar 2x'}
        >
          <div
            className="relative w-full h-full transition-transform duration-150 ease-out"
            style={{
              transform: `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${zoom})`,
              transformOrigin: 'center center',
            }}
          >
            <Image
              src={award.certificateImage}
              alt={`Sertifikat ${award.title}`}
              width={award.width || 1280}
              height={award.height || 905}
              className="w-full h-full object-contain pointer-events-none p-2"
              priority
            />
          </div>
        </div>

        {/* Optional verification link */}
        {award.verifyUrl && (
          <div className="flex justify-end pt-1">
            <a
              href={award.verifyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-semibold text-text hover:text-accent transition-colors"
            >
              <span>Verifikasi ↗</span>
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
