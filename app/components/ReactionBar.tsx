'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../../lib/supabase/client'
import { getSessionId } from '../../lib/utils/session'
import gsap from 'gsap'
import { useRealtimeReactions } from '../../hooks/useRealtimeReactions'

export interface ReactionItem {
    id: string
    dbType: string
    dbField: string
    label: string
    tooltip: string
    icon: string
    legacyKeys: string[]
}

// 5 Pilihan Emoji Interaktif dari Microsoft Fluent UI Emoji 3D
export const REACTION_ITEMS: ReactionItem[] = [
    {
        id: 'fire',
        dbType: 'fire',
        dbField: 'fire_count',
        label: 'Keren',
        tooltip: 'Keren banget!',
        icon: '/emojis/fire.png',
        legacyKeys: ['🔥', 'fire'],
    },
    {
        id: 'mind_blown',
        dbType: 'insightful',
        dbField: 'insightful_count',
        label: 'Takjub',
        tooltip: 'Bikin takjub!',
        icon: '/emojis/mind_blown.png',
        legacyKeys: ['💡', 'insightful', 'mind_blown', '🤯'],
    },
    {
        id: 'rocket',
        dbType: 'rocket',
        dbField: 'rocket_count',
        label: 'Gas Pol',
        tooltip: 'Terbang tinggi!',
        icon: '/emojis/rocket.png',
        legacyKeys: ['🚀', 'rocket'],
    },
    {
        id: 'party',
        dbType: 'applause',
        dbField: 'applause_count',
        label: 'Mantap',
        tooltip: 'Mantap!',
        icon: '/emojis/party.png',
        legacyKeys: ['👏', 'applause', 'party', '🎉'],
    },
    {
        id: 'love',
        dbType: 'love',
        dbField: 'love_count',
        label: 'Suka',
        tooltip: 'Suka tulisannya!',
        icon: '/emojis/love.png',
        legacyKeys: ['❤️', 'love', 'heart'],
    },
]

interface ReactionBarProps {
    slug: string
    initialReactions?: Record<string, number>
    size?: 'sm' | 'lg'
}

export default function ReactionBar({ slug, initialReactions = {}, size = 'sm' }: ReactionBarProps) {
    const {
        reactions,
        setReactions,
        userReacted,
        setUserReacted,
        recordLocalClick,
    } = useRealtimeReactions({ slug, initialReactions })

    const [mounted, setMounted] = useState(false)
    const [popUps, setPopUps] = useState<Record<string, { id: number; text: string }[]>>({})

    const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({})
    const imgRefs = useRef<Record<string, HTMLImageElement | null>>({})
    const isLarge = size === 'lg'

    useEffect(() => {
        setMounted(true)
    }, [])

    const handleReaction = useCallback(async (item: ReactionItem, e?: React.MouseEvent) => {
        if (e) {
            e.preventDefault()
            e.stopPropagation()
        }

        const sessionId = getSessionId()
        const isRemoving = !!userReacted[item.id]

        // Record user click to avoid realtime overwrite flicker
        recordLocalClick(item.id)

        // GSAP Elastic Animation on image
        const img = imgRefs.current[item.id]
        const btn = buttonRefs.current[item.id]

        const prefersReduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

        if (img && !prefersReduced) {
            gsap.timeline()
                .fromTo(img, 
                    { scale: 0.8, rotate: -12 }, 
                    { scale: 1.25, rotate: 8, duration: 0.18, ease: 'power2.out' }
                )
                .to(img, {
                    scale: 1,
                    rotate: 0,
                    duration: 0.35,
                    ease: 'elastic.out(1.2, 0.4)',
                })
        }

        if (btn && !prefersReduced) {
            gsap.fromTo(btn,
                { scale: 0.94 },
                { scale: 1, duration: 0.3, ease: 'back.out(2)' }
            )
        }

        // Float popup "+1" or "-1"
        const popId = Date.now()
        setPopUps(prev => ({
            ...prev,
            [item.id]: [...(prev[item.id] || []), { id: popId, text: isRemoving ? '-1' : '+1' }]
        }))
        setTimeout(() => {
            setPopUps(prev => ({
                ...prev,
                [item.id]: (prev[item.id] || []).filter(p => p.id !== popId)
            }))
        }, 800)

        // Optimistic UI Update
        setReactions(prev => ({
            ...prev,
            [item.id]: Math.max(0, (prev[item.id] || 0) + (isRemoving ? -1 : 1)),
        }))
        setUserReacted(prev => ({
            ...prev,
            [item.id]: !isRemoving,
        }))

        // Call Supabase RPC
        try {
            const { error } = await supabase.rpc('toggle_reaction', {
                post_slug: slug,
                user_session_id: sessionId,
                reaction_type: item.dbType,
            })
            if (error) {
                console.warn('Error toggling reaction:', error.message || error)
            }
        } catch (err: any) {
            console.warn('Error toggling reaction:', err?.message || err)
        }
    }, [userReacted, slug, recordLocalClick, setReactions, setUserReacted])

    if (!mounted) {
        return (
            <div className="flex flex-col gap-2">
                <div className="flex flex-wrap items-center gap-2 opacity-50">
                    {REACTION_ITEMS.map((item) => (
                        <div key={item.id} className="h-8 w-14 rounded-md border border-text/10 bg-text/5 animate-pulse" />
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-wrap items-center gap-2">
            {REACTION_ITEMS.map((item) => {
                const count = reactions[item.id] || 0
                const isReacted = !!userReacted[item.id]
                const currentPopups = popUps[item.id] || []

                return (
                    <div key={item.id} className="relative flex items-center justify-center">
                        {/* Floating "+1" / "-1" Animation */}
                        <AnimatePresence>
                            {currentPopups.map(pop => (
                                <motion.span
                                    key={pop.id}
                                    initial={{ opacity: 0, y: 0, scale: 0.6 }}
                                    animate={{ opacity: 1, y: -26, scale: 1.1 }}
                                    exit={{ opacity: 0, y: -38, scale: 0.8 }}
                                    transition={{ duration: 0.6, ease: 'easeOut' }}
                                    className={`absolute -top-3 pointer-events-none z-30 text-[11px] font-mono font-bold select-none px-1.5 py-0.5 rounded-md shadow-md ${
                                        pop.text === '+1'
                                            ? 'bg-accent text-bg'
                                            : 'bg-text-muted/80 text-bg'
                                    }`}
                                >
                                    {pop.text}
                                </motion.span>
                            ))}
                        </AnimatePresence>

                        {/* Reaction Button — Clean, Engineered Squircle with 3D Emoji Hero */}
                        <button
                            ref={el => { buttonRefs.current[item.id] = el }}
                            onClick={(e) => handleReaction(item, e)}
                            type="button"
                            aria-label={`${item.label} (${count})`}
                            className={`group relative inline-flex items-center rounded-lg font-mono transition-colors duration-150 border cursor-pointer select-none active:scale-[0.96] px-2.5 py-1 text-xs gap-1.5 ${
                                isReacted
                                    ? 'bg-surface-light border-text/40 text-text font-medium'
                                    : 'bg-surface-light/40 border-[var(--card-border)] text-text-muted hover:border-text/30 hover:text-text'
                            }`}
                        >
                            {/* 3D Fluent Emoji Icon */}
                            <div className={`relative shrink-0 transition-transform duration-200 ease-out group-hover:scale-125 group-hover:-translate-y-0.5 group-hover:-rotate-6 ${
                                isLarge ? 'w-6 h-6' : 'w-4 h-4'
                            }`}>
                                <Image
                                    ref={el => { imgRefs.current[item.id] = el }}
                                    src={item.icon}
                                    alt={item.label}
                                    width={isLarge ? 32 : 24}
                                    height={isLarge ? 32 : 24}
                                    className="w-full h-full object-contain pointer-events-none drop-shadow-sm select-none"
                                    priority={isLarge}
                                />
                            </div>

                            {/* Count Badge */}
                            {count > 0 && (
                                <span
                                    className={`font-mono tabular-nums transition-colors ${
                                        isReacted ? 'text-text font-semibold' : 'text-text-muted/80'
                                    } ${
                                        isLarge ? 'text-xs' : 'text-[11px]'
                                    }`}
                                >
                                    {count}
                                </span>
                            )}
                        </button>
                    </div>
                )
            })}
        </div>
    )
}
