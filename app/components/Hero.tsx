'use client'

import React, { useRef, useEffect } from 'react'
import MagneticWrapper from './MagneticWrapper'
import { Mascot } from 'page-mascot'
import { useHeroAnimation, HERO_ANIMATION_CONFIG } from './useHeroAnimation'

// ============================================================================
// SATU SUMBER TEKS HERO (HERO_COPY)
// Semua teks hero (mobile dan desktop) diambil secara konsisten dari sini.
// ============================================================================
export const HERO_STATEMENTS = [
    {
        line1: 'Hi, I am',
        line2: 'Akhmad Ikbal.',
    },
    {
        line1: 'Creative',
        line2: 'Designer.',
    },
] as const

export const HERO_COPY = {
    badgeMobile: 'Open for Internship',
    badgeDesktop: 'Open for Internship & Collaboration',
    roleLabel: 'FULL-STACK DEVELOPER',
    headline: HERO_STATEMENTS[0],
    subtext: {
        prefix: "Information Systems student from Pekalongan, Indonesia. I don't just write code; I build solutions that merge ",
        bold1: 'engineering logic',
        middle: ' with ',
        bold2: 'creative design',
        suffix: '.',
    },
    ctaPrimary: 'View My Work',
    ctaSecondary: 'Leadership & Achievements',
} as const

// ============================================================================
// DAFTAR VARIABEL KONFIGURASI HERO YANG MUDAH DIUBAH
// ============================================================================
export const HERO_CONFIG = {
    // 1. Tipografi & Komposisi Mobile (< 768px)
    MOBILE_HEADLINE_SIZE: 'clamp(1.95rem, 9.4vw, 2.75rem)',
    MOBILE_HEADLINE_LINE_HEIGHT: 1.02,
    MOBILE_VERB_OPACITY: 0.92,
    MOBILE_VERB_WEIGHT: 600,
    MOBILE_KW_WEIGHT: 800,
    MOBILE_AVATAR_WIDTH: 'clamp(72px, 20vw, 92px)',
    MOBILE_BADGE_HEIGHT_PX: 26,
    MOBILE_BADGE_FONT_PX: 10,
    MOBILE_ROLE_FONT_PX: 11,
    MOBILE_SUBTEXT_FONT_PX: 14.5,
    MOBILE_SUBTEXT_LINE_HEIGHT: 1.6,
    MOBILE_SUBTEXT_MAX_CH: '32ch',
    MOBILE_CTA_HEIGHT_PX: 52,
    MOBILE_CTA_SEC_HEIGHT_PX: 44,
    MOBILE_CTA_RADIUS_PX: 12,

    // 2. Ritme Vertikal Mobile (< 768px)
    MOBILE_BADGE_HEADLINE_GAP_PX: 16,     // Badge -> role/headline
    MOBILE_STATEMENT_GAP_EM: '0.05em',    // Antar baris headline
    MOBILE_ROLE_HEADLINE_GAP_PX: 12,      // Role label di atas headline: 12px
    MOBILE_HEADLINE_SUBTEXT_GAP_PX: 28,   // Headline -> subteks: 28px
    MOBILE_SUBTEXT_CTA_GAP_PX: 28,        // Subteks -> CTA utama: 28px
    MOBILE_CTA_INTER_GAP_PX: 18,          // CTA utama -> CTA sekunder: 18px

    // 3. Latar Belakang Mobile & Desktop
    MOBILE_FLAT_GRID_OPACITY: 0.04,
    PIN_SCROLL_VH: HERO_ANIMATION_CONFIG.PIN_SCROLL_VH,                      // 120vh (Desktop)
    GRID_ROTATE_X_DEG: HERO_ANIMATION_CONFIG.GRID_ROTATE_X_DEG,              // 60deg
    GRID_OPACITY_START: HERO_ANIMATION_CONFIG.GRID_OPACITY_START,            // 0.65
    GRID_OPACITY_END: HERO_ANIMATION_CONFIG.GRID_OPACITY_END,                // 1.0
    ORB_OPACITY_START: HERO_ANIMATION_CONFIG.ORB_OPACITY_START,              // 0.12
    ORB_OPACITY_END: HERO_ANIMATION_CONFIG.ORB_OPACITY_END,                  // 0.22
    NOISE_OPACITY: HERO_ANIMATION_CONFIG.NOISE_OPACITY,                      // 0.04 (Desktop)
    BG_OUTLINE_OPACITY: HERO_ANIMATION_CONFIG.BG_TEXT_OPACITY,               // 0.06 (Desktop)

    // 4. Blueprint Cursor (Desktop)
    BLUEPRINT_RADIUS_PX: HERO_ANIMATION_CONFIG.BP_RADIUS_PX,                 // 160px
    BLUEPRINT_STROKE_PX: HERO_ANIMATION_CONFIG.BP_STROKE_MAX_PX,             // 1.5px
    BLUEPRINT_LIFT_PX: HERO_ANIMATION_CONFIG.BP_LIFT_MAX_PX,                 // -4px
    BLUEPRINT_WAVE_PERIOD_SEC: HERO_ANIMATION_CONFIG.BP_WAVE_PERIOD_SEC,     // 6.0s
}

const STATIC_NOISE_BG =
    "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")"

function HeroComponent() {
    const containerRef = useRef<HTMLElement>(null)
    const heroStageRef = useRef<HTMLDivElement>(null)

    // Lapisan Latar Refs
    const grid3dRef = useRef<HTMLDivElement>(null)
    const bgTextScrollRef = useRef<HTMLDivElement>(null)
    const parallaxBgTextRef = useRef<HTMLDivElement>(null)
    const orbRef = useRef<HTMLDivElement>(null)

    // Pelacak render untuk verifikasi otomatis (0 re-render saat mousemove & scroll)
    const renderCountRef = useRef(0)
    renderCountRef.current += 1
    if (typeof window !== 'undefined') {
        ;(window as unknown as { __heroRenderCount?: number }).__heroRenderCount = renderCountRef.current
    }

    // HUD Refs (diperbarui langsung via DOM tanpa useState)
    const hudCoordsRef = useRef<HTMLSpanElement>(null)
    const hudClockRef = useRef<HTMLSpanElement>(null)
    const hudVpTopRef = useRef<HTMLSpanElement>(null)
    const hudVpBottomRef = useRef<HTMLSpanElement>(null)

    // Desktop Headline & Content Refs
    const headlineRef = useRef<HTMLHeadingElement>(null)
    const line1Ref = useRef<HTMLDivElement>(null)
    const line2Ref = useRef<HTMLDivElement>(null)
    const badgeScrollRef = useRef<HTMLDivElement>(null)
    const badgeRef = useRef<HTMLDivElement>(null)
    const metaScrollRef = useRef<HTMLDivElement>(null)
    const roleContainerRef = useRef<HTMLDivElement>(null)
    const roleTextRef = useRef<HTMLSpanElement>(null)
    const descRef = useRef<HTMLParagraphElement>(null)
    const ctaRef = useRef<HTMLDivElement>(null)
    const ctaPrimaryRef = useRef<HTMLDivElement>(null)
    const ctaSecondaryRef = useRef<HTMLDivElement>(null)

    // Avatar & Scroll Indicator Refs (Desktop)
    const avatarWrapperRef = useRef<HTMLDivElement>(null)
    const avatarFloatRef = useRef<HTMLDivElement>(null)
    const avatarTiltRef = useRef<HTMLDivElement>(null)
    const avatarShadowRef = useRef<HTMLDivElement>(null)
    const scrollIndicatorRef = useRef<HTMLDivElement>(null)
    const hudTopLeftRef = useRef<HTMLDivElement>(null)
    const hudTopRightRef = useRef<HTMLDivElement>(null)
    const hudBottomLeftRef = useRef<HTMLDivElement>(null)
    // Mobile Refs (< 768px)
    const flatGridRef = useRef<HTMLDivElement>(null)
    const mobileContainerRef = useRef<HTMLDivElement>(null)
    const mobileBadgeRef = useRef<HTMLDivElement>(null)
    const mobileRoleRef = useRef<HTMLDivElement>(null)
    const mobileRoleTextRef = useRef<HTMLSpanElement>(null)
    const mobileHeadlineBoxRef = useRef<HTMLDivElement>(null)
    const mobileLine1Ref = useRef<HTMLDivElement>(null)
    const mobileLine2Ref = useRef<HTMLDivElement>(null)
    const mobileSubtextRef = useRef<HTMLParagraphElement>(null)
    const mobileCtaPrimaryRef = useRef<HTMLDivElement>(null)
    const mobileCtaSecondaryRef = useRef<HTMLDivElement>(null)

    // Render avatar HANYA saat desktop/tablet (>= 768px) agar mobile murni tidak mengunduh gambar avatar
    const [isDesktop, setIsDesktop] = React.useState(false)
    useEffect(() => {
        const mq = window.matchMedia('(min-width: 768px)')
        setIsDesktop(mq.matches)
        const onMediaChange = (e: MediaQueryListEvent) => setIsDesktop(e.matches)
        mq.addEventListener('change', onMediaChange)
        return () => mq.removeEventListener('change', onMediaChange)
    }, [])

    // Jam, Ukuran Viewport HUD, & kunci --app-svh terhadap perubahan tinggi address bar mobile
    useEffect(() => {
        let lockedWidth = window.innerWidth
        const syncAppSvh = (force: boolean) => {
            if (force || window.innerWidth !== lockedWidth) {
                lockedWidth = window.innerWidth
                document.documentElement.style.setProperty(
                    '--app-svh',
                    `${(window.innerHeight * 0.01).toFixed(3)}px`
                )
            }
        }
        syncAppSvh(true)

        const updateClock = () => {
            if (hudClockRef.current) {
                hudClockRef.current.textContent = new Date().toTimeString().split(' ')[0]
            }
        }

        const updateViewportSize = () => {
            syncAppSvh(false)
            const label = `${window.innerWidth}×${window.innerHeight}`
            if (hudVpTopRef.current) {
                hudVpTopRef.current.textContent = `[${label}]`
            }
            if (hudVpBottomRef.current) {
                hudVpBottomRef.current.textContent = `VP // ${label}`
            }
        }

        updateClock()
        updateViewportSize()

        const clockTimer = window.setInterval(updateClock, 1000)
        window.addEventListener('resize', updateViewportSize, { passive: true })

        return () => {
            window.clearInterval(clockTimer)
            window.removeEventListener('resize', updateViewportSize)
        }
    }, [])

    // Inisialisasi GSAP Animations (Desktop & Mobile)
    useHeroAnimation({
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
    })

    return (
        <section
            ref={containerRef}
            id="hero"
            className="hero-section-root relative w-full select-none bg-bg text-text"
            style={
                {
                    '--hl-size': HERO_CONFIG.MOBILE_HEADLINE_SIZE,
                    '--av-w': HERO_CONFIG.MOBILE_AVATAR_WIDTH,
                    '--g-badge': `${HERO_CONFIG.MOBILE_BADGE_HEADLINE_GAP_PX}px`,
                    '--g-stmt': HERO_CONFIG.MOBILE_STATEMENT_GAP_EM,
                    '--g-role': `${HERO_CONFIG.MOBILE_ROLE_HEADLINE_GAP_PX}px`,
                    '--g-role-sub': `${HERO_CONFIG.MOBILE_HEADLINE_SUBTEXT_GAP_PX}px`,
                    '--g-sub-cta': `${HERO_CONFIG.MOBILE_SUBTEXT_CTA_GAP_PX}px`,
                    '--g-cta-cta': `${HERO_CONFIG.MOBILE_CTA_INTER_GAP_PX}px`,
                } as React.CSSProperties
            }
        >
            {/* ============================================================ */}
            {/* HERO CONTENT: SATU ALUR BERURUTAN                            */}
            {/* ============================================================ */}
            <div
                ref={heroStageRef}
                data-testid="hero-stage"
                className="hero-stage-root relative w-full flex flex-col justify-between overflow-x-clip lg:overflow-hidden"
            >
                {/* Lapisan Latar */}
                <div
                    data-testid="hero-bg-wrapper"
                    className="pointer-events-none absolute inset-0 z-0 select-none bg-bg"
                    style={{ overflow: 'clip', isolation: 'isolate' }}
                    aria-hidden="true"
                >
                    {/* Mobile Layer: Grid datar 32px opacity 0.04 (tanpa orb atau titik yang membingungkan) */}
                    <div
                        ref={flatGridRef}
                        data-testid="hero-flat-grid"
                        className="md:hidden pointer-events-none absolute -inset-[8%]"
                        style={{
                            opacity: HERO_CONFIG.MOBILE_FLAT_GRID_OPACITY,
                            backgroundImage: `
                                linear-gradient(to right, rgba(var(--accent-rgb), 0.35) 1px, transparent 1px),
                                linear-gradient(to bottom, rgba(var(--accent-rgb), 0.35) 1px, transparent 1px)
                            `,
                            backgroundSize: '32px 32px',
                            maskImage: 'radial-gradient(circle at 50% 50%, black 30%, transparent 85%)',
                            WebkitMaskImage: 'radial-gradient(circle at 50% 50%, black 30%, transparent 85%)',
                        }}
                    />

                    {/* Desktop Layer: Satu Orb Lime lembut (hanya di desktop, orb mobile dihapus) */}
                    <div
                        ref={orbRef}
                        data-testid="hero-orb"
                        className="hidden md:block pointer-events-none absolute -inset-[8%] overflow-hidden"
                    >
                        <div
                            className="pointer-events-none absolute inset-0"
                            style={{
                                opacity: HERO_CONFIG.ORB_OPACITY_START,
                                background:
                                    'radial-gradient(circle at 65% 32%, rgba(var(--accent-rgb), 0.95) 0%, rgba(var(--accent-rgb), 0.42) 20%, rgba(var(--accent-rgb), 0.12) 40%, transparent 64%)',
                            }}
                        />
                    </div>

                    {/* Desktop Layer: Grid 3D Lantai Perspektif (hanya di desktop) */}
                    <div
                        data-bg-layer="grid"
                        className="hidden md:block pointer-events-none absolute inset-0 z-0 overflow-hidden"
                        style={{ perspective: '650px' }}
                    >
                        <div
                            className="pointer-events-none absolute inset-0 blueprint-grid-subtle opacity-50"
                            style={{
                                maskImage:
                                    'linear-gradient(to bottom, transparent 0px, transparent var(--nav-h, 72px), black calc(var(--nav-h, 72px) + 36px), transparent 85%)',
                                WebkitMaskImage:
                                    'linear-gradient(to bottom, transparent 0px, transparent var(--nav-h, 72px), black calc(var(--nav-h, 72px) + 36px), transparent 85%)',
                            }}
                        />
                        <div
                            ref={grid3dRef}
                            data-testid="hero-grid-3d"
                            className="pointer-events-none absolute -left-[30%] -right-[30%] -bottom-[18%] h-[78%]"
                            style={{
                                transformOrigin: '50% 0%',
                                transform: `rotateX(${HERO_CONFIG.GRID_ROTATE_X_DEG}deg) translate3d(0, 0px, 0) scale(1)`,
                                opacity: HERO_CONFIG.GRID_OPACITY_START,
                                backgroundImage: `
                                    linear-gradient(to right, rgba(var(--accent-rgb), 0.22) 1px, transparent 1px),
                                    linear-gradient(to bottom, rgba(var(--accent-rgb), 0.22) 1px, transparent 1px)
                                `,
                                backgroundSize: '56px 56px',
                                maskImage:
                                    'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.2) 28%, rgba(0,0,0,0.95) 100%)',
                                WebkitMaskImage:
                                    'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.2) 28%, rgba(0,0,0,0.95) 100%)',
                            }}
                        />
                    </div>

                    {/* Desktop Layer: Teks Outline Raksasa "IKBAL" (hanya di desktop) */}
                    <div
                        data-bg-layer="ikbal"
                        className="hero-ikbal-layer hidden md:flex pointer-events-none absolute -inset-[8%] z-0 items-center justify-center overflow-clip"
                    >
                        <div
                            ref={bgTextScrollRef}
                            data-testid="bg-ikbal-scroll"
                            className="pointer-events-none flex items-center justify-center"
                        >
                            <div
                                ref={parallaxBgTextRef}
                                data-testid="bg-ikbal"
                                className="pointer-events-none font-syne font-black text-[clamp(6.2rem,28vw,30rem)] tracking-tighter leading-none select-none text-transparent whitespace-nowrap"
                                style={{
                                    opacity: HERO_CONFIG.BG_OUTLINE_OPACITY,
                                    WebkitTextStroke: '2px var(--accent)',
                                }}
                            >
                                IKBAL
                            </div>
                        </div>
                    </div>

                    {/* Desktop Layer: Noise Halus Statis */}
                    <div
                        data-testid="hero-noise"
                        className="hidden md:block pointer-events-none absolute inset-0 z-[1]"
                        style={{
                            opacity: HERO_CONFIG.NOISE_OPACITY,
                            backgroundImage: STATIC_NOISE_BG,
                            backgroundRepeat: 'repeat',
                            backgroundSize: '200px 200px',
                        }}
                    />
                </div>

                {/* HUD Sudut (Hanya di Desktop) */}
                <div
                    data-hud="true"
                    className="hidden md:block pointer-events-none absolute inset-0 z-20 text-[11px] font-mono select-none"
                    aria-hidden="true"
                >
                    <div
                        ref={hudTopLeftRef}
                        data-testid="hud-top-left"
                        className="hidden md:flex absolute md:left-20 items-center gap-1.5 text-accent/80"
                        style={{ top: 'calc(var(--nav-h, 72px) + 6px)' }}
                    >
                        <span
                            ref={hudCoordsRef}
                            data-testid="hud-coords-text"
                            className="tracking-wider text-accent font-semibold"
                        >
                            [0, 0]
                        </span>
                        <span className="text-text-muted">· SYS.MONITOR</span>
                    </div>

                    <div
                        ref={hudTopRightRef}
                        data-testid="hud-top-right"
                        className="hidden md:flex absolute md:right-20 items-center gap-2 text-accent/80"
                        style={{ top: 'calc(var(--nav-h, 72px) + 6px)' }}
                    >
                        <span className="text-text-muted">LOCAL_TIME:</span>
                        <span ref={hudClockRef} className="tracking-wider font-semibold text-text">
                            12:00:00
                        </span>
                        <span ref={hudVpTopRef} className="tracking-wider text-accent">
                            [1920×1080]
                        </span>
                    </div>

                    <div
                        ref={hudBottomLeftRef}
                        data-testid="hud-bottom-left"
                        className="hidden md:flex absolute md:left-20 bottom-3 items-center gap-1.5 text-text-muted"
                    >
                        <span ref={hudVpBottomRef} className="tracking-wider">
                            VP // 1920×1080
                        </span>
                    </div>
                </div>

                {/* Area Konten: SATU ALUR BERURUTAN */}
                <div
                    data-testid="hero-content-area"
                    className="hero-content-area relative z-10 w-full hero-safe-px md:px-12 lg:px-20 flex-1 flex flex-col justify-start md:justify-center min-h-0 py-1.5 sm:py-2 md:py-4"
                >
                    {/* ============================================================ */}
                    {/* 1. DESKTOP LAYOUT (>= 768px)                                 */}
                    {/* ============================================================ */}
                    <div className="hidden md:grid hero-grid-layout">
                        {/* 1. AVATAR (Wrapper selalu ada di DOM untuk ref GSAP; Mascot di-render saat >= 768px) */}
                        <div className="hero-avatar-col relative z-10">
                            <div
                                ref={avatarWrapperRef}
                                data-testid="hero-avatar"
                                className="hero-avatar-box relative flex flex-col items-center justify-end select-none"
                            >
                                <div
                                    ref={avatarFloatRef}
                                    className="w-full flex-1 min-h-0 flex items-center justify-center relative"
                                >
                                    <div
                                        ref={avatarTiltRef}
                                        className="w-full h-full flex items-center justify-center aspect-square max-h-full max-w-full relative"
                                    >
                                        <div className="flex w-full h-full items-center justify-center">
                                            {isDesktop && (
                                                <Mascot
                                                    directions="/mascots/ikbal-directions.webp"
                                                    reactions="/mascots/ikbal-reactions.webp"
                                                    size={440}
                                                    className="!w-full !h-full max-w-full max-h-full aspect-square"
                                                />
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div
                                    ref={avatarShadowRef}
                                    className="hero-avatar-shadow w-24 sm:w-36 lg:w-64 h-3 sm:h-4 lg:h-5 pointer-events-none -mt-1 shrink-0"
                                    style={{
                                        background:
                                            'radial-gradient(ellipse at center, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0.2) 45%, transparent 72%)',
                                    }}
                                    aria-hidden="true"
                                />
                            </div>
                        </div>

                        {/* 2. TEKS: SATU ALUR DESKTOP */}
                        <div className="hero-text-col z-10">
                            {/* Badge Desktop */}
                            <div ref={badgeScrollRef} className="hero-badge-wrap self-start flex">
                                <div
                                    ref={badgeRef}
                                    data-testid="hero-badge"
                                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface border border-card-border mb-1.5 md:mb-3"
                                >
                                    <span className="w-2 h-2 rounded-full bg-accent shrink-0" />
                                    <span
                                        aria-hidden="true"
                                        className="text-[11px] font-mono text-accent tracking-wider uppercase whitespace-nowrap"
                                    >
                                        {HERO_COPY.badgeDesktop}
                                    </span>
                                </div>
                            </div>

                            {/* HEADLINE 2 BARIS ("From Pixel" / "to Query.") */}
                            <h1
                                ref={headlineRef}
                                id="hero-headline"
                                data-testid="hero-headline"
                                className="hero-headline-el font-syne font-black select-none block max-w-full relative z-20"
                                aria-label={`${HERO_COPY.headline.line1} ${HERO_COPY.headline.line2}`}
                            >
                                <div
                                    ref={line1Ref}
                                    data-testid="headline-line-1"
                                    className="hl-line hl-line-mask"
                                    style={{ width: 'max-content' }}
                                    aria-hidden="true"
                                >
                                    <span className="hl-solid text-text inline-block">{HERO_COPY.headline.line1}</span>
                                </div>

                                <div
                                    ref={line2Ref}
                                    data-testid="headline-line-2"
                                    className="hl-line hl-line-mask md:pl-[0.45em]"
                                    style={{ width: 'max-content' }}
                                    aria-hidden="true"
                                >
                                    <span className="hl-kw text-accent inline-block">{HERO_COPY.headline.line2}</span>
                                </div>
                            </h1>

                            {/* Role Label, Subteks & CTA */}
                            <div
                                ref={metaScrollRef}
                                data-testid="hero-meta-scroll"
                                className="relative z-10 flex flex-col items-start text-left mt-3 md:mt-5 w-full max-w-xl"
                            >
                                {/* Baris Role: Statis FULL-STACK WEB DEVELOPER dengan cursor '_' */}
                                <div
                                    ref={roleContainerRef}
                                    data-testid="hero-role"
                                    className="font-mono text-[11px] md:text-[12px] text-accent flex items-center justify-start gap-2 mb-2 md:mb-3.5 whitespace-nowrap"
                                >
                                    <span className="text-text-muted text-[11px]">ROLE //</span>
                                    <span
                                        className="font-mono font-semibold text-accent inline-flex items-center tracking-[0.12em] uppercase"
                                        style={{ minWidth: '26ch' }}
                                    >
                                        <span ref={roleTextRef} data-testid="role-text">
                                            {HERO_COPY.roleLabel}
                                        </span>
                                        <span
                                            data-testid="role-cursor"
                                            className="inline-block font-mono text-accent font-bold ml-0.5 animate-step-blink select-none"
                                            aria-hidden="true"
                                        >
                                            _
                                        </span>
                                    </span>
                                </div>

                                {/* Subteks */}
                                <p
                                    ref={descRef}
                                    data-testid="hero-subtext"
                                    className="hero-subtext-el text-text-muted text-[14.5px] md:text-[1rem] leading-[1.55] md:leading-[1.6] tracking-[-0.012em] md:tracking-normal font-inter max-w-[34ch] md:max-w-[52ch] mb-0 md:mb-5"
                                >
                                    {HERO_COPY.subtext.prefix}
                                    <span className="text-text font-semibold">{HERO_COPY.subtext.bold1}</span>
                                    {HERO_COPY.subtext.middle}
                                    <span className="text-text font-semibold">{HERO_COPY.subtext.bold2}</span>
                                    {HERO_COPY.subtext.suffix}
                                </p>

                                {/* Tombol CTA Desktop */}
                                <div
                                    ref={ctaRef}
                                    data-testid="hero-cta-group"
                                    className="hero-cta-group-el flex flex-col md:flex-row items-stretch md:items-center justify-start gap-2.5 md:gap-3 w-full md:w-auto"
                                >
                                    <div ref={ctaPrimaryRef} className="w-full md:w-auto">
                                        <MagneticWrapper strength={0.3} className="w-full md:w-auto">
                                            <a
                                                href="#projects"
                                                data-testid="cta-primary"
                                                className="w-full md:w-auto h-[52px] md:h-11 inline-flex items-center justify-center gap-2 px-6 bg-accent text-bg font-grotesk font-bold text-[15px] md:text-sm rounded-[12px] md:rounded-md active:scale-[0.97] transition-all duration-200 group whitespace-nowrap"
                                            >
                                                <span className="flex items-center gap-2 text-bg font-bold">
                                                    {HERO_COPY.ctaPrimary}
                                                    <svg
                                                        className="w-4 h-4 md:w-3.5 md:h-3.5 md:group-hover:translate-x-1 transition-transform duration-300"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                        strokeWidth={2.5}
                                                        aria-hidden="true"
                                                    >
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                                    </svg>
                                                </span>
                                            </a>
                                        </MagneticWrapper>
                                    </div>

                                    <div ref={ctaSecondaryRef} className="w-full md:w-auto">
                                        <MagneticWrapper strength={0.2} className="w-full md:w-auto">
                                            <a
                                                href="/experience"
                                                data-testid="cta-secondary"
                                                className="w-full md:w-auto h-[44px] md:h-11 inline-flex items-center justify-center px-5 border border-card-border bg-transparent text-text font-grotesk font-semibold text-[15px] md:text-sm rounded-[12px] md:rounded-md active:scale-[0.97] md:hover:text-accent md:hover:border-accent/40 transition-all duration-200 whitespace-nowrap"
                                            >
                                                {HERO_COPY.ctaSecondary}
                                            </a>
                                        </MagneticWrapper>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ============================================================ */}
                    {/* 2. MOBILE HERO CONTENT (< 768px)                             */}
                    {/* Satu alur rapi, tanpa garis pemisah, tanpa progress bar      */}
                    {/* ============================================================ */}
                    <div
                        ref={mobileContainerRef}
                        data-testid="mobile-hero-container"
                        className="md:hidden flex flex-col items-start justify-center text-left w-full max-w-[420px] mx-auto px-6 py-2 select-none"
                    >
                        {/* 1. Badge "OPEN FOR INTERNSHIP" */}
                        <div
                            ref={mobileBadgeRef}
                            data-testid="mobile-badge"
                            className="inline-flex items-center gap-2 px-2.5 h-[26px] rounded-full bg-surface border border-accent/20 select-none shrink-0"
                            style={{ marginTop: '24px' }}
                        >
                            <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                            <span className="text-[10px] font-mono font-semibold text-accent tracking-[0.08em] uppercase whitespace-nowrap leading-none">
                                {HERO_COPY.badgeMobile}
                            </span>
                        </div>

                        {/* 2. Label Role: FULL-STACK WEB DEVELOPER (12px di atas headline, tanpa prefix nomor) */}
                        <div
                            ref={mobileRoleRef}
                            data-testid="mobile-role"
                            className="font-mono text-[11px] font-semibold text-accent tracking-[0.12em] uppercase select-none whitespace-nowrap inline-flex items-center"
                            style={{ marginTop: '16px', marginBottom: '12px' }}
                        >
                            <span ref={mobileRoleTextRef}>{HERO_COPY.roleLabel}</span>
                            <span
                                data-testid="mobile-role-cursor"
                                className="inline-block font-mono text-accent font-bold ml-0.5 animate-step-blink select-none"
                                aria-hidden="true"
                            >
                                _
                            </span>
                        </div>

                        {/* 3. Headline 2 Baris: "From Pixel" / "to Query." (hl-line-mask anti terpotong) */}
                        <div
                            ref={mobileHeadlineBoxRef}
                            data-testid="mobile-headline-box"
                            className="mobile-headline-box relative w-full select-none z-20"
                            style={{ touchAction: 'pan-y' }}
                            aria-hidden="true"
                        >
                            <div className="mobile-stmt-slide font-syne select-none">
                                <div ref={mobileLine1Ref} className="mobile-stmt-line hl-line-mask">
                                    <span className="mobile-stmt-verb font-semibold text-text inline-block leading-[1.02]">
                                        {HERO_COPY.headline.line1}
                                    </span>
                                </div>
                                <div ref={mobileLine2Ref} className="mobile-stmt-line hl-line-mask">
                                    <span className="mobile-stmt-kw font-extrabold text-accent inline-block leading-[1.02]">
                                        {HERO_COPY.headline.line2}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* 4. Subteks: Jarak 28px dari headline */}
                        <p
                            ref={mobileSubtextRef}
                            data-testid="mobile-subtext"
                            className="text-text-muted text-[14.5px] leading-[1.6] max-w-[32ch] font-inter select-none"
                            style={{ marginTop: '28px', textWrap: 'pretty' }}
                        >
                            {HERO_COPY.subtext.prefix}
                            <strong className="text-text font-semibold">{HERO_COPY.subtext.bold1}</strong>
                            {HERO_COPY.subtext.middle}
                            <strong className="text-text font-semibold">{HERO_COPY.subtext.bold2}</strong>
                            {HERO_COPY.subtext.suffix}
                        </p>

                        {/* 5. CTA Utama: Lebar penuh, tinggi 52px, radius 12px, jarak 28px dari subteks */}
                        <div ref={mobileCtaPrimaryRef} className="w-full" style={{ marginTop: '28px' }}>
                            <a
                                href="#projects"
                                data-testid="mobile-cta-primary"
                                className="w-full h-[52px] inline-flex items-center justify-center gap-2 px-6 bg-accent text-bg font-grotesk font-bold text-[15px] rounded-[12px] active:scale-[0.97] transition-transform select-none"
                            >
                                {HERO_COPY.ctaPrimary}
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2.5}
                                    aria-hidden="true"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </a>
                        </div>

                        {/* 6. CTA Sekunder: Tautan teks 14px dengan garis bawah tipis, jarak 18px */}
                        <div ref={mobileCtaSecondaryRef} style={{ marginTop: '18px' }}>
                            <a
                                href="/experience"
                                data-testid="mobile-cta-secondary"
                                className="min-h-[44px] inline-flex items-center text-[14px] text-text-muted hover:text-accent font-grotesk font-medium underline underline-offset-4 decoration-card-border hover:decoration-accent transition-colors select-none"
                            >
                                {HERO_COPY.ctaSecondary}
                            </a>
                        </div>
                    </div>
                </div>

                {/* Indikator Scroll Desktop */}
                <div
                    ref={scrollIndicatorRef}
                    data-testid="scroll-indicator-wrapper"
                    data-hud="true"
                    className="hidden lg:flex relative z-10 w-full flex-col items-center pt-1 pb-2 shrink-0"
                >
                    <a
                        href="#about"
                        data-testid="scroll-indicator"
                        className="group inline-flex flex-col items-center gap-1 cursor-pointer active:scale-[0.97] transition-transform"
                        aria-label="Scroll to explore"
                    >
                        <span className="text-[10px] font-mono text-text-muted tracking-widest uppercase lg:group-hover:text-accent transition-colors">
                            scroll to explore
                        </span>
                        <div className="w-[1.5px] h-3.5 lg:h-4 bg-card-border overflow-hidden relative">
                            <div className="scroll-indicator-line w-full h-full bg-accent origin-top" />
                        </div>
                    </a>
                </div>
            </div>
        </section>
    )
}

const Hero = React.memo(HeroComponent)
export default Hero
