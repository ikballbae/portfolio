'use client'
import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import BlueprintGrid from './GradientMesh'
import MagneticButton from './MagneticButton'
import ScrollReveal from './ScrollReveal'
import ScrambleText from './ScrambleText'
import { Mascot } from 'page-mascot'

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger)
}

export default function Hero() {
    const containerRef = useRef(null)
    const decorRef = useRef(null)
    const [mascotSize, setMascotSize] = useState(340)
    const mascotParallaxRef = useRef(null)
    const mascotFloatRef = useRef(null)

    // Responsive Mascot Size
    useEffect(() => {
        const updateSize = () => {
            const width = window.innerWidth
            if (width >= 1024) setMascotSize(340)
            else if (width >= 768) setMascotSize(240)
            else setMascotSize(165)
        }
        updateSize() // initial call
        window.addEventListener('resize', updateSize)
        return () => window.removeEventListener('resize', updateSize)
    }, [])

    useEffect(() => {
        const container = containerRef.current
        if (!container) return

        let ctx = gsap.context(() => {
            // GSAP only for parallax (scrub-based, no cleanup issue)
            gsap.to(container.querySelector('.hero-content'), {
                y: '20%',
                opacity: 0,
                ease: 'none',
                scrollTrigger: {
                    trigger: container,
                    start: 'top top',
                    end: 'bottom top',
                    scrub: 0.5,
                },
            })

            // Floating decorative elements
            const decors = decorRef.current?.querySelectorAll('.hero-decor')
            if (decors) {
                decors.forEach((el, i) => {
                    gsap.to(el, {
                        y: `${-15 - i * 5}px`,
                        rotation: `${(i % 2 === 0 ? 1 : -1) * 3}deg`,
                        duration: 5 + i * 1.5,
                        ease: 'sine.inOut',
                        repeat: -1,
                        yoyo: true,
                    })
                })
            }

            // Mascot Animations
            const mm = gsap.matchMedia()

            mm.add("(prefers-reduced-motion: no-preference)", () => {
                if (mascotFloatRef.current) {
                    // Entrance animation
                    gsap.fromTo(mascotFloatRef.current,
                        { scale: 0.6, opacity: 0 },
                        {
                            scale: 1,
                            opacity: 1,
                            duration: 1,
                            ease: "back.out(1.7)",
                            delay: 2.2 // Sync with headline
                        }
                    )

                    // Idle floating animation
                    gsap.to(mascotFloatRef.current, {
                        y: -10,
                        duration: 2.5,
                        ease: "sine.inOut",
                        repeat: -1,
                        yoyo: true,
                        delay: 3.2
                    })
                }

                // Parallax on mouse move (only for fine pointers)
                mm.add("(pointer: fine)", () => {
                    const handleMouseMove = (e) => {
                        if (!mascotParallaxRef.current) return
                        const { clientX, clientY } = e
                        const moveX = ((clientX / window.innerWidth) - 0.5) * 24 // max 12px
                        const moveY = ((clientY / window.innerHeight) - 0.5) * 24

                        gsap.to(mascotParallaxRef.current, {
                            x: moveX,
                            y: moveY,
                            duration: 0.5,
                            ease: "power2.out",
                            overwrite: "auto"
                        })
                    }
                    window.addEventListener('mousemove', handleMouseMove)
                    return () => window.removeEventListener('mousemove', handleMouseMove)
                })
            })

            // Reduced motion fallback
            mm.add("(prefers-reduced-motion: reduce)", () => {
                if (mascotFloatRef.current) {
                    gsap.fromTo(mascotFloatRef.current,
                        { opacity: 0 },
                        { opacity: 1, duration: 1, delay: 2.2 }
                    )
                }
            })
            
        }, containerRef)

        return () => ctx.revert()
    }, [])

    return (
        <section
            ref={containerRef}
            id="hero"
            className="relative min-h-svh md:min-h-[100svh] flex items-start md:items-center overflow-hidden"
        >
            <BlueprintGrid />

            {/* Floating lab elements */}
            <div ref={decorRef}>
                <div className="hero-decor hidden lg:block absolute top-[10%] right-[12%] w-20 h-20 border border-accent/10 rounded-sm" style={{ rotate: '15deg' }} />
                <div className="hero-decor hidden md:block absolute bottom-[25%] right-[8%] w-3 h-3 bg-accent/30 rounded-full" />
                <div className="hero-decor hidden md:block absolute top-[35%] left-[5%] font-mono text-[10px] text-accent/20">
                    {'// system.init()'}
                </div>
                <div className="hero-decor hidden lg:block absolute bottom-[30%] left-[15%] w-[1px] h-16 bg-gradient-to-b from-accent/20 to-transparent" />
                <div className="hero-decor hidden md:block absolute top-[55%] right-[30%] opacity-20">
                    <div className="w-4 h-[1px] bg-accent/20 absolute top-1/2 left-1/2 -translate-x-1/2" />
                    <div className="w-[1px] h-4 bg-accent/20 absolute top-1/2 left-1/2 -translate-y-1/2" />
                </div>
            </div>

            {/* Content */}
            <div className="hero-content relative z-10 w-full px-4 sm:px-6 md:px-12 lg:px-20 pt-[84px] sm:pt-28 md:pt-32 pb-8 md:pb-20">
                <div className="max-w-6xl mx-auto flex flex-col items-center text-center md:items-start md:text-left">
                    
                    {/* Mascot */}
                    <div className="relative z-40 mb-4 flex justify-center mx-auto md:mx-0 pointer-events-auto opacity-100 md:absolute md:top-[42%] md:right-[3%] md:-translate-y-1/2 md:mb-0 md:justify-start lg:right-[5%] xl:right-[8%]">
                        <div ref={mascotParallaxRef}>
                            <div ref={mascotFloatRef} style={{ opacity: 0 }}>
                                <Mascot
                                    directions="/mascots/ikbal-directions.webp"
                                    reactions="/mascots/ikbal-reactions.webp"
                                    size={mascotSize}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Status tag */}
                    <ScrollReveal delay={0.2}>
                        <div className="flex items-center justify-center md:justify-start gap-2 sm:gap-3 mb-4 md:mb-8">
                            <span className="w-2 h-2 bg-accent rounded-full animate-pulse-glow" />
                            <span className="text-xs sm:text-xs font-mono text-accent/80 tracking-wider uppercase">
                                Open for Internship &amp; Collaboration
                            </span>
                        </div>
                    </ScrollReveal>

                    {/* Main Headline */}
                    <div className="mb-4 md:mb-8 font-syne font-extrabold text-[clamp(1.52rem,6.8vw,2.05rem)] sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl leading-[1.1] tracking-tight text-center md:text-left w-full">
                        <ScrollReveal delay={0.2}>
                            <div className="block">
                                <ScrambleText text="I Build " delay={0.4} duration={0.8} />
                                <span className="text-accent">
                                    <ScrambleText text="Solutions." delay={0.4} duration={0.8} />
                                </span>
                            </div>
                        </ScrollReveal>
                        <ScrollReveal delay={0.3}>
                            <div className="block">
                                <ScrambleText text="I Design " delay={1.2} duration={0.8} />
                                <span className="text-accent">
                                    <ScrambleText text="Experiences." delay={1.2} duration={0.8} />
                                </span>
                            </div>
                        </ScrollReveal>
                        <ScrollReveal delay={0.4}>
                            <div className="block">
                                <ScrambleText text="I Lead " delay={2.0} duration={0.8} />
                                <span className="text-accent">
                                    <ScrambleText text="Communities." delay={2.0} duration={0.8} />
                                </span>
                            </div>
                        </ScrollReveal>
                    </div>

                    {/* Subtitle / Role */}
                    <div className="mb-6 md:mb-12 max-w-lg w-full">
                        <ScrollReveal delay={1}>
                            <p className="hidden md:block text-text-muted text-sm sm:text-base leading-relaxed">
                                Information Systems student from Pekalongan, Indonesia. I don&apos;t just write code —
                                I build solutions that merge{' '}
                                <span className="text-text">engineering logic</span> with{' '}
                                <span className="text-text">creative design</span>.
                            </p>
                        </ScrollReveal>
                        <ScrollReveal delay={1.2}>
                            <div className="font-mono text-[13px] sm:text-xs text-accent/80 flex flex-col md:flex-row items-center justify-center md:justify-start gap-0.5 md:gap-1 text-center md:text-left">
                                <div className="flex items-center gap-1">
                                    <span>Full-Stack Dev</span>
                                    <span className="text-accent/60">·</span>
                                    <span>UI/UX Designer</span>
                                    <span className="hidden md:inline text-accent/60">·</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <span>Tech Leader</span>
                                    <span className="inline-block w-2 text-left animate-blink text-accent">_</span>
                                </div>
                            </div>
                        </ScrollReveal>
                    </div>

                    {/* CTAs */}
                    <ScrollReveal delay={1.4} className="w-full">
                        <div className="flex flex-col items-center md:items-start w-full gap-4 sm:flex-row sm:flex-wrap sm:justify-center md:justify-start">
                            <MagneticButton className="w-full max-w-[280px] sm:w-auto">
                                <a href="#projects" className="w-full max-w-[280px] sm:w-auto h-12 inline-flex items-center justify-center gap-2 sm:gap-3 px-6 sm:px-7 bg-accent text-bg font-grotesk font-semibold text-xs sm:text-sm rounded-md hover:bg-accent-dark transition-colors duration-300 group">
                                    View My Work
                                    <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </a>
                            </MagneticButton>
                            <MagneticButton className="w-full max-w-[280px] sm:w-auto">
                                <a href="#experience" className="w-full max-w-[280px] sm:w-auto min-h-[44px] inline-flex items-center justify-center gap-1.5 md:gap-3 px-1 py-2.5 md:px-7 md:py-3.5 md:border md:border-accent/15 text-text-muted/70 md:text-text-muted font-grotesk font-medium text-xs sm:text-sm rounded-md hover:text-accent md:hover:border-accent/40 transition-all duration-300">
                                    Leadership &amp; Achievements
                                    <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </a>
                            </MagneticButton>
                        </div>
                    </ScrollReveal>

                    {/* Scroll indicator */}
                    <ScrollReveal delay={1.6}>
                        <div className="hidden sm:flex absolute bottom-8 left-1/2 -translate-x-1/2 flex-col items-center gap-2">
                            <span className="text-[9px] font-mono text-text-muted/50 tracking-widest uppercase">scroll to explore</span>
                            <div className="w-[1px] h-8 bg-gradient-to-b from-accent/40 to-transparent animate-pulse-glow" />
                        </div>
                    </ScrollReveal>
                </div>
            </div>
        </section>
    )
}
