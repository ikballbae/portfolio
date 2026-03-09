'use client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { blogPosts, formatDate } from '../data/blogData'
import Navbar from '../components/Navbar'
import ReactionBar from '../components/ReactionBar'
import ShareMenu from '../components/ShareMenu'

const categoryStyles = {
    LEADERSHIP: { color: 'text-purple-400', bg: 'bg-purple-400/5', border: 'border-purple-400/20', icon: '👑' },
    ACHIEVEMENT: { color: 'text-amber-400', bg: 'bg-amber-400/5', border: 'border-amber-400/20', icon: '🏆' },
    CREATIVE: { color: 'text-pink-400', bg: 'bg-pink-400/5', border: 'border-pink-400/20', icon: '🎨' },
    TECHNICAL: { color: 'text-blue-400', bg: 'bg-blue-400/5', border: 'border-blue-400/20', icon: '⚙️' },
    EXPERIENCE: { color: 'text-orange-400', bg: 'bg-orange-400/5', border: 'border-orange-400/20', icon: '💼' },
}

function BlogCard({ post, index }) {
    const router = useRouter()
    const style = categoryStyles[post.category] || categoryStyles.TECHNICAL

    const handleCardClick = () => {
        router.push(`/blog/${post.slug}`)
    }

    return (
        <div
            onClick={handleCardClick}
            className="block group cursor-pointer animate-fade-up"
            role="link"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && handleCardClick()}
            style={{ animationDelay: `${index * 0.08}s` }}
        >
            <article className="lab-card rounded-xl overflow-hidden transition-all duration-500 hover:border-accent/20 group-hover:-translate-y-1">
                <div className={`h-[2px] w-full bg-gradient-to-r from-transparent via-current to-transparent opacity-0 group-hover:opacity-60 transition-opacity duration-500 ${style.color}`} />

                {/* Cover Image Thumbnail */}
                {post.coverImage && (
                    <div className="relative w-full aspect-[21/9] overflow-hidden">
                        <Image
                            src={post.coverImage}
                            alt={post.title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                            sizes="(max-width: 768px) 100vw, 896px"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[var(--surface)] via-[var(--surface)]/20 to-transparent" />
                    </div>
                )}

                <div className="p-5 sm:p-6 md:p-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 sm:mb-5">
                        <div className="flex items-center gap-3">
                            <span className="text-xl sm:text-2xl">{style.icon}</span>
                            <span className={`text-[8px] sm:text-[9px] font-mono tracking-wider px-2 py-0.5 rounded-sm border ${style.color} ${style.bg} ${style.border}`}>
                                {post.category}
                            </span>
                        </div>
                        <div className="flex items-center gap-3 text-text-muted/40">
                            <span className="text-[9px] sm:text-[10px] font-mono">{formatDate(post.date)}</span>
                            <span className="text-[9px] text-accent/20">•</span>
                            <span className="text-[9px] sm:text-[10px] font-mono">{post.readTime}</span>
                        </div>
                    </div>

                    <h2 className="font-syne font-bold text-lg sm:text-xl md:text-2xl text-text mb-3 sm:mb-4 group-hover:text-accent transition-colors duration-300 leading-tight">
                        {post.title}
                    </h2>

                    <p className="text-text-muted text-sm sm:text-base leading-relaxed mb-5 sm:mb-6 max-w-2xl">
                        {post.excerpt}
                    </p>

                    <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-5 sm:mb-6">
                        {post.tags.map((tag) => (
                            <span key={tag} className="text-[9px] sm:text-[10px] font-mono text-accent/50 border border-accent/10 px-2.5 py-1 rounded-md bg-accent/[0.02]">
                                #{tag}
                            </span>
                        ))}
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 sm:pt-5 border-t border-accent/5">
                        <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
                            <ReactionBar slug={post.slug} initialReactions={post.reactions} size="sm" />
                            <ShareMenu slug={post.slug} title={post.title} />
                        </div>
                        <div className="flex items-center gap-2 text-text-muted group-hover:text-accent transition-colors duration-300 shrink-0">
                            <span className="text-[10px] sm:text-xs font-mono tracking-wider">READ_POST</span>
                            <svg className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </div>
                    </div>
                </div>
            </article>
        </div>
    )
}

export default function BlogListPage() {
    return (
        <>
            <Navbar />
            <main className="relative min-h-screen pt-24 sm:pt-28 md:pt-32">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-12 pb-16 sm:pb-20">
                    {/* Back link */}
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-text-muted hover:text-accent transition-colors duration-300 mb-8 sm:mb-10 group"
                    >
                        <svg className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                        </svg>
                        <span className="text-xs sm:text-sm font-mono">cd ~/home</span>
                    </Link>

                    {/* Page header */}
                    <div className="mb-10 sm:mb-14">
                        <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                            <span className="text-[10px] sm:text-xs font-mono text-accent tracking-wider">BLOG</span>
                            <span className="w-8 sm:w-16 h-[1px] bg-accent/20" />
                            <span className="text-[10px] sm:text-xs font-mono text-text-muted tracking-wider uppercase">journal / all_entries</span>
                        </div>

                        <h1 className="font-syne font-extrabold text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-3 sm:mb-4">
                            All <span className="text-accent">Posts</span>
                        </h1>
                        <p className="text-text-muted text-sm sm:text-base max-w-lg">
                            Stories, lessons, and reflections from my path in tech.
                        </p>
                    </div>

                    {/* Vertical stacked posts */}
                    <div className="space-y-5 sm:space-y-6">
                        {blogPosts.map((post, i) => (
                            <BlogCard key={post.slug} post={post} index={i} />
                        ))}
                    </div>
                </div>
            </main>
        </>
    )
}
