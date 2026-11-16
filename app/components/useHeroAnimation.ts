'use client'

import { RefObject } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { useGSAP } from '@gsap/react'
import { HERO_COPY, HERO_STATEMENTS } from './Hero'

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP)
    ScrollTrigger.config({ ignoreMobileResize: true })
    ScrollTrigger.clearScrollMemory('manual')
}

// ============================================================================
// DAFTAR VARIABEL KONFIGURASI ANIMASI HERO
// ============================================================================
export const HERO_ANIMATION_CONFIG = {
    // --- 1. Scroll-Driven Pin & Lapisan Latar Desktop ("Fly Through The Blueprint") ---
    PIN_SCROLL_VH: 120,           // Panjang pin scroll hero di desktop (±120vh)
    SCRUB_SMOOTHING: 1,           // Haluskan scrub ScrollTrigger di desktop (1 detik)
    MOBILE_SCRUB_SMOOTHING: 0.5,  // Scrub parallax ringan tanpa pin di tablet

    // Grid 3D Lantai Perspektif (Desktop)
    GRID_ROTATE_X_DEG: 60,
    GRID_TRANSLATE_Y_PCT: 28,
    GRID_SCALE_END: 1.38,
    GRID_OPACITY_START: 0.65,
    GRID_OPACITY_END: 1.0,

    // Teks Raksasa "IKBAL" Latar (Desktop)
    BG_TEXT_OPACITY: 0.06,
    PHONE_BG_TEXT_OPACITY: 0.07,
    PHONE_BG_TEXT_X: 3,
    BG_TEXT_X_START: -15,
    BG_TEXT_X_END: 15,
    BG_TEXT_SCALE_END: 1.25,

    // Orb Gradient Lime (Desktop)
    ORB_OPACITY_START: 0.12,
    ORB_OPACITY_END: 0.22,
    ORB_X_START: -10,
    ORB_X_END: 18,
    ORB_Y_START: -8,
    ORB_Y_END: 18,
    ORB_SCALE_END: 1.35,

    // Noise Statis (Desktop)
    NOISE_OPACITY: 0.04,

    // --- 2. Komposisi Elemen Saat Scroll Desktop (0% -> 100%) ---
    LINE1_X_PCT: -8,
    LINE2_X_PCT: 8,
    AVATAR_SCROLL_Y_PCT: -10,
    AVATAR_SCROLL_SCALE: 1.08,
    META_SCROLL_Y_PX: -40,

    // --- 3. Blueprint Cursor (Desktop & Mobile Touch) ---
    BP_RADIUS_PX: 160,
    BP_MOBILE_RADIUS_PX: 115,
    BP_STROKE_MAX_PX: 1.5,
    BP_LIFT_MAX_PX: -4,
    BP_LERP_FACTOR: 0.24,
    BP_IDLE_TIMEOUT_MS: 2000,
    BP_WAVE_PERIOD_SEC: 6.0,
    BP_WAVE_SWEEP_SEC: 2.8,
    RESIZE_DEBOUNCE_MS: 150,

    // --- 4. Avatar Mengambang & Kursor (Desktop) ---
    AVATAR_FLOAT_AMPLITUDE: 8,
    AVATAR_MOBILE_FLOAT_AMP: 5,
    AVATAR_FLOAT_DURATION: 3.5,
    AVATAR_TILT_MAX_PX: 6,
    AVATAR_TILT_MAX_DEG: 3,

    // --- 5. Animasi Mobile (< 768px) ---
    MOBILE_TOUCH_RADIUS_PX: 90,        // Radius sentuh blueprint di mobile: 90px
    MOBILE_TOUCH_LIFT_MAX_PX: -3,      // Lift maksimum karakter saat disentuh: -3px
    MOBILE_TOUCH_RELEASE_SEC: 0.5,     // Durasi kembali ke solid saat sentuhan dilepas: 0.5s
    MOBILE_WAVE_INTERVAL_SEC: 7.0,     // Interval gelombang idle di mobile: 7.0 detik
    MOBILE_WAVE_SWEEP_SEC: 1.8,        // Durasi sapuan gelombang: 1.8s
    MOBILE_ENTRANCE_STAGGER: 0.018,    // Stagger per karakter headline: 0.018s
    MOBILE_ENTRANCE_DURATION: 0.8,     // Durasi masuk per karakter: 0.8s
}

interface CharMetric {
    el: HTMLElement
    cx: number
    cy: number
    currentT: number
    targetT: number
}

export interface HeroAnimationParams {
    containerRef: RefObject<HTMLElement | null>
    heroStageRef: RefObject<HTMLDivElement | null>
    grid3dRef: RefObject<HTMLDivElement | null>
    bgTextScrollRef: RefObject<HTMLDivElement | null>
    parallaxBgTextRef: RefObject<HTMLDivElement | null>
    orbRef: RefObject<HTMLDivElement | null>
    headlineRef: RefObject<HTMLHeadingElement | null>
    line1Ref: RefObject<HTMLDivElement | null>
    line2Ref: RefObject<HTMLDivElement | null>
    badgeScrollRef: RefObject<HTMLDivElement | null>
    badgeRef: RefObject<HTMLDivElement | null>
    metaScrollRef: RefObject<HTMLDivElement | null>
    roleContainerRef: RefObject<HTMLDivElement | null>
    roleTextRef: RefObject<HTMLSpanElement | null>
    descRef: RefObject<HTMLParagraphElement | null>
    ctaRef: RefObject<HTMLDivElement | null>
    ctaPrimaryRef?: RefObject<HTMLDivElement | null>
    ctaSecondaryRef?: RefObject<HTMLDivElement | null>
    avatarWrapperRef: RefObject<HTMLDivElement | null>
    avatarFloatRef: RefObject<HTMLDivElement | null>
    avatarTiltRef: RefObject<HTMLDivElement | null>
    avatarShadowRef?: RefObject<HTMLDivElement | null>
    scrollIndicatorRef: RefObject<HTMLDivElement | null>
    hudCoordsRef: RefObject<HTMLSpanElement | null>
    hudTopLeftRef?: RefObject<HTMLDivElement | null>
    hudTopRightRef?: RefObject<HTMLDivElement | null>
    hudBottomLeftRef?: RefObject<HTMLDivElement | null>
    // Mobile single statement focus refs (< 1024px)
    mobileBadgeRef?: RefObject<HTMLDivElement | null>
    mobileRoleRef?: RefObject<HTMLDivElement | null>
    mobileRoleTextRef?: RefObject<HTMLSpanElement | null>
    mobileHeadlineBoxRef?: RefObject<HTMLDivElement | null>
    mobileLine1Ref?: RefObject<HTMLDivElement | null>
    mobileLine2Ref?: RefObject<HTMLDivElement | null>
    mobileSubtextRef?: RefObject<HTMLParagraphElement | null>
    mobileCtaPrimaryRef?: RefObject<HTMLDivElement | null>
    mobileCtaSecondaryRef?: RefObject<HTMLDivElement | null>
    flatGridRef?: RefObject<HTMLDivElement | null>
}

export function useHeroAnimation({
    containerRef,
    heroStageRef,
    grid3dRef,
    bgTextScrollRef,
    parallaxBgTextRef,
    orbRef,
    headlineRef,
    line1Ref,
    line2Ref,
    badgeScrollRef,
    badgeRef,
    metaScrollRef,
    roleContainerRef,
    roleTextRef,
    descRef,
    ctaRef,
    ctaPrimaryRef,
    ctaSecondaryRef,
    avatarWrapperRef,
    avatarFloatRef,
    avatarTiltRef,
    avatarShadowRef,
    scrollIndicatorRef,
    hudCoordsRef,
    hudTopLeftRef,
    hudTopRightRef,
    hudBottomLeftRef,
    mobileBadgeRef,
    mobileRoleRef,
    mobileRoleTextRef,
    mobileHeadlineBoxRef,
    mobileLine1Ref,
    mobileLine2Ref,
    mobileSubtextRef,
    mobileCtaPrimaryRef,
    mobileCtaSecondaryRef,
    flatGridRef,
}: HeroAnimationParams) {
    useGSAP(
        () => {
            const container = containerRef.current
            if (!container) return

            ScrollTrigger.config({ ignoreMobileResize: true })

            container.style.setProperty('--bp-stroke', `${HERO_ANIMATION_CONFIG.BP_STROKE_MAX_PX}px`)
            container.style.setProperty('--bp-lift', `${HERO_ANIMATION_CONFIG.BP_LIFT_MAX_PX}px`)

            let isCleanedUp = false
            let splitInstances: InstanceType<typeof SplitText>[] = []
            let charMetrics: CharMetric[] = []
            let mobileSplitInstances: InstanceType<typeof SplitText>[] = []
            let mobileCharMetrics: CharMetric[] = []
            let minCharX = 0
            let maxCharX = 1
            let resizeTimer = 0
            let postEntranceTimer = 0
            let lastMeasuredWidth = window.innerWidth

            const bgLayers = [grid3dRef.current, bgTextScrollRef.current, orbRef.current].filter(
                Boolean
            ) as HTMLElement[]

            const setBgWillChange = (val: string) => {
                for (let i = 0; i < bgLayers.length; i++) {
                    bgLayers[i].style.willChange = val
                }
            }

            const mm = gsap.matchMedia()

            mm.add(
                {
                    isDesktop: '(min-width: 768px)',
                    isPhone: '(max-width: 767px)',
                    reduceMotion: '(prefers-reduced-motion: reduce)',
                },
                (context) => {
                    let isContextActive = true
                    let isMobileTouching = false
                    let mobileTouchCleanup: (() => void) | null = null
                    const { isDesktop, isPhone, reduceMotion } = context.conditions as {
                        isDesktop: boolean
                        isPhone: boolean
                        reduceMotion: boolean
                    }

                    if (isPhone) {
                        container.style.setProperty('--bp-stroke', '1.5px')
                        container.style.setProperty(
                            '--bp-lift',
                            `${HERO_ANIMATION_CONFIG.MOBILE_TOUCH_LIFT_MAX_PX}px`
                        )
                    } else {
                        container.style.setProperty(
                            '--bp-stroke',
                            `${HERO_ANIMATION_CONFIG.BP_STROKE_MAX_PX}px`
                        )
                        container.style.setProperty(
                            '--bp-lift',
                            `${HERO_ANIMATION_CONFIG.BP_LIFT_MAX_PX}px`
                        )
                    }

                    const bgTextOpacity = isPhone
                        ? HERO_ANIMATION_CONFIG.PHONE_BG_TEXT_OPACITY
                        : HERO_ANIMATION_CONFIG.BG_TEXT_OPACITY
                    const bgTextXStart = isPhone
                        ? -HERO_ANIMATION_CONFIG.PHONE_BG_TEXT_X
                        : HERO_ANIMATION_CONFIG.BG_TEXT_X_START
                    const bgTextXEnd = isPhone
                        ? HERO_ANIMATION_CONFIG.PHONE_BG_TEXT_X
                        : HERO_ANIMATION_CONFIG.BG_TEXT_X_END

                    const hasTouch =
                        typeof window !== 'undefined' &&
                        !window.matchMedia('(hover: hover) and (pointer: fine)').matches

                    const shouldPinHero = isDesktop && !hasTouch && typeof window !== 'undefined' && window.innerHeight >= 540

                    // Reduced Motion Handling
                    if (reduceMotion) {
                        setBgWillChange('auto')
                        if (isPhone) {
                            if (mobileBadgeRef?.current) gsap.set(mobileBadgeRef.current, { opacity: 1, y: 0 })
                            if (mobileRoleRef?.current) gsap.set(mobileRoleRef.current, { opacity: 1, y: 0 })
                            if (mobileRoleTextRef?.current) mobileRoleTextRef.current.textContent = HERO_COPY.roleLabel
                            if (mobileLine1Ref?.current) gsap.set(mobileLine1Ref.current, { opacity: 1, y: 0, xPercent: 0 })
                            if (mobileLine2Ref?.current) gsap.set(mobileLine2Ref.current, { opacity: 1, y: 0, xPercent: 0 })
                            if (mobileHeadlineBoxRef?.current) gsap.set(mobileHeadlineBoxRef.current, { opacity: 1, y: 0 })
                            if (mobileSubtextRef?.current) gsap.set(mobileSubtextRef.current, { opacity: 1, y: 0 })
                            if (mobileCtaPrimaryRef?.current) gsap.set(mobileCtaPrimaryRef.current, { opacity: 1, y: 0 })
                            if (mobileCtaSecondaryRef?.current) gsap.set(mobileCtaSecondaryRef.current, { opacity: 1, y: 0 })
                            if (flatGridRef?.current) gsap.set(flatGridRef.current, { opacity: 0.04, scale: 1 })
                            return () => {
                                isContextActive = false
                            }
                        }

                        const visibleEls = [
                            badgeScrollRef.current,
                            badgeRef.current,
                            headlineRef.current,
                            line1Ref.current,
                            line2Ref.current,
                            metaScrollRef.current,
                            roleContainerRef.current,
                            descRef.current,
                            ctaRef.current,
                            avatarWrapperRef.current,
                            avatarFloatRef.current,
                            scrollIndicatorRef.current,
                        ].filter(Boolean)
                        gsap.set(visibleEls, { opacity: 1, visibility: 'visible', clearProps: 'transform,clipPath' })
                        if (parallaxBgTextRef.current) {
                            gsap.set(parallaxBgTextRef.current, { opacity: bgTextOpacity })
                        }
                        if (roleTextRef?.current) {
                            roleTextRef.current.textContent = HERO_COPY.roleLabel
                        }
                        return () => {
                            isContextActive = false
                        }
                    }

                    const lineEls = [line1Ref.current, line2Ref.current].filter(
                        Boolean
                    ) as HTMLElement[]

                    // ----------------------------------------------------------------
                    // 1. Titik tengah karakter untuk Blueprint cursor & touch
                    // ----------------------------------------------------------------
                    const measureCharCenters = () => {
                        if (!isContextActive || isCleanedUp) return

                        const targetMetrics = isPhone ? mobileCharMetrics : charMetrics
                        if (targetMetrics.length === 0) return

                        const scrollX = window.scrollX || window.pageXOffset || 0
                        const scrollY = window.scrollY || window.pageYOffset || 0
                        let minX = Infinity
                        let maxX = -Infinity

                        for (let i = 0; i < targetMetrics.length; i++) {
                            const item = targetMetrics[i]
                            const rect = item.el.getBoundingClientRect()
                            const liftOffset = item.currentT * HERO_ANIMATION_CONFIG.BP_LIFT_MAX_PX
                            item.cx = rect.left + scrollX + rect.width * 0.5
                            item.cy = rect.top + scrollY + rect.height * 0.5 - liftOffset
                            if (item.cx < minX) minX = item.cx
                            if (item.cx > maxX) maxX = item.cx
                        }

                        if (minX !== Infinity && maxX !== -Infinity) {
                            minCharX = minX
                            maxCharX = Math.max(minX + 1, maxX)
                        }
                    }

                    const scheduleMeasureDebounced = () => {
                        const currentW = window.innerWidth
                        if (!shouldPinHero && currentW === lastMeasuredWidth) {
                            return
                        }
                        lastMeasuredWidth = currentW
                        window.clearTimeout(resizeTimer)
                        resizeTimer = window.setTimeout(() => {
                            if (isContextActive && !isCleanedUp) {
                                measureCharCenters()
                                ScrollTrigger.refresh()
                            }
                        }, HERO_ANIMATION_CONFIG.RESIZE_DEBOUNCE_MS)
                    }

                    // ----------------------------------------------------------------
                    // 2. Entrance Timeline & Typewriter Role (Satu kali durasi ~0.5s)
                    // ----------------------------------------------------------------
                    let failSafeTimer = 0

                    const entranceTl = gsap.timeline({
                        paused: true,
                        onComplete: () => {
                            if (!isContextActive || isCleanedUp) return

                            const activeMetrics = isPhone ? mobileCharMetrics : charMetrics
                            const allChars = activeMetrics.map((m) => m.el)

                            // Bersihkan transform dan opacity inline agar style CSS blueprint aktif
                            gsap.set(allChars, { clearProps: 'transform,opacity' })
                            allChars.forEach((c) => {
                                c.style.setProperty('--t', '0')
                                c.style.willChange = 'auto'
                                c.style.transform = ''
                                c.style.opacity = ''
                            })

                            if (roleTextRef?.current) roleTextRef.current.textContent = HERO_COPY.roleLabel
                            if (mobileRoleTextRef?.current) mobileRoleTextRef.current.textContent = HERO_COPY.roleLabel

                            measureCharCenters()
                            lastScrollChangeTime = performance.now()

                            window.clearTimeout(postEntranceTimer)
                            postEntranceTimer = window.setTimeout(() => {
                                if (isContextActive && !isCleanedUp) {
                                    measureCharCenters()
                                    ScrollTrigger.refresh()
                                }
                            }, HERO_ANIMATION_CONFIG.RESIZE_DEBOUNCE_MS)

                            startStatementRotation()
                        },
                    })

                    // ----------------------------------------------------------------
                    // 2b. Rotasi Pernyataan Headline (Tampilan 1 <-> Tampilan 2)
                    // ----------------------------------------------------------------
                    let activeStatementIndex = 0
                    let statementRotationTimer = 0
                    let statementRotationTl: gsap.core.Timeline | null = null
                    let isRotatingStatement = false

                    const stopStatementRotation = () => {
                        if (statementRotationTimer) {
                            window.clearTimeout(statementRotationTimer)
                            statementRotationTimer = 0
                        }
                        if (statementRotationTl) {
                            statementRotationTl.kill()
                            statementRotationTl = null
                        }
                        isRotatingStatement = false
                    }

                    const rotateToNextStatement = () => {
                        if (!isContextActive || isCleanedUp || isRotatingStatement) return

                        if (scrollProgress > 0.04 || (typeof document !== 'undefined' && document.hidden)) {
                            statementRotationTimer = window.setTimeout(rotateToNextStatement, 1800)
                            return
                        }

                        const nextIndex = (activeStatementIndex + 1) % HERO_STATEMENTS.length
                        const nextStmt = HERO_STATEMENTS[nextIndex]

                        const deskSpan1 = (line1Ref.current?.querySelector('.hl-solid') || line1Ref.current?.firstElementChild) as HTMLElement | null
                        const deskSpan2 = (line2Ref.current?.querySelector('.hl-kw') || line2Ref.current?.firstElementChild) as HTMLElement | null
                        const mobSpan1 = (mobileLine1Ref?.current?.querySelector('.mobile-stmt-verb') || mobileLine1Ref?.current?.firstElementChild) as HTMLElement | null
                        const mobSpan2 = (mobileLine2Ref?.current?.querySelector('.mobile-stmt-kw') || mobileLine2Ref?.current?.firstElementChild) as HTMLElement | null

                        const span1Targets = [deskSpan1, mobSpan1].filter(Boolean) as HTMLElement[]
                        const span2Targets = [deskSpan2, mobSpan2].filter(Boolean) as HTMLElement[]

                        if (span1Targets.length === 0 && span2Targets.length === 0) {
                            statementRotationTimer = window.setTimeout(rotateToNextStatement, 3500)
                            return
                        }

                        isRotatingStatement = true
                        statementRotationTl = gsap.timeline({
                            onComplete: () => {
                                isRotatingStatement = false
                                activeStatementIndex = nextIndex
                                statementRotationTimer = window.setTimeout(rotateToNextStatement, 5500)
                            },
                        })

                        // 1. Geser ke atas & pudar keluar
                        statementRotationTl.to(
                            span1Targets,
                            { yPercent: -110, rotateZ: 0, opacity: 0, duration: 0.45, ease: 'power2.in' },
                            0
                        )
                        statementRotationTl.to(
                            span2Targets,
                            { yPercent: -110, rotateZ: 0, opacity: 0, duration: 0.45, ease: 'power2.in' },
                            0.08
                        )

                        // 2. Di titik tengah (di balik mask): perbarui teks & siapkan di bawah
                        statementRotationTl.add(() => {
                            span1Targets.forEach((el) => {
                                el.textContent = nextStmt.line1
                            })
                            span2Targets.forEach((el) => {
                                el.textContent = nextStmt.line2
                            })
                            gsap.set(span1Targets, {
                                yPercent: 115,
                                rotateZ: 0,
                                opacity: 0,
                            })
                            gsap.set(span2Targets, {
                                yPercent: 115,
                                rotateZ: 0,
                                opacity: 0,
                            })
                        }, 0.54)

                        // 3. Masuk dari bawah SMOOTH (tanpa bounce, lurus ke atas)
                        statementRotationTl.to(
                            span1Targets,
                            { yPercent: 0, rotateZ: 0, opacity: 1, duration: 0.55, ease: 'power3.out' },
                            0.56
                        )
                        statementRotationTl.to(
                            span2Targets,
                            { yPercent: 0, rotateZ: 0, opacity: 1, duration: 0.55, ease: 'power3.out' },
                            0.64
                        )
                    }

                    const startStatementRotation = () => {
                        stopStatementRotation()
                        statementRotationTimer = window.setTimeout(rotateToNextStatement, 5500)
                    }

                    const onVisibilityChange = () => {
                        if (typeof document !== 'undefined' && document.hidden) {
                            stopStatementRotation()
                        } else if (scrollProgress < 0.04) {
                            startStatementRotation()
                        }
                    }
                    if (typeof document !== 'undefined') {
                        document.addEventListener('visibilitychange', onVisibilityChange)
                    }

                    // Typewriter role helper
                    const addRoleTypewriter = (timePos: number) => {
                        const targetText = HERO_COPY.roleLabel
                        const proxy = { count: 0 }

                        if (roleTextRef?.current) roleTextRef.current.textContent = ''
                        if (mobileRoleTextRef?.current) mobileRoleTextRef.current.textContent = ''

                        entranceTl.to(
                            proxy,
                            {
                                count: targetText.length,
                                duration: 0.5,
                                ease: 'none',
                                onUpdate: () => {
                                    if (!isContextActive || isCleanedUp) return
                                    const count = Math.ceil(proxy.count)
                                    const sliced = targetText.slice(0, count)
                                    if (roleTextRef?.current) roleTextRef.current.textContent = sliced
                                    if (mobileRoleTextRef?.current) mobileRoleTextRef.current.textContent = sliced
                                },
                                onComplete: () => {
                                    if (roleTextRef?.current) roleTextRef.current.textContent = targetText
                                    if (mobileRoleTextRef?.current) mobileRoleTextRef.current.textContent = targetText
                                },
                            },
                            timePos
                        )
                    }

                    let scrollTl: gsap.core.Timeline | null = null
                    let mobileScrollTl: gsap.core.Timeline | null = null
                    let hasRevealed = false

                    // ----------------------------------------------------------------
                    // 3. Inisialisasi SplitText & Entrance
                    // ----------------------------------------------------------------
                    const initSplitAndEntrance = () => {
                        if (!isContextActive || isCleanedUp) return

                        splitInstances.forEach((s) => {
                            try {
                                s.revert()
                            } catch {}
                        })
                        splitInstances = []
                        charMetrics = []

                        mobileSplitInstances.forEach((s) => {
                            try {
                                s.revert()
                            } catch {}
                        })
                        mobileSplitInstances = []
                        mobileCharMetrics = []

                        entranceTl.clear()

                        if (isPhone) {
                            // --- MOBILE ENTRANCE (< 768px) ---
                            const mLine1 = mobileLine1Ref?.current
                            const mLine2 = mobileLine2Ref?.current
                            const mLines = [mLine1, mLine2].filter(Boolean) as HTMLElement[]
                            const mobileWords: HTMLElement[] = []

                            mLines.forEach((lineEl) => {
                                const split = SplitText.create(lineEl, {
                                    type: 'words,chars',
                                    wordsClass: 'm-hl-word',
                                    charsClass: 'm-hl-char hl-char',
                                })
                                if (split.words) {
                                    const words = split.words as HTMLElement[]
                                    words.forEach((w) => {
                                        w.style.display = 'inline-block'
                                        w.style.whiteSpace = 'nowrap'
                                    })
                                    mobileWords.push(...words)
                                }
                                if (split.chars) {
                                    ;(split.chars as HTMLElement[]).forEach((c) => {
                                        c.style.display = 'inline-block'
                                        c.style.setProperty('--t', '0')
                                        mobileCharMetrics.push({
                                            el: c,
                                            cx: 0,
                                            cy: 0,
                                            currentT: 0,
                                            targetT: 0,
                                        })
                                    })
                                }
                                mobileSplitInstances.push(split)
                            })

                            const mobileChars = mobileCharMetrics.map((m) => m.el)
                            if (mobileChars.length > 0) {
                                gsap.set(mobileChars, { yPercent: 110, rotateZ: 3, opacity: 0 })
                            }

                            // Badge
                            if (mobileBadgeRef?.current) {
                                entranceTl.fromTo(
                                    mobileBadgeRef.current,
                                    { opacity: 0, y: 12 },
                                    { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' },
                                    0.05
                                )
                            }

                            // Role label fade-in & typewriter
                            if (mobileRoleRef?.current) {
                                entranceTl.fromTo(
                                    mobileRoleRef.current,
                                    { opacity: 0, y: 10 },
                                    { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' },
                                    0.12
                                )
                            }
                            addRoleTypewriter(0.15)

                            // Headline lines entrance SMOOTH (tanpa bounce saat slide in)
                            const mobSpan1 = (mLine1?.querySelector('.mobile-stmt-verb') || mLine1?.firstElementChild) as HTMLElement | null
                            const mobSpan2 = (mLine2?.querySelector('.mobile-stmt-kw') || mLine2?.firstElementChild) as HTMLElement | null

                            if (mobSpan1 && mobSpan2) {
                                entranceTl.fromTo(
                                    mobSpan1,
                                    { yPercent: 115, rotateZ: 0, opacity: 0 },
                                    { yPercent: 0, rotateZ: 0, opacity: 1, duration: 0.55, ease: 'power3.out' },
                                    0.2
                                )
                                entranceTl.fromTo(
                                    mobSpan2,
                                    { yPercent: 115, rotateZ: 0, opacity: 0 },
                                    { yPercent: 0, rotateZ: 0, opacity: 1, duration: 0.55, ease: 'power3.out' },
                                    0.28
                                )
                            }

                            // Subteks & Tombol
                            const mobileItems = [
                                mobileSubtextRef?.current,
                                mobileCtaPrimaryRef?.current,
                                mobileCtaSecondaryRef?.current,
                            ].filter(Boolean)

                            if (mobileItems.length > 0) {
                                entranceTl.fromTo(
                                    mobileItems,
                                    { opacity: 0, y: 18 },
                                    { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'power3.out' },
                                    0.38
                                )
                            }

                            // Animasi SplitText kata-kata pada mobile: memisah ke arah luar
                            if (mobileWords.length > 0 && mobileScrollTl) {
                                mobileScrollTl.fromTo(
                                    mobileWords,
                                    { xPercent: 0, yPercent: 0, rotateZ: 0 },
                                    {
                                        xPercent: (i: number) => (i % 2 === 0 ? -12 : 12),
                                        yPercent: (i: number) => -14 - (i % 2) * 8,
                                        rotateZ: (i: number) => (i % 2 === 0 ? -2.5 : 2.5),
                                        duration: 0.78,
                                        immediateRender: false,
                                    },
                                    0
                                )
                            }

                            // Touch interaction pada mobile headline box (Blueprint glow/lift effect)
                            const boxEl = mobileHeadlineBoxRef?.current
                            if (boxEl) {
                                if (mobileTouchCleanup) mobileTouchCleanup()
                                let isTouching = false

                                const handleTouch = (clientX: number, clientY: number) => {
                                    lastMoveTime = performance.now()
                                    measureCharCenters()
                                    const scrollX = window.scrollX || window.pageXOffset || 0
                                    const scrollY = window.scrollY || window.pageYOffset || 0
                                    const px = clientX + scrollX
                                    const py = clientY + scrollY
                                    const r = HERO_ANIMATION_CONFIG.MOBILE_TOUCH_RADIUS_PX

                                    for (let i = 0; i < mobileCharMetrics.length; i++) {
                                        const item = mobileCharMetrics[i]
                                        const dist = Math.hypot(px - item.cx, py - item.cy)
                                        const rawT = 1 - dist / r
                                        const t = rawT <= 0 ? 0 : rawT >= 1 ? 1 : rawT
                                        item.targetT = t
                                        item.currentT = t
                                        item.el.style.setProperty('--t', t === 0 ? '0' : t.toFixed(3))
                                    }
                                }

                                const handleEnd = () => {
                                    isTouching = false
                                    isMobileTouching = false
                                    lastMoveTime = performance.now()
                                    for (let i = 0; i < mobileCharMetrics.length; i++) {
                                        const item = mobileCharMetrics[i]
                                        item.targetT = 0
                                    }
                                }

                                const onTouchStart = (e: TouchEvent) => {
                                    if (e.touches.length === 0) return
                                    isTouching = true
                                    isMobileTouching = true
                                    handleTouch(e.touches[0].clientX, e.touches[0].clientY)
                                }
                                const onTouchMove = (e: TouchEvent) => {
                                    if (!isTouching || e.touches.length === 0) return
                                    handleTouch(e.touches[0].clientX, e.touches[0].clientY)
                                }
                                const onTouchEnd = () => handleEnd()

                                boxEl.addEventListener('touchstart', onTouchStart, { passive: true })
                                boxEl.addEventListener('touchmove', onTouchMove, { passive: true })
                                boxEl.addEventListener('touchend', onTouchEnd, { passive: true })
                                boxEl.addEventListener('touchcancel', onTouchEnd, { passive: true })

                                mobileTouchCleanup = () => {
                                    boxEl.removeEventListener('touchstart', onTouchStart)
                                    boxEl.removeEventListener('touchmove', onTouchMove)
                                    boxEl.removeEventListener('touchend', onTouchEnd)
                                    boxEl.removeEventListener('touchcancel', onTouchEnd)
                                }
                            }
                        } else {
                            // --- DESKTOP ENTRANCE (>= 768px) ---
                            const allWords: HTMLElement[] = []

                            lineEls.forEach((lineEl) => {
                                const split = SplitText.create(lineEl, {
                                    type: 'words,chars',
                                    wordsClass: 'hl-word',
                                    charsClass: 'hl-char',
                                })

                                if (split.words) {
                                    const words = split.words as HTMLElement[]
                                    words.forEach((w) => {
                                        w.style.display = 'inline-block'
                                        w.style.whiteSpace = 'nowrap'
                                    })
                                    allWords.push(...words)
                                }

                                if (split.chars) {
                                    const chars = split.chars as HTMLElement[]
                                    chars.forEach((c) => {
                                        c.style.display = 'inline-block'
                                        c.style.setProperty('--t', '0')
                                        charMetrics.push({
                                            el: c,
                                            cx: 0,
                                            cy: 0,
                                            currentT: 0,
                                            targetT: 0,
                                        })
                                    })
                                }

                                splitInstances.push(split)
                            })

                            const desktopChars = charMetrics.map((m) => m.el)
                            if (desktopChars.length > 0) {
                                gsap.set(desktopChars, { yPercent: 110, rotateZ: 4, opacity: 0 })
                            }

                            if (parallaxBgTextRef.current) {
                                entranceTl.fromTo(
                                    parallaxBgTextRef.current,
                                    { opacity: 0, scale: 0.94 },
                                    {
                                        opacity: bgTextOpacity,
                                        scale: 1,
                                        duration: 0.8,
                                        ease: 'power3.out',
                                    },
                                    0.05
                                )
                            }

                            if (badgeRef.current) {
                                entranceTl.fromTo(
                                    badgeRef.current,
                                    { opacity: 0, y: -12 },
                                    { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out', clearProps: 'transform' },
                                    0.08
                                )
                            }

                            // Headline lines entrance pada Desktop SMOOTH (tanpa bounce saat slide in)
                            const deskSpan1 = (line1Ref.current?.querySelector('.hl-solid') || line1Ref.current?.firstElementChild) as HTMLElement | null
                            const deskSpan2 = (line2Ref.current?.querySelector('.hl-kw') || line2Ref.current?.firstElementChild) as HTMLElement | null

                            if (deskSpan1 && deskSpan2) {
                                entranceTl.fromTo(
                                    deskSpan1,
                                    { yPercent: 115, rotateZ: 0, opacity: 0 },
                                    { yPercent: 0, rotateZ: 0, opacity: 1, duration: 0.55, ease: 'power3.out' },
                                    0.14
                                )
                                entranceTl.fromTo(
                                    deskSpan2,
                                    { yPercent: 115, rotateZ: 0, opacity: 0 },
                                    { yPercent: 0, rotateZ: 0, opacity: 1, duration: 0.55, ease: 'power3.out' },
                                    0.22
                                )
                            }

                            // Animasi SplitText per kata pada ScrollTrigger Desktop: memisah radial
                            if (allWords.length > 0 && scrollTl) {
                                scrollTl.fromTo(
                                    allWords,
                                    { xPercent: 0, yPercent: 0, rotateZ: 0 },
                                    {
                                        xPercent: (i: number) => (i % 2 === 0 ? -14 - i * 4 : 14 + i * 4),
                                        yPercent: (i: number) => -18 - (i % 3) * 10,
                                        rotateZ: (i: number) => (i % 2 === 0 ? -3.5 : 3.5),
                                        duration: 0.75,
                                        immediateRender: false,
                                    },
                                    0
                                )
                            }

                            if (avatarFloatRef.current) {
                                entranceTl.fromTo(
                                    avatarFloatRef.current,
                                    { opacity: 0, scale: 0.85, rotate: -5 },
                                    { opacity: 1, scale: 1, rotate: 0, duration: 0.75, ease: 'back.out(1.7)' },
                                    0.16
                                )
                            }

                            if (roleContainerRef.current) {
                                entranceTl.fromTo(
                                    roleContainerRef.current,
                                    { opacity: 0, y: 12 },
                                    { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out', clearProps: 'transform' },
                                    0.28
                                )
                            }
                            addRoleTypewriter(0.3)

                            if (descRef.current) {
                                entranceTl.fromTo(
                                    descRef.current,
                                    { opacity: 0, y: 16 },
                                    { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out', clearProps: 'transform' },
                                    0.34
                                )
                            }

                            if (ctaRef.current) {
                                entranceTl.fromTo(
                                    ctaRef.current,
                                    { opacity: 0, y: 14, scale: 0.94 },
                                    { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'back.out(1.5)', clearProps: 'transform' },
                                    0.42
                                )
                            }
                        }

                        measureCharCenters()

                        const isScrolledDown =
                            typeof window !== 'undefined' && (window.scrollY || window.pageYOffset || 0) > 10
                        const isSkipOrRevealed =
                            typeof window !== 'undefined' &&
                            (new URLSearchParams(window.location.search).get('load') === '0' ||
                                (window as unknown as { __heroRevealed?: boolean }).__heroRevealed === true)

                        if (isScrolledDown) {
                            hasRevealed = true
                            entranceTl.progress(1)
                        } else if (isSkipOrRevealed && !hasRevealed) {
                            hasRevealed = true
                            entranceTl.play()
                        }

                        ScrollTrigger.refresh()
                    }

                    const onReveal = () => {
                        if (!isContextActive || isCleanedUp) return
                        hasRevealed = true
                        const win = window as Window & { __heroRevealed?: boolean }
                        win.__heroRevealed = true
                        entranceTl.restart()
                        ScrollTrigger.refresh()
                        startStatementRotation()
                    }
                    const onRevealDirect = () => {
                        if (!isContextActive || isCleanedUp || hasRevealed) return
                        hasRevealed = true
                        const win = window as Window & { __heroRevealed?: boolean }
                        win.__heroRevealed = true
                        entranceTl.progress(1)
                        ScrollTrigger.refresh()
                        startStatementRotation()
                    }
                    window.addEventListener('hero:reveal', onReveal)
                    window.addEventListener('hero:reveal-direct', onRevealDirect)
                    window.addEventListener('resize', scheduleMeasureDebounced, { passive: true })

                    // ----------------------------------------------------------------
                    // 4. MASTER SCROLL TIMELINE (GSAP ScrollTrigger Scrub + SplitText)
                    // ----------------------------------------------------------------
                    let scrollProgress = 0
                    let latestHudX = 0
                    let latestHudY = 0
                    let lastScrollChangeTime = performance.now()
                    const waveOriginTime = performance.now()

                    if (isPhone) {
                        // Parallax & Fade ScrollTrigger untuk Mobile (< 768px)
                        mobileScrollTl = gsap.timeline({
                            defaults: { ease: 'none' },
                            scrollTrigger: {
                                trigger: container,
                                start: 'top top',
                                end: 'bottom top',
                                scrub: 0.6,
                                invalidateOnRefresh: true,
                                onUpdate: (self) => {
                                    if (self.progress > 0.005 && entranceTl.isActive()) {
                                        entranceTl.progress(1)
                                    }
                                    if (self.progress > 0.04) {
                                        stopStatementRotation()
                                    }
                                },
                                onLeaveBack: () => {
                                    startStatementRotation()
                                },
                            },
                        })

                        // 1. Lapisan Flat Grid: zoom & memudar halus
                        if (flatGridRef?.current) {
                            mobileScrollTl.fromTo(
                                flatGridRef.current,
                                { scale: 1, opacity: 0.04 },
                                { scale: 1.25, opacity: 0, duration: 0.85, immediateRender: false },
                                0
                            )
                        }

                        // 2. Badge: melesat ke kiri-atas dengan rotasi halus
                        if (mobileBadgeRef?.current) {
                            mobileScrollTl.fromTo(
                                mobileBadgeRef.current,
                                { x: 0, y: 0, rotate: 0, scale: 1, opacity: 1 },
                                {
                                    x: -45,
                                    y: -50,
                                    rotate: -9,
                                    scale: 0.88,
                                    opacity: 0,
                                    duration: 0.65,
                                    immediateRender: false,
                                },
                                0
                            )
                        }

                        // 3. Role Label: melesat ke kanan-atas dengan rotasi halus
                        if (mobileRoleRef?.current) {
                            mobileScrollTl.fromTo(
                                mobileRoleRef.current,
                                { x: 0, y: 0, rotate: 0, opacity: 1 },
                                {
                                    x: 40,
                                    y: -38,
                                    rotate: 5,
                                    opacity: 0,
                                    duration: 0.68,
                                    immediateRender: false,
                                },
                                0
                            )
                        }

                        // 4. Headline Line 1 ("From Pixel"): melesat kuat ke kiri-atas & rotasi counter-clockwise
                        if (mobileLine1Ref?.current) {
                            mobileScrollTl.fromTo(
                                mobileLine1Ref.current,
                                { xPercent: 0, yPercent: 0, rotate: 0, opacity: 1 },
                                {
                                    xPercent: -38,
                                    yPercent: -20,
                                    rotate: -4.5,
                                    opacity: 0,
                                    duration: 0.78,
                                    immediateRender: false,
                                },
                                0
                            )
                        }

                        // 5. Headline Line 2 ("to Query."): melesat kuat ke kanan-bawah & rotasi clockwise (memisah berlawanan!)
                        if (mobileLine2Ref?.current) {
                            mobileScrollTl.fromTo(
                                mobileLine2Ref.current,
                                { xPercent: 0, yPercent: 0, rotate: 0, opacity: 1 },
                                {
                                    xPercent: 38,
                                    yPercent: 14,
                                    rotate: 4.5,
                                    opacity: 0,
                                    duration: 0.78,
                                    immediateRender: false,
                                },
                                0
                            )
                        }

                        // 6. Headline box wrapper: fade out bertahap
                        if (mobileHeadlineBoxRef?.current) {
                            mobileScrollTl.fromTo(
                                mobileHeadlineBoxRef.current,
                                { scale: 1, opacity: 1 },
                                { scale: 0.95, opacity: 0, duration: 0.8, immediateRender: false },
                                0.05
                            )
                        }

                        // 7. Subteks: melayang turun ke kiri & memudar
                        if (mobileSubtextRef?.current) {
                            mobileScrollTl.fromTo(
                                mobileSubtextRef.current,
                                { xPercent: 0, yPercent: 0, rotate: 0, scale: 1, opacity: 1 },
                                {
                                    xPercent: -12,
                                    yPercent: 35,
                                    rotate: -2,
                                    scale: 0.94,
                                    opacity: 0,
                                    duration: 0.75,
                                    immediateRender: false,
                                },
                                0.04
                            )
                        }

                        // 8. CTA Utama: meluncur ke kanan-bawah & memudar
                        if (mobileCtaPrimaryRef?.current) {
                            mobileScrollTl.fromTo(
                                mobileCtaPrimaryRef.current,
                                { xPercent: 0, yPercent: 0, rotate: 0, scale: 1, opacity: 1 },
                                {
                                    xPercent: 14,
                                    yPercent: 48,
                                    rotate: 3.5,
                                    scale: 0.92,
                                    opacity: 0,
                                    duration: 0.8,
                                    immediateRender: false,
                                },
                                0.08
                            )
                        }

                        // 9. CTA Sekunder: meluncur ke kiri-bawah & memudar (memisah berlawanan arah!)
                        if (mobileCtaSecondaryRef?.current) {
                            mobileScrollTl.fromTo(
                                mobileCtaSecondaryRef.current,
                                { xPercent: 0, yPercent: 0, rotate: 0, scale: 1, opacity: 1 },
                                {
                                    xPercent: -18,
                                    yPercent: 62,
                                    rotate: -4,
                                    scale: 0.9,
                                    opacity: 0,
                                    duration: 0.8,
                                    immediateRender: false,
                                },
                                0.12
                            )
                        }
                    } else {
                        setBgWillChange('transform, opacity')

                        scrollTl = gsap.timeline({
                            defaults: { ease: 'none' },
                            scrollTrigger: {
                                trigger: container,
                                start: 'top top',
                                end: 'bottom top',
                                scrub: 0.8,
                                invalidateOnRefresh: true,
                                onEnter: () => setBgWillChange('transform, opacity'),
                                onEnterBack: () => setBgWillChange('transform, opacity'),
                                onLeave: () => setBgWillChange('auto'),
                                onLeaveBack: () => {
                                    scrollProgress = 0
                                    lastScrollChangeTime = performance.now()
                                    setBgWillChange('transform, opacity')
                                    measureCharCenters()
                                    if (hudCoordsRef?.current) {
                                        hudCoordsRef.current.textContent = `[${latestHudX}, ${latestHudY}]`
                                    }
                                    startStatementRotation()
                                },
                                onRefresh: () => {
                                    if (scrollProgress < 0.02) measureCharCenters()
                                },
                                onUpdate: (self) => {
                                    scrollProgress = self.progress
                                    lastScrollChangeTime = performance.now()
                                    if (self.progress > 0.005 && entranceTl.isActive()) {
                                        entranceTl.progress(1)
                                    }
                                    if (self.progress > 0.04) {
                                        stopStatementRotation()
                                    }
                                    if (hudCoordsRef?.current) {
                                        if (self.progress > 0.002) {
                                            const pct = String(Math.round(self.progress * 100)).padStart(3, '0')
                                            hudCoordsRef.current.textContent = `SCROLL // ${pct}%`
                                        } else {
                                            hudCoordsRef.current.textContent = `[${latestHudX}, ${latestHudY}]`
                                        }
                                    }
                                },
                            },
                        })

                        // 1. Lantai Grid 3D Perspektif: bergerak maju & membesar
                        if (grid3dRef.current) {
                            scrollTl.fromTo(
                                grid3dRef.current,
                                {
                                    rotateX: HERO_ANIMATION_CONFIG.GRID_ROTATE_X_DEG,
                                    yPercent: 0,
                                    scale: 1,
                                    opacity: HERO_ANIMATION_CONFIG.GRID_OPACITY_START,
                                },
                                {
                                    rotateX: HERO_ANIMATION_CONFIG.GRID_ROTATE_X_DEG,
                                    yPercent: HERO_ANIMATION_CONFIG.GRID_TRANSLATE_Y_PCT,
                                    scale: HERO_ANIMATION_CONFIG.GRID_SCALE_END,
                                    opacity: HERO_ANIMATION_CONFIG.GRID_OPACITY_END,
                                    duration: 1.0,
                                },
                                0
                            )
                        }

                        // 2. Teks Raksasa Outline "IKBAL" di latar: sapuan horizontal & zoom
                        if (bgTextScrollRef.current) {
                            scrollTl.fromTo(
                                bgTextScrollRef.current,
                                { xPercent: bgTextXStart, scale: 1 },
                                {
                                    xPercent: bgTextXEnd,
                                    scale: HERO_ANIMATION_CONFIG.BG_TEXT_SCALE_END,
                                    duration: 1.0,
                                },
                                0
                            )
                        }

                        // 3. Ambient Orb Lime: melayang diagonal & membesar
                        if (orbRef.current) {
                            scrollTl.fromTo(
                                orbRef.current,
                                {
                                    xPercent: HERO_ANIMATION_CONFIG.ORB_X_START,
                                    yPercent: HERO_ANIMATION_CONFIG.ORB_Y_START,
                                    scale: 1,
                                    opacity: HERO_ANIMATION_CONFIG.ORB_OPACITY_START,
                                },
                                {
                                    xPercent: HERO_ANIMATION_CONFIG.ORB_X_END,
                                    yPercent: HERO_ANIMATION_CONFIG.ORB_Y_END,
                                    scale: HERO_ANIMATION_CONFIG.ORB_SCALE_END,
                                    opacity: HERO_ANIMATION_CONFIG.ORB_OPACITY_END,
                                    duration: 1.0,
                                },
                                0
                            )
                        }

                        // 4. Indikator Scroll: menghilang cepat saat mulai scroll
                        if (scrollIndicatorRef.current) {
                            scrollTl.fromTo(
                                scrollIndicatorRef.current,
                                { opacity: 1, y: 0 },
                                { opacity: 0, y: 35, duration: 0.25, immediateRender: false },
                                0
                            )
                        }

                        // 5. HUD Sudut: memencar ke sudut luar layar (bubar ke pojok)
                        if (hudTopLeftRef?.current) {
                            scrollTl.fromTo(
                                hudTopLeftRef.current,
                                { x: 0, y: 0, opacity: 1 },
                                { x: -50, y: -30, opacity: 0, duration: 0.6, immediateRender: false },
                                0
                            )
                        }
                        if (hudTopRightRef?.current) {
                            scrollTl.fromTo(
                                hudTopRightRef.current,
                                { x: 0, y: 0, opacity: 1 },
                                { x: 50, y: -30, opacity: 0, duration: 0.6, immediateRender: false },
                                0
                            )
                        }
                        if (hudBottomLeftRef?.current) {
                            scrollTl.fromTo(
                                hudBottomLeftRef.current,
                                { x: 0, y: 0, opacity: 1 },
                                { x: -50, y: 30, opacity: 0, duration: 0.6, immediateRender: false },
                                0
                            )
                        }

                        // 6. Headline Baris 1 & Baris 2: memisah berlawanan arah secara dramatis
                        // Line 1 melesat ke kiri-atas dengan rotasi counter-clockwise
                        if (line1Ref.current) {
                            scrollTl.fromTo(
                                line1Ref.current,
                                { xPercent: 0, yPercent: 0, rotate: 0, opacity: 1 },
                                {
                                    xPercent: -36,
                                    yPercent: -28,
                                    rotate: -4.5,
                                    opacity: 0,
                                    duration: 0.75,
                                    immediateRender: false,
                                },
                                0
                            )
                        }
                        // Line 2 melesat ke kanan-atas dengan rotasi clockwise
                        if (line2Ref.current) {
                            scrollTl.fromTo(
                                line2Ref.current,
                                { xPercent: 0, yPercent: 0, rotate: 0, opacity: 1 },
                                {
                                    xPercent: 36,
                                    yPercent: -12,
                                    rotate: 4.5,
                                    opacity: 0,
                                    duration: 0.75,
                                    immediateRender: false,
                                },
                                0
                            )
                        }
                        if (headlineRef.current) {
                            scrollTl.fromTo(
                                headlineRef.current,
                                { opacity: 1, scale: 1 },
                                { opacity: 0, scale: 0.94, duration: 0.75, immediateRender: false },
                                0.05
                            )
                        }

                        // 7. Badge Desktop: meluncur ke kiri-atas dengan rotasi halus
                        if (badgeScrollRef.current) {
                            scrollTl.fromTo(
                                badgeScrollRef.current,
                                { x: 0, y: 0, rotate: 0, scale: 1, opacity: 1 },
                                {
                                    x: -65,
                                    y: -65,
                                    rotate: -7,
                                    scale: 0.88,
                                    opacity: 0,
                                    duration: 0.65,
                                    immediateRender: false,
                                },
                                0
                            )
                        }

                        // 8. Meta Wrapper (menjaga kompatibilitas opacity di test-hero) & elemen di dalamnya memisah
                        if (metaScrollRef.current) {
                            scrollTl.fromTo(
                                metaScrollRef.current,
                                { opacity: 1 },
                                { opacity: 0, duration: 0.78, immediateRender: false },
                                0.05
                            )
                        }

                        // 8a. Role Label: meluncur ke kiri-bawah dengan rotasi halus
                        if (roleContainerRef.current) {
                            scrollTl.fromTo(
                                roleContainerRef.current,
                                { x: 0, y: 0, rotate: 0, opacity: 1 },
                                {
                                    x: -55,
                                    y: 18,
                                    rotate: -3,
                                    opacity: 0,
                                    duration: 0.68,
                                    immediateRender: false,
                                },
                                0
                            )
                        }

                        // 8b. Subteks: melayang turun ke kanan-bawah & scale mengecil halus
                        if (descRef.current) {
                            scrollTl.fromTo(
                                descRef.current,
                                { x: 0, y: 0, rotate: 0, scale: 1, opacity: 1 },
                                {
                                    x: 45,
                                    y: 55,
                                    rotate: 2,
                                    scale: 0.95,
                                    opacity: 0,
                                    duration: 0.75,
                                    immediateRender: false,
                                },
                                0.04
                            )
                        }

                        // 8c. CTA Utama ("View My Work"): memisah ke kiri-bawah
                        if (ctaPrimaryRef?.current) {
                            scrollTl.fromTo(
                                ctaPrimaryRef.current,
                                { x: 0, y: 0, rotate: 0, scale: 1, opacity: 1 },
                                {
                                    x: -45,
                                    y: 75,
                                    rotate: -4,
                                    scale: 0.92,
                                    opacity: 0,
                                    duration: 0.78,
                                    immediateRender: false,
                                },
                                0.06
                            )
                        }

                        // 8d. CTA Sekunder ("Leadership & Achievements"): memisah ke kanan-bawah (berlawanan dari Primary!)
                        if (ctaSecondaryRef?.current) {
                            scrollTl.fromTo(
                                ctaSecondaryRef.current,
                                { x: 0, y: 0, rotate: 0, scale: 1, opacity: 1 },
                                {
                                    x: 55,
                                    y: 85,
                                    rotate: 4,
                                    scale: 0.92,
                                    opacity: 0,
                                    duration: 0.78,
                                    immediateRender: false,
                                },
                                0.08
                            )
                        }

                        // Fallback jika ctaRef langsung ada tanpa child ref
                        if (ctaRef.current && !ctaPrimaryRef?.current) {
                            scrollTl.fromTo(
                                ctaRef.current,
                                { y: 0, opacity: 1 },
                                { y: 70, opacity: 0, duration: 0.75, immediateRender: false },
                                0.06
                            )
                        }

                        // 9. Avatar / Mascot: melesat ke kiri luar & membesar halus (fly outward)
                        if (avatarWrapperRef.current) {
                            scrollTl.fromTo(
                                avatarWrapperRef.current,
                                { xPercent: 0, yPercent: 0, scale: 1, rotate: 0, opacity: 1 },
                                {
                                    xPercent: -32,
                                    yPercent: -16,
                                    scale: 1.14,
                                    rotate: -4,
                                    opacity: 0,
                                    duration: 0.82,
                                    immediateRender: false,
                                },
                                0
                            )
                        }

                        // 9b. Bayangan Avatar: menyusut & memudar
                        if (avatarShadowRef?.current) {
                            scrollTl.fromTo(
                                avatarShadowRef.current,
                                { scale: 1, opacity: 1 },
                                { scale: 0.3, opacity: 0, duration: 0.55, immediateRender: false },
                                0
                            )
                        }
                    }

                    if (typeof document !== 'undefined' && document.fonts && document.fonts.ready) {
                        document.fonts.ready.then(() => {
                            if (isContextActive && !isCleanedUp) {
                                context.add(initSplitAndEntrance)
                                ScrollTrigger.refresh()
                            }
                        })
                    } else {
                        initSplitAndEntrance()
                    }

                    // ----------------------------------------------------------------
                    // 5. BLUEPRINT CURSOR & IDLE WAVE (Desktop)
                    // ----------------------------------------------------------------
                    let pointerClientX = -9999
                    let pointerClientY = -9999
                    let lastMoveTime = -9999
                    let isPointerInHero = false
                    let isTouchDragging = false
                    let hasLeftHeroExplicitly = false
                    let hudNeedsUpdate = false

                    const checkInsideHero = (clientX: number, clientY: number) => {
                        const rect = container.getBoundingClientRect()
                        const navH = shouldPinHero ? 72 : 60
                        return (
                            clientX >= rect.left &&
                            clientX <= rect.right &&
                            clientY >= Math.max(rect.top, navH) &&
                            clientY <= rect.bottom
                        )
                    }

                    const handlePointerActivity = (clientX: number, clientY: number, isTouch: boolean) => {
                        pointerClientX = clientX
                        pointerClientY = clientY

                        const inside = checkInsideHero(clientX, clientY)
                        isPointerInHero = inside
                        hasLeftHeroExplicitly = !inside

                        if (inside) {
                            lastMoveTime = performance.now()
                            if (isTouch) {
                                isTouchDragging = true
                                measureCharCenters()
                            }
                            const rect = container.getBoundingClientRect()
                            latestHudX = Math.round(clientX - rect.left)
                            latestHudY = Math.round(clientY - rect.top)
                            hudNeedsUpdate = true
                        }
                    }

                    const onPointerDown = (e: PointerEvent) => {
                        if (isPhone) return
                        handlePointerActivity(e.clientX, e.clientY, e.pointerType === 'touch')
                    }

                    const onPointerMove = (e: PointerEvent | MouseEvent) => {
                        if (isPhone) return
                        const isTouch = 'pointerType' in e && e.pointerType === 'touch'
                        handlePointerActivity(e.clientX, e.clientY, isTouch)
                    }

                    const onPointerEnd = () => {
                        if (isPhone) return
                        isTouchDragging = false
                        lastMoveTime = performance.now()
                    }

                    const onHeroMouseLeave = () => {
                        if (isPhone) return
                        isPointerInHero = false
                        isTouchDragging = false
                        hasLeftHeroExplicitly = true
                    }

                    container.addEventListener('pointerdown', onPointerDown, { passive: true })
                    window.addEventListener('pointermove', onPointerMove, { passive: true })
                    window.addEventListener('pointerup', onPointerEnd, { passive: true })
                    window.addEventListener('pointercancel', onPointerEnd, { passive: true })
                    container.addEventListener('mouseleave', onHeroMouseLeave, { passive: true })

                    const onTick = () => {
                        const activeMetrics = isPhone ? mobileCharMetrics : charMetrics
                        if (!isContextActive || isCleanedUp || activeMetrics.length === 0) return
                        if (entranceTl.isActive() || (isPhone && isMobileTouching)) return

                        if (!isPhone && hudNeedsUpdate && scrollProgress <= 0.002 && hudCoordsRef?.current) {
                            hudCoordsRef.current.textContent = `[${latestHudX}, ${latestHudY}]`
                            hudNeedsUpdate = false
                        }

                        const now = performance.now()
                        if (scrollProgress > 0.002 || (window.scrollY || window.pageYOffset || 0) > 5) {
                            lastScrollChangeTime = now
                        }
                        const heroRect = container.getBoundingClientRect()
                        const heroVisible = heroRect.bottom > 60 && heroRect.top < window.innerHeight

                        const timeSinceMove = now - lastMoveTime
                        const activeTimeout = hasTouch
                            ? isTouchDragging
                                ? 2000
                                : 320
                            : scrollProgress > 0.02
                            ? 350
                            : HERO_ANIMATION_CONFIG.BP_IDLE_TIMEOUT_MS

                        const isPointerActivelyMoving =
                            !isPhone && isPointerInHero && timeSinceMove <= activeTimeout

                        if (!heroVisible || (!isPhone && hasLeftHeroExplicitly) || (scrollProgress > 0.02 && !isPointerActivelyMoving)) {
                            for (let i = 0; i < activeMetrics.length; i++) {
                                activeMetrics[i].targetT = 0
                            }
                        } else if (isPointerActivelyMoving) {
                            const scrollX = window.scrollX || window.pageXOffset || 0
                            const scrollY = window.scrollY || window.pageYOffset || 0
                            const px = pointerClientX + scrollX
                            const py = pointerClientY + scrollY
                            const r = hasTouch
                                ? HERO_ANIMATION_CONFIG.BP_MOBILE_RADIUS_PX
                                : HERO_ANIMATION_CONFIG.BP_RADIUS_PX

                            for (let i = 0; i < activeMetrics.length; i++) {
                                const item = activeMetrics[i]
                                const dist = Math.hypot(px - item.cx, py - item.cy)
                                const rawT = 1 - dist / r
                                item.targetT = rawT <= 0 ? 0 : rawT >= 1 ? 1 : rawT
                            }
                        } else if (isPhone || hasTouch || isPointerInHero || !hasLeftHeroExplicitly) {
                            const idleTimeoutMs = isPhone ? 1200 : HERO_ANIMATION_CONFIG.BP_IDLE_TIMEOUT_MS
                            const idleAnchor = Math.max(waveOriginTime, lastMoveTime, lastScrollChangeTime)
                            const idleElapsedMs = now - idleAnchor - idleTimeoutMs

                            if (idleElapsedMs > 0 && scrollProgress <= 0.002) {
                                const periodSec = isPhone ? 4.8 : HERO_ANIMATION_CONFIG.BP_WAVE_PERIOD_SEC
                                const sweepSec = isPhone ? 2.6 : HERO_ANIMATION_CONFIG.BP_WAVE_SWEEP_SEC
                                const cycleSec = (idleElapsedMs / 1000) % periodSec
                                const r = isPhone
                                    ? HERO_ANIMATION_CONFIG.MOBILE_TOUCH_RADIUS_PX
                                    : hasTouch
                                    ? HERO_ANIMATION_CONFIG.BP_MOBILE_RADIUS_PX
                                    : HERO_ANIMATION_CONFIG.BP_RADIUS_PX

                                if (cycleSec <= sweepSec) {
                                    const progress = cycleSec / sweepSec
                                    const spanW = maxCharX - minCharX
                                    const waveX = minCharX - r + progress * (spanW + r * 2)

                                    for (let i = 0; i < activeMetrics.length; i++) {
                                        const item = activeMetrics[i]
                                        const distX = Math.abs(item.cx - waveX)
                                        const rawT = 1 - distX / r
                                        item.targetT = rawT <= 0 ? 0 : rawT >= 1 ? 1 : rawT
                                    }
                                } else {
                                    for (let i = 0; i < activeMetrics.length; i++) {
                                        activeMetrics[i].targetT = 0
                                    }
                                }
                            } else {
                                for (let i = 0; i < activeMetrics.length; i++) {
                                    activeMetrics[i].targetT = 0
                                }
                            }
                        } else {
                            for (let i = 0; i < activeMetrics.length; i++) {
                                activeMetrics[i].targetT = 0
                            }
                        }

                        const dt = Math.min(gsap.ticker.deltaRatio(60), 3)
                        const alpha = 1 - Math.pow(1 - HERO_ANIMATION_CONFIG.BP_LERP_FACTOR, dt)

                        for (let i = 0; i < activeMetrics.length; i++) {
                            const item = activeMetrics[i]
                            const diff = item.targetT - item.currentT
                            if (Math.abs(diff) > 0.0005) {
                                let nextT = item.currentT + diff * alpha
                                if (item.targetT === 0 && nextT < 0.002) nextT = 0
                                else if (item.targetT === 1 && nextT > 0.998) nextT = 1
                                item.currentT = nextT
                                item.el.style.setProperty('--t', nextT === 0 ? '0' : nextT.toFixed(3))
                            } else if (item.currentT !== item.targetT) {
                                item.currentT = item.targetT
                                item.el.style.setProperty('--t', item.targetT === 0 ? '0' : item.targetT.toFixed(3))
                            }
                        }
                    }

                    gsap.ticker.add(onTick)

                    // ----------------------------------------------------------------
                    // 6. AVATAR: Mengambang & Mengikuti Kursor di Desktop
                    // ----------------------------------------------------------------
                    if (!isPhone && avatarFloatRef.current) {
                        const floatAmp = HERO_ANIMATION_CONFIG.AVATAR_FLOAT_AMPLITUDE
                        gsap.to(avatarFloatRef.current, {
                            y: -floatAmp,
                            duration: HERO_ANIMATION_CONFIG.AVATAR_FLOAT_DURATION,
                            yoyo: true,
                            repeat: -1,
                            ease: 'sine.inOut',
                        })
                    }

                    let cleanupAvatarMouse: (() => void) | null = null
                    if (!isPhone && avatarTiltRef.current) {
                        const avatarTilt = avatarTiltRef.current
                        const bgText = parallaxBgTextRef.current

                        const quickAvatarX = gsap.quickTo(avatarTilt, 'x', { duration: 0.4, ease: 'power2.out' })
                        const quickAvatarY = gsap.quickTo(avatarTilt, 'y', { duration: 0.4, ease: 'power2.out' })
                        const quickAvatarRot = gsap.quickTo(avatarTilt, 'rotation', { duration: 0.4, ease: 'power2.out' })

                        const quickBgX = bgText ? gsap.quickTo(bgText, 'x', { duration: 0.6, ease: 'power1.out' }) : null
                        const quickBgY = bgText ? gsap.quickTo(bgText, 'y', { duration: 0.6, ease: 'power1.out' }) : null

                        const handleAvatarFollow = (e: MouseEvent) => {
                            const normX = Math.max(-1, Math.min(1, (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2)))
                            const normY = Math.max(-1, Math.min(1, (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2)))

                            quickAvatarX(normX * HERO_ANIMATION_CONFIG.AVATAR_TILT_MAX_PX)
                            quickAvatarY(normY * HERO_ANIMATION_CONFIG.AVATAR_TILT_MAX_PX)
                            quickAvatarRot(normX * HERO_ANIMATION_CONFIG.AVATAR_TILT_MAX_DEG)

                            if (quickBgX && quickBgY) {
                                quickBgX(-normX * 20)
                                quickBgY(-normY * 14)
                            }
                        }

                        window.addEventListener('mousemove', handleAvatarFollow, { passive: true })
                        cleanupAvatarMouse = () => window.removeEventListener('mousemove', handleAvatarFollow)
                    }

                    return () => {
                        isContextActive = false
                        setBgWillChange('auto')
                        gsap.ticker.remove(onTick)
                        if (scrollTl) {
                            if (scrollTl.scrollTrigger) scrollTl.scrollTrigger.kill()
                            scrollTl.kill()
                        }
                        if (mobileScrollTl) {
                            if (mobileScrollTl.scrollTrigger) mobileScrollTl.scrollTrigger.kill()
                            mobileScrollTl.kill()
                        }
                        if (mobileTouchCleanup) mobileTouchCleanup()
                        mobileSplitInstances.forEach((s) => {
                            try {
                                s.revert()
                            } catch {}
                        })
                        mobileSplitInstances = []
                        mobileCharMetrics = []
                        container.removeEventListener('pointerdown', onPointerDown)
                        window.removeEventListener('pointermove', onPointerMove)
                        window.removeEventListener('pointerup', onPointerEnd)
                        window.removeEventListener('pointercancel', onPointerEnd)
                        container.removeEventListener('mouseleave', onHeroMouseLeave)
                        window.removeEventListener('hero:reveal', onReveal)
                        window.removeEventListener('hero:reveal-direct', onRevealDirect)
                        window.removeEventListener('resize', scheduleMeasureDebounced)
                        if (cleanupAvatarMouse) cleanupAvatarMouse()
                        if (typeof document !== 'undefined') {
                            document.removeEventListener('visibilitychange', onVisibilityChange)
                        }
                        stopStatementRotation()
                        window.clearTimeout(resizeTimer)
                        window.clearTimeout(postEntranceTimer)
                        window.clearTimeout(failSafeTimer)
                        splitInstances.forEach((s) => {
                            try {
                                s.revert()
                            } catch {}
                        })
                        splitInstances = []
                        charMetrics = []
                    }
                }
            )

            return () => {
                isCleanedUp = true
                setBgWillChange('auto')
                window.clearTimeout(resizeTimer)
                window.clearTimeout(postEntranceTimer)
                mm.revert()
                mobileSplitInstances.forEach((s) => {
                    try {
                        s.revert()
                    } catch {}
                })
                mobileSplitInstances = []
                mobileCharMetrics = []
                splitInstances.forEach((s) => {
                    try {
                        s.revert()
                    } catch {}
                })
                splitInstances = []
                charMetrics = []
            }
        },
        { scope: containerRef }
    )
}
