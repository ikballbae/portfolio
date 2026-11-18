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

interface PostCardProps {
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
        return { href: '/experience', label: 'Pengalaman UKM PK' }
    }
    if (slug.includes('jinmoo')) {
        return { href: '/projects', label: 'Proyek Jinmoo' }
    }
    if (slug.includes('poster') || slug.includes('lks') || category === 'ACHIEVEMENT') {
        return { href: '/awards', label: 'Sertifikat di Penghargaan' }
    }
    return null
}

export default function PostCard({ post }: PostCardProps) {
    const router = useRouter()
    const crossLink = getPortfolioCrossLink(post.slug, post.category)
    const categoryName = categoryLabels[post.category] || post.category

    const handleCardClick = () => {
        router.push(`/blog/${post.slug}`)
    }

    return (
        <article
            onClick={handleCardClick}
            className="group h-full flex flex-col rounded-xl overflow-hidden bg-[var(--surface)] border border-[var(--card-border)] hover:border-text/30 transition-all duration-300 cursor-pointer"
        >
            {/* Thumbnail */}
            {post.coverImage && (
                <div className="relative w-full aspect-[16/10] overflow-hidden bg-[var(--surface-light)]">
                    <Image
                        src={post.coverImage}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 420px"
                    />
                </div>
            )}

            {/* Content Details */}
            <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                <div>
                    {/* Meta: Tanggal · Kategori */}
                    <div className="flex items-center gap-2 text-xs text-text-muted mb-2 font-normal">
                        <span>{formatDateID(post.date)}</span>
                        {post.readTime && (
                            <>
                                <span className="text-text-muted/40">·</span>
                                <span>{post.readTime}</span>
                            </>
                        )}
                        <span className="text-text-muted/40">·</span>
                        <span className="text-text-muted/90">{categoryName}</span>
                    </div>

                    {/* Title */}
                    <h3 className="font-sans font-bold text-base sm:text-lg text-text tracking-tight mb-2.5 group-hover:text-accent transition-colors duration-200 line-clamp-2">
                        <Link
                            href={`/blog/${post.slug}`}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {post.title}
                        </Link>
                    </h3>

                    {/* Excerpt */}
                    <p className="text-xs sm:text-sm text-text-muted leading-relaxed line-clamp-2 mb-4">
                        {post.excerpt}
                    </p>
                </div>

                {/* Footer Actions */}
                <div className="pt-3 border-t border-[var(--card-border)] flex items-center justify-between text-xs">
                    <span className="font-medium text-text group-hover:text-accent transition-colors inline-flex items-center gap-1 underline underline-offset-4">
                        <span>Baca selengkapnya</span>
                        <span>→</span>
                    </span>

                    {crossLink && (
                        <Link
                            href={crossLink.href}
                            onClick={(e) => e.stopPropagation()}
                            className="text-[11px] text-text-muted hover:text-accent transition-colors relative z-10"
                        >
                            {crossLink.label} ↗
                        </Link>
                    )}
                </div>
            </div>
        </article>
    )
}
