'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { gsap } from 'gsap'

export default function CertificatePaper({
  item,
  onOpenLightbox,
  prefersReduced = false,
}) {
  const containerRef = useRef(null)
  const cardRef = useRef(null)
  const [isTouch, setIsTouch] = useState(false)
  const [hasError, setHasError] = useState(false)

  // GSAP quickTo setters for 3D tilt
  const setRotateX = useRef(null)
  const setRotateY = useRef(null)

  // Detect touch device
  useEffect(() => {
    if (typeof window === 'undefined') return
    const mq = window.matchMedia('(pointer: coarse)')
    setIsTouch(mq.matches)
    const handler = (e) => setIsTouch(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  // Setup GSAP quickTo
  useEffect(() => {
    if (!cardRef.current || prefersReduced || isTouch) return

    setRotateX.current = gsap.quickTo(cardRef.current, 'rotateX', {
      duration: 0.2,
      ease: 'power2.out',
    })
    setRotateY.current = gsap.quickTo(cardRef.current, 'rotateY', {
      duration: 0.2,
      ease: 'power2.out',
    })
  }, [prefersReduced, isTouch])

  const handleMouseMove = useCallback(
    (e) => {
      if (isTouch || prefersReduced || !containerRef.current) return

      const rect = containerRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      const normX = Math.max(-1, Math.min(1, (x / rect.width) * 2 - 1))
      const normY = Math.max(-1, Math.min(1, (y / rect.height) * 2 - 1))

      // Gentle tilt: max ±3 degrees
      if (setRotateX.current && setRotateY.current) {
        setRotateX.current(-normY * 3)
        setRotateY.current(normX * 3)
      }
    },
    [isTouch, prefersReduced]
  )

  const handleMouseLeave = useCallback(() => {
    if (prefersReduced || isTouch || !cardRef.current) return
    gsap.to(cardRef.current, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.4,
      ease: 'power2.out',
    })
  }, [prefersReduced, isTouch])

  const handleClick = (e) => {
    onOpenLightbox?.(item, e)
  }

  const baseRotation = item.rotation || 0

  if (hasError || !item.certificateImage) {
    return (
      <div
        className="w-full max-w-[500px] aspect-[1.414/1] rounded-sm border border-dashed border-text/20 bg-surface/40 flex flex-col items-center justify-center p-6 text-center select-none"
        style={{
          transform: prefersReduced ? 'none' : `rotate(${baseRotation}deg)`,
        }}
      >
        <p className="text-xs text-text-muted">Sertifikat segera ditambahkan</p>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          handleClick(e)
        }
      }}
      aria-label={`Buka pratinjau sertifikat ${item.title}`}
      className="relative w-full max-w-[520px] aspect-[1.414/1] select-none perspective-[1000px] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text/50 rounded-sm"
      style={{
        transform: prefersReduced ? 'none' : `rotate(${baseRotation}deg)`,
      }}
    >
      <div
        ref={cardRef}
        className="relative w-full h-full rounded-sm overflow-hidden bg-white shadow-md shadow-black/20 dark:shadow-xl dark:shadow-black/70 ring-1 ring-black/10 dark:ring-white/10 transition-shadow duration-200 hover:shadow-lg dark:hover:shadow-2xl"
        style={{
          transformStyle: 'preserve-3d',
        }}
      >
        <Image
          src={item.certificateImage}
          alt={`Sertifikat ${item.title} — ${item.meta}`}
          width={item.width || 1280}
          height={item.height || 905}
          className="w-full h-full object-contain p-1 bg-white pointer-events-none"
          priority={item.id === 'juara-1-desain-poster-pkfest-2024'}
          onError={() => setHasError(true)}
        />
      </div>
    </div>
  )
}
