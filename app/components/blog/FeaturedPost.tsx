'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

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

const categoryLabels: Record<string, string> = {
    LEADERSHIP: 'Kepemimpinan',
    ACHIEVEMENT: 'Penghargaan',
    CREATIVE: 'Kreatif & Desain',
    TECHNICAL: 'Teknis',
    EXPERIENCE: 'Pengalaman',
}

function formatDateID(dateString: string) {
    return new Date(dateString).toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    })
}

function getPortfolioCrossLink(slug: string, category: string) {
    if (slug.includes('ukm-pengembangan-komputer') || category === 'LEADERSHIP') {
        return { href: '/experience', label: 'Terkait: Kepemimpinan UKM PK di Pengalaman' }
    }
    if (slug.includes('jinmoo')) {
        return { href: '/projects', label: 'Terkait: Sistem Katalog Jinmoo di Proyek' }
    }
    if (slug.includes('poster') || slug.includes('lks') || category === 'ACHIEVEMENT') {
        return { href: '/awards', label: 'Terkait: Sertifikat Juara di Penghargaan' }
    }
    return null
}

export default function FeaturedPost({ post }: FeaturedPostProps) {
    const router = useRouter()
    const crossLink = getPortfolioCrossLink(post.slug, post.category)
    const categoryName = categoryLabels[post.category] || post.category

    const handleCardClick = () => {
        router.push(`/blog/${post.slug}`)
    }

    return (
        <article
            onClick={handleCardClick}
            className="mb-14 sm:mb-16 rounded-2xl bg-[var(--surface)] border border-[var(--card-border)] overflow-hidden shadow-sm hover:border-text/25 transition-all cursor-pointer group"
        >
            <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
                {/* Cover image (5 cols on lg) */}
                {post.coverImage && (
                    <div className="relative lg:col-span-5 aspect-[16/10] lg:aspect-auto min-h-[220px] sm:min-h-[260px] lg:min-h-[320px] overflow-hidden bg-[var(--surface-light)]">
                        <Image
                            src={post.coverImage}
                            alt={post.title}
                            fill
                            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                            sizes="(max-width: 1024px) 100vw, 480px"
                            priority
                        />
                    </div>
                )}

                {/* Content Details (7 cols on lg) */}
                <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between">
                    <div>
                        {/* Meta: Tulisan Pilihan · Tanggal · Waktu Baca · Kategori */}
                        <div className="flex flex-wrap items-center gap-2 text-xs text-text-muted mb-3 font-normal">
                            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-accent/15 text-accent">
                                Tulisan Pilihan
                            </span>
                            <span className="text-text-muted/40">·</span>
                            <span>{formatDateID(post.date)}</span>
                            {post.readTime && (
                                <>
                                    <span className="text-text-muted/40">·</span>
                                    <span>{post.readTime}</span>
                                </>
                            )}
                            <span className="text-text-muted/40">·</span>
                            <span className="text-text-muted">{categoryName}</span>
                        </div>

                        {/* Title */}
                        <h2 className="font-sans font-bold text-xl sm:text-2xl lg:text-3xl text-text tracking-tight mb-3 group-hover:text-accent transition-colors duration-200">
                            <Link
                                href={`/blog/${post.slug}`}
                                onClick={(e) => e.stopPropagation()}
                            >
                                {post.title}
                            </Link>
                        </h2>

                        {/* Excerpt */}
                        <p className="text-xs sm:text-sm text-text-muted leading-relaxed mb-4">
                            {post.excerpt}
                        </p>

                        {/* Topics/Tags */}
                        {post.tags && post.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mb-5">
                                {post.tags.map((t) => (
                                    <span
                                        key={t}
                                        className="text-[11px] text-text-muted/80 px-2 py-0.5 rounded bg-text/[0.04] border border-text/5"
                                    >
                                        {t}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Bottom Actions */}
                    <div className="pt-4 border-t border-[var(--card-border)] flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
                        <span className="font-medium text-text group-hover:text-accent transition-colors inline-flex items-center gap-1.5 underline underline-offset-4">
                            <span>Baca selengkapnya</span>
                            <span>→</span>
                        </span>

                        {crossLink && (
                            <Link
                                href={crossLink.href}
                                onClick={(e) => e.stopPropagation()}
                                className="text-xs text-text-muted hover:text-accent transition-colors inline-flex items-center gap-1 relative z-10"
                            >
                                <span>{crossLink.label}</span>
                                <span>↗</span>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </article>
    )
}
