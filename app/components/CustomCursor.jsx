'use client'
import { useEffect, useRef, useState, useCallback } from 'react'

export default function CustomCursor() {
    const canvasRef = useRef(null)
    const dotRef = useRef(null)
    const ringRef = useRef(null)
    const [hovering, setHovering] = useState(false)
    const [clicking, setClicking] = useState(false)
    const [visible, setVisible] = useState(false)
    const mouse = useRef({ x: -100, y: -100 })
    const dotPos = useRef({ x: -100, y: -100 })
    const ringPos = useRef({ x: -100, y: -100 })
    const trail = useRef([])
    const rafId = useRef(null)

    useEffect(() => {
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
        if (isTouchDevice) return

        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')

        const resize = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
        }
        resize()
        window.addEventListener('resize', resize)

        const handleMove = (e) => {
            mouse.current = { x: e.clientX, y: e.clientY }
            if (!visible) setVisible(true)

            // Add trail point
            trail.current.push({
                x: e.clientX,
                y: e.clientY,
                life: 1.0,
            })
            // Keep trail manageable
            if (trail.current.length > 50) trail.current.shift()
        }

        const handleDown = () => setClicking(true)
        const handleUp = () => setClicking(false)
        const handleLeave = () => setVisible(false)
        const handleEnter = () => setVisible(true)

        const handleOver = (e) => {
            const t = e.target
            if (
                t.closest('a') || t.closest('button') ||
                t.closest('[role="link"]') || t.closest('[role="button"]') ||
                t.closest('input') || t.closest('textarea')
            ) {
                setHovering(true)
            }
        }
        const handleOut = () => setHovering(false)

        // Get accent color from CSS
        const getAccentRGB = () => {
            const style = getComputedStyle(document.documentElement)
            const rgb = style.getPropertyValue('--accent-rgb').trim()
            if (rgb) {
                const parts = rgb.split(',').map(s => parseInt(s.trim()))
                return parts
            }
            return [196, 255, 0]
        }

        const animate = () => {
            const [r, g, b] = getAccentRGB()

            // Smooth follow
            dotPos.current.x += (mouse.current.x - dotPos.current.x) * 0.4
            dotPos.current.y += (mouse.current.y - dotPos.current.y) * 0.4
            ringPos.current.x += (mouse.current.x - ringPos.current.x) * 0.12
            ringPos.current.y += (mouse.current.y - ringPos.current.y) * 0.12

            if (dotRef.current) {
                dotRef.current.style.transform = `translate(${dotPos.current.x}px, ${dotPos.current.y}px) translate(-50%, -50%)`
            }
            if (ringRef.current) {
                ringRef.current.style.transform = `translate(${ringPos.current.x}px, ${ringPos.current.y}px) translate(-50%, -50%)`
            }

            // Draw lighting trail on canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            // Update and draw trail particles
            for (let i = trail.current.length - 1; i >= 0; i--) {
                const p = trail.current[i]
                p.life -= 0.025

                if (p.life <= 0) {
                    trail.current.splice(i, 1)
                    continue
                }

                const alpha = p.life * 0.15
                const size = p.life * 60

                // Soft glow circle
                const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, size)
                gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${alpha})`)
                gradient.addColorStop(0.4, `rgba(${r}, ${g}, ${b}, ${alpha * 0.3})`)
                gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`)

                ctx.beginPath()
                ctx.arc(p.x, p.y, size, 0, Math.PI * 2)
                ctx.fillStyle = gradient
                ctx.fill()
            }

            // Main ambient light around cursor
            const ambientSize = 120
            const ambientGradient = ctx.createRadialGradient(
                mouse.current.x, mouse.current.y, 0,
                mouse.current.x, mouse.current.y, ambientSize
            )
            ambientGradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.08)`)
            ambientGradient.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, 0.03)`)
            ambientGradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`)

            ctx.beginPath()
            ctx.arc(mouse.current.x, mouse.current.y, ambientSize, 0, Math.PI * 2)
            ctx.fillStyle = ambientGradient
            ctx.fill()

            rafId.current = requestAnimationFrame(animate)
        }

        document.addEventListener('mousemove', handleMove)
        document.addEventListener('mousedown', handleDown)
        document.addEventListener('mouseup', handleUp)
        document.addEventListener('mouseleave', handleLeave)
        document.addEventListener('mouseenter', handleEnter)
        document.addEventListener('mouseover', handleOver)
        document.addEventListener('mouseout', handleOut)
        rafId.current = requestAnimationFrame(animate)

        return () => {
            document.removeEventListener('mousemove', handleMove)
            document.removeEventListener('mousedown', handleDown)
            document.removeEventListener('mouseup', handleUp)
            document.removeEventListener('mouseleave', handleLeave)
            document.removeEventListener('mouseenter', handleEnter)
            document.removeEventListener('mouseover', handleOver)
            document.removeEventListener('mouseout', handleOut)
            window.removeEventListener('resize', resize)
            if (rafId.current) cancelAnimationFrame(rafId.current)
        }
    }, [visible])

    const dotSize = clicking ? 4 : hovering ? 12 : 6
    const ringSize = hovering ? 48 : 36

    return (
        <>
            <style jsx global>{`
                @media (pointer: fine) {
                    *, *::before, *::after {
                        cursor: none !important;
                    }
                }
            `}</style>

            {/* Canvas for lighting trail */}
            <canvas
                ref={canvasRef}
                className="fixed inset-0 pointer-events-none z-[9998]"
                style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.3s ease' }}
            />

            {/* Ring — outline circle, follows with lag */}
            <div
                ref={ringRef}
                className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full"
                style={{
                    width: `${ringSize}px`,
                    height: `${ringSize}px`,
                    border: `1.5px solid rgba(var(--accent-rgb, 196,255,0), ${hovering ? 0.6 : 0.3})`,
                    opacity: visible ? 1 : 0,
                    transition: 'width 0.3s cubic-bezier(0.16,1,0.3,1), height 0.3s cubic-bezier(0.16,1,0.3,1), border-color 0.3s ease, opacity 0.3s ease',
                    mixBlendMode: 'difference',
                }}
            />

            {/* Dot — solid accent dot */}
            <div
                ref={dotRef}
                className="fixed top-0 left-0 pointer-events-none z-[10000] rounded-full"
                style={{
                    width: `${dotSize}px`,
                    height: `${dotSize}px`,
                    backgroundColor: `rgb(var(--accent-rgb, 196,255,0))`,
                    boxShadow: `0 0 ${hovering ? '16px 4px' : '8px 2px'} rgba(var(--accent-rgb, 196,255,0), 0.35)`,
                    opacity: visible ? 1 : 0,
                    transition: 'width 0.15s ease, height 0.15s ease, box-shadow 0.3s ease, opacity 0.3s ease',
                }}
            />
        </>
    )
}
