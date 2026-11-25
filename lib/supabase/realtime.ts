import { RealtimeChannel } from '@supabase/supabase-js'
import { supabase } from './client'

type PostgresChangeCallback = (payload: any) => void
type PresenceCallback = (state: Record<string, any>) => void

interface ChannelEntry {
  channel: RealtimeChannel
  refCount: number
  commentListeners: Set<PostgresChangeCallback>
  metricsListeners: Set<PostgresChangeCallback>
  presenceListeners: Set<PresenceCallback>
  cleanupTimer: ReturnType<typeof setTimeout> | null
  isSubscribed: boolean
}

// Map per slug to ensure only one channel is created per page/slug
const channelRegistry = new Map<string, ChannelEntry>()

// Set of visibility callbacks to trigger refetch when document becomes visible
const visibilityCallbacks = new Set<() => void>()

if (typeof window !== 'undefined') {
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      visibilityCallbacks.forEach((cb) => {
        try {
          cb()
        } catch (e) {
          console.warn('[Realtime] Visibility callback error:', e)
        }
      })
    }
  })
}

export function registerVisibilityCallback(cb: () => void) {
  visibilityCallbacks.add(cb)
  return () => {
    visibilityCallbacks.delete(cb)
  }
}

interface SubscribeOptions {
  onCommentChange?: PostgresChangeCallback
  onMetricsChange?: PostgresChangeCallback
  onPresenceSync?: PresenceCallback
  presenceUser?: string
}

/**
 * Subscribes a component to the unified blog channel for a given slug.
 * Ensures:
 * 1. Exactly one channel per slug (no duplicate WebSocket channels)
 * 2. Safe against React StrictMode unmount/remount churn
 * 3. Handles presence, comments changes, and metrics changes together
 * 4. Silent fallback on CHANNEL_ERROR, TIMED_OUT, CLOSED
 */
export function subscribeToBlogChannel(slug: string, options: SubscribeOptions) {
  if (!slug || typeof window === 'undefined') {
    return () => {}
  }

  let entry = channelRegistry.get(slug)

  if (!entry) {
    const channelName = `blog-page-${slug}`
    const channel = supabase.channel(channelName)

    entry = {
      channel,
      refCount: 0,
      commentListeners: new Set(),
      metricsListeners: new Set(),
      presenceListeners: new Set(),
      cleanupTimer: null,
      isSubscribed: false,
    }
    channelRegistry.set(slug, entry)

    // Setup listeners before subscribing
    channel
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'comments',
          filter: `article_slug=eq.${slug}`,
        },
        (payload) => {
          const currentEntry = channelRegistry.get(slug)
          if (currentEntry) {
            currentEntry.commentListeners.forEach((cb) => {
              try {
                cb(payload)
              } catch (e) {
                console.warn('[Realtime] Error in comment listener:', e)
              }
            })
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'posts_metrics',
          filter: `slug=eq.${slug}`,
        },
        (payload) => {
          const currentEntry = channelRegistry.get(slug)
          if (currentEntry) {
            currentEntry.metricsListeners.forEach((cb) => {
              try {
                cb(payload)
              } catch (e) {
                console.warn('[Realtime] Error in metrics listener:', e)
              }
            })
          }
        }
      )
      .on('presence', { event: 'sync' }, () => {
        const currentEntry = channelRegistry.get(slug)
        if (currentEntry) {
          const state = channel.presenceState()
          currentEntry.presenceListeners.forEach((cb) => {
            try {
              cb(state)
            } catch (e) {
              console.warn('[Realtime] Error in presence listener:', e)
            }
          })
        }
      })

    channel.subscribe(async (status, err) => {
      if (status === 'SUBSCRIBED') {
        entry!.isSubscribed = true
        if (options.presenceUser) {
          try {
            await channel.track({ user: options.presenceUser })
          } catch {
            // Quiet fallback
          }
        }
      } else if (
        status === 'CHANNEL_ERROR' ||
        status === 'TIMED_OUT' ||
        status === 'CLOSED'
      ) {
        // Fallback silently: do not crash, do not show error to visitor
        entry!.isSubscribed = false
        if (process.env.NODE_ENV === 'development') {
          console.debug(`[Realtime] Channel status for ${slug}: ${status}`, err || '')
        }
      }
    })
  }

  // Cancel any pending cleanup (e.g. during React StrictMode remount)
  if (entry.cleanupTimer) {
    clearTimeout(entry.cleanupTimer)
    entry.cleanupTimer = null
  }

  entry.refCount++

  if (options.onCommentChange) {
    entry.commentListeners.add(options.onCommentChange)
  }
  if (options.onMetricsChange) {
    entry.metricsListeners.add(options.onMetricsChange)
  }
  if (options.onPresenceSync) {
    entry.presenceListeners.add(options.onPresenceSync)
    // If channel is already subscribed, trigger initial presence state
    if (entry.isSubscribed) {
      options.onPresenceSync(entry.channel.presenceState())
    }
  }

  // If presence tracking requested and channel is already subscribed
  if (options.presenceUser && entry.isSubscribed) {
    entry.channel.track({ user: options.presenceUser }).catch(() => {})
  }

  // Return unsubscribe cleanup function
  return () => {
    const currentEntry = channelRegistry.get(slug)
    if (!currentEntry) return

    if (options.onCommentChange) {
      currentEntry.commentListeners.delete(options.onCommentChange)
    }
    if (options.onMetricsChange) {
      currentEntry.metricsListeners.delete(options.onMetricsChange)
    }
    if (options.onPresenceSync) {
      currentEntry.presenceListeners.delete(options.onPresenceSync)
    }

    currentEntry.refCount--

    // If no more components are using this slug channel, schedule teardown
    if (currentEntry.refCount <= 0) {
      currentEntry.cleanupTimer = setTimeout(() => {
        if (currentEntry.refCount <= 0) {
          try {
            currentEntry.channel.untrack().catch(() => {})
            supabase.removeChannel(currentEntry.channel)
          } catch (e) {
            console.warn('[Realtime] Error removing channel:', e)
          }
          channelRegistry.delete(slug)
        }
      }, 150)
    }
  }
}
