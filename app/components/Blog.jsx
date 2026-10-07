'use client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import ScrollReveal from './ScrollReveal'
import MagneticButton from './MagneticButton'
import ReactionBar from './ReactionBar'
import ShareMenu from './ShareMenu'
import ScrambleText from './ScrambleText'
import { blogPosts, formatDate } from '../data/blogData'

const categoryStyles = {
    LEADERSHIP: { label: 'Leadership', color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20', icon: '👑' },
    ACHIEVEMENT: { label: 'Achievement', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', icon: '🏆' },
    CREATIVE: { label: 'Creative', color: 'text-pink-400', bg: 'bg-pink-500/10', border: 'border-pink-500/20', icon: '🎨' },
    TECHNICAL: { label: 'Technical', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', icon: '⚙️' },
    EXPERIENCE: { label: 'Experience', color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20', icon: '💼' },
}

/* =========================================================
   DESKTOP BLOG CARD (Unchanged for md: and above)
   ========================================================= */
function DesktopBlogCard({ post, index }) {
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

/* =========================================================
   MOBILE FEATURED CARD (< 768px)
   ========================================================= */
function MobileFeaturedCard({ post }) {
    const hasCover = Boolean(post.coverImage)

    return (
        <ScrollReveal delay={0.15} direction="up" distance={24}>
            <Link
                href={`/blog/${post.slug}`}
                className="block group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-[20px] mb-6 active:scale-[0.98] transition-transform duration-200"
            >
                <article className="w-full rounded-[20px] overflow-hidden bg-[#101010] border border-white/8 shadow-2xl">
                    {/* 1. BAGIAN FOTO (atas) - Rasio 4:3 */}
                    <div className="relative w-full aspect-[4/3] overflow-hidden bg-surface">
                        {hasCover ? (
                            <Image
                                src={post.coverImage}
                                alt={post.title}
                                fill
                                className="object-cover object-[center_25%] transition-transform duration-700 ease-out group-hover:scale-105"
                                sizes="(max-width: 768px) calc(100vw - 40px), 450px"
                                priority
                            />
                        ) : (
                            <div className="absolute inset-0 bg-gradient-to-br from-surface-light via-surface to-bg flex items-center justify-center">
                                <span className="text-3xl font-syne font-bold text-white/20 uppercase tracking-wider">
                                    {post.category}
                                </span>
                            </div>
                        )}

                        {/* Gradasi tipis (transparan -> hitam 25%) hanya di 25% bagian bawah foto */}
                        <div className="absolute bottom-0 left-0 right-0 h-1/4 bg-gradient-to-t from-[#101010] to-transparent pointer-events-none" />

                        {/* Top Badges: Kategori (kiri) & Terbaru (kanan) */}
                        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                            <span className="px-[10px] py-[6px] rounded-full bg-black/55 backdrop-blur-md text-[11px] font-mono font-medium text-white uppercase tracking-wider border border-white/10">
                                {post.category}
                            </span>
                            <span className="px-[10px] py-[6px] rounded-full bg-accent text-black text-[11px] font-mono font-bold uppercase tracking-wider shrink-0 shadow-sm">
                                Terbaru
                            </span>
                        </div>
                    </div>

                    {/* 2. PANEL TEKS (bawah) - Latar #101010 */}
                    <div className="p-5 bg-[#101010] flex flex-col">
                        {/* Tanggal · Waktu baca (12px monospace, putih 60%) */}
                        <div className="text-xs font-mono text-white/60 mb-2 flex items-center gap-1.5">
                            <time dateTime={post.date}>{formatDate(post.date)}</time>
                            <span>·</span>
                            <span>{post.readTime}</span>
                        </div>

                        {/* Judul Penuh (20px, font-bold, line-height 1.25, text-wrap: balance, DILARANG ellipsis) */}
                        <h3 className="font-syne font-bold text-[20px] text-white leading-[1.25] mb-4 [text-wrap:balance] group-hover:text-accent transition-colors">
                            {post.title}
                        </h3>

                        {/* Baris bawah: Teks "Baca artikel" + Lingkaran panah 40px */}
                        <div className="flex items-center justify-between pt-2 border-t border-white/5">
                            <span className="text-[14px] text-white font-medium group-hover:text-accent transition-colors">
                                Baca artikel
                            </span>
                            <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white group-hover:border-accent group-hover:text-accent group-hover:bg-accent/10 transition-all">
                                <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </article>
            </Link>
        </ScrollReveal>
    )
}

/* =========================================================
   MOBILE COMPACT LIST ROW (< 768px)
   ========================================================= */
function MobileCompactListRow({ post, index }) {
    const hasCover = Boolean(post.coverImage)

    return (
        <ScrollReveal delay={index * 0.08} direction="up" distance={16}>
            <Link
                href={`/blog/${post.slug}`}
                className="block group active:scale-[0.98] transition-transform duration-200"
            >
                <article className="py-4 border-b border-white/8 flex items-center gap-4 min-h-[96px]">
                    {/* Left 88px square thumbnail */}
                    <div className="w-[88px] h-[88px] shrink-0 rounded-[12px] overflow-hidden relative bg-surface border border-white/10">
                        {hasCover ? (
                            <Image
                                src={post.coverImage}
                                alt={post.title}
                                fill
                                className="object-cover object-center"
                                sizes="88px"
                            />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-surface-light to-bg flex items-center justify-center">
                                <span className="text-xs font-mono font-bold text-white/30 uppercase">
                                    {post.category.substring(0, 3)}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Right details */}
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                        {/* Category (11px, uppercase, neutral gray) */}
                        <span className="text-[11px] font-mono text-text-muted/60 uppercase tracking-wider mb-1">
                            {post.category}
                        </span>

                        {/* Full Title (16px, font-semibold, NO ELLIPSIS!) */}
                        <h4 className="font-syne font-semibold text-[16px] text-text leading-snug mb-1 text-wrap: balance group-hover:text-accent transition-colors">
                            {post.title}
                        </h4>

                        {/* Date · Read Time (12px, gray) */}
                        <div className="text-xs font-mono text-text-muted/50 flex items-center gap-1.5">
                            <time dateTime={post.date}>{formatDate(post.date)}</time>
                            <span>·</span>
                            <span>{post.readTime}</span>
                        </div>
                    </div>
                </article>
            </Link>
        </ScrollReveal>
    )
}

/* =========================================================
   MAIN BLOG SECTION
   ========================================================= */
export default function Blog() {
    const latestPosts = blogPosts.slice(0, 3)
    const featuredPost = latestPosts[0]
    const otherPosts = latestPosts.slice(1)

    return (
        <section id="blog" className="section-padding relative overflow-x-hidden">
            {/* ==================== MOBILE VIEW (< 768px) ==================== */}
            <div className="block md:hidden max-w-4xl mx-auto px-5">
                {/* Header */}
                <ScrollReveal>
                    <div className="text-xs font-mono text-text-muted/60 tracking-wider uppercase mb-2">
                        04 — BLOG
                    </div>
                </ScrollReveal>

                <ScrollReveal delay={0.1}>
                    <div className="flex items-center justify-between mb-2">
                        <h2 className="font-syne font-bold text-[36px] text-text leading-tight">
                            My <span className="text-accent"><ScrambleText text="Journey" delay={0.2} /></span>
                        </h2>
                        <Link
                            href="/blog"
                            className="inline-flex items-center justify-center gap-1 text-accent font-semibold text-[14px] min-h-[44px] min-w-[44px] px-2 py-2 hover:underline shrink-0"
                        >
                            Semua →
                        </Link>
                    </div>
                    <p className="text-text-muted/80 text-xs sm:text-sm mb-6 max-w-[340px] leading-relaxed">
                        Cerita dari kompetisi, komunitas, dan kode.
                    </p>
                </ScrollReveal>

                {/* 1. Featured Article */}
                {featuredPost && (
                    <MobileFeaturedCard post={featuredPost} />
                )}

                {/* 2. Compact List for Other Articles */}
                {otherPosts.length > 0 && (
                    <div className="flex flex-col mb-4">
                        {otherPosts.map((post, i) => (
                            <MobileCompactListRow key={post.slug} post={post} index={i} />
                        ))}
                    </div>
                )}
            </div>

            {/* ==================== DESKTOP & TABLET VIEW (≥ 768px) ==================== */}
            <div className="hidden md:block max-w-4xl mx-auto">
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
                        <DesktopBlogCard key={post.slug} post={post} index={i} />
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
