'use client'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { visionNote } from '../data/visionData'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export default function QuoteSection() {
  const sectionRef = useRef(null)
  const quoteRef = useRef(null)
  const quoteMarkRef = useRef(null)
  const quoteTextRef = useRef(null)
  const noteRef = useRef(null)
  const dividerRef = useRef(null)

  const hasNote = Boolean(visionNote && visionNote.trim() !== '')

  useEffect(() => {
    if (typeof window === 'undefined') return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const ctx = gsap.context(() => {
      // Animasi scroll masuk simpel & anggun
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 82%',
          toggleActions: 'play none none reverse',
        },
      })

      // SVG tanda kutip
      tl.fromTo(
        quoteMarkRef.current,
        { opacity: 0, scale: 0.75, y: 14 },
        { opacity: 0.25, scale: 1, y: 0, duration: 0.6, ease: 'power2.out' },
        0
      )

      // Kemunculan kutipan
      tl.fromTo(
        quoteTextRef.current,
        { opacity: 0, y: 22 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' },
        0.08
      )

      // Keterangan opsional (jika ada)
      if (noteRef.current) {
        tl.fromTo(
          noteRef.current,
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
          0.2
        )
      }

      // Garis konektor vision & ethos
      tl.fromTo(
        dividerRef.current,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.55, ease: 'power2.out' },
        0.25
      )

      // Parallax scroll halus saat melintasi viewport
      gsap.to(quoteRef.current, {
        y: -16,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.2,
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [hasNote])

  return (
    <section ref={sectionRef} className="relative pt-10 sm:pt-16 md:pt-20 pb-8 sm:pb-12 md:pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8 flex items-center justify-center">
        <blockquote
          ref={quoteRef}
          className="relative flex items-start gap-3 sm:gap-5 md:gap-7 text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-syne select-none"
        >
          {/* SVG Double Quotes */}
          <svg
            ref={quoteMarkRef}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            role="img"
            fill="currentColor"
            className="-mt-1 h-9 sm:h-14 md:h-20 lg:h-24 text-accent/25 shrink-0"
            aria-hidden="true"
          >
            <path d="M7.27273 16.3833H0L5.30713 4H10.0737L7.27273 16.3833ZM17.199 16.3833H9.92629L15.2334 4H20L17.199 16.3833Z" />
          </svg>

          {/* Quote Typography Composition */}
          <div className="flex flex-col">
            <h2
              ref={quoteTextRef}
              className="leading-[1.15] font-bold text-text text-balance [text-wrap:balance] max-w-2xl"
            >
              Built for people who <span className="text-accent">actually use</span> it.
            </h2>

            {/* Keterangan opsional: hanya dirender jika visionNote terisi */}
            {hasNote && (
              <p
                ref={noteRef}
                className="mt-3 sm:mt-4 text-xs sm:text-sm font-sans font-normal text-text-muted"
              >
                {visionNote}
              </p>
            )}
          </div>
        </blockquote>
      </div>

      {/* Subtle organic gradient connector leading smoothly to About section */}
      <div ref={dividerRef} className="mt-12 sm:mt-16 max-w-4xl mx-auto px-6 flex items-center justify-center gap-3">
        <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
        <span className="font-mono text-[9px] tracking-widest text-text-muted/80 uppercase">
          vision &amp; ethos
        </span>
        <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
      </div>
    </section>
  )
}
