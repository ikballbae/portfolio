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
            try {
                const { error } = await supabase.rpc('increment_view', {
                    post_slug: slug,
                    user_session_id: sessionId
                })
                // Ignore duplicate key errors (23505) quietly since it just means the user already viewed
                if (error && error.code !== '23505') {
                    console.warn('Error incrementing view:', error.message || error)
                }
            } catch (err: any) {
                // Ignore network errors gracefully
            }
        }

        // 2. Fetch Initial Views
        const fetchViews = async () => {
            try {
                const { data, error } = await supabase
                    .from('posts_metrics')
                    .select('views_count')
                    .eq('slug', slug)
                    .single()

                if (!error && data) {
                    setViews(data.views_count)
                }
            } catch (err: any) {
                // Ignore network errors gracefully
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
            <div className="flex items-center gap-3 animate-pulse text-xs font-mono text-text-muted/40">
                <span className="h-3.5 w-12 bg-white/5 rounded"></span>
                <span>·</span>
                <span className="h-3.5 w-16 bg-white/5 rounded"></span>
            </div>
        )
    }

    return (
        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs font-mono text-text-muted">
            <span className="tabular-nums">{views} views</span>
            <span className="text-text-muted/30 select-none">·</span>
            {activeReaders > 0 && (
                <span className="inline-flex items-center gap-1.5 text-text-muted">
                    <span className="w-1.5 h-1.5 bg-accent animate-pulse" />
                    <span className="tabular-nums">{activeReaders} reading</span>
                </span>
            )}
        </div>
    )
}
