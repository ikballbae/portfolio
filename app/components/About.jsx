'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ScrollReveal from './ScrollReveal'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

const manifestoTokens = [
  { text: 'I', highlight: false },
  { text: "don't", highlight: false },
  { text: 'just', highlight: false },
  { text: 'write', highlight: false },
  { text: 'code.', highlight: false },
  { text: 'I', highlight: false },
  { text: 'shape', highlight: false },
  { text: 'systems', highlight: true },
  { text: 'where', highlight: false },
  { text: 'engineering', highlight: false },
  { text: 'logic', highlight: false },
  { text: 'meets', highlight: false },
  { text: 'visual', highlight: true },
  { text: 'craft.', highlight: true },
]

const pillars = [
  {
    id: 'fullstack',
    index: '01',
    mobileShortTitle: 'Full-Stack',
    title: 'Full-Stack Engineering',
    tagline: 'Skema Database & Dashboard Web',
    desc: 'Merancang skema database relasional MySQL serta membangun halaman admin dan alur transaksi menggunakan Laravel, Next.js, dan Tailwind CSS.',
    highlights: ['Next.js & React', 'Laravel & MySQL', 'Midtrans Gateway', 'Tailwind CSS'],
  },
  {
    id: 'design',
    index: '02',
    mobileShortTitle: 'Visual Craft',
    title: 'Visual & Brand Craft',
    tagline: 'Expressive UI Systems & Typography',
    desc: 'Meraih Juara 1 Desain Poster di STMIK Widya Pratama dan Juara 1 LKS Web Technology Tingkat Kabupaten Pekalongan. Memadukan struktur antarmuka yang presisi dengan visual yang fungsional.',
    highlights: ['Design Systems', 'Typography & Contrast', 'Motion & GSAP', 'Brand Identity'],
  },
  {
    id: 'leadership',
    index: '03',
    mobileShortTitle: 'Leadership',
    title: 'Community Leadership',
    tagline: 'Mentorship, Events & Community Growth',
    desc: 'Ketua Umum UKM Pengembangan Komputer (UKM PK), STMIK Widya Pratama periode 2025/2026. Mengarahkan program kerja seperti PKFest, inisiatif Goes to School, serta memfasilitasi kelompok belajar teknologi.',
    highlights: ['Ketua Umum UKM PK', 'Periode 2025/2026', 'PKFest Organizer', 'Goes to School'],
  },
]

// 3D Isometric Stack Graphic Component with Hardware-Accelerated Transforms
function IsometricBlueprintStack({ activeIndex, onSelectIndex, compact = false }) {
  const containerRef = useRef(null)
  const isInitial = useRef(true)
  const cx = 190
  const layerYs = [90, 185, 280]
  const W2 = 64
  const H2 = 36
  const T = 50

  useEffect(() => {
    if (typeof window === 'undefined') return
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    const el = containerRef.current
    if (!el) return

    // Hardware-accelerated GPU transforms with silky smooth easing
    const dur = isInitial.current ? 0 : 0.48
    const ease = 'power3.out'

    ;[0, 1, 2].forEach((idx) => {
      const plate = el.querySelector(`.pop-plate-${idx}`)
      if (!plate) return

      if (idx === activeIndex) {
        if (isInitial.current) {
          if (idx === 0) gsap.set(plate, { y: -22, opacity: 1 })
          else gsap.set(plate, { x: -34, y: 17, opacity: 1 })
        } else {
          if (idx === 0) {
            gsap.fromTo(
              plate,
              { y: -10, opacity: 0.4 },
              { y: -22, opacity: 1, duration: dur, ease, overwrite: 'auto' }
            )
          } else {
            gsap.fromTo(
              plate,
              { x: -14, y: 7, opacity: 0.4 },
              { x: -34, y: 17, opacity: 1, duration: dur, ease, overwrite: 'auto' }
            )
          }
        }
      } else {
        if (isInitial.current) {
          gsap.set(plate, { x: 0, y: 0, opacity: 0 })
        } else {
          if (idx === 0) {
            gsap.to(plate, { y: 0, opacity: 0, duration: 0.28, ease: 'power2.inOut', overwrite: 'auto' })
          } else {
            gsap.to(plate, { x: 0, y: 0, opacity: 0, duration: 0.28, ease: 'power2.inOut', overwrite: 'auto' })
          }
        }
      }
    })

    isInitial.current = false
  }, [activeIndex])

  return (
    <div
      ref={containerRef}
      className={`relative w-full mx-auto select-none ${
        compact ? 'max-w-[200px] sm:max-w-[240px]' : 'max-w-[340px] sm:max-w-[380px]'
      }`}
    >
      {/* Active Focus Pill */}
      <div className="flex items-center justify-between mb-2 sm:mb-3 px-1 sm:px-2 gap-2 text-[10px] sm:text-xs">
        <span className="font-sans text-text-muted/80 font-medium">
          Focus
        </span>
        <span className="font-sans text-accent font-semibold tracking-wide truncate text-right">
          {pillars[activeIndex]?.title}
        </span>
      </div>

      <svg
        viewBox="0 0 380 400"
        className="w-full h-auto"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="activePlateGlow" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.25" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.05" />
          </linearGradient>
        </defs>

        {/* Outer connection guide line */}
        <line
          x1={cx}
          y1={40}
          x2={cx}
          y2={370}
          stroke="var(--accent)"
          strokeOpacity="0.12"
          strokeDasharray="3 4"
        />

        {/* Render 3 Layers (from bottom to top) */}
        {[2, 1, 0].map((idx) => {
          const cy = layerYs[idx]
          const isActive = activeIndex === idx

          return (
            <g
              key={idx}
              onClick={() => onSelectIndex(idx)}
              className="cursor-pointer group"
            >
              {/* Left Face */}
              <polygon
                points={`
                  ${cx - W2},${cy}
                  ${cx},${cy + H2}
                  ${cx},${cy + H2 + T}
                  ${cx - W2},${cy + T}
                `}
                fill={isActive ? 'var(--surface)' : 'var(--surface-light)'}
                fillOpacity={isActive ? '0.85' : '0.35'}
                stroke={isActive ? 'var(--accent)' : 'var(--text)'}
                strokeOpacity={isActive ? '0.6' : '0.12'}
                strokeWidth={isActive ? '1.5' : '1'}
                strokeLinejoin="round"
              />

              {/* Right Face */}
              <polygon
                points={`
                  ${cx},${cy + H2}
                  ${cx + W2},${cy}
                  ${cx + W2},${cy + T}
                  ${cx},${cy + H2 + T}
                `}
                fill={isActive ? 'var(--surface)' : 'var(--surface-light)'}
                fillOpacity={isActive ? '0.7' : '0.25'}
                stroke={isActive ? 'var(--accent)' : 'var(--text)'}
                strokeOpacity={isActive ? '0.5' : '0.1'}
                strokeWidth={isActive ? '1.5' : '1'}
                strokeLinejoin="round"
              />

              {/* Vertical Dashed Guide Lines on Left Face */}
              <line
                x1={cx - W2 * 0.66}
                y1={cy + H2 * 0.33}
                x2={cx - W2 * 0.66}
                y2={cy + H2 * 0.33 + T}
                stroke={isActive ? 'var(--accent)' : 'var(--text)'}
                strokeOpacity={isActive ? '0.4' : '0.08'}
                strokeDasharray="2 3"
              />
              <line
                x1={cx - W2 * 0.33}
                y1={cy + H2 * 0.66}
                x2={cx - W2 * 0.33}
                y2={cy + H2 * 0.66 + T}
                stroke={isActive ? 'var(--accent)' : 'var(--text)'}
                strokeOpacity={isActive ? '0.4' : '0.08'}
                strokeDasharray="2 3"
              />

              {/* Top Face Rhombus */}
              <polygon
                points={`
                  ${cx},${cy - H2}
                  ${cx + W2},${cy}
                  ${cx},${cy + H2}
                  ${cx - W2},${cy}
                `}
                fill={isActive ? 'var(--surface)' : 'var(--surface-light)'}
                fillOpacity={isActive ? '0.95' : '0.45'}
                stroke={isActive ? 'var(--accent)' : 'var(--text)'}
                strokeOpacity={isActive ? '0.75' : '0.16'}
                strokeWidth={isActive ? '1.8' : '1'}
                strokeLinejoin="round"
              />

              {/* Top Face Inner Rounded Ring */}
              <polygon
                points={`
                  ${cx},${cy - H2 * 0.45}
                  ${cx + W2 * 0.45},${cy}
                  ${cx},${cy + H2 * 0.45}
                  ${cx - W2 * 0.45},${cy}
                `}
                fill={isActive ? 'var(--accent)' : 'none'}
                fillOpacity={isActive ? '0.15' : '0'}
                stroke={isActive ? 'var(--accent)' : 'var(--text)'}
                strokeOpacity={isActive ? '0.8' : '0.1'}
                strokeWidth={isActive ? '1.5' : '1'}
                strokeDasharray={isActive ? 'none' : '2 2'}
                strokeLinejoin="round"
              />

              {/* Level Indicator Number */}
              <text
                x={cx + W2 + 12}
                y={cy + 8}
                className="font-mono text-[10px] font-semibold"
                fill={isActive ? 'var(--accent)' : 'var(--text-muted)'}
                opacity={isActive ? 1 : 0.4}
              >
                0{idx + 1}
              </text>

              {/* GPU Hardware-Accelerated Pop-Out Plates */}
              {idx === 0 && (
                <g
                  className="pop-plate pop-plate-0 will-change-transform"
                  style={{ opacity: 0, pointerEvents: 'none' }}
                >
                  <polygon
                    points={`
                      ${cx},${cy - H2}
                      ${cx + W2},${cy}
                      ${cx},${cy + H2}
                      ${cx - W2},${cy}
                    `}
                    fill="url(#activePlateGlow)"
                    stroke="var(--accent)"
                    strokeWidth="2.2"
                    strokeLinejoin="round"
                  />
                  <polygon
                    points={`
                      ${cx},${cy - H2 * 0.55}
                      ${cx + W2 * 0.55},${cy}
                      ${cx},${cy + H2 * 0.55}
                      ${cx - W2 * 0.55},${cy}
                    `}
                    stroke="var(--accent)"
                    strokeWidth="1.8"
                    strokeLinejoin="round"
                  />
                </g>
              )}

              {idx === 1 && (
                <g
                  className="pop-plate pop-plate-1 will-change-transform"
                  style={{ opacity: 0, pointerEvents: 'none' }}
                >
                  <polygon
                    points={`
                      ${cx - W2},${cy}
                      ${cx},${cy + H2}
                      ${cx},${cy + H2 + T}
                      ${cx - W2},${cy + T}
                    `}
                    fill="url(#activePlateGlow)"
                    stroke="var(--accent)"
                    strokeWidth="2.2"
                    strokeLinejoin="round"
                  />
                  <line
                    x1={cx - W2 * 0.75}
                    y1={cy + H2 * 0.25 + 4}
                    x2={cx - W2 * 0.75}
                    y2={cy + H2 * 0.25 + T - 4}
                    stroke="var(--accent)"
                    strokeWidth="1.5"
                    strokeDasharray="3 3"
                  />
                  <line
                    x1={cx - W2 * 0.5}
                    y1={cy + H2 * 0.5 + 4}
                    x2={cx - W2 * 0.5}
                    y2={cy + H2 * 0.5 + T - 4}
                    stroke="var(--accent)"
                    strokeWidth="1.5"
                    strokeDasharray="3 3"
                  />
                  <line
                    x1={cx - W2 * 0.25}
                    y1={cy + H2 * 0.75 + 4}
                    x2={cx - W2 * 0.25}
                    y2={cy + H2 * 0.75 + T - 4}
                    stroke="var(--accent)"
                    strokeWidth="1.5"
                    strokeDasharray="3 3"
                  />
                </g>
              )}

              {idx === 2 && (
                <g
                  className="pop-plate pop-plate-2 will-change-transform"
                  style={{ opacity: 0, pointerEvents: 'none' }}
                >
                  <polygon
                    points={`
                      ${cx - W2},${cy}
                      ${cx},${cy + H2}
                      ${cx},${cy + H2 + T}
                      ${cx - W2},${cy + T}
                    `}
                    fill="url(#activePlateGlow)"
                    stroke="var(--accent)"
                    strokeWidth="2.2"
                    strokeLinejoin="round"
                  />
                  <line
                    x1={cx - W2 * 0.75}
                    y1={cy + H2 * 0.25 + 4}
                    x2={cx - W2 * 0.75}
                    y2={cy + H2 * 0.25 + T - 4}
                    stroke="var(--accent)"
                    strokeWidth="1.5"
                    strokeDasharray="3 3"
                  />
                  <line
                    x1={cx - W2 * 0.5}
                    y1={cy + H2 * 0.5 + 4}
                    x2={cx - W2 * 0.5}
                    y2={cy + H2 * 0.5 + T - 4}
                    stroke="var(--accent)"
                    strokeWidth="1.5"
                    strokeDasharray="3 3"
                  />
                  <line
                    x1={cx - W2 * 0.25}
                    y1={cy + H2 * 0.75 + 4}
                    x2={cx - W2 * 0.25}
                    y2={cy + H2 * 0.75 + T - 4}
                    stroke="var(--accent)"
                    strokeWidth="1.5"
                    strokeDasharray="3 3"
                  />
                </g>
              )}
            </g>
          )
        })}
      </svg>
    </div>
  )
}

export default function About() {
  const desktopListRef = useRef(null)
  const mobileCardRef = useRef(null)
  const [activeTab, setActiveTab] = useState(0)
  const isInitialTab = useRef(true)

  // Fluid GSAP animations & micro-interactions on tab change
  useEffect(() => {
    if (typeof window === 'undefined') return
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    if (isInitialTab.current) {
      isInitialTab.current = false
      return
    }

    // Desktop active card tactile scale rebound + border glow pulse + items transition
    if (desktopListRef.current) {
      const activeCard = desktopListRef.current.querySelector(`.desktop-card-${activeTab}`)
      if (activeCard) {
        // Micro-interaction: tactile scale rebound + accent glow pulse
        gsap.fromTo(
          activeCard,
          {
            scale: 0.985,
            borderColor: 'var(--accent)',
            boxShadow: '0 0 24px -2px rgba(var(--accent-rgb), 0.28)',
          },
          {
            scale: 1,
            borderColor: 'rgba(var(--accent-rgb), 0.25)',
            boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.25)',
            duration: 0.45,
            ease: 'back.out(1.5)',
            overwrite: 'auto',
          }
        )

        const animItems = activeCard.querySelectorAll('.card-gsap-item')
        if (animItems.length > 0) {
          gsap.fromTo(
            animItems,
            { opacity: 0, y: 8 },
            { opacity: 1, y: 0, duration: 0.4, stagger: 0.04, ease: 'power3.out', overwrite: 'auto' }
          )
        }
      }
    }

    // Mobile card tactile scale rebound + border glow pulse + items transition
    if (mobileCardRef.current) {
      gsap.fromTo(
        mobileCardRef.current,
        {
          scale: 0.985,
          borderColor: 'var(--accent)',
          boxShadow: '0 0 24px -2px rgba(var(--accent-rgb), 0.28)',
        },
        {
          scale: 1,
          borderColor: 'rgba(var(--accent-rgb), 0.25)',
          boxShadow: '0 8px 24px -8px rgba(0, 0, 0, 0.25)',
          duration: 0.45,
          ease: 'back.out(1.5)',
          overwrite: 'auto',
        }
      )

      const mobileItems = mobileCardRef.current.querySelectorAll('.mobile-gsap-item')
      if (mobileItems.length > 0) {
        gsap.fromTo(
          mobileItems,
          { opacity: 0, y: 8 },
          { opacity: 1, y: 0, duration: 0.4, stagger: 0.04, ease: 'power3.out', overwrite: 'auto' }
        )
      }
    }
  }, [activeTab])

  return (
    <section id="about" className="section-padding relative">
      <div className="max-w-6xl mx-auto">
        {/* Section Label */}
        <ScrollReveal>
          <div className="flex items-center gap-2 sm:gap-3 mb-8 sm:mb-12 md:mb-16">
            <span className="text-[10px] sm:text-xs font-mono text-accent tracking-wider font-semibold">
              01
            </span>
            <span className="w-8 sm:w-16 h-[1px] bg-accent/25" />
            <span className="text-[10px] sm:text-xs font-mono text-text-muted tracking-wider uppercase">
              About / README.md
            </span>
          </div>
        </ScrollReveal>

        {/* Editorial Manifesto */}
        <div className="mb-10 sm:mb-14 md:mb-18">
          <ScrollReveal delay={0.1}>
            <h2
              className="font-sans font-bold text-2xl sm:text-4xl md:text-5xl lg:text-[54px] leading-[1.25] tracking-tight max-w-5xl mb-6 sm:mb-8 flex flex-wrap gap-x-[0.26em] gap-y-1.5 sm:gap-y-2"
            >
              {manifestoTokens.map((token, idx) => (
                <span
                  key={idx}
                  className={`inline-block ${
                    token.highlight ? 'text-accent' : 'text-text'
                  }`}
                >
                  {token.text}
                </span>
              ))}
            </h2>
          </ScrollReveal>

          {/* High-Contrast Bio */}
          <ScrollReveal delay={0.2}>
            <div className="max-w-2xl">
              <p className="text-text/85 text-sm sm:text-base md:text-lg leading-relaxed">
                Information Systems student based in{' '}
                <span className="text-text font-semibold">Pekalongan, Indonesia</span>. I bridge backend
                architecture and expressive visual design so software feels both reliable under the
                hood and effortless on screen.
              </p>
            </div>
          </ScrollReveal>
        </div>

        {/* =========================================================================
            Interactive Feature Showcase with Synchronized 3D Blueprint Visual
           ========================================================================= */}
        <div className="pt-6 sm:pt-8 border-t border-text/10">
          <ScrollReveal delay={0.15}>
            {/* DESKTOP LAYOUT (>= lg): Smooth In-Place Expanding Rows + 3D Stack */}
            <div className="hidden lg:grid lg:grid-cols-12 gap-12 xl:gap-14 items-start">
              {/* Left: Fluid Expanding Feature Rows */}
              <div ref={desktopListRef} className="lg:col-span-7 space-y-3">
                {pillars.map((item, idx) => {
                  const isActive = activeTab === idx

                  return (
                    <div
                      key={item.id}
                      className={`desktop-card-${idx} overflow-hidden rounded-2xl p-5 sm:p-6 transition-[background-color,border-color,box-shadow] duration-300 ${
                        isActive
                          ? 'bg-surface border border-accent/25 shadow-lg shadow-black/20'
                          : 'bg-transparent border border-transparent hover:bg-surface/30'
                      }`}
                    >
                      {/* Header Row (Always clickable) */}
                      <button
                        type="button"
                        onClick={() => setActiveTab(idx)}
                        className="w-full text-left flex items-center justify-between cursor-pointer focus-visible:outline-none group select-none"
                      >
                        <div className="flex items-center gap-3.5">
                          <span
                            className={`font-mono text-xs font-semibold tracking-wider transition-colors duration-300 ${
                              isActive ? 'text-accent' : 'text-text-muted group-hover:text-accent'
                            }`}
                          >
                            /{item.index}
                          </span>
                          <h3
                            className={`font-sans font-bold text-lg sm:text-xl transition-colors duration-300 ${
                              isActive
                                ? 'text-text'
                                : 'text-text/85 group-hover:text-text'
                            }`}
                          >
                            {item.title}
                          </h3>
                        </div>

                        <div className="flex items-center gap-2">
                          {isActive ? (
                            <span className="card-gsap-item font-mono text-[10px] text-accent/90 bg-accent/10 px-2.5 py-0.5 rounded-full border border-accent/20">
                              {item.tagline}
                            </span>
                          ) : (
                            <span className="font-mono text-xs text-text-muted group-hover:text-accent group-hover:translate-x-1 transition-all duration-300">
                              →
                            </span>
                          )}
                        </div>
                      </button>

                      {/* Smooth Accordion Body (Fluid CSS Grid Animation with Zero Margin Snap) */}
                      <div
                        className={`grid transition-[grid-template-rows,opacity] duration-350 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                          isActive
                            ? 'grid-rows-[1fr] opacity-100'
                            : 'grid-rows-[0fr] opacity-0 pointer-events-none'
                        }`}
                      >
                        <div className="overflow-hidden">
                          <div className="pt-4">
                            <p className="card-gsap-item text-text/90 text-sm sm:text-base leading-relaxed mb-4">
                              {item.desc}
                            </p>

                            <div className="card-gsap-item flex flex-wrap gap-2 pt-3 border-t border-text/10">
                              {item.highlights.map((tag) => (
                                <span
                                  key={tag}
                                  className="font-mono text-[11px] text-text/90 bg-bg px-2.5 py-1 rounded-md border border-text/5"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Right: Large Synchronized 3D Blueprint Isometric Stack */}
              <div className="lg:col-span-5 flex flex-col items-center justify-center pt-2">
                <IsometricBlueprintStack
                  activeIndex={activeTab}
                  onSelectIndex={(idx) => setActiveTab(idx)}
                />
                <span className="font-mono text-[10px] text-text-muted/80 tracking-wider mt-3">
                  Click tabs or layers to inspect system slice
                </span>
              </div>
            </div>

            {/* MOBILE & TABLET LAYOUT (< lg) */}
            <div className="lg:hidden space-y-4">
              {/* Touch-Friendly Segmented Tabs */}
              <div className="grid grid-cols-3 gap-1.5 p-1.5 rounded-2xl bg-surface border border-text/10">
                {pillars.map((item, idx) => {
                  const isActive = activeTab === idx
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setActiveTab(idx)}
                      className={`min-h-[46px] py-2 px-1.5 rounded-xl text-center font-sans font-semibold text-xs transition-all duration-300 cursor-pointer flex flex-col items-center justify-center gap-0.5 active:scale-[0.98] ${
                        isActive
                          ? 'bg-accent/15 text-accent border border-accent/35 shadow-sm'
                          : 'text-text-muted hover:text-text'
                      }`}
                    >
                      <span className="font-mono text-[9px] opacity-70">/{item.index}</span>
                      <span className="truncate w-full font-medium leading-tight">
                        {item.mobileShortTitle}
                      </span>
                    </button>
                  )
                })}
              </div>

              {/* Active Content Card with Integrated 3D Visual */}
              <div
                ref={mobileCardRef}
                className="rounded-2xl p-5 bg-surface border border-accent/25 shadow-lg"
              >
                <div className="py-2 border-b border-text/10">
                  <IsometricBlueprintStack
                    activeIndex={activeTab}
                    onSelectIndex={(idx) => setActiveTab(idx)}
                    compact
                  />
                </div>

                <div className="pt-4">
                  <div className="mobile-gsap-item flex items-center justify-between mb-2">
                    <span className="font-mono text-[11px] text-accent font-semibold tracking-wider">
                      /{pillars[activeTab].index}
                    </span>
                    <span className="font-mono text-[10px] text-accent/80 bg-accent/10 px-2.5 py-0.5 rounded-full border border-accent/20">
                      {pillars[activeTab].tagline}
                    </span>
                  </div>

                  <h3 className="mobile-gsap-item font-sans font-bold text-lg sm:text-xl text-text tracking-tight mb-2">
                    {pillars[activeTab].title}
                  </h3>

                  <p className="mobile-gsap-item text-text/85 text-xs sm:text-sm leading-relaxed mb-4">
                    {pillars[activeTab].desc}
                  </p>

                  <div className="mobile-gsap-item flex flex-wrap gap-1.5 pt-3 border-t border-text/10">
                    {pillars[activeTab].highlights.map((tag) => (
                      <span
                        key={tag}
                        className="font-mono text-[10px] text-text/90 bg-bg px-2.5 py-1 rounded-md border border-text/5"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Factual link to Awards page */}
          <ScrollReveal delay={0.1}>
            <div className="mt-8 pt-4 border-t border-text/10 flex items-center justify-between flex-wrap gap-3">
              <span className="text-xs font-mono text-text-muted">
                Prestasi kompetisi & apresiasi akademik
              </span>
              <Link
                href="/awards"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent hover:underline select-none"
              >
                <span>Lihat halaman penghargaan</span>
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}
