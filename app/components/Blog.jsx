'use client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import ScrollReveal from './ScrollReveal'
import MagneticButton from './MagneticButton'
import ReactionBar from './ReactionBar'
import ShareMenu from './ShareMenu'
import ScrambleText from './ScrambleText'
import { blogPosts, formatDate } from '../data/blogData'

const categoryStyles = {
    LEADERSHIP: { color: 'text-purple-400', bg: 'bg-purple-400/5', border: 'border-purple-400/20', icon: '👑' },
    ACHIEVEMENT: { color: 'text-amber-400', bg: 'bg-amber-400/5', border: 'border-amber-400/20', icon: '🏆' },
    CREATIVE: { color: 'text-pink-400', bg: 'bg-pink-400/5', border: 'border-pink-400/20', icon: '🎨' },
    TECHNICAL: { color: 'text-blue-400', bg: 'bg-blue-400/5', border: 'border-blue-400/20', icon: '⚙️' },
}

function BlogCard({ post, index }) {
    const router = useRouter()
    const style = categoryStyles[post.category] || categoryStyles.TECHNICAL

    const handleCardClick = () => {
        router.push(`/blog/${post.slug}`)
    }

    return (
        <ScrollReveal delay={index * 0.15} direction="up">
            <div
                onClick={handleCardClick}
                className="block group cursor-pointer"
                role="link"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && handleCardClick()}
            >
                <article className="lab-card rounded-xl overflow-hidden transition-all duration-500 hover:border-accent/20 group-hover:-translate-y-1">
                    <div className={`h-[2px] w-full bg-gradient-to-r from-transparent via-current to-transparent opacity-0 group-hover:opacity-60 transition-opacity duration-500 ${style.color}`} />

                    <div className="p-5 sm:p-6 md:p-8">
                        {/* Header row */}
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

                        {/* Title */}
                        <h3 className="font-syne font-bold text-lg sm:text-xl md:text-2xl text-text mb-3 sm:mb-4 group-hover:text-accent transition-colors duration-300 leading-tight">
                            {post.title}
                        </h3>

                        {/* Excerpt */}
                        <p className="text-text-muted text-sm sm:text-base leading-relaxed mb-5 sm:mb-6 max-w-2xl">
                            {post.excerpt}
                        </p>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-5 sm:mb-6">
                            {post.tags.map((tag) => (
                                <span key={tag} className="text-[9px] sm:text-[10px] font-mono text-accent/50 border border-accent/10 px-2.5 py-1 rounded-md bg-accent/[0.02]">
                                    #{tag}
                                </span>
                            ))}
                        </div>

                        {/* Reactions + Share + Read more */}
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
        </ScrollReveal>
    )
}

export default function Blog() {
    const latestPosts = blogPosts.slice(0, 3)

    return (
        <section id="blog" className="section-padding relative">
            <div className="max-w-4xl mx-auto">
                <ScrollReveal>
                    <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                        <span className="text-[10px] sm:text-xs font-mono text-accent tracking-wider">04</span>
                        <span className="w-8 sm:w-16 h-[1px] bg-accent/20" />
                        <span className="text-[10px] sm:text-xs font-mono text-text-muted tracking-wider uppercase">Blog / journal_entries</span>
                    </div>
                </ScrollReveal>

                <ScrollReveal delay={0.1}>
                    <h2 className="font-syne font-bold text-xl sm:text-2xl md:text-3xl lg:text-4xl mb-3 sm:mb-4">
                        My <span className="text-accent"><ScrambleText text="Journey" delay={0.2} /></span>
                    </h2>
                    <p className="text-text-muted text-xs sm:text-sm max-w-lg mb-8 sm:mb-12">
                        Stories, lessons, and reflections from my path in tech — from competitions to leadership, from code to design.
                    </p>
                </ScrollReveal>

                {/* Vertical stacked blog cards */}
                <div className="space-y-5 sm:space-y-6">
                    {latestPosts.map((post, i) => (
                        <BlogCard key={post.slug} post={post} index={i} />
                    ))}
                </div>

                {/* View all CTA */}
                <ScrollReveal delay={0.5}>
                    <div className="mt-8 sm:mt-10 flex justify-center">
                        <MagneticButton>
                            <Link
                                href="/blog"
                                className="inline-flex items-center gap-2 sm:gap-3 px-6 sm:px-7 py-3 sm:py-3.5 border border-accent/15 text-text-muted font-grotesk font-medium text-xs sm:text-sm rounded-md hover:border-accent/40 hover:text-accent transition-all duration-300"
                            >
                                View All Posts
                                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </Link>
                        </MagneticButton>
                    </div>
                </ScrollReveal>
            </div>
        </section>
    )
}
