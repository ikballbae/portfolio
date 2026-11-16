'use client'

import React, { useRef, useState, useEffect, useCallback } from 'react'
import { gsap } from 'gsap'
import { SplitText } from 'gsap/SplitText'
import { useGSAP } from '@gsap/react'
import { useLoading } from '../context/LoadingContext'

if (typeof window !== 'undefined') {
    gsap.registerPlugin(SplitText, useGSAP)
}

// ==========================================
// KONSTANTA & VARIABEL YANG MUDAH DISESUAIKAN
// ==========================================
export const PRELOADER_CONFIG = {
    // Mode pengembangan: ubah ke true bila ingin loader hanya muncul 1x per sesi
    SHOW_ONCE_PER_SESSION: false,
    SESSION_STORAGE_KEY: 'portfolio_preloader_seen',

    // Durasi minimum loading di desktop (milidetik)
    MIN_DURATION_MS: 2500,

    // Durasi fail-safe maksimal di mobile (milidetik, aman untuk durasi halus ~2.8s - 3.2s)
    MOBILE_MAX_DURATION_MS: 4800,

    // Batas fail-safe maksimal di desktop (milidetik)
    FAIL_SAFE_TIMEOUT_MS: 6000,

    // Teks terminal berurutan (1 baris terpusat)
    TERMINAL_STEPS: [
        '> booting creative_engine...',
        '> loading projects, design, community...',
        '> ready.',
    ],

    // Nama reveal di 100%
    NAME_FIRST: 'Akhmad ',
    NAME_HIGHLIGHT: 'Ikbal.',
}

export default function Preloader() {
    const { markLoaded } = useLoading()
    const [mounted, setMounted] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)

    // DOM references
    const panelTopRef = useRef<HTMLDivElement>(null)
    const panelBottomRef = useRef<HTMLDivElement>(null)
    const centerGroupRef = useRef<HTMLDivElement>(null)
    const counterNumberRef = useRef<HTMLHeadingElement>(null)
    const ringCircleRef = useRef<SVGCircleElement>(null)
    const ringDotRef = useRef<SVGCircleElement>(null)
    const lineProgressBarRef = useRef<HTMLDivElement>(null)
    const terminalTextRef = useRef<HTMLParagraphElement>(null)
    const nameContainerRef = useRef<HTMLDivElement>(null)
    const nameTextRef = useRef<HTMLHeadingElement>(null)

    const isFinishedRef = useRef(false)
    const isSkippingRef = useRef(false)
    const mountTimeRef = useRef<number>(0)
    const timelineRef = useRef<gsap.core.Timeline | null>(null)
    const exitTlRef = useRef<gsap.core.Timeline | null>(null)
    const failSafeTimerRef = useRef<number | null>(null)
    const desktopWaitTimerRef = useRef<number | null>(null)
    const splitInstanceRef = useRef<InstanceType<typeof SplitText> | null>(null)
    const RADIUS = 80
    const CIRCUMFERENCE = 2 * Math.PI * RADIUS

    // 1. Initial mounting check (Session Storage & URL params)
    useEffect(() => {
        if (typeof window === 'undefined') return

        const urlParams = new URLSearchParams(window.location.search)
        const forceLoad = urlParams.get('load') === '1'
        const skipLoad = urlParams.get('load') === '0'

        if (skipLoad) {
            ;(window as unknown as { __heroRevealed?: boolean }).__heroRevealed = true
            markLoaded()
            window.dispatchEvent(new CustomEvent('hero:reveal'))
            return
        }

        if (PRELOADER_CONFIG.SHOW_ONCE_PER_SESSION && !forceLoad) {
            try {
                const seen = sessionStorage.getItem(PRELOADER_CONFIG.SESSION_STORAGE_KEY)
                if (seen === 'true') {
                    ;(window as unknown as { __heroRevealed?: boolean }).__heroRevealed = true
                    markLoaded()
                    window.dispatchEvent(new CustomEvent('hero:reveal'))
                    return
                }
            } catch {
                // Ignore storage error
            }
        }

        document.body.style.overflow = 'hidden'
        window.scrollTo(0, 0)
        mountTimeRef.current = performance.now()
        setMounted(true)
    }, [markLoaded])

    // 2. Safe completion callback (Unmount loader & reveal page)
    const handleCompletion = useCallback(() => {
        if (isFinishedRef.current) return
        isFinishedRef.current = true

        if (failSafeTimerRef.current) {
            clearTimeout(failSafeTimerRef.current)
            failSafeTimerRef.current = null
        }
        if (desktopWaitTimerRef.current) {
            clearTimeout(desktopWaitTimerRef.current)
            desktopWaitTimerRef.current = null
        }
        if (exitTlRef.current) {
            exitTlRef.current.kill()
            exitTlRef.current = null
        }
        if (timelineRef.current) {
            timelineRef.current.kill()
            timelineRef.current = null
        }

        if (typeof window !== 'undefined' && mountTimeRef.current > 0) {
            ;(window as unknown as { __preloaderDurationMs?: number }).__preloaderDurationMs = Math.round(
                performance.now() - mountTimeRef.current
            )
        }
        document.body.style.overflow = ''
        window.scrollTo(0, 0)
        const win = window as Window & { __heroRevealed?: boolean; __lenis?: { scrollTo: (target: number, opts: { immediate: boolean }) => void } }
        if (win.__lenis) {
            win.__lenis.scrollTo(0, { immediate: true })
        }
        const alreadyRevealed = win.__heroRevealed === true
        win.__heroRevealed = true
        if (PRELOADER_CONFIG.SHOW_ONCE_PER_SESSION) {
            try {
                sessionStorage.setItem(PRELOADER_CONFIG.SESSION_STORAGE_KEY, 'true')
            } catch {
                // Ignore storage error
            }
        }

        markLoaded()
        if (!alreadyRevealed) {
            window.dispatchEvent(new CustomEvent('hero:reveal'))
        }
        setMounted(false)
    }, [markLoaded])

    // Animasi exit cepat & mulus saat user menekan Skip (0.32s)
    const performFastExit = useCallback(() => {
        const pTop = panelTopRef.current
        const pBottom = panelBottomRef.current
        const center = centerGroupRef.current
        const overlay = containerRef.current

        // Segera pulihkan scroll body & trigger hero entrance
        document.body.style.overflow = ''
        window.scrollTo(0, 0)
        const win = window as Window & { __heroRevealed?: boolean; __lenis?: { scrollTo: (target: number, opts: { immediate: boolean }) => void } }
        if (win.__lenis) {
            win.__lenis.scrollTo(0, { immediate: true })
        }
        win.__heroRevealed = true
        markLoaded()

        // Hentikan master timeline & animasi sebelumnya
        if (timelineRef.current) {
            timelineRef.current.kill()
            timelineRef.current = null
        }
        if (exitTlRef.current) {
            exitTlRef.current.kill()
            exitTlRef.current = null
        }
        gsap.killTweensOf([pTop, pBottom, center, overlay])

        const exitTl = gsap.timeline({
            id: 'preloaderFastExitTl',
            onComplete: () => {
                handleCompletion()
            },
        })
        exitTlRef.current = exitTl

        if (center) {
            exitTl.to(center, { opacity: 0, scale: 0.9, duration: 0.12, ease: 'power2.in' }, 0)
        }

        if (pTop && pBottom) {
            exitTl.to(pTop, { yPercent: -100, duration: 0.32, ease: 'power3.inOut' }, 0.04)
            exitTl.to(pBottom, { yPercent: 100, duration: 0.32, ease: 'power3.inOut' }, 0.04)
            exitTl.add(() => {
                window.dispatchEvent(new CustomEvent('hero:reveal'))
            }, 0.08)
        } else if (overlay) {
            exitTl.to(overlay, { opacity: 0, duration: 0.2, ease: 'power2.out' }, 0)
        } else {
            handleCompletion()
        }
    }, [handleCompletion, markLoaded])

    // Skip helper function (Esc / Klik Skip button) - Bebas loop & idempotent
    const handleSkip = useCallback(() => {
        if (isFinishedRef.current) return

        // Jika user spam ESC / klik skip berulang saat animasi exit berjalan:
        // Segera selesaikan seketika (instant dismissal) tanpa looping!
        if (isSkippingRef.current) {
            handleCompletion()
            return
        }

        isSkippingRef.current = true

        if (failSafeTimerRef.current) {
            clearTimeout(failSafeTimerRef.current)
            failSafeTimerRef.current = null
        }
        if (desktopWaitTimerRef.current) {
            clearTimeout(desktopWaitTimerRef.current)
            desktopWaitTimerRef.current = null
        }

        performFastExit()
    }, [handleCompletion, performFastExit])

    // Keyboard listener for ESC key (dengan proteksi e.repeat terhadap tombol ditahan)
    useEffect(() => {
        if (!mounted) return
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                if (e.repeat) return
                e.preventDefault()
                handleSkip()
            }
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [mounted, handleSkip])

    // 3. GSAP Master Timeline
    useGSAP(
        () => {
            if (!mounted) return

            // Reduced motion support: versi fade singkat
            const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
            if (prefersReducedMotion) {
                const reducedTl = gsap.timeline({ onComplete: handleCompletion })
                reducedTl.to(containerRef.current, {
                    opacity: 0,
                    duration: 0.45,
                    ease: 'power2.inOut',
                    delay: 0.05,
                })
                return
            }

            const isMobileLoader =
                window.innerWidth < 768 ||
                !window.matchMedia('(hover: hover) and (pointer: fine)').matches

            // Fail-safe timeout (≤ 2.1s di mobile agar total durasi ≤ 2.2s, 6s di desktop)
            const timeoutMs = isMobileLoader
                ? PRELOADER_CONFIG.MOBILE_MAX_DURATION_MS
                : PRELOADER_CONFIG.FAIL_SAFE_TIMEOUT_MS

            const failSafeTimer = window.setTimeout(() => {
                if (!isFinishedRef.current) {
                    handleCompletion()
                }
            }, timeoutMs)
            failSafeTimerRef.current = failSafeTimer

            if (ringCircleRef.current) {
                ringCircleRef.current.style.strokeDasharray = `${CIRCUMFERENCE}`
                ringCircleRef.current.style.strokeDashoffset = `${CIRCUMFERENCE}`
            }

            const counterObj = { value: 0 }

            const masterTl = gsap.timeline({
                id: 'preloaderMasterTl',
                onComplete: () => {
                    clearTimeout(failSafeTimer)
                    handleCompletion()
                },
            })
            timelineRef.current = masterTl

            // Durasi adaptif yang halus & elegan di mobile (~2.8s-3.2s total) dan desktop (~3.0s-3.5s):
            const step1Dur = isMobileLoader ? 0.35 : 0.5
            const countDur = isMobileLoader ? 1.85 : 2.2
            const countStart = isMobileLoader ? 0.08 : 0.2
            const fadeOutCounterDur = isMobileLoader ? 0.28 : 0.4
            const splitNameDur = isMobileLoader ? 0.52 : 0.75
            const splitNameStagger = isMobileLoader ? 0.018 : 0.025
            const preExitHold = isMobileLoader ? 0.22 : 0.3
            const exitPanelDur = isMobileLoader ? 0.55 : 0.85
            // STEP 1: Cincin SVG tipis dan garis horizontal aksen menyebar dari tengah
            masterTl.fromTo(
                lineProgressBarRef.current,
                { scaleX: 0, opacity: 0 },
                { scaleX: 1, opacity: 1, duration: step1Dur, ease: 'power3.out' }
            )
            masterTl.fromTo(
                centerGroupRef.current,
                { scale: 0.85, opacity: 0 },
                { scale: 1, opacity: 1, duration: step1Dur + 0.08, ease: 'back.out(1.4)' },
                '<'
            )

            // STEP 2: Counter 000 -> 100 + Cincin SVG terisi
            masterTl.to(
                counterObj,
                {
                    value: 100,
                    duration: countDur,
                    ease: 'power2.inOut',
                    onUpdate: () => {
                        const cur = Math.round(counterObj.value)
                        const formatted = String(cur).padStart(3, '0')
                        if (counterNumberRef.current) {
                            counterNumberRef.current.textContent = formatted
                        }

                        if (ringCircleRef.current) {
                            const offset = CIRCUMFERENCE - (cur / 100) * CIRCUMFERENCE
                            ringCircleRef.current.style.strokeDashoffset = offset.toString()
                        }

                        if (ringDotRef.current) {
                            const angle = (cur / 100) * 360 - 90
                            const rad = (angle * Math.PI) / 180
                            const cx = 100 + RADIUS * Math.cos(rad)
                            const cy = 100 + RADIUS * Math.sin(rad)
                            ringDotRef.current.setAttribute('cx', cx.toFixed(2))
                            ringDotRef.current.setAttribute('cy', cy.toFixed(2))
                        }
                    },
                },
                countStart
            )

            // STEP 3: Satu baris terminal terpusat berganti teks
            masterTl.to(
                terminalTextRef.current,
                {
                    opacity: 1,
                    duration: isMobileLoader ? 0.25 : 0.4,
                },
                isMobileLoader ? 0.12 : 0.3
            )
            masterTl.to(
                terminalTextRef.current,
                {
                    opacity: 0.4,
                    duration: isMobileLoader ? 0.12 : 0.15,
                    yoyo: true,
                    repeat: 1,
                    onRepeat: () => {
                        if (terminalTextRef.current) {
                            terminalTextRef.current.textContent = PRELOADER_CONFIG.TERMINAL_STEPS[1]
                        }
                    },
                },
                isMobileLoader ? 0.75 : 1.1
            )
            masterTl.to(
                terminalTextRef.current,
                {
                    opacity: 0.4,
                    duration: isMobileLoader ? 0.12 : 0.15,
                    yoyo: true,
                    repeat: 1,
                    onRepeat: () => {
                        if (terminalTextRef.current) {
                            terminalTextRef.current.textContent = PRELOADER_CONFIG.TERMINAL_STEPS[2]
                        }
                    },
                },
                isMobileLoader ? 1.55 : 2.0
            )
            // Di desktop: sinkronisasi kesiapan font & window load (minimal 2.5s)
            if (!isMobileLoader) {
                masterTl.add(() => {
                    masterTl.pause()
                    const startTime = performance.now()

                    const fontReady =
                        typeof document !== 'undefined' && document.fonts
                            ? document.fonts.ready
                            : Promise.resolve()
                    const { promise: loadPromise, resolve: resolveLoad } = Promise.withResolvers<boolean>()

                    if (document.readyState === 'complete') {
                        resolveLoad(true)
                    } else {
                        window.addEventListener('load', () => resolveLoad(true), { once: true })
                        setTimeout(() => resolveLoad(true), 1500)
                    }

                    Promise.all([fontReady, loadPromise]).then(() => {
                        const elapsed = performance.now() - startTime
                        const remaining = Math.max(0, PRELOADER_CONFIG.MIN_DURATION_MS - elapsed)
                        desktopWaitTimerRef.current = window.setTimeout(() => {
                            if (!isFinishedRef.current && !isSkippingRef.current && masterTl.paused()) {
                                masterTl.play()
                            }
                        }, remaining)
                    })
                })
            }
            // STEP 4: Di 100%: counter mengecil lalu memudar, nama "Akhmad Ikbal." muncul
            masterTl.to(centerGroupRef.current, {
                opacity: 0,
                scale: 0.88,
                duration: fadeOutCounterDur,
                ease: 'power2.in',
            })

            masterTl.set(nameContainerRef.current, { opacity: 1, visibility: 'visible' })

            if (nameTextRef.current) {
                try {
                    const split = SplitText.create(nameTextRef.current, {
                        type: 'chars',
                    })
                    splitInstanceRef.current = split

                    if (split.chars && split.chars.length > 0) {
                        masterTl.fromTo(
                            split.chars,
                            { yPercent: 100, opacity: 0 },
                            {
                                yPercent: 0,
                                opacity: 1,
                                duration: splitNameDur,
                                stagger: splitNameStagger,
                                ease: 'expo.out',
                            }
                        )
                    }
                } catch {
                    masterTl.fromTo(
                        nameTextRef.current,
                        { opacity: 0, y: 20 },
                        { opacity: 1, y: 0, duration: splitNameDur, ease: 'expo.out' }
                    )
                }
            }

            // STEP 5: EXIT (Momen terbelah dua panel)
            masterTl.addLabel('exitSection')

            masterTl.to(
                nameContainerRef.current,
                {
                    scale: 0.9,
                    y: -16,
                    opacity: 0.7,
                    duration: isMobileLoader ? 0.2 : 0.45,
                    ease: 'power2.inOut',
                },
                `+=${preExitHold}`
            )


            masterTl.to(
                panelTopRef.current,
                {
                    yPercent: -100,
                    duration: exitPanelDur,
                    ease: 'expo.inOut',
                    onStart: () => {
                        document.body.style.overflow = ''
                        markLoaded()
                    },
                },
                '+=0.03'
            )

            masterTl.to(
                panelBottomRef.current,
                {
                    yPercent: 100,
                    duration: exitPanelDur,
                    ease: 'expo.inOut',
                },
                '<'
            )

            // Trigger hero entrance bounce as panels part open
            masterTl.add(() => {
                const win = window as Window & { __heroRevealed?: boolean }
                win.__heroRevealed = true
                markLoaded()
                window.dispatchEvent(new CustomEvent('hero:reveal'))
            }, '<0.15')
            masterTl.to(
                nameContainerRef.current,
                {
                    opacity: 0,
                    duration: isMobileLoader ? 0.2 : 0.35,
                    ease: 'power1.out',
                },
                '<0.1'
            )

            return () => {
                if (failSafeTimerRef.current) {
                    clearTimeout(failSafeTimerRef.current)
                    failSafeTimerRef.current = null
                }
                if (desktopWaitTimerRef.current) {
                    clearTimeout(desktopWaitTimerRef.current)
                    desktopWaitTimerRef.current = null
                }
                if (exitTlRef.current) {
                    exitTlRef.current.kill()
                    exitTlRef.current = null
                }
                masterTl.kill()
                if (splitInstanceRef.current) {
                    try {
                        splitInstanceRef.current.revert()
                    } catch {
                        // ignore
                    }
                }
            }
        },
        { scope: containerRef, dependencies: [mounted, handleCompletion] }
    )

    if (!mounted) return null

    return (
        <div
            ref={containerRef}
            id="preloader-overlay"
            className="fixed inset-0 z-[99999] pointer-events-auto select-none overflow-hidden font-mono bg-bg text-text transition-colors duration-300"
            aria-live="polite"
            role="status"
            aria-label="Loading portfolio"
        >
            {/* Top Split Panel */}
            <div
                ref={panelTopRef}
                className="absolute top-0 left-0 w-full h-[50.5%] bg-bg z-10 flex flex-col justify-start pointer-events-none transition-colors duration-300"
                style={{
                    backgroundImage: `
                        linear-gradient(to right, var(--grid-color) 1px, transparent 1px),
                        linear-gradient(to bottom, var(--grid-color) 1px, transparent 1px)
                    `,
                    backgroundSize: '48px 48px',
                    willChange: 'transform',
                }}
            />

            {/* Bottom Split Panel */}
            <div
                ref={panelBottomRef}
                className="absolute bottom-0 left-0 w-full h-[50.5%] bg-bg z-10 flex flex-col justify-end pointer-events-none transition-colors duration-300"
                style={{
                    backgroundImage: `
                        linear-gradient(to right, var(--grid-color) 1px, transparent 1px),
                        linear-gradient(to bottom, var(--grid-color) 1px, transparent 1px)
                    `,
                    backgroundSize: '48px 48px',
                    willChange: 'transform',
                }}
            />


            {/* LAYER 1: POJOK & FOOTER (Tombol skip di tengah bawah dengan env(safe-area-inset-bottom)) */}
            <div
                className="absolute inset-0 z-30 pointer-events-none flex flex-col justify-end p-5 sm:p-10"
                style={{
                    paddingBottom: 'calc(1.25rem + env(safe-area-inset-bottom, 0px))',
                }}
            >
                <div className="w-full relative flex items-center justify-center text-[11px] min-h-[40px]">
                    {/* Tombol Skip persis di tengah horizontal (50% viewport) */}
                    <div className="flex items-center justify-center pointer-events-auto">
                        <button
                            onClick={handleSkip}
                            type="button"
                            data-testid="preloader-skip"
                            className="min-h-[40px] px-4 py-1.5 rounded border border-card-border hover:border-accent bg-surface/80 backdrop-blur-sm text-text-muted hover:text-accent active:scale-[0.97] transition-all duration-200 text-xs tracking-wider uppercase cursor-pointer whitespace-nowrap"
                            title="Skip to content (or press Escape)"
                        >
                            [ skip · esc ]
                        </button>
                    </div>

                    <span className="hidden sm:inline text-accent/80 tracking-wider">
                        {'// system.init()'}
                    </span>
                </div>
            </div>

            {/* LAYER 2: KONTEN TENGAH TEPAT (Counter & Nama dengan clamp() agar tidak meluber di 360px) */}
            <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none px-5">
                {/* 1. Counter + Cincin SVG + 1 Baris Terminal */}
                <div
                    ref={centerGroupRef}
                    className="flex flex-col items-center justify-center text-center w-full max-w-[320px] sm:max-w-sm"
                >
                    <div className="relative w-40 h-40 sm:w-56 sm:h-56 flex items-center justify-center mb-4 sm:mb-5">
                        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 200 200">
                            <circle
                                cx="100"
                                cy="100"
                                r={RADIUS}
                                fill="none"
                                stroke="currentColor"
                                className="text-text/10"
                                strokeWidth="2"
                            />
                            <circle
                                ref={ringCircleRef}
                                cx="100"
                                cy="100"
                                r={RADIUS}
                                fill="none"
                                stroke="var(--accent)"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                            />
                            <circle
                                ref={ringDotRef}
                                cx="100"
                                cy={100 - RADIUS}
                                r="3.5"
                                fill="var(--accent)"
                            />
                        </svg>

                        {/* Angka Counter Besar dengan clamp() - Tepat di Titik Tengah */}
                        <div className="flex items-center justify-center text-center">
                            <h2
                                ref={counterNumberRef}
                                className="font-syne font-black text-text tracking-tighter leading-none select-none text-center"
                                style={{ fontSize: 'clamp(2.75rem, 13vw, 4.5rem)' }}
                            >
                                000
                            </h2>
                        </div>
                    </div>

                    {/* Garis Horizontal Aksen Tipis Menyebar */}
                    <div className="w-36 sm:w-52 h-[1.5px] bg-text/10 rounded-full overflow-hidden mb-3 sm:mb-4 relative">
                        <div
                            ref={lineProgressBarRef}
                            className="w-full h-full bg-accent origin-center"
                            style={{ willChange: 'transform' }}
                        />
                    </div>

                    {/* 1 Baris Teks Terminal Terpusat */}
                    <p
                        ref={terminalTextRef}
                        className="text-xs sm:text-sm text-text-muted tracking-wide font-mono text-center min-h-[22px] max-w-full truncate"
                    >
                        {PRELOADER_CONFIG.TERMINAL_STEPS[0]}
                    </p>
                </div>

                {/* 2. Reveal Nama "Akhmad Ikbal." dengan clamp() agar utuh di 360px */}
                <div
                    ref={nameContainerRef}
                    className="absolute inset-0 flex items-center justify-center opacity-0 pointer-events-none px-5"
                >
                    <h1
                        ref={nameTextRef}
                        className="font-syne font-extrabold text-text tracking-tight text-center whitespace-nowrap bg-bg px-5 sm:px-8 py-2.5 rounded-2xl select-none relative z-30"
                        style={{ fontSize: 'clamp(1.75rem, 8.8vw, 4.5rem)' }}
                    >
                        <span>{PRELOADER_CONFIG.NAME_FIRST}</span>
                        <span className="text-accent">
                            {PRELOADER_CONFIG.NAME_HIGHLIGHT}
                        </span>
                    </h1>
                </div>
            </div>
        </div>
    )
}
