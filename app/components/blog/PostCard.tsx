'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Crown, Trophy, Palette, Wrench, Briefcase, Clock, Calendar } from 'lucide-react'

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

interface PostCardProps {
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

export default function PostCard({ post }: PostCardProps) {
    const config = categoryConfig[post.category] || categoryConfig.TECHNICAL
    const IconComponent = config.icon

    return (
        <article className="group h-full">
            <Link
                href={`/blog/${post.slug}`}
                className="
                    flex flex-col h-full rounded-xl overflow-hidden bg-surface
                    border border-[var(--card-border)]
                    transition-all duration-300 hover:border-accent/30 hover:-translate-y-1
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent
                    focus-visible:ring-offset-2 focus-visible:ring-offset-bg
                "
            >
                {/* Thumbnail */}
                {post.coverImage && (
                    <div className="relative w-full aspect-[16/10] overflow-hidden">
                        <Image
                            src={post.coverImage}
                            alt={post.title}
                            fill
                            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 380px"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[var(--surface)] via-transparent to-transparent opacity-60" />
                    </div>
                )}

                <div className="flex flex-col flex-1 p-4 sm:p-5">
                    {/* Category + meta */}
                    <div className="flex items-center justify-between gap-2 mb-2.5">
                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-medium border ${config.bg} ${config.color} ${config.border}`}>
                            <IconComponent className="w-3 h-3" strokeWidth={1.5} />
                            {config.label}
                        </span>
                        <div className="flex items-center gap-1.5 text-text-muted/50 text-[11px] font-mono">
                            <Clock className="w-3 h-3" strokeWidth={1.5} />
                            {post.readTime}
                        </div>
                    </div>

                    {/* Title */}
                    <h3 className="font-syne font-bold text-base text-text leading-snug mb-2 line-clamp-2 group-hover:text-accent transition-colors duration-200">
                        {post.title}
                    </h3>

                    {/* Excerpt — clamped to 2 lines */}
                    <p className="text-text-muted text-xs leading-relaxed mb-4 line-clamp-2 flex-1">
                        {post.excerpt}
                    </p>

                    {/* Footer */}
                    <div className="flex items-center justify-between mt-auto pt-3 border-t border-[var(--card-border)]">
                        <span className="flex items-center gap-1.5 text-[11px] font-mono text-text-muted/50">
                            <Calendar className="w-3 h-3" strokeWidth={1.5} />
                            <time dateTime={post.date}>{formatDateID(post.date)}</time>
                        </span>

                        {/* CTA */}
                        <span className="
                            inline-flex items-center gap-1.5 text-xs font-semibold
                            text-accent group-hover:gap-2.5
                            transition-all duration-200
                        ">
                            Baca
                            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-200" strokeWidth={2} />
                        </span>
                    </div>
                </div>
            </Link>
        </article>
    )
}
