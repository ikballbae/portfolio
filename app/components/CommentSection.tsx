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
            <div className="lab-card rounded-2xl p-6 sm:p-8 mb-12 border border-text/5 relative overflow-hidden group">
                {/* Subtle background glow effect on focus within form */}
                <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity duration-700 pointer-events-none" />
                
                <form ref={formRef} action={formAction} className="flex flex-col gap-5 relative z-10">
                    <input type="hidden" name="article_slug" value={slug} />
                    
                    <div className="flex flex-col gap-2">
                        <label htmlFor="author_name" className="text-xs sm:text-sm font-mono text-text-muted uppercase tracking-wider">Nama Anda <span className="text-accent">*</span></label>
                        <input
                            type="text"
                            id="author_name"
                            name="author_name"
                            required
                            minLength={2}
                            maxLength={50}
                            placeholder="John Doe"
                            className="w-full bg-surface-light hover:bg-surface border border-text/10 rounded-xl px-4 py-3 text-sm sm:text-base text-text placeholder:text-text-muted/60 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50 transition-all duration-300"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="content" className="text-xs sm:text-sm font-mono text-text-muted uppercase tracking-wider">Komentar <span className="text-accent">*</span></label>
                        <textarea
                            id="content"
                            name="content"
                            required
                            minLength={5}
                            maxLength={1000}
                            rows={4}
                            placeholder="Bagikan pendapat atau pertanyaan Anda..."
                            className="w-full bg-surface-light hover:bg-surface border border-text/10 rounded-xl px-4 py-3 text-sm sm:text-base text-text placeholder:text-text-muted/60 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50 transition-all duration-300 resize-y"
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

                    <div className="flex justify-end mt-4">
                        <button
                            type="submit"
                            disabled={isPending}
                            className="px-8 py-3 bg-text text-bg hover:bg-accent hover:text-bg font-grotesk font-bold text-sm rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transform active:scale-95"
                        >
                            {isPending ? 'Mengirim...' : 'Kirim Komentar'}
                        </button>
                    </div>
                    <p className="text-[10px] text-text-muted/40 mt-3 text-center font-mono flex items-center justify-center gap-1.5">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        Otomatis dimoderasi oleh sistem. Dilarang spam atau bahasa kasar.
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
