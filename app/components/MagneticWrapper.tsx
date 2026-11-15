'use client'

import React, { useRef, useState, useEffect } from 'react'
import { gsap } from 'gsap'

interface MagneticProps {
    children: React.ReactElement
    strength?: number // Default: 0.35
    className?: string
}

export default function MagneticWrapper({
    children,
    strength = 0.35,
    className = '',
}: MagneticProps) {
    const elRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const el = elRef.current
        if (!el) return

        // Only active on pointer: fine devices
        const isFinePointer = window.matchMedia('(pointer: fine)').matches
        if (!isFinePointer) return

        const handleMouseMove = (e: MouseEvent) => {
            const rect = el.getBoundingClientRect()
            const centerX = rect.left + rect.width / 2
            const centerY = rect.top + rect.height / 2
            const deltaX = (e.clientX - centerX) * strength
            const deltaY = (e.clientY - centerY) * strength

            gsap.to(el, {
                x: deltaX,
                y: deltaY,
                duration: 0.3,
                ease: 'power2.out',
                overwrite: 'auto',
            })
        }

        const handleMouseLeave = () => {
            gsap.to(el, {
                x: 0,
                y: 0,
                duration: 0.7,
                ease: 'elastic.out(1.1, 0.4)',
                overwrite: 'auto',
            })
        }

        el.addEventListener('mousemove', handleMouseMove)
        el.addEventListener('mouseleave', handleMouseLeave)

        return () => {
            el.removeEventListener('mousemove', handleMouseMove)
            el.removeEventListener('mouseleave', handleMouseLeave)
        }
    }, [strength])

    return (
        <div ref={elRef} className={`inline-block ${className}`}>
            {children}
        </div>
    )
}
