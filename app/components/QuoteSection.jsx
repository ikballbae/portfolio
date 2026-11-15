'use client'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export default function QuoteSection() {
  const sectionRef = useRef(null)
  const quoteRef = useRef(null)
  const quoteMarkRef = useRef(null)
  const line1Ref = useRef(null)
  const line2Ref = useRef(null)
  const line3Ref = useRef(null)
  const pill1Ref = useRef(null)
  const pill2Ref = useRef(null)
  const dividerRef = useRef(null)

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

      // Stagger kemunculan 3 baris kutipan
      tl.fromTo(
        [line1Ref.current, line2Ref.current, line3Ref.current],
        { opacity: 0, y: 22 },
        { opacity: 1, y: 0, duration: 0.7, stagger: 0.12, ease: 'power3.out' },
        0.08
      )

      // Pil aksen horizontal di baris ke-2 mekar halus
      tl.fromTo(
        [pill1Ref.current, pill2Ref.current],
        { scaleX: 0, opacity: 0 },
        { scaleX: 1, opacity: 1, duration: 0.45, stagger: 0.08, ease: 'power2.out' },
        0.28
      )

      // Garis konektor vision & ethos
      tl.fromTo(
        dividerRef.current,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.55, ease: 'power2.out' },
        0.38
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
  }, [])

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
          <span className="flex flex-col">
            {/* Line 1: Purposeful in code, */}
            <span ref={line1Ref} className="leading-[1.15]">
              <em className="italic font-light text-text/85">Purposeful</em>{' '}
              <span className="font-light text-text-muted/75 text-xl sm:text-3xl md:text-4xl lg:text-5xl">
                in code,
              </span>
            </span>

            {/* Line 2: accent bars + expressive in design */}
            <span ref={line2Ref} className="flex items-center gap-2 sm:gap-3 lg:gap-4 leading-[1.15] my-1 sm:my-2">
              <span ref={pill1Ref} className="mt-1 h-0.5 sm:h-1 w-6 sm:w-12 lg:w-20 rounded-full bg-accent/40 origin-left" />
              <span className="text-text-muted">
                <strong className="font-extrabold text-text">expressive</strong>{' '}
                <span className="text-text-muted/80 font-normal">in</span>{' '}
                <strong className="font-extrabold text-accent">design</strong>
              </span>
              <span ref={pill2Ref} className="mt-1 h-0.5 sm:h-1 w-4 sm:w-8 lg:w-14 rounded-full bg-accent/40 origin-right" />
            </span>

            {/* Line 3: is my standard (Garis bawah dihapus bersih) */}
            <span ref={line3Ref} className="leading-[1.15]">
              <span className="font-light text-text/70">is my</span>{' '}
              <strong className="font-extrabold text-accent inline-block">
                standard.
              </strong>
            </span>
          </span>
        </blockquote>
      </div>

      {/* Subtle organic gradient connector leading smoothly to About section */}
      <div ref={dividerRef} className="mt-12 sm:mt-16 max-w-4xl mx-auto px-6 flex items-center justify-center gap-3">
        <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
        <span className="font-mono text-[9px] tracking-widest text-text-muted/40 uppercase">
          vision &amp; ethos
        </span>
        <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
      </div>
    </section>
  )
}
