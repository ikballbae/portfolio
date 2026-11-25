'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { supabase } from '../lib/supabase/client'
import { subscribeToBlogChannel, registerVisibilityCallback } from '../lib/supabase/realtime'
import { getSessionId } from '../lib/utils/session'
import { REACTION_ITEMS, ReactionItem } from '../app/components/ReactionBar'

interface UseRealtimeReactionsProps {
  slug: string
  initialReactions?: Record<string, number>
}

export function useRealtimeReactions({ slug, initialReactions = {} }: UseRealtimeReactionsProps) {
  const normalizeInitialCounts = useCallback(() => {
    const counts: Record<string, number> = {}
    REACTION_ITEMS.forEach((item) => {
      let val = 0
      for (const key of [item.id, item.dbType, ...item.legacyKeys]) {
        if (initialReactions[key] !== undefined) {
          val = initialReactions[key]
          break
        }
      }
      counts[item.id] = val
    })
    return counts
  }, [initialReactions])

  const [reactions, setReactions] = useState<Record<string, number>>(normalizeInitialCounts)
  const [userReacted, setUserReacted] = useState<Record<string, boolean>>({})
  const [views, setViews] = useState<number>(0)
  const lastUserClickTime = useRef<Record<string, number>>({})

  // Fetch current user's reaction history
  const fetchUserReactions = useCallback(async () => {
    if (!slug) return
    try {
      const sessionId = getSessionId()
      const { data, error } = await supabase
        .from('user_interactions')
        .select('interaction_type')
        .eq('session_id', sessionId)
        .eq('slug', slug)

      if (!error && data) {
        const reactedState: Record<string, boolean> = {}
        data.forEach((row) => {
          const matched = REACTION_ITEMS.find(
            (item) =>
              item.dbType === row.interaction_type ||
              item.id === row.interaction_type ||
              item.legacyKeys.includes(row.interaction_type)
          )
          if (matched) reactedState[matched.id] = true
        })
        setUserReacted(reactedState)
      }
    } catch {
      // Quiet fallback
    }
  }, [slug])

  // Fetch metrics (reactions & views) from DB
  const fetchMetrics = useCallback(async () => {
    if (!slug) return
    try {
      const { data, error } = await supabase
        .from('posts_metrics')
        .select('fire_count, insightful_count, rocket_count, applause_count, views_count')
        .eq('slug', slug)
        .maybeSingle()

      if (!error && data) {
        setReactions((prev) => {
          const next = { ...prev }
          REACTION_ITEMS.forEach((item) => {
            const remoteVal = (data as any)[item.dbField]
            if (remoteVal !== undefined) {
              const timeSinceClick = Date.now() - (lastUserClickTime.current[item.id] || 0)
              if (timeSinceClick < 2500) {
                // Keep local value if recently clicked to avoid flicker
                next[item.id] = Math.max(prev[item.id] || 0, remoteVal || 0)
              } else {
                next[item.id] = remoteVal || 0
              }
            }
          })
          return next
        })

        if (data.views_count !== undefined) {
          setViews(data.views_count)
        }
      }
    } catch {
      // Quiet fallback
    }
  }, [slug])

  // Initial fetch and visibility change handler
  useEffect(() => {
    fetchUserReactions()
    fetchMetrics()

    const unregisterVisibility = registerVisibilityCallback(() => {
      fetchUserReactions()
      fetchMetrics()
    })

    return () => {
      unregisterVisibility()
    }
  }, [fetchUserReactions, fetchMetrics])

  // Realtime subscription via unified channel
  useEffect(() => {
    if (!slug) return

    const handleMetricsChange = (payload: any) => {
      const newRecord = payload.new as {
        fire_count?: number
        insightful_count?: number
        rocket_count?: number
        applause_count?: number
        views_count?: number
      }

      if (!newRecord) return

      setReactions((prev) => {
        const next = { ...prev }
        const fieldMap: Record<string, number | undefined> = {
          fire: newRecord.fire_count,
          mind_blown: newRecord.insightful_count,
          rocket: newRecord.rocket_count,
          party: newRecord.applause_count,
        }

        Object.entries(fieldMap).forEach(([id, val]) => {
          if (val !== undefined) {
            const timeSinceClick = Date.now() - (lastUserClickTime.current[id] || 0)
            if (timeSinceClick < 2500) {
              // Avoid flicker: if clicked within 2.5s, don't overwrite with older count
              next[id] = Math.max(prev[id] || 0, val)
            } else {
              next[id] = val
            }
          }
        })

        return next
      })

      // Update views without triggering an increment
      if (newRecord.views_count !== undefined) {
        setViews(newRecord.views_count)
      }
    }

    const unsubscribe = subscribeToBlogChannel(slug, {
      onMetricsChange: handleMetricsChange,
    })

    return () => {
      unsubscribe()
    }
  }, [slug])

  // Mark local user click to prevent realtime flicker
  const recordLocalClick = useCallback((itemId: string) => {
    lastUserClickTime.current[itemId] = Date.now()
  }, [])

  return {
    reactions,
    setReactions,
    userReacted,
    setUserReacted,
    views,
    recordLocalClick,
    refetchMetrics: fetchMetrics,
  }
}
