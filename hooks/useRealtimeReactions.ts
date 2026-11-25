'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { supabase } from '../lib/supabase/client'
import { subscribeToBlogChannel, registerVisibilityCallback } from '../lib/supabase/realtime'
import { getSessionId } from '../lib/utils/session'
import {
  REACTION_ITEMS,
  REACTIONS,
  ReactionType,
  isAllowedReaction,
  REACTION_COLUMN_MAP,
} from '../lib/constants/reactions'

interface UseRealtimeReactionsProps {
  slug: string
  initialReactions?: Record<string, number>
}

export function useRealtimeReactions({ slug, initialReactions = {} }: UseRealtimeReactionsProps) {
  // Normalize initial counts based exclusively on allowed reactions. Ignore any unknown/legacy keys.
  const normalizeInitialCounts = useCallback(() => {
    const counts: Record<ReactionType, number> = {
      fire: 0,
      insightful: 0,
      rocket: 0,
      applause: 0,
    }

    REACTION_ITEMS.forEach((item) => {
      let val = 0
      for (const key of [item.id, item.dbType, ...item.legacyKeys]) {
        if (initialReactions[key] !== undefined && typeof initialReactions[key] === 'number') {
          val = initialReactions[key]
          break
        }
      }
      counts[item.id] = val
    })

    return counts
  }, [initialReactions])

  const [reactions, setReactions] = useState<Record<ReactionType, number>>(normalizeInitialCounts)
  const [userReacted, setUserReacted] = useState<Record<ReactionType, boolean>>({
    fire: false,
    insightful: false,
    rocket: false,
    applause: false,
  })
  const [views, setViews] = useState<number>(0)
  const lastUserClickTime = useRef<Record<string, number>>({})

  // Fetch current user's reaction history (strictly filters out any unknown interaction types)
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
        const reactedState: Record<ReactionType, boolean> = {
          fire: false,
          insightful: false,
          rocket: false,
          applause: false,
        }

        data.forEach((row) => {
          const type = row.interaction_type
          // Match with allowed reaction items only. Any old 'love' or unknown keys are ignored.
          const matched = REACTION_ITEMS.find(
            (item) => item.dbType === type || item.id === type || item.legacyKeys.includes(type)
          )
          if (matched && isAllowedReaction(matched.id)) {
            reactedState[matched.id] = true
          }
        })

        setUserReacted(reactedState)
      }
    } catch {
      // Quiet fallback
    }
  }, [slug])

  // Fetch metrics (reactions & views) from DB using explicit column mapping
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
          REACTIONS.forEach((reactionKey) => {
            const colName = REACTION_COLUMN_MAP[reactionKey]
            const remoteVal = (data as any)[colName]
            if (remoteVal !== undefined) {
              const timeSinceClick = Date.now() - (lastUserClickTime.current[reactionKey] || 0)
              if (timeSinceClick < 2500) {
                next[reactionKey] = Math.max(prev[reactionKey] || 0, remoteVal || 0)
              } else {
                next[reactionKey] = remoteVal || 0
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

        REACTIONS.forEach((reactionKey) => {
          const colName = REACTION_COLUMN_MAP[reactionKey]
          const val = newRecord[colName]
          if (val !== undefined) {
            const timeSinceClick = Date.now() - (lastUserClickTime.current[reactionKey] || 0)
            if (timeSinceClick < 2500) {
              next[reactionKey] = Math.max(prev[reactionKey] || 0, val)
            } else {
              next[reactionKey] = val
            }
          }
        })

        return next
      })

      // Update views state without triggering increment RPC
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

  // Mark local user click to prevent realtime overwrite flicker
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
