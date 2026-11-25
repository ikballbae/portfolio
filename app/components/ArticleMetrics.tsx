'use client'

import { useEffect, useState, useRef } from 'react'
import { supabase } from '../../lib/supabase/client'
import { getSessionId } from '../../lib/utils/session'
import { subscribeToBlogChannel } from '../../lib/supabase/realtime'

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
        const sessionId = getSessionId()

        // 1. Increment View (Call RPC) — Only recorded ONCE on mount, NEVER on realtime events
        const recordView = async () => {
            if (hasRecorded.current) return
            hasRecorded.current = true

            try {
                const { error } = await supabase.rpc('increment_view', {
                    post_slug: slug,
                    user_session_id: sessionId
                })
                // Ignore duplicate key errors (23505) quietly since it just means the user already viewed
                if (error && error.code !== '23505') {
                    console.warn('Error incrementing view:', error.message || error)
                }
            } catch {
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
                    .maybeSingle()

                if (!error && data && data.views_count !== undefined) {
                    setViews(data.views_count)
                }
            } catch {
                // Ignore network errors gracefully
            }
        }

        recordView().then(() => fetchViews())

        // 3. Subscribe to Unified Realtime Channel (One channel per page)
        const unsubscribe = subscribeToBlogChannel(slug, {
            presenceUser: sessionId,
            onPresenceSync: (presenceState) => {
                const users = Object.keys(presenceState).length
                setActiveReaders(users > 0 ? users : 1)
            },
            onMetricsChange: (payload) => {
                const newRecord = payload.new as { views_count?: number }
                if (newRecord && newRecord.views_count !== undefined) {
                    setViews(newRecord.views_count)
                }
            }
        })

        return () => {
            unsubscribe()
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
