'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import Navbar from '../../components/Navbar'
import ReactionBar from '../../components/ReactionBar'
import ShareMenu from '../../components/ShareMenu'
import ArticleMetrics from '../../components/ArticleMetrics'
import CommentSection from '../../components/CommentSection'
import { getBlogPost, formatDate } from '../../data/blogData'

const categoryStyles: Record<string, { color: string, bg: string, border: string, icon: string }> = {
    LEADERSHIP: { color: 'text-purple-400', bg: 'bg-purple-400/5', border: 'border-purple-400/20', icon: '👑' },
    ACHIEVEMENT: { color: 'text-amber-400', bg: 'bg-amber-400/5', border: 'border-amber-400/20', icon: '🏆' },
    CREATIVE: { color: 'text-pink-400', bg: 'bg-pink-400/5', border: 'border-pink-400/20', icon: '🎨' },
    TECHNICAL: { color: 'text-blue-400', bg: 'bg-blue-400/5', border: 'border-blue-400/20', icon: '⚙️' },
    EXPERIENCE: { color: 'text-orange-400', bg: 'bg-orange-400/5', border: 'border-orange-400/20', icon: '💼' },
}

export default function BlogPostPage() {
    const params = useParams()
    const slug = typeof params.slug === 'string' ? params.slug : (Array.isArray(params.slug) ? params.slug[0] : '')
    const post = getBlogPost(slug)

    if (!post) {
        return (
            <>
                <Navbar />
                <main className="relative min-h-screen pt-24 sm:pt-28 md:pt-32 flex items-center justify-center overflow-x-hidden w-full">
                    <div className="text-center">
                        <span className="font-mono text-accent text-6xl block mb-4">404</span>
                        <p className="text-text-muted font-mono text-sm mb-6">post_not_found</p>
                        <Link href="/blog" className="text-accent font-mono text-sm hover:underline">← back to blog</Link>
                    </div>
                </main>
            </>
        )
    }

    const style = categoryStyles[post.category] || categoryStyles.TECHNICAL

    return (
        <>
            <Navbar />
            <main className="relative min-h-screen pt-24 sm:pt-28 md:pt-32 overflow-x-hidden w-full">
                <article className="max-w-3xl mx-auto px-4 sm:px-6 md:px-12 pb-16 sm:pb-20">
                    {/* Back link */}
                    <Link
                        href="/blog"
                        className="inline-flex items-center gap-2 text-text-muted hover:text-accent transition-colors duration-300 mb-8 sm:mb-10 group"
                    >
                        <svg className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                        </svg>
                        <span className="text-xs sm:text-sm font-mono">cd ~/blog</span>
                    </Link>

                    {/* Post header */}
                    <header className="mb-8 sm:mb-12">
                        <div className="flex items-center gap-3 mb-5 sm:mb-6">
                            <span className="text-2xl sm:text-3xl">{style.icon}</span>
                            <span className={`text-[8px] sm:text-[9px] font-mono tracking-wider px-2 py-0.5 rounded-sm border ${style.color} ${style.bg} ${style.border}`}>
                                {post.category}
                            </span>
                        </div>

                        <h1 className="font-syne font-extrabold text-xl sm:text-2xl md:text-3xl lg:text-4xl leading-tight mb-5 sm:mb-6">
                            {post.title}
                        </h1>

                        <ArticleMetrics slug={post.slug} readTime={post.readTime || ''} />

                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-5">
                            <span className="text-xs sm:text-sm font-mono text-text-muted/60">
                                {formatDate(post.date)}
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                                {post.tags.map((tag: string) => (
                                    <span key={tag} className="text-[9px] sm:text-[10px] font-mono text-accent/50 border border-accent/10 px-2.5 py-1 rounded-md bg-accent/[0.02]">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="h-[1px] bg-gradient-to-r from-accent/20 via-accent/10 to-transparent" />
                    </header>

                    {/* Cover Image */}
                    {post.coverImage && (
                        <figure className="mb-8 sm:mb-10">
                            <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden group">
                                <Image
                                    src={post.coverImage}
                                    alt={post.coverCaption || post.title}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    sizes="(max-width: 768px) 100vw, 768px"
                                    priority
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                                <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/10" />

                                {/* Caption overlay */}
                                {post.coverCaption && (
                                    <figcaption className="absolute bottom-0 left-0 right-0 px-4 sm:px-5 py-3 sm:py-4 backdrop-blur-md bg-black/30 border-t border-white/10">
                                        <div className="flex items-start gap-2.5">
                                            <svg className="w-3.5 h-3.5 text-white/50 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Z" />
                                            </svg>
                                            <span className="text-[11px] sm:text-xs text-white/70 leading-relaxed">
                                                {post.coverCaption}
                                            </span>
                                        </div>
                                    </figcaption>
                                )}
                            </div>
                        </figure>
                    )}

                    {/* Post content */}
                    <div
                        className="prose-blog"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />

                    {/* Reactions + Share section */}
                    <div className="mt-10 sm:mt-14 lab-card rounded-xl p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5">
                            <ReactionBar slug={post.slug} initialReactions={post.reactions as Record<string, number>} size="lg" />
                            <ShareMenu slug={post.slug} title={post.title} />
                        </div>
                    </div>

                    {/* Comments section */}
                    <CommentSection slug={post.slug} />

                    {/* Post footer */}
                    <footer className="mt-8 sm:mt-10 pt-6 border-t border-accent/10">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div>
                                <span className="text-[10px] sm:text-xs font-mono text-text-muted/40 block mb-1">Written by</span>
                                <span className="font-grotesk font-semibold text-sm text-text">Akhmad Ikbal</span>
                            </div>
                            <Link
                                href="/blog"
                                className="inline-flex items-center gap-2 px-5 py-2.5 border border-accent/15 text-text-muted font-grotesk font-medium text-xs sm:text-sm rounded-md hover:border-accent/40 hover:text-accent transition-all duration-300"
                            >
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                                </svg>
                                All Posts
                            </Link>
                        </div>
                    </footer>
                </article>
            </main>
        </>
    )
}
