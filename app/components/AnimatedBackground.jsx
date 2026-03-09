'use client'
import { useEffect, useRef } from 'react'

export default function AnimatedBackground() {
    const canvasRef = useRef(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')

        let animationId
        let particles = []
        let orbs = []

        const resize = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
        }
        resize()

        // Get accent color
        const getAccent = () => {
            const style = getComputedStyle(document.documentElement)
            const rgb = style.getPropertyValue('--accent-rgb').trim()
            if (rgb) return rgb.split(',').map(s => parseInt(s.trim()))
            return [196, 255, 0]
        }

        // Create floating particles
        const createParticles = () => {
            particles = []
            const count = Math.floor((canvas.width * canvas.height) / 25000)
            for (let i = 0; i < count; i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    size: Math.random() * 1.5 + 0.5,
                    speedX: (Math.random() - 0.5) * 0.15,
                    speedY: (Math.random() - 0.5) * 0.1,
                    opacity: Math.random() * 0.4 + 0.1,
                    pulse: Math.random() * Math.PI * 2,
                    pulseSpeed: Math.random() * 0.01 + 0.005,
                })
            }
        }

        // Create gradient orbs
        const createOrbs = () => {
            orbs = [
                { x: canvas.width * 0.15, y: canvas.height * 0.1, size: 350, speedX: 0.12, speedY: 0.08, phase: 0 },
                { x: canvas.width * 0.85, y: canvas.height * 0.3, size: 280, speedX: -0.1, speedY: 0.06, phase: 2 },
                { x: canvas.width * 0.5, y: canvas.height * 0.7, size: 320, speedX: 0.08, speedY: -0.1, phase: 4 },
                { x: canvas.width * 0.2, y: canvas.height * 0.9, size: 200, speedX: 0.15, speedY: -0.05, phase: 1 },
            ]
        }

        createParticles()
        createOrbs()

        window.addEventListener('resize', () => {
            resize()
            createParticles()
            createOrbs()
        })

        let time = 0

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            const [r, g, b] = getAccent()
            time += 0.005

            // Draw particles

            particles.forEach((p) => {
                p.x += p.speedX
                p.y += p.speedY
                p.pulse += p.pulseSpeed

                // Wrap around
                if (p.x < -10) p.x = canvas.width + 10
                if (p.x > canvas.width + 10) p.x = -10
                if (p.y < -10) p.y = canvas.height + 10
                if (p.y > canvas.height + 10) p.y = -10

                const alpha = p.opacity * (0.6 + Math.sin(p.pulse) * 0.4)

                ctx.beginPath()
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
                ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`
                ctx.fill()
            })

            // Draw connecting lines between nearby particles
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x
                    const dy = particles[i].y - particles[j].y
                    const dist = Math.sqrt(dx * dx + dy * dy)

                    if (dist < 100) {
                        const alpha = (1 - dist / 100) * 0.06
                        ctx.beginPath()
                        ctx.moveTo(particles[i].x, particles[i].y)
                        ctx.lineTo(particles[j].x, particles[j].y)
                        ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`
                        ctx.lineWidth = 0.5
                        ctx.stroke()
                    }
                }
            }

            animationId = requestAnimationFrame(animate)
        }

        animationId = requestAnimationFrame(animate)

        return () => {
            cancelAnimationFrame(animationId)
            window.removeEventListener('resize', resize)
        }
    }, [])

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-0"
            aria-hidden="true"
            style={{ opacity: 0.9 }}
        />
    )
}
