'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { supabase } from '../../lib/supabase/client'
import { getSessionId } from '../../lib/utils/session'
import gsap from 'gsap'

type ReactionCounts = {
    fire: number
    insightful: number
    rocket: number
    applause: number
}

// Map emoji to SQL column/type name
const reactionTypeMap: Record<string, keyof ReactionCounts> = {
    '🔥': 'fire',
    '💡': 'insightful',
    '🚀': 'rocket',
    '👏': 'applause'
}

interface ReactionBarProps {
    slug: string
    initialReactions: Record<string, number>
    size?: 'sm' | 'lg'
}

export default function ReactionBar({ slug, initialReactions, size = 'sm' }: ReactionBarProps) {
    const [reactions, setReactions] = useState<Record<string, number>>(initialReactions)
    const [userReacted, setUserReacted] = useState<Record<string, boolean>>({})
    const [mounted, setMounted] = useState(false)
    const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({})

    const isLarge = size === 'lg'

    useEffect(() => {
        setMounted(true)
        const sessionId = getSessionId()

        // Fetch User's Reactions for this post
        const fetchUserReactions = async () => {
            const { data, error } = await supabase
                .from('user_interactions')
                .select('interaction_type')
                .eq('session_id', sessionId)
                .eq('slug', slug)

            if (error) {
                console.error("Error fetching user reactions:", error)
            } else if (data) {
                console.log("Fetched user reactions:", data)
                const reactedState: Record<string, boolean> = {}
                data.forEach((row) => {
                    const emoji = Object.keys(reactionTypeMap).find(key => reactionTypeMap[key] === row.interaction_type)
                    if (emoji) reactedState[emoji] = true
                })
                setUserReacted(reactedState)
            }
        }

        // Fetch Current Metrics
        const fetchMetrics = async () => {
            const { data, error } = await supabase
                .from('posts_metrics')
                .select('fire_count, insightful_count, rocket_count, applause_count')
                .eq('slug', slug)
                .maybeSingle()

            if (error) {
                console.error("Error fetching metrics:", error)
                // If the row doesn't exist yet, we don't setReactions
            } else if (data) {
                console.log("Fetched metrics:", data)
                setReactions({
                    '🔥': data.fire_count,
                    '💡': data.insightful_count,
                    '🚀': data.rocket_count,
                    '👏': data.applause_count
                })
            }
        }

        fetchUserReactions()
        fetchMetrics()

        // Listen for Realtime Updates on this post
        const subscription = supabase
            .channel(`public:posts_metrics:reactions:slug=eq.${slug}`)
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'posts_metrics',
                    filter: `slug=eq.${slug}`
                },
                (payload) => {
                    const newRecord = payload.new as {
                        fire_count: number
                        insightful_count: number
                        rocket_count: number
                        applause_count: number
                    }
                    if (newRecord) {
                        setReactions({
                            '🔥': newRecord.fire_count,
                            '💡': newRecord.insightful_count,
                            '🚀': newRecord.rocket_count,
                            '👏': newRecord.applause_count
                        })
                    }
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(subscription)
        }
    }, [slug])

    const handleReaction = useCallback(async (emoji: string, e?: React.MouseEvent) => {
        if (e) {
            e.preventDefault()
            e.stopPropagation()
        }

        const sessionId = getSessionId()
        const isRemoving = userReacted[emoji]
        const reactionType = reactionTypeMap[emoji]

        // GSAP Animation
        const btn = buttonRefs.current[emoji]
        if (btn) {
            gsap.fromTo(btn, 
                { scale: 0.9 }, 
                { scale: 1, duration: 0.4, ease: "back.out(2)" }
            )
        }

        // Optimistic UI Update
        const newReactions = {
            ...reactions,
            [emoji]: Math.max(0, (reactions[emoji] || 0) + (isRemoving ? -1 : 1)),
        }
        const newUserReacted = { ...userReacted, [emoji]: !isRemoving }

        setReactions(newReactions)
        setUserReacted(newUserReacted)

        // Call Supabase RPC
        const { error } = await supabase.rpc('toggle_reaction', {
            post_slug: slug,
            user_session_id: sessionId,
            reaction_type: reactionType
        })

        if (error) {
            console.error('Error toggling reaction:', error)
            // Revert on error (optional, omitted for brevity)
        }

    }, [reactions, userReacted, slug])

    const totalReactions = Object.values(reactions).reduce((sum, v) => sum + (v || 0), 0)

    if (!mounted) {
        return (
            <div className="flex flex-col gap-2">
                 <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 opacity-50">
                     {/* Placeholder while mounting */}
                     {Object.keys(initialReactions).map((emoji) => (
                         <div key={emoji} className="px-3 sm:px-4 py-2 sm:py-2.5 rounded-full border border-white/5 bg-white/5 h-10 w-16 animate-pulse"></div>
                     ))}
                 </div>
            </div>
        )
    }

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
                        ref={el => { buttonRefs.current[emoji] = el }}
                        onClick={(e) => handleReaction(emoji, e)}
                        className={`inline-flex items-center gap-1.5 rounded-full font-mono transition-all duration-300 border cursor-pointer active:scale-95 ${isLarge ? 'px-3 sm:px-4 py-2 sm:py-2.5 text-sm gap-2' : 'px-2.5 py-1 text-xs gap-1.5'
                            } ${userReacted[emoji]
                                ? 'bg-accent/10 border-accent/30 text-accent shadow-sm shadow-accent/10'
                                : 'bg-surface border-accent/5 text-text-muted/60 hover:border-accent/20 hover:bg-accent/5'
                            }`}
                    >
                        <span className={`${isLarge ? 'text-base sm:text-lg' : 'text-sm'}`}>
                            {emoji}
                        </span>
                        <span className={`${isLarge ? 'text-xs' : 'text-[10px]'} font-medium tabular-nums`}>
                            {count || 0}
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
