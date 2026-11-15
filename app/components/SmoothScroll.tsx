'use client'

import React, { createContext, useContext, useEffect, useRef, useState } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motionConfig } from '@/motionConfig'

interface LenisWindow {
    __lenis?: Lenis
}

interface LenisContextType {
    lenis: Lenis | null
    scrollTo: (target: string | number | HTMLElement, options?: Record<string, unknown>) => void
    stop: () => void
    start: () => void
}

const LenisContext = createContext<LenisContextType>({
    lenis: null,
    scrollTo: () => { },
    stop: () => { },
    start: () => { },
})

export const useLenis = () => useContext(LenisContext)

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
    const [lenisInstance, setLenisInstance] = useState<Lenis | null>(null)
    const lenisRef = useRef<Lenis | null>(null)

    useEffect(() => {
        if (typeof window === 'undefined') return

        if ('scrollRestoration' in history) {
            history.scrollRestoration = 'manual'
        }

        gsap.registerPlugin(ScrollTrigger)
        ScrollTrigger.config({ ignoreMobileResize: true })
        ScrollTrigger.clearScrollMemory('manual')
        window.scrollTo(0, 0)
        // Nonaktifkan Lenis hanya jika pengguna mengaktifkan prefers-reduced-motion
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

        if (prefersReducedMotion) {
            return
        }

        // Initialize Lenis on non-touch desktop
        const lenis = new Lenis({
            lerp: motionConfig.lenis.lerp,
            wheelMultiplier: motionConfig.lenis.wheelMultiplier,
            smoothWheel: motionConfig.lenis.smoothWheel,
            syncTouch: false,
        })

        lenisRef.current = lenis
        setLenisInstance(lenis)

        lenis.scrollTo(0, { immediate: true })
        const win = window as unknown as LenisWindow
        win.__lenis = lenis

        // Sync Lenis scroll with GSAP ScrollTrigger
        lenis.on('scroll', ScrollTrigger.update)

        const tickerCallback = (time: number) => {
            lenis.raf(time * 1000)
        }

        gsap.ticker.add(tickerCallback)
        gsap.ticker.lagSmoothing(0)

        const handleAnchorClick = (e: MouseEvent) => {
            const target = (e.target as HTMLElement).closest('a')
            if (!target) return

            const href = target.getAttribute('href')
            if (href && href.startsWith('#') && href.length > 1) {
                const targetElement = document.querySelector(href)
                if (targetElement) {
                    e.preventDefault()
                    lenis.scrollTo(targetElement as HTMLElement, {
                        duration: motionConfig.lenis.anchorScrollDuration,
                        easing: motionConfig.lenis.anchorScrollEase,
                    })
                }
            }
        }

        document.addEventListener('click', handleAnchorClick)

        const handleBeforeUnload = () => {
            if ('scrollRestoration' in history) {
                history.scrollRestoration = 'manual'
            }
            window.scrollTo(0, 0)
        }
        window.addEventListener('beforeunload', handleBeforeUnload)

        return () => {
            document.removeEventListener('click', handleAnchorClick)
            gsap.ticker.remove(tickerCallback)
            window.removeEventListener('beforeunload', handleBeforeUnload)
            lenis.destroy()
            lenisRef.current = null
            setLenisInstance(null)
            delete win.__lenis
        }
    }, [])

    const scrollTo = (target: string | number | HTMLElement, options?: Record<string, unknown>) => {
        if (lenisRef.current) {
            lenisRef.current.scrollTo(target, {
                duration: motionConfig.lenis.anchorScrollDuration,
                easing: motionConfig.lenis.anchorScrollEase,
                ...options,
            })
        } else if (typeof target === 'string' && target.startsWith('#')) {
            const el = document.querySelector(target)
            el?.scrollIntoView({ behavior: 'smooth' })
        }
    }

    const stop = () => {
        lenisRef.current?.stop()
    }

    const start = () => {
        lenisRef.current?.start()
    }

    return (
        <LenisContext.Provider value={{ lenis: lenisInstance, scrollTo, stop, start }}>
            {children}
        </LenisContext.Provider>
    )
}
