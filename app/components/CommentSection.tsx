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
        <section className="mt-16 sm:mt-24 border-t border-text/10 pt-10 sm:pt-16">
            <div className="flex items-center gap-3 mb-8">
                <span className="text-2xl">💬</span>
                <h3 className="font-syne font-bold text-xl sm:text-2xl text-text">Discussion</h3>
                <span className="bg-accent/10 text-accent font-mono text-xs px-2 py-0.5 rounded-full ml-2">
                    {loading ? '...' : comments.length}
                </span>
            </div>

            {/* Comment Form */}
            <div className="lab-card rounded-xl p-5 sm:p-6 mb-10 border border-text/5">
                <form ref={formRef} action={formAction} className="flex flex-col gap-4">
                    <input type="hidden" name="article_slug" value={slug} />
                    
                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="author_name" className="text-sm font-mono text-text-muted">Nama Anda <span className="text-accent">*</span></label>
                        <input
                            type="text"
                            id="author_name"
                            name="author_name"
                            required
                            minLength={2}
                            maxLength={50}
                            placeholder="John Doe"
                            className="bg-bg/50 border border-text/10 rounded-lg px-4 py-2.5 text-sm sm:text-base text-text focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50 transition-all"
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="content" className="text-sm font-mono text-text-muted">Komentar <span className="text-accent">*</span></label>
                        <textarea
                            id="content"
                            name="content"
                            required
                            minLength={5}
                            maxLength={1000}
                            rows={3}
                            placeholder="Bagikan pendapat Anda tentang artikel ini..."
                            className="bg-bg/50 border border-text/10 rounded-lg px-4 py-3 text-sm sm:text-base text-text focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50 transition-all resize-y"
                        />
                    </div>

                    {state?.error && (
                        <div className="text-red-400 bg-red-400/10 border border-red-400/20 px-4 py-3 rounded-lg text-sm font-mono">
                            ⚠️ {state.error}
                        </div>
                    )}

                    {state?.success && (
                        <div className={`px-4 py-3 rounded-lg text-sm font-mono border ${state.status === 'pending' ? 'text-amber-400 bg-amber-400/10 border-amber-400/20' : 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20'}`}>
                            {state.status === 'pending' ? '⏳ ' : '✅ '} {state.message}
                        </div>
                    )}

                    <div className="flex justify-end mt-2">
                        <button
                            type="submit"
                            disabled={isPending}
                            className="px-6 py-2.5 bg-text text-bg hover:bg-accent font-grotesk font-semibold text-sm rounded-lg transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {isPending ? 'Mengirim...' : 'Kirim Komentar'}
                        </button>
                    </div>
                    <p className="text-[10px] text-text-muted/50 mt-1 text-center font-mono">
                        * Komentar akan dimoderasi secara otomatis. Dilarang spam atau bahasa kasar.
                    </p>
                </form>
            </div>

            {/* Comments List */}
            <div ref={listRef} className="flex flex-col gap-4">
                {loading ? (
                    // Skeleton Loaders
                    Array.from({ length: 2 }).map((_, i) => (
                        <div key={i} className="flex gap-4 p-5 lab-card rounded-xl border border-text/5 animate-pulse">
                            <div className="w-12 h-12 bg-text/5 rounded-full shrink-0" />
                            <div className="flex-1 space-y-3">
                                <div className="h-4 bg-text/5 rounded w-1/4" />
                                <div className="h-3 bg-text/5 rounded w-full" />
                                <div className="h-3 bg-text/5 rounded w-5/6" />
                            </div>
                        </div>
                    ))
                ) : comments.length > 0 ? (
                    comments.map(comment => (
                        <CommentItem key={comment.id} comment={comment} />
                    ))
                ) : (
                    // Empty State
                    <div className="text-center py-12 px-4 border border-dashed border-text/10 rounded-xl">
                        <div className="text-4xl mb-3 opacity-50">✨</div>
                        <h4 className="font-syne font-semibold text-text mb-2">Belum ada komentar</h4>
                        <p className="text-text-muted text-sm">Jadilah orang pertama yang memberikan komentar.</p>
                    </div>
                )}
            </div>
        </section>
    )
}
