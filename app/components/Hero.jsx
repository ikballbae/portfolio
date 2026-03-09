'use client'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import BlueprintGrid from './GradientMesh'
import MagneticButton from './MagneticButton'
import ScrollReveal from './ScrollReveal'
import ScrambleText from './ScrambleText'

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger)
}

export default function Hero() {
    const containerRef = useRef(null)
    const decorRef = useRef(null)

    useEffect(() => {
        const container = containerRef.current
        if (!container) return

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
    }, [])

    return (
        <section
            ref={containerRef}
            id="hero"
            className="relative min-h-[100svh] flex items-center overflow-hidden"
        >
            <BlueprintGrid />

            {/* Floating lab elements */}
            <div ref={decorRef}>
                <div className="hero-decor hidden lg:block absolute top-[18%] right-[12%] w-20 h-20 border border-accent/10 rounded-sm" style={{ rotate: '15deg' }} />
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
            <div className="hero-content relative z-10 w-full px-4 sm:px-6 md:px-12 lg:px-20 pt-24 sm:pt-28 md:pt-32 pb-16 md:pb-20">
                <div className="max-w-6xl mx-auto">
                    {/* Status tag */}
                    <ScrollReveal delay={0.2}>
                        <div className="flex items-center gap-2 sm:gap-3 mb-6 sm:mb-8">
                            <span className="w-2 h-2 bg-accent rounded-full animate-pulse-glow" />
                            <span className="text-[10px] sm:text-xs font-mono text-accent/70 tracking-wider uppercase">
                                Open for Internship &amp; Collaboration
                            </span>
                        </div>
                    </ScrollReveal>

                    {/* Main Headline */}
                    <div className="mb-6 sm:mb-8 font-syne font-extrabold text-[2rem] sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl leading-[1.05] tracking-tight">
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

                    {/* Subtitle */}
                    <div className="mb-8 sm:mb-10 md:mb-12 max-w-lg">
                        <ScrollReveal delay={1}>
                            <p className="text-text-muted text-sm sm:text-base leading-relaxed">
                                Information Systems student from Pekalongan, Indonesia. I don&apos;t just write code —
                                I build solutions that merge{' '}
                                <span className="text-text">engineering logic</span> with{' '}
                                <span className="text-text">creative design</span>.
                            </p>
                        </ScrollReveal>
                        <ScrollReveal delay={1.2}>
                            <div className="mt-4 font-mono text-xs text-accent/40 flex items-center gap-1">
                                <span className="text-accent">{'>'}</span>
                                <span>Full-Stack Dev</span>
                                <span className="text-accent/60">·</span>
                                <span>UI/UX Designer</span>
                                <span className="text-accent/60">·</span>
                                <span>Tech Leader</span>
                                <span className="animate-blink text-accent">_</span>
                            </div>
                        </ScrollReveal>
                    </div>

                    {/* CTAs */}
                    <ScrollReveal delay={1.4}>
                        <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-3 sm:gap-4">
                            <MagneticButton>
                                <a href="#projects" className="inline-flex items-center gap-2 sm:gap-3 px-6 sm:px-7 py-3 sm:py-3.5 bg-accent text-bg font-grotesk font-semibold text-xs sm:text-sm rounded-md hover:bg-accent-dark transition-colors duration-300 group">
                                    View My Work
                                    <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </a>
                            </MagneticButton>
                            <MagneticButton>
                                <a href="#experience" className="inline-flex items-center gap-2 sm:gap-3 px-6 sm:px-7 py-3 sm:py-3.5 border border-accent/15 text-text-muted font-grotesk font-medium text-xs sm:text-sm rounded-md hover:border-accent/40 hover:text-accent transition-all duration-300">
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
