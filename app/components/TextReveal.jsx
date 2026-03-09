'use client'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger)
}

// Simple reveal — preserves children JSX (no innerHTML manipulation)
export default function TextReveal({ children, delay = 0 }) {
    const ref = useRef(null)

    useEffect(() => {
        const el = ref.current
        if (!el) return

        gsap.set(el, { y: 30, opacity: 0 })

        gsap.to(el, {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'power3.out',
            delay,
            scrollTrigger: {
                trigger: el,
                start: 'top 90%',
                toggleActions: 'play none none none',
                once: true,
            },
        })
    }, [delay])

    return (
        <span ref={ref} className="inline-block" style={{ willChange: 'transform, opacity' }}>
            {children}
        </span>
    )
}

export function LineReveal({ children, delay = 0 }) {
    const ref = useRef(null)

    useEffect(() => {
        const el = ref.current
        if (!el) return

        gsap.set(el, { y: 50, opacity: 0, clipPath: 'inset(0 0 100% 0)' })

        gsap.to(el, {
            y: 0,
            opacity: 1,
            clipPath: 'inset(0 0 0% 0)',
            duration: 1,
            ease: 'power4.out',
            delay,
            scrollTrigger: {
                trigger: el,
                start: 'top 90%',
                toggleActions: 'play none none none',
                once: true,
            },
        })
    }, [delay])

    return (
        <div ref={ref} style={{ willChange: 'transform, opacity' }}>
            {children}
        </div>
    )
}

export function FadeIn({ children, delay = 0, direction = 'up', className = '' }) {
    const ref = useRef(null)

    useEffect(() => {
        const el = ref.current
        if (!el) return

        const fromVars = { opacity: 0 }
        if (direction === 'up') fromVars.y = 40
        if (direction === 'down') fromVars.y = -40
        if (direction === 'left') fromVars.x = 40
        if (direction === 'right') fromVars.x = -40

        gsap.set(el, fromVars)

        gsap.to(el, {
            y: 0,
            x: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'power3.out',
            delay,
            scrollTrigger: {
                trigger: el,
                start: 'top 92%',
                toggleActions: 'play none none none',
                once: true,
            },
        })
    }, [delay, direction])

    return (
        <div ref={ref} className={className} style={{ willChange: 'transform, opacity' }}>
            {children}
        </div>
    )
}
