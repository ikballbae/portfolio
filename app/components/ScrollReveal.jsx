'use client'
import { useEffect, useRef } from 'react'

/**
 * ScrollReveal — enter/leave scroll animation
 * Elements appear when entering viewport, disappear when leaving.
 */
export default function ScrollReveal({
    children,
    delay = 0,
    direction = 'up',
    distance = 40,
    duration = 0.7,
    className = '',
    as: Component = 'div',
    threshold = 0.1,
    once = false,
}) {
    const ref = useRef(null)

    useEffect(() => {
        const el = ref.current
        if (!el) return

        // Build transform string for hidden state
        let hiddenTransform = ''
        switch (direction) {
            case 'up': hiddenTransform = `translateY(${distance}px)`; break
            case 'down': hiddenTransform = `translateY(-${distance}px)`; break
            case 'left': hiddenTransform = `translateX(${distance}px)`; break
            case 'right': hiddenTransform = `translateX(-${distance}px)`; break
            case 'scale': hiddenTransform = `scale(0.9)`; break
            default: hiddenTransform = `translateY(${distance}px)`
        }

        // Start hidden
        el.style.opacity = '0'
        el.style.transform = hiddenTransform
        el.style.transition = `opacity ${duration}s ease, transform ${duration}s ease`
        el.style.transitionDelay = `${delay}s`

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    // Enter — reveal
                    el.style.opacity = '1'
                    el.style.transform = 'translate(0, 0) scale(1)'
                    if (once) observer.unobserve(el)
                } else {
                    // Leave — hide
                    el.style.opacity = '0'
                    el.style.transform = hiddenTransform
                }
            },
            { threshold, rootMargin: '0px 0px -50px 0px' }
        )

        observer.observe(el)
        return () => observer.disconnect()
    }, [delay, direction, distance, duration, threshold])

    return (
        <Component ref={ref} className={className}>
            {children}
        </Component>
    )
}

/**
 * StaggerReveal — children appear/disappear with stagger delay
 */
export function StaggerReveal({
    children,
    baseDelay = 0,
    stagger = 0.1,
    direction = 'up',
    distance = 30,
    className = '',
    once = false,
}) {
    const ref = useRef(null)

    useEffect(() => {
        const el = ref.current
        if (!el) return

        const items = el.querySelectorAll('[data-reveal-item]')
        if (!items.length) return

        let hiddenTransform = ''
        switch (direction) {
            case 'up': hiddenTransform = `translateY(${distance}px)`; break
            case 'left': hiddenTransform = `translateX(${distance}px)`; break
            case 'scale': hiddenTransform = `scale(0.9)`; break
            default: hiddenTransform = `translateY(${distance}px)`
        }

        items.forEach((item, i) => {
            item.style.opacity = '0'
            item.style.transform = hiddenTransform
            item.style.transition = `opacity 0.6s ease, transform 0.6s ease`
            item.style.transitionDelay = `${baseDelay + i * stagger}s`
        })

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    items.forEach((item) => {
                        item.style.opacity = '1'
                        item.style.transform = 'translate(0, 0) scale(1)'
                    })
                    if (once) observer.unobserve(el)
                } else {
                    items.forEach((item) => {
                        item.style.opacity = '0'
                        item.style.transform = hiddenTransform
                    })
                }
            },
            { threshold: 0.05, rootMargin: '0px 0px -30px 0px' }
        )

        observer.observe(el)
        return () => observer.disconnect()
    }, [baseDelay, stagger, direction, distance])

    return (
        <div ref={ref} className={className}>
            {children}
        </div>
    )
}

/**
 * CountUp — animates a number from 0 to target on scroll
 */
export function CountUp({ target, suffix = '', duration = 2000 }) {
    const ref = useRef(null)
    const counted = useRef(false)

    useEffect(() => {
        const el = ref.current
        if (!el) return

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !counted.current) {
                    counted.current = true
                    const start = performance.now()

                    const step = (now) => {
                        const progress = Math.min((now - start) / duration, 1)
                        const eased = 1 - Math.pow(1 - progress, 3)
                        el.textContent = Math.round(eased * target) + suffix
                        if (progress < 1) requestAnimationFrame(step)
                    }

                    requestAnimationFrame(step)
                }
            },
            { threshold: 0.5 }
        )

        observer.observe(el)
        return () => observer.disconnect()
    }, [target, suffix, duration])

    return <span ref={ref}>0{suffix}</span>
}

/**
 * BarFill — animates a skill bar width on scroll (enter/leave)
 */
export function BarFill({ level, className = '' }) {
    const ref = useRef(null)

    useEffect(() => {
        const el = ref.current
        if (!el) return

        el.style.width = '0%'
        el.style.transition = 'width 1.4s cubic-bezier(0.16, 1, 0.3, 1)'

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    el.style.width = `${level}%`
                } else {
                    el.style.width = '0%'
                }
            },
            { threshold: 0.3 }
        )

        observer.observe(el)
        return () => observer.disconnect()
    }, [level])

    return <div ref={ref} className={`skill-bar-fill ${className}`} />
}

/**
 * LineGrow — animates a horizontal line on scroll (enter/leave)
 */
export function LineGrow({ className = '' }) {
    const ref = useRef(null)

    useEffect(() => {
        const el = ref.current
        if (!el) return

        el.style.transform = 'scaleX(0)'
        el.style.transformOrigin = 'left center'
        el.style.transition = 'transform 1s cubic-bezier(0.16, 1, 0.3, 1)'

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    el.style.transform = 'scaleX(1)'
                } else {
                    el.style.transform = 'scaleX(0)'
                }
            },
            { threshold: 0.1 }
        )

        observer.observe(el)
        return () => observer.disconnect()
    }, [])

    return <span ref={ref} className={className} />
}
