'use client'

import { useEffect, useState, useRef } from 'react'
import { supabase } from '../../lib/supabase/client'
import { getSessionId } from '../../lib/utils/session'

interface ArticleMetricsProps {
    slug: string
    readTime: string
}

export default function ArticleMetrics({ slug, readTime }: ArticleMetricsProps) {
    const [views, setViews] = useState<number>(0)
    const [activeReaders, setActiveReaders] = useState<number>(1) // at least self
    const [mounted, setMounted] = useState(false)
    const hasRecorded = useRef(false)

    useEffect(() => {
        setMounted(true)
        if (hasRecorded.current) return
        hasRecorded.current = true

        const sessionId = getSessionId()

        // 1. Increment View (Call RPC)
        const recordView = async () => {
            const { error } = await supabase.rpc('increment_view', {
                post_slug: slug,
                user_session_id: sessionId
            })
            // Ignore duplicate key errors (23505) quietly since it just means the user already viewed
            if (error && error.code !== '23505') {
                console.error('Error incrementing view:', error)
            }
        }

        // 2. Fetch Initial Views
        const fetchViews = async () => {
            const { data, error } = await supabase
                .from('posts_metrics')
                .select('views_count')
                .eq('slug', slug)
                .single()

            if (!error && data) {
                setViews(data.views_count)
            }
        }

        recordView().then(() => fetchViews())

        // 3. Subscribe to Realtime Presence for Active Readers
        const room = supabase.channel(`room_article_${slug}`)
        
        room
            .on('presence', { event: 'sync' }, () => {
                const newState = room.presenceState()
                // Count unique users in the room
                const users = Object.keys(newState).length
                setActiveReaders(users > 0 ? users : 1)
            })
            .subscribe(async (status) => {
                if (status === 'SUBSCRIBED') {
                    await room.track({ user: sessionId })
                }
            })

        // 4. Subscribe to Realtime Postgres Changes for Total Views
        const viewSubscription = supabase
            .channel(`public:posts_metrics:slug=eq.${slug}`)
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'posts_metrics',
                    filter: `slug=eq.${slug}`
                },
                (payload) => {
                    const newRecord = payload.new as { views_count: number }
                    if (newRecord && newRecord.views_count) {
                        setViews(newRecord.views_count)
                    }
                }
            )
            .subscribe()

        return () => {
            room.untrack()
            supabase.removeChannel(room)
            supabase.removeChannel(viewSubscription)
        }
    }, [slug])

    if (!mounted) {
        return (
            <div className="flex items-center gap-3 mb-5 sm:mb-6 animate-pulse">
                <div className="h-4 w-16 bg-white/5 rounded"></div>
                <div className="h-4 w-16 bg-white/5 rounded"></div>
            </div>
        )
    }

    return (
        <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-5 sm:mb-6 text-[10px] sm:text-xs font-mono text-text-muted/60">
            {/* Reading Time */}
            <div className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-md border border-white/5">
                <svg className="w-3.5 h-3.5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
                <span>{readTime}</span>
            </div>

            {/* Total Views */}
            <div className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-md border border-white/5">
                <svg className="w-3.5 h-3.5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>
                <span className="tabular-nums">{views} views</span>
            </div>

            {/* Active Readers */}
            {activeReaders > 0 && (
                <div className="flex items-center gap-1.5 bg-green-500/10 text-green-400/90 px-2.5 py-1 rounded-md border border-green-500/20">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    <span className="tabular-nums">{activeReaders} reading now</span>
                </div>
            )}
        </div>
    )
}
