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
  presenceTrackersCount: number
  cleanupTimer: ReturnType<typeof setTimeout> | null
  isSubscribed: boolean
  hasTracked: boolean
}

// Generate anonymous, random unique ID for this browser tab instance
// NEVER contains user identity, name, email, IP, or session IDs
const TAB_ID =
  typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID()
    : 'tab_' + Math.random().toString(36).slice(2) + Date.now().toString(36)

// Map per slug to ensure only ONE channel is created per page/slug
const channelRegistry = new Map<string, ChannelEntry>()

// Set of visibility callbacks to trigger refetch when document becomes visible
const visibilityCallbacks = new Set<() => void>()

if (typeof window !== 'undefined') {
  document.addEventListener('visibilitychange', () => {
    const isVisible = document.visibilityState === 'visible'

    channelRegistry.forEach((entry) => {
      if (entry.presenceTrackersCount > 0 && entry.isSubscribed) {
        if (isVisible) {
          // Track tab presence when tab becomes active/visible
          entry.channel
            .track({ joined_at: Date.now() })
            .then(() => {
              entry.hasTracked = true
            })
            .catch(() => {})
        } else {
          // Untrack tab presence when tab is hidden/backgrounded
          if (entry.hasTracked) {
            entry.channel
              .untrack()
              .then(() => {
                entry.hasTracked = false
              })
              .catch(() => {})
          }
        }
      }
    })

    if (isVisible) {
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

export interface SubscribeOptions {
  onCommentChange?: PostgresChangeCallback
  onMetricsChange?: PostgresChangeCallback
  onPresenceSync?: PresenceCallback
  trackPresence?: boolean
}

/**
 * Subscribes a component to the unified blog channel for a given slug.
 * Guarantees:
 * 1. Exactly ONE WebSocket channel per slug (no duplicate connections)
 * 2. Supabase Realtime Presence with anonymous random tab key (crypto.randomUUID())
 * 3. Minimal payload { joined_at: ... } without user identity, email, or IP
 * 4. Automatic untrack when tab is hidden and re-track when visible
 * 5. Safe against React StrictMode double-mount churn (debounced teardown)
 * 6. Silent fallback on CHANNEL_ERROR, TIMED_OUT, CLOSED
 */
export function subscribeToBlogChannel(slug: string, options: SubscribeOptions) {
  if (!slug || typeof window === 'undefined') {
    return () => {}
  }

  let entry = channelRegistry.get(slug)

  if (!entry) {
    const channelName = `blog-page-${slug}`
    // Configure channel with random tab ID as presence key
    const channel = supabase.channel(channelName, {
      config: {
        presence: { key: TAB_ID },
      },
    })

    entry = {
      channel,
      refCount: 0,
      commentListeners: new Set(),
      metricsListeners: new Set(),
      presenceListeners: new Set(),
      presenceTrackersCount: 0,
      cleanupTimer: null,
      isSubscribed: false,
      hasTracked: false,
    }
    channelRegistry.set(slug, entry)

    // Setup postgres changes listeners before subscribe()
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
        // If presence tracking is active and document is currently visible, track tab
        if (entry!.presenceTrackersCount > 0 && document.visibilityState === 'visible') {
          try {
            await channel.track({ joined_at: Date.now() })
            entry!.hasTracked = true
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

  if (options.trackPresence) {
    entry.presenceTrackersCount++
    if (entry.isSubscribed && document.visibilityState === 'visible' && !entry.hasTracked) {
      entry.channel
        .track({ joined_at: Date.now() })
        .then(() => {
          entry!.hasTracked = true
        })
        .catch(() => {})
    }
  }

  if (options.onCommentChange) {
    entry.commentListeners.add(options.onCommentChange)
  }
  if (options.onMetricsChange) {
    entry.metricsListeners.add(options.onMetricsChange)
  }
  if (options.onPresenceSync) {
    entry.presenceListeners.add(options.onPresenceSync)
    // If channel is already subscribed, pass current state immediately
    if (entry.isSubscribed) {
      options.onPresenceSync(entry.channel.presenceState())
    }
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
    if (options.trackPresence) {
      currentEntry.presenceTrackersCount = Math.max(0, currentEntry.presenceTrackersCount - 1)
      if (currentEntry.presenceTrackersCount === 0 && currentEntry.hasTracked) {
        currentEntry.channel
          .untrack()
          .then(() => {
            currentEntry.hasTracked = false
          })
          .catch(() => {})
      }
    }

    currentEntry.refCount--

    // If no more components are using this slug channel, schedule teardown
    if (currentEntry.refCount <= 0) {
      currentEntry.cleanupTimer = setTimeout(() => {
        if (currentEntry.refCount <= 0) {
          try {
            if (currentEntry.hasTracked) {
              currentEntry.channel.untrack().catch(() => {})
              currentEntry.hasTracked = false
            }
            currentEntry.channel.unsubscribe()
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
