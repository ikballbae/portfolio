'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Crown, Trophy, Palette, Wrench, Briefcase, Clock, Calendar } from 'lucide-react'
import ShareButton from './ShareButton'

interface Post {
    slug: string
    title: string
    excerpt: string
    date: string
    readTime?: string
    category: string
    coverImage?: string
    tags: string[]
}

interface FeaturedPostProps {
    post: Post
}

const categoryConfig: Record<string, { label: string; color: string; bg: string; border: string; icon: React.ElementType }> = {
    LEADERSHIP: { label: 'Leadership', color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20', icon: Crown },
    ACHIEVEMENT: { label: 'Achievement', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', icon: Trophy },
    CREATIVE: { label: 'Creative', color: 'text-pink-400', bg: 'bg-pink-500/10', border: 'border-pink-500/20', icon: Palette },
    TECHNICAL: { label: 'Technical', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', icon: Wrench },
    EXPERIENCE: { label: 'Experience', color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20', icon: Briefcase },
}

function formatDateID(dateString: string) {
    return new Date(dateString).toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    })
}

export default function FeaturedPost({ post }: FeaturedPostProps) {
    const config = categoryConfig[post.category] || categoryConfig.TECHNICAL
    const IconComponent = config.icon

    return (
        <article className="group mb-8 sm:mb-12">
            <Link
                href={`/blog/${post.slug}`}
                className="
                    flex flex-col md:flex-row md:items-stretch md:max-h-[420px] rounded-xl overflow-hidden bg-surface
                    border border-[var(--card-border)]
                    transition-all duration-300 hover:border-accent/30 hover:-translate-y-1
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent
                    focus-visible:ring-offset-2 focus-visible:ring-offset-bg
                "
            >
                {/* Cover image (55-60% on desktop) */}
                {post.coverImage && (
                    <div className="relative w-full md:w-[55%] lg:w-[58%] shrink-0 aspect-[16/10] md:aspect-auto overflow-hidden">
                        <Image
                            src={post.coverImage}
                            alt={post.title}
                            fill
                            className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                            sizes="(max-width: 768px) 100vw, 600px"
                            priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[var(--surface)] via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-[var(--surface)] opacity-80 md:opacity-60" />

                        {/* Mobile category badge */}
                        <div className="absolute top-3 left-3 md:hidden">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-sm text-xs font-medium ${config.color}`}>
                                <IconComponent className="w-3.5 h-3.5" strokeWidth={1.5} />
                                {config.label}
                            </span>
                        </div>
                    </div>
                )}

                {/* Content */}
                <div className="flex-1 flex flex-col justify-between p-5 sm:p-6 md:p-7 lg:p-8">
                    <div>
                        {/* Featured label & Category Badge */}
                        <div className="flex items-center justify-between gap-2 mb-3">
                            <span className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-accent uppercase tracking-wider">
                                Featured
                            </span>
                            <span className={`hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border ${config.bg} ${config.color} ${config.border}`}>
                                <IconComponent className="w-3.5 h-3.5" strokeWidth={1.5} />
                                {config.label}
                            </span>
                        </div>

                        {/* Title */}
                        <h2 className="font-syne font-bold text-xl sm:text-2xl lg:text-3xl text-text leading-tight mb-2.5 group-hover:text-accent transition-colors duration-200 line-clamp-2">
                            {post.title}
                        </h2>

                        {/* Excerpt */}
                        <p className="text-text-muted text-xs sm:text-sm leading-relaxed mb-4 line-clamp-2 md:line-clamp-3">
                            {post.excerpt}
                        </p>
                    </div>

                    {/* Footer / Meta */}
                    <div>
                        <div className="flex flex-wrap items-center gap-3 text-text-muted/60 text-xs mb-4 pt-3 border-t border-[var(--card-border)]">
                            <span className="inline-flex items-center gap-1.5 font-mono">
                                <Calendar className="w-3.5 h-3.5" strokeWidth={1.5} />
                                <time dateTime={post.date}>{formatDateID(post.date)}</time>
                            </span>
                            <span className="text-text-muted/20">·</span>
                            <span className="inline-flex items-center gap-1.5 font-mono">
                                <Clock className="w-3.5 h-3.5" strokeWidth={1.5} />
                                {post.readTime}
                            </span>
                        </div>

                        {/* CTA */}
                        <div className="flex items-center justify-between">
                            <span className="
                                inline-flex items-center gap-2 text-xs sm:text-sm font-semibold
                                text-accent group-hover:gap-3 transition-all duration-200
                            ">
                                Baca selengkapnya
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" strokeWidth={2} />
                            </span>
                        </div>
                    </div>
                </div>
            </Link>

            {/* Share Menu */}
            <div className="flex justify-end mt-2 pr-1" onClick={(e) => e.stopPropagation()}>
                <ShareButton slug={post.slug} title={post.title} variant="featured" />
            </div>
        </article>
    )
}
