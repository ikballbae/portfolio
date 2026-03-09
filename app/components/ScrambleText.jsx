'use client'
import { useState, useEffect, useCallback, useRef } from 'react'

const defaultChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+'

export default function ScrambleText({
    text,
    delay = 0,
    duration = 1.5,
    revealSpeed = 50, // ms between character reveals
    characters = defaultChars,
    trigger = true // if true, starts immediately (after delay)
}) {
    const [displayText, setDisplayText] = useState('')
    const [isAnimating, setIsAnimating] = useState(false)
    const timerRef = useRef(null)
    const frameRef = useRef(0)

    const scramble = useCallback(() => {
        setIsAnimating(true)
        const textArray = text.split('')
        const length = textArray.length
        let currentFrame = 0
        const totalFrames = Math.floor((duration * 1000) / revealSpeed)

        const tick = () => {
            const result = textArray.map((char, i) => {
                if (char === ' ') return ' '

                // Progress calculation
                const progress = currentFrame / totalFrames
                const charThreshold = i / length

                if (progress > charThreshold) {
                    return char
                }

                return characters[Math.floor(Math.random() * characters.length)]
            }).join('')

            setDisplayText(result)

            if (currentFrame < totalFrames) {
                currentFrame++
                timerRef.current = setTimeout(tick, revealSpeed)
            } else {
                setDisplayText(text)
                setIsAnimating(false)
            }
        }

        tick()
    }, [text, duration, revealSpeed, characters])

    useEffect(() => {
        if (!trigger) return

        const timeout = setTimeout(() => {
            scramble()
        }, delay * 1000)

        return () => {
            clearTimeout(timeout)
            if (timerRef.current) clearTimeout(timerRef.current)
        }
    }, [trigger, delay, scramble])

    if (!displayText && !isAnimating) {
        return <span className="invisible">{text}</span>
    }

    return <span>{displayText}</span>
}
