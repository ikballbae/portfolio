'use client'

import React, { useEffect, useRef, useState, useCallback } from 'react'
import { gsap } from 'gsap'

interface BootSequenceProps {
    onComplete: () => void
}

export default function BootSequence({ onComplete }: BootSequenceProps) {
    const [visible, setVisible] = useState(false)
    const overlayRef = useRef<HTMLDivElement>(null)
    const line1Ref = useRef<HTMLDivElement>(null)
    const line2Ref = useRef<HTMLDivElement>(null)
    const line3Ref = useRef<HTMLDivElement>(null)
    const tlRef = useRef<gsap.core.Timeline | null>(null)
    const hasCompletedRef = useRef(false)

    const finishBoot = useCallback(() => {
        if (hasCompletedRef.current) return
        hasCompletedRef.current = true
        console.log('[BootSequence] Boot sequence complete -> unmounting & triggering hero')
        setVisible(false)
        onComplete()
    }, [onComplete])

    useEffect(() => {
        if (typeof window === 'undefined') return

        const urlParams = new URLSearchParams(window.location.search)
        const forceBoot = urlParams.get('boot') === '1'
        const skipBoot = urlParams.get('boot') === '0'

        console.log('[BootSequence] Initializing boot sequence check. forceBoot:', forceBoot, 'skipBoot:', skipBoot)

        if (skipBoot) {
            console.log('[BootSequence] Skipped via ?boot=0')
            finishBoot()
            return
        }

        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        if (prefersReducedMotion && !forceBoot) {
            console.log('[BootSequence] Skipped due to prefers-reduced-motion')
            finishBoot()
            return
        }

        // Always show by default during development, unless ?boot=0 is set
        setVisible(true)
    }, [finishBoot])

    useEffect(() => {
        if (!visible || !overlayRef.current) return

        const overlay = overlayRef.current
        const l1 = line1Ref.current
        const l2 = line2Ref.current
        const l3 = line3Ref.current

        console.log('[BootSequence] Starting terminal typing animation')

        const tl = gsap.timeline({
            id: 'bootSequenceTl',
            onComplete: () => {
                finishBoot()
            },
        })
        tlRef.current = tl

        // Terminal lines typing
        tl.to(l1, { opacity: 1, duration: 0.15, ease: 'none' })
            .to(l1, { opacity: 1, duration: 0.25 })
            .to(l2, { opacity: 1, duration: 0.15, ease: 'none' })
            .to(l2, { opacity: 1, duration: 0.35 })
            .to(l3, { opacity: 1, duration: 0.15, ease: 'none' })
            .to(l3, { opacity: 1, duration: 0.25 })

        // Overlay lift with exponential curve
        tl.to(
            overlay,
            {
                clipPath: 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)',
                duration: 0.7,
                ease: 'expo.inOut',
            },
            '+=0.05'
        )

        // Safety fallback: if anything prevents completion after 3s, force finish
        const safetyTimer = setTimeout(() => {
            if (!hasCompletedRef.current) {
                console.warn('[BootSequence] Safety timer fired after 3s')
                finishBoot()
            }
        }, 3000)

        return () => {
            clearTimeout(safetyTimer)
            tl.kill()
        }
    }, [visible, finishBoot])

    const handleSkip = (e?: React.MouseEvent) => {
        if (e) e.stopPropagation()
        console.log('[BootSequence] User skipped boot sequence')
        if (tlRef.current) {
            tlRef.current.progress(1)
        } else {
            finishBoot()
        }
    }

    if (!visible) return null

    return (
        <div
            ref={overlayRef}
            onClick={() => handleSkip()}
            className="fixed inset-0 z-[9999] bg-[#050505] text-[#e8e6e1] font-mono flex flex-col justify-between p-6 sm:p-12 cursor-pointer select-none"
            style={{
                clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
            }}
            aria-label="Booting system, click to skip"
            role="dialog"
            aria-modal="true"
        >
            <div className="flex items-center justify-between text-xs text-text-muted">
                <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                    <span>SYSTEM_BOOT_V3</span>
                </span>
                <button
                    onClick={handleSkip}
                    className="px-2.5 py-1 text-[11px] rounded border border-card-border hover:border-accent/60 hover:text-accent transition-colors cursor-pointer"
                >
                    [SKIP ESC / CLICK]
                </button>
            </div>

            <div className="my-auto max-w-xl text-left space-y-2 text-sm sm:text-base">
                <div ref={line1Ref} className="opacity-0 flex items-center gap-2">
                    <span className="text-accent">&gt;</span>
                    <span>system.init()</span>
                </div>
                <div ref={line2Ref} className="opacity-0 flex items-center gap-2">
                    <span className="text-accent">&gt;</span>
                    <span>loading creative_engine...</span>
                    <span className="text-accent font-semibold">OK</span>
                </div>
                <div ref={line3Ref} className="opacity-0 flex items-center gap-2">
                    <span className="text-accent">&gt;</span>
                    <span className="text-text font-bold">hello, world.</span>
                    <span className="inline-block w-2 h-4 bg-accent animate-pulse" />
                </div>
            </div>

            <div className="flex items-center justify-between text-xs text-text-muted">
                <span>PORTFOLIO // AKHMAD IKBAL</span>
                <span>STATUS: READY</span>
            </div>
        </div>
    )
}
