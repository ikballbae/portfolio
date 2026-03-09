'use client'
import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'blog-reactions'

function getStoredReactions() {
    if (typeof window === 'undefined') return {}
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
    } catch {
        return {}
    }
}

function getStoredUserReactions() {
    if (typeof window === 'undefined') return {}
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY + '-user') || '{}')
    } catch {
        return {}
    }
}

function saveReactions(slug, reactions) {
    const all = getStoredReactions()
    all[slug] = reactions
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all))
}

function saveUserReactions(slug, userReacted) {
    const all = getStoredUserReactions()
    all[slug] = userReacted
    localStorage.setItem(STORAGE_KEY + '-user', JSON.stringify(all))
}

export default function ReactionBar({ slug, initialReactions, size = 'sm' }) {
    const [reactions, setReactions] = useState(initialReactions)
    const [userReacted, setUserReacted] = useState({})
    const [mounted, setMounted] = useState(false)
    const [animatingEmoji, setAnimatingEmoji] = useState(null)

    // Load from localStorage on mount
    useEffect(() => {
        const stored = getStoredReactions()
        const storedUser = getStoredUserReactions()
        if (stored[slug]) {
            setReactions(stored[slug])
        }
        if (storedUser[slug]) {
            setUserReacted(storedUser[slug])
        }
        setMounted(true)
    }, [slug])

    // Cross-tab sync via storage event
    useEffect(() => {
        const handleStorage = (e) => {
            if (e.key === STORAGE_KEY) {
                const all = JSON.parse(e.newValue || '{}')
                if (all[slug]) setReactions(all[slug])
            }
            if (e.key === STORAGE_KEY + '-user') {
                const all = JSON.parse(e.newValue || '{}')
                if (all[slug]) setUserReacted(all[slug])
            }
        }
        window.addEventListener('storage', handleStorage)
        return () => window.removeEventListener('storage', handleStorage)
    }, [slug])

    const handleReaction = useCallback((emoji, e) => {
        if (e) {
            e.preventDefault()
            e.stopPropagation()
        }

        const isRemoving = userReacted[emoji]
        const newReactions = {
            ...reactions,
            [emoji]: reactions[emoji] + (isRemoving ? -1 : 1),
        }
        const newUserReacted = { ...userReacted, [emoji]: !isRemoving }

        setReactions(newReactions)
        setUserReacted(newUserReacted)
        saveReactions(slug, newReactions)
        saveUserReactions(slug, newUserReacted)

        if (!isRemoving) {
            setAnimatingEmoji(emoji)
            setTimeout(() => setAnimatingEmoji(null), 400)
        }
    }, [reactions, userReacted, slug])

    const totalReactions = Object.values(reactions).reduce((sum, v) => sum + v, 0)

    const isLarge = size === 'lg'

    return (
        <div className="flex flex-col gap-2">
            {isLarge && (
                <div className="flex items-center gap-2 mb-1">
                    <span className="text-[9px] sm:text-[10px] font-mono text-text-muted/40 tracking-wider uppercase">Reactions</span>
                    <span className="text-[9px] sm:text-[10px] font-mono text-text-muted/25">•</span>
                    <span className="text-[9px] sm:text-[10px] font-mono text-text-muted/30">{totalReactions} total</span>
                </div>
            )}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                {Object.entries(reactions).map(([emoji, count]) => (
                    <button
                        key={emoji}
                        onClick={(e) => handleReaction(emoji, e)}
                        className={`inline-flex items-center gap-1.5 rounded-full font-mono transition-all duration-300 border cursor-pointer active:scale-95 ${isLarge ? 'px-3 sm:px-4 py-2 sm:py-2.5 text-sm gap-2' : 'px-2.5 py-1 text-xs gap-1.5'
                            } ${mounted && userReacted[emoji]
                                ? 'bg-accent/10 border-accent/30 text-accent scale-[1.02] shadow-sm shadow-accent/10'
                                : 'bg-surface border-accent/5 text-text-muted/60 hover:border-accent/20 hover:bg-accent/5 hover:scale-[1.02]'
                            }`}
                    >
                        <span className={`${isLarge ? 'text-base sm:text-lg' : 'text-sm'} ${animatingEmoji === emoji ? 'animate-bounce-once' : ''}`}>
                            {emoji}
                        </span>
                        <span className={`${isLarge ? 'text-xs' : 'text-[10px]'} font-medium tabular-nums`}>
                            {count}
                        </span>
                    </button>
                ))}
                {!isLarge && (
                    <span className="text-[9px] font-mono text-text-muted/20 ml-1 hidden sm:inline">{totalReactions}</span>
                )}
            </div>
        </div>
    )
}
