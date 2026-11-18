'use client'

import { useState, useEffect, useRef, useActionState } from 'react'
import { gsap } from 'gsap'
import { supabase } from '../../lib/supabase/client'
import CommentItem, { CommentType } from './CommentItem'
import { submitComment } from '../actions/comments'

export default function CommentSection({ slug }: { slug: string }) {
    const [comments, setComments] = useState<CommentType[]>([])
    const [loading, setLoading] = useState(true)
    const listRef = useRef<HTMLDivElement>(null)
    const formRef = useRef<HTMLFormElement>(null)

    // Setup action state using React 19 / Next 15 useActionState
    const [state, formAction, isPending] = useActionState(submitComment, null)

    useEffect(() => {
        // Fetch existing approved comments
        const fetchComments = async () => {
            const { data, error } = await supabase
                .from('comments')
                .select('id, author_name, content, created_at')
                .eq('article_slug', slug)
                .eq('status', 'approved')
                .order('created_at', { ascending: false })

            if (!error && data) {
                setComments(data)
            }
            setLoading(false)
        }

        fetchComments()

        // Listen for realtime updates from Supabase
        const subscription = supabase
            .channel(`public:comments:slug=${slug}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'comments',
                    filter: `article_slug=eq.${slug}`,
                },
                (payload) => {
                    // Only show if it's approved
                    if (payload.new.status === 'approved') {
                        setComments((prev) => {
                            // Cek duplikasi jika user itu sendiri yang submit dan sudah dirender via state lokal
                            if (prev.some(c => c.id === payload.new.id)) return prev;
                            return [payload.new as CommentType, ...prev]
                        })
                    }
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(subscription)
        }
    }, [slug])

    // GSAP animation for new comments
    useEffect(() => {
        if (!loading && listRef.current) {
            const elements = listRef.current.children
            if (elements.length > 0) {
                gsap.fromTo(
                    elements,
                    { opacity: 0, y: 20 },
                    { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out', clearProps: 'all' }
                )
            }
        }
    }, [loading]) // Only animate once on load. Realtime insertions can just pop in or we can add specific logic later.

    // Clear form on success
    useEffect(() => {
        if (state?.success) {
            formRef.current?.reset()
        }
    }, [state])

    return (
        <section className="mt-14 sm:mt-18 pt-8 border-t border-[var(--divider)]">
            <div className="flex items-center justify-between mb-6">
                <h3 className="font-sans font-semibold text-base sm:text-lg text-text">
                    Komentar <span className="text-text-muted text-sm font-normal">({loading ? '...' : comments.length})</span>
                </h3>
            </div>

            {/* Comment Form — Bersih, Humanis, Tanpa Glow Card */}
            <form ref={formRef} action={formAction} className="space-y-4 mb-10">
                <input type="hidden" name="article_slug" value={slug} />

                <div>
                    <label htmlFor="author_name" className="block text-xs text-text-muted font-medium mb-1.5">
                        Nama
                    </label>
                    <input
                        type="text"
                        id="author_name"
                        name="author_name"
                        required
                        minLength={2}
                        maxLength={50}
                        placeholder="Nama Anda"
                        className="w-full bg-surface border border-[var(--card-border)] rounded-lg px-3.5 py-2.5 text-sm text-text placeholder:text-text-muted/40 focus:outline-none focus:border-text/40 transition-colors"
                    />
                </div>

                <div>
                    <label htmlFor="content" className="block text-xs text-text-muted font-medium mb-1.5">
                        Tanggapan
                    </label>
                    <textarea
                        id="content"
                        name="content"
                        required
                        minLength={5}
                        maxLength={1000}
                        rows={3}
                        placeholder="Tulis tanggapan atau pertanyaan Anda..."
                        className="w-full bg-surface border border-[var(--card-border)] rounded-lg px-3.5 py-2.5 text-sm text-text placeholder:text-text-muted/40 focus:outline-none focus:border-text/40 transition-colors resize-y"
                    />
                </div>

                {state?.error && (
                    <div className="text-red-400 bg-red-400/10 border border-red-400/20 px-3.5 py-2.5 rounded-lg text-xs font-mono">
                        {state.error}
                    </div>
                )}

                {state?.success && (
                    <div className={`px-3.5 py-2.5 rounded-lg text-xs font-mono border ${state.status === 'pending' ? 'text-amber-400 bg-amber-400/10 border-amber-400/20' : 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20'}`}>
                        {state.message}
                    </div>
                )}

                <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-text-muted/50">
                        Komentar akan dimoderasi sebelum dipublikasikan.
                    </span>
                    <button
                        type="submit"
                        disabled={isPending}
                        className="px-4 py-2 bg-text text-bg hover:opacity-90 font-medium text-xs sm:text-sm rounded-lg transition-opacity cursor-pointer disabled:opacity-50"
                    >
                        {isPending ? 'Mengirim...' : 'Kirim Komentar'}
                    </button>
                </div>
            </form>

            {/* Comments List */}
            <div ref={listRef} className="space-y-1">
                {loading ? (
                    // Skeleton Loaders
                    Array.from({ length: 2 }).map((_, i) => (
                        <div key={i} className="py-4 border-b border-[var(--divider)] first:border-t flex items-start gap-3.5 animate-pulse">
                            <div className="w-8 h-8 rounded-full bg-surface-light border border-[var(--card-border)] shrink-0" />
                            <div className="flex-1 space-y-2 pt-1">
                                <div className="h-3.5 bg-surface-light rounded w-28" />
                                <div className="h-3 bg-surface-light rounded w-full" />
                            </div>
                        </div>
                    ))
                ) : comments.length > 0 ? (
                    comments.map(comment => (
                        <CommentItem key={comment.id} comment={comment} />
                    ))
                ) : (
                    // Empty State
                    <div className="py-8 text-center text-xs text-text-muted/60 border-t border-[var(--divider)]">
                        Belum ada komentar. Jadilah yang pertama memberikan tanggapan.
                    </div>
                )}
            </div>
        </section>
    )
}
