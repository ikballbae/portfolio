'use client'

import { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Navbar from '../components/Navbar'
import Contact from '../components/Contact'
import CertificatePaper from './CertificatePaper'
import AwardsLightbox from './AwardsLightbox'
import { useLoading } from '../context/LoadingContext'
import { awardsData } from '../data/awardsData'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

function renderCleanStory(story) {
  if (!story) return null
  const sentences = story
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s && !s.includes('[ISI'))

  if (sentences.length === 0) return null
  return sentences.join(' ')
}

export default function AwardsContent() {
  const { isLoaded } = useLoading()
  const [activeIndex, setActiveIndex] = useState(0)
  const [selectedAward, setSelectedAward] = useState(null)
  const [prefersReduced, setPrefersReduced] = useState(false)
  const triggerRef = useRef(null)
  const listRef = useRef(null)

  const total = awardsData.length

  // Check prefers-reduced-motion
  useEffect(() => {
    if (typeof window === 'undefined') return
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReduced(mq.matches)
    const handler = (e) => setPrefersReduced(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  // Scroll animations: Entrance lift + Left timeline line/node active state
  useEffect(() => {
    if (typeof window === 'undefined' || !listRef.current) return

    const items = listRef.current.querySelectorAll('[data-award-item]')
    if (!items || items.length === 0) return

    const ctx = gsap.context(() => {
      items.forEach((el, index) => {
        // Entrance animation (fade + 16px lift once)
        if (!prefersReduced) {
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
                start: 'top 88%',
                once: true,
              },
            }
          )
        }

        // Active state indicator on scroll
        ScrollTrigger.create({
          trigger: el,
          start: 'top 55%',
          end: 'bottom 45%',
          onEnter: () => setActiveIndex(index),
          onEnterBack: () => setActiveIndex(index),
        })

        // Scrub vertical line fill downwards to next item
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
                  start: 'top 55%',
                  endTrigger: nextEl,
                  end: 'top 55%',
                  scrub: true,
                },
              }
            )
          }
        }
      })
    }, listRef)

    return () => ctx.revert()
  }, [prefersReduced])

  // Open & Close Lightbox
  const handleOpenLightbox = (award, event) => {
    triggerRef.current = event?.currentTarget || null
    setSelectedAward(award)
  }

  const handleCloseLightbox = () => {
    setSelectedAward(null)
    triggerRef.current?.focus()
  }

  const handleNavigateLightbox = (index) => {
    if (awardsData[index]) {
      setSelectedAward(awardsData[index])
    }
  }

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
        {/* Header: Title only, no introductory sentence */}
        <header className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8 mb-8 sm:mb-12">
          <h1 className="font-sans font-bold text-2xl sm:text-3xl md:text-4xl text-text tracking-tight">
            Penghargaan
          </h1>
        </header>

        {/* Timeline Stream: Date on left, vertical rail with —○— node, Content on right */}
        <div
          ref={listRef}
          className="max-w-5xl mx-auto px-3 sm:px-6 md:px-8"
        >
          {awardsData.map((item, index) => {
            const cleanStory = renderCleanStory(item.story)
            const cleanProvincial =
              item.provincialProof && !item.provincialProof.includes('[ISI')
                ? item.provincialProof.trim()
                : null

            // Maximum 3 lines of facts from details
            const displayDetails = (item.details || []).slice(0, 3)

            const isActive = activeIndex === index
            const isPassed = activeIndex > index
            const isLast = index === total - 1

            return (
              <article
                key={item.id}
                data-award-item
                className="relative flex gap-2.5 sm:gap-4 md:gap-8"
              >
                {/* 1. Desktop Date (aligned to the right of the date column, pointing to the node) */}
                <div className="hidden md:block w-32 lg:w-36 flex-shrink-0 text-right pt-0.5 select-none self-start">
                  <p
                    className={`text-xs sm:text-sm font-medium transition-colors duration-300 ${
                      isActive ? 'text-text font-semibold' : 'text-text-muted'
                    }`}
                  >
                    {item.date}
                  </p>
                  <p className="text-[11px] text-text-muted/60 mt-0.5 truncate">
                    {item.level}
                  </p>
                </div>

                {/* 2. Timeline Spine Rail & Circle Node (Exact pattern: —○— on a continuous vertical rail) */}
                <div className="relative flex flex-col items-center flex-shrink-0 pt-1 self-stretch w-5 sm:w-7 md:w-10">
                  {/* Vertical Rail Segment: Upper connection from top-0 to node center (for items after the first) */}
                  {index > 0 && (
                    <div className="absolute top-0 h-3 w-[2px] bg-[var(--timeline-line)] left-1/2 -translate-x-1/2">
                      <div
                        className={`w-full h-full bg-accent transition-opacity duration-300 ${
                          isActive || isPassed ? 'opacity-100' : 'opacity-0'
                        }`}
                      />
                    </div>
                  )}

                  {/* Vertical Rail Segment: From node center downwards to bottom of item (for items before the last) */}
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
                    /* Subtle fade-out tail below the last node */
                    <div className="absolute top-3 w-[2px] h-20 bg-gradient-to-b from-[var(--timeline-line)] to-transparent left-1/2 -translate-x-1/2 pointer-events-none">
                      <div
                        className={`w-full h-12 bg-gradient-to-b from-accent to-transparent transition-opacity duration-500 ${
                          isActive ? 'opacity-100' : 'opacity-0'
                        }`}
                      />
                    </div>
                  )}

                  {/* Horizontal Connector & Circle Node: —○— */}
                  <div className="relative z-10 flex items-center justify-center">
                    {/* Left horizontal tick (desktop only, points toward date column) */}
                    <div
                      className={`hidden md:block w-2 sm:w-2.5 h-[2px] transition-colors duration-300 ${
                        isActive || isPassed ? 'bg-accent' : 'bg-[var(--timeline-tick)]'
                      }`}
                    />

                    {/* Circular Node */}
                    <div
                      className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full border-2 bg-bg flex items-center justify-center transition-all duration-300 ${
                        isActive
                          ? 'border-accent shadow-[0_0_10px_rgba(var(--accent-rgb),0.5)]'
                          : isPassed
                          ? 'border-accent/80'
                          : 'border-[var(--timeline-node-border)]'
                      }`}
                      aria-hidden="true"
                    >
                      {/* Active inner core dot */}
                      <div
                        className={`w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full transition-all duration-300 ${
                          isActive
                            ? 'bg-accent scale-100'
                            : isPassed
                            ? 'bg-accent/70 scale-100'
                            : 'bg-transparent scale-0'
                        }`}
                      />
                    </div>

                    {/* Right horizontal branch line connecting to content */}
                    <div
                      className={`w-2 sm:w-3 h-[2px] transition-colors duration-300 ${
                        isActive || isPassed ? 'bg-accent' : 'bg-[var(--timeline-tick)]'
                      }`}
                    />
                  </div>
                </div>

                {/* 3. Main Content on the Right */}
                <div className="flex-1 min-w-0 pb-14 sm:pb-20 md:pb-28">
                  {/* Mobile Date Header (< md) - Aligned next to node */}
                  <div className="md:hidden flex items-center text-xs text-text-muted mb-2 font-medium">
                    <span>{item.date}</span>
                    <span className="mx-1.5 opacity-40">·</span>
                    <span>{item.level}</span>
                  </div>

                  {/* Two-column layout: Certificate Image (~55%) and Details (~45%) */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8 lg:gap-10 items-start">
                    {/* Left (Desktop ~55%): Certificate sheet */}
                    <div className="lg:col-span-7 flex justify-center lg:justify-start">
                      <CertificatePaper
                        item={item}
                        onOpenLightbox={handleOpenLightbox}
                        prefersReduced={prefersReduced}
                      />
                    </div>

                    {/* Right (Desktop ~45%): Editorial Text */}
                    <div className="lg:col-span-5 flex flex-col justify-start pt-1">
                      {/* Date & Location in plain body font (desktop only to prevent duplication on mobile) */}
                      <p className="hidden md:block text-xs sm:text-sm text-text-muted font-normal mb-1.5">
                        {item.meta}
                      </p>

                      {/* Title */}
                      <h2 className="font-sans font-bold text-lg sm:text-xl text-text tracking-tight leading-snug mb-1">
                        {item.title}
                      </h2>

                      {/* Issuer */}
                      <p className="text-xs sm:text-sm text-text-muted mb-4">
                        {item.issuer}
                      </p>

                      {/* Verified facts: max 3 lines, lowercase/regular labels, no section title */}
                      {displayDetails.length > 0 && (
                        <dl className="space-y-1.5 text-xs mb-4">
                          {displayDetails.map((d) => (
                            <div key={d.label} className="flex items-baseline gap-2">
                              <dt className="text-text-muted font-normal whitespace-nowrap min-w-[95px] sm:min-w-[105px]">
                                {d.label}
                              </dt>
                              <dd className="text-text font-normal break-words flex-1 min-w-0">
                                {d.value}
                              </dd>
                            </div>
                          ))}
                        </dl>
                      )}

                      {/* Story paragraph (only if filled) */}
                      {cleanStory && (
                        <p className="text-xs sm:text-sm text-text/80 leading-relaxed mb-3">
                          {cleanStory}
                        </p>
                      )}

                      {/* Provincial proof (only if filled) */}
                      {cleanProvincial && (
                        <p className="text-xs text-text-muted mb-3">
                          {cleanProvincial}
                        </p>
                      )}

                      {/* Verification link (only if verifyUrl exists) */}
                      {item.verifyUrl && (
                        <div>
                          <a
                            href={item.verifyUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs font-medium text-text hover:text-accent transition-colors select-none"
                          >
                            <span>Verifikasi</span>
                            <span aria-hidden="true">↗</span>
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            )
          })}
        </div>

        <div className="section-divider mt-16 sm:mt-24" />
        <Contact />
      </main>

      {/* Accessible Lightbox Modal */}
      {selectedAward && (
        <AwardsLightbox
          award={selectedAward}
          awards={awardsData}
          currentIndex={awardsData.findIndex((a) => a.id === selectedAward.id)}
          onClose={handleCloseLightbox}
          onNavigate={handleNavigateLightbox}
        />
      )}
    </div>
  )
}
