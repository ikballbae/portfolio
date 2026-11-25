'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { supabase } from '../lib/supabase/client'
import { subscribeToBlogChannel, registerVisibilityCallback } from '../lib/supabase/realtime'
import { CommentType } from '../app/components/CommentItem'

export function useRealtimeComments(slug: string) {
  const [comments, setComments] = useState<CommentType[]>([])
  const [loading, setLoading] = useState(true)
  const [latestNewCommentId, setLatestNewCommentId] = useState<string | null>(null)

  // Fetch approved comments safely (only selecting safe non-sensitive columns)
  const fetchComments = useCallback(async () => {
    if (!slug) return
    try {
      const { data, error } = await supabase
        .from('comments')
        .select('id, author_name, content, created_at')
        .eq('article_slug', slug)
        .eq('status', 'approved')
        .order('created_at', { ascending: false })

      if (!error && data) {
        setComments(data as CommentType[])
      }
    } catch {
      // Quiet fallback
    } finally {
      setLoading(false)
    }
  }, [slug])

  // Initial fetch and visibility change handler
  useEffect(() => {
    fetchComments()

    // When tab becomes active again, refetch to sync any missed changes
    const unregisterVisibility = registerVisibilityCallback(() => {
      fetchComments()
    })

    return () => {
      unregisterVisibility()
    }
  }, [fetchComments])

  // Realtime subscription via unified channel
  useEffect(() => {
    if (!slug) return

    const handleCommentChange = async (payload: any) => {
      const eventType = payload.eventType

      if (eventType === 'INSERT' || eventType === 'UPDATE') {
        const commentId = payload.new?.id
        if (!commentId) return

        // CRITICAL SECURITY MEASURE:
        // Do NOT use payload contents directly because comments table contains sensitive columns
        // (ip_hash, moderation_reason). Fetch only safe columns if status is 'approved'.
        try {
          const { data, error } = await supabase
            .from('comments')
            .select('id, author_name, content, created_at')
            .eq('id', commentId)
            .eq('status', 'approved')
            .maybeSingle()

          if (!error && data) {
            const approvedComment = data as CommentType
            setComments((prev) => {
              // Deduplication by ID
              const existingIndex = prev.findIndex((c) => c.id === approvedComment.id)
              if (existingIndex !== -1) {
                // Update existing comment (e.g. edited content)
                const updated = [...prev]
                updated[existingIndex] = approvedComment
                return updated
              }
              // New comment inserted or newly approved: prepend
              setLatestNewCommentId(approvedComment.id)
              return [approvedComment, ...prev]
            })
          } else {
            // Comment is rejected, pending, or not found: ensure it is removed if in state
            setComments((prev) => prev.filter((c) => c.id !== commentId))
          }
        } catch {
          // Quiet fallback
        }
      } else if (eventType === 'DELETE') {
        const deletedId = payload.old?.id
        if (deletedId) {
          setComments((prev) => prev.filter((c) => c.id !== deletedId))
        }
      }
    }

    const unsubscribe = subscribeToBlogChannel(slug, {
      onCommentChange: handleCommentChange,
    })

    return () => {
      unsubscribe()
    }
  }, [slug])

  // Helper for optimistic comment insertion with deduplication
  const addOptimisticComment = useCallback((newComment: CommentType) => {
    setComments((prev) => {
      if (prev.some((c) => c.id === newComment.id)) {
        return prev
      }
      setLatestNewCommentId(newComment.id)
      return [newComment, ...prev]
    })
  }, [])

  return {
    comments,
    loading,
    commentCount: comments.length,
    setComments,
    addOptimisticComment,
    refetch: fetchComments,
    latestNewCommentId,
  }
}
