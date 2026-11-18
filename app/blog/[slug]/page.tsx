'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import Navbar from '../../components/Navbar'
import ReactionBar from '../../components/ReactionBar'
import ShareMenu from '../../components/ShareMenu'
import ArticleMetrics from '../../components/ArticleMetrics'
import CommentSection from '../../components/CommentSection'
import { getBlogPost, formatDate, getRelatedPosts } from '../../data/blogData'

const categoryLabels: Record<string, { label: string; code: string }> = {
    LEADERSHIP: { label: 'Kepemimpinan', code: 'LDR-01' },
    ACHIEVEMENT: { label: 'Penghargaan', code: 'ACH-02' },
    CREATIVE: { label: 'Kreatif & Desain', code: 'CRT-03' },
    TECHNICAL: { label: 'Teknis', code: 'TC-04' },
    EXPERIENCE: { label: 'Pengalaman', code: 'EXP-05' },
}

function getCrossPortfolioRecommendation(slug: string, category: string) {
    if (slug.includes('ukm-pengembangan-komputer') || category === 'LEADERSHIP') {
        return {
            title: 'Rekam Jejak Kepemimpinan Terkait',
            description: 'Dokumentasi kepengurusan UKM Pengembangan Komputer dan kepanitiaan tersedia di halaman Pengalaman.',
            href: '/experience',
            actionText: 'Buka Halaman Pengalaman',
        }
    }
    if (slug.includes('jinmoo')) {
        return {
            title: 'Sistem Web & Katalog Terkait',
            description: 'Sistem profil perusahaan dan katalog manufaktur digital Jinmoo Indonesia dapat ditinjau di halaman Proyek.',
            href: '/projects',
            actionText: 'Buka Halaman Proyek',
        }
    }
    if (slug.includes('poster') || slug.includes('lks') || category === 'ACHIEVEMENT') {
        return {
            title: 'Dokumentasi Piagam & Sertifikat',
            description: 'Verifikasi sertifikat juara LKS dan lomba desain grafis tercatat di arsip Penghargaan.',
            href: '/awards',
            actionText: 'Buka Halaman Penghargaan',
        }
    }
    return null
}

export default function BlogPostPage() {
    const params = useParams()
    const slug = typeof params.slug === 'string' ? params.slug : (Array.isArray(params.slug) ? params.slug[0] : '')
    const post = getBlogPost(slug)

    const [readingProgress, setReadingProgress] = useState(0)

    useEffect(() => {
        const updateProgress = () => {
            const currentScroll = window.scrollY
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
            if (scrollHeight > 0) {
                setReadingProgress(Math.min(100, Math.max(0, (currentScroll / scrollHeight) * 100)))
            }
        }
        window.addEventListener('scroll', updateProgress, { passive: true })
        return () => window.removeEventListener('scroll', updateProgress)
    }, [])

    if (!post) {
        return (
            <>
                <Navbar />
                <main className="relative min-h-screen pt-24 sm:pt-28 md:pt-32 flex items-center justify-center overflow-x-hidden w-full">
                    <div className="text-center px-4">
                        <div className="font-mono text-xs text-accent mb-2 tracking-widest">[ 404 // NOT_FOUND ]</div>
                        <h1 className="font-sans font-bold text-3xl sm:text-4xl text-text mb-3">
                            Artikel Tidak Ditemukan
                        </h1>
                        <p className="text-text-muted text-sm sm:text-base mb-6 max-w-md mx-auto">
                            Tulisan yang Anda cari mungkin telah dipindahkan atau belum dipublikasikan.
                        </p>
                        <Link
                            href="/blog"
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-surface-light border border-[var(--card-border)] text-text hover:text-accent hover:border-accent text-xs sm:text-sm font-mono transition-colors"
                        >
                            <span>← Index Blog</span>
                        </Link>
                    </div>
                </main>
            </>
        )
    }

    const categoryInfo = categoryLabels[post.category] || { label: post.category, code: 'LOG-00' }
    const crossRec = getCrossPortfolioRecommendation(post.slug, post.category)
    const relatedPosts = getRelatedPosts(post.slug, 2)

    return (
        <>
            {/* Reading Progress Bar (Fixed Top) */}
            <div className="fixed top-0 left-0 w-full h-[3px] z-[60] bg-transparent pointer-events-none">
                <div
                    className="h-full bg-[var(--accent)] transition-all duration-100 ease-out shadow-[0_0_8px_var(--accent)]"
                    style={{ width: `${readingProgress}%` }}
                />
            </div>

            <Navbar />

            <main id="main-content" className="relative min-h-screen pt-20 sm:pt-24 md:pt-28 overflow-x-hidden w-full">
                <article className="max-w-3xl mx-auto px-4 sm:px-6 md:px-8 pb-16 sm:pb-24">
                    {/* Navigasi Alami Kembali ke Blog */}
                    <div className="mb-6 sm:mb-8">
                        <Link
                            href="/blog"
                            className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-text-muted hover:text-accent transition-colors"
                        >
                            <span>←</span>
                            <span>Kembali ke Blog</span>
                        </Link>
                    </div>

                    {/* Post Header — Bersih, Humanis, Tanpa AI Gimmick */}
                    <header className="mb-8 sm:mb-10">
                        {/* Meta: Tanggal · Waktu Baca · Kategori */}
                        <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-text-muted mb-3 font-normal">
                            <time dateTime={post.date}>{formatDate(post.date)}</time>
                            {post.readTime && (
                                <>
                                    <span className="text-text-muted/40">·</span>
                                    <span>{post.readTime}</span>
                                </>
                            )}
                            <span className="text-text-muted/40">·</span>
                            <span className="text-text-muted/90">{categoryInfo.label}</span>
                        </div>

                        {/* Judul Utama */}
                        <h1 className="font-sans font-bold text-2xl sm:text-3xl md:text-4xl text-text tracking-tight leading-[1.3]">
                            {post.title}
                        </h1>
                    </header>

                    {/* Cover Image */}
                    {post.coverImage && (
                        <figure className="mb-8 sm:mb-10">
                            <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden bg-surface">
                                <Image
                                    src={post.coverImage}
                                    alt={post.coverCaption || post.title}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 100vw, 768px"
                                    priority
                                />
                            </div>
                            {post.coverCaption && (
                                <figcaption className="text-xs text-text-muted mt-2.5 text-center">
                                    {post.coverCaption}
                                </figcaption>
                            )}
                        </figure>
                    )}

                    {/* Post Content — Rendered as Editorial Prose */}
                    <div
                        className="prose-blog my-8 sm:my-10"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />

                    {/* Topik / Tag di Akhir Artikel */}
                    {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap items-center gap-2 mt-8 pt-6 border-t border-[var(--divider)] text-xs text-text-muted">
                            <span className="text-text-muted/50">Topik:</span>
                            {post.tags.map((tag: string) => (
                                <span key={tag} className="hover:text-text transition-colors">
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Tautan Silang Portofolio Terkait */}
                    {crossRec && (
                        <aside className="my-10 p-5 rounded-xl border border-[var(--card-border)] bg-surface">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="max-w-lg">
                                    <span className="text-[11px] font-mono text-accent uppercase tracking-wider block mb-1">
                                        Eksplorasi Terkait
                                    </span>
                                    <h4 className="font-sans font-semibold text-sm sm:text-base text-text mb-1">
                                        {crossRec.title}
                                    </h4>
                                    <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
                                        {crossRec.description}
                                    </p>
                                </div>
                                <Link
                                    href={crossRec.href}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--card-border)] hover:border-accent hover:text-accent text-text text-xs font-medium transition-colors shrink-0 self-start sm:self-center"
                                >
                                    <span>{crossRec.actionText}</span>
                                    <span>↗</span>
                                </Link>
                            </div>
                        </aside>
                    )}

                    {/* Catatan Penutup Penulis — Alami, Tanpa Kotak Berat, Tanpa Badge AI */}
                    <div className="mt-10 pt-6 border-t border-[var(--divider)]">
                        <p className="text-sm text-text-muted leading-relaxed">
                            Ditulis oleh <strong className="text-text font-medium">Akhmad Ikbal</strong> — Mahasiswa Teknik Informatika & Ketua Umum UKM Pengembangan Komputer (2025/2026). Catatan berkala seputar web engineering, arsitektur sistem, dan manajemen teknologi.
                        </p>
                    </div>

                    {/* Reaksi & Bagikan — Bar Horisontal Minimalis Terpadu */}
                    <div className="my-6 py-4 border-y border-[var(--divider)] flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-text-muted mr-1">Reaksi:</span>
                            <ReactionBar slug={post.slug} initialReactions={post.reactions as Record<string, number>} size="sm" />
                        </div>
                        <div className="flex items-center gap-3">
                            <ArticleMetrics slug={post.slug} readTime={post.readTime || ''} />
                            <span className="text-text-muted/30 select-none">·</span>
                            <ShareMenu slug={post.slug} title={post.title} />
                        </div>
                    </div>

                    {/* Komentar */}
                    <CommentSection slug={post.slug} />

                    {/* Tulisan Terkait Lainnya (Mencegah Dead-End) */}
                    {relatedPosts.length > 0 && (
                        <section className="mt-14 sm:mt-16 pt-8 border-t border-[var(--divider)]">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="font-mono text-xs uppercase tracking-wider text-text-muted flex items-center gap-2">
                                    <span className="text-accent">//</span> ARTIKEL TERKAIT
                                </h3>
                                <Link href="/blog" className="font-mono text-xs text-text-muted hover:text-accent transition-colors">
                                    Index Blog →
                                </Link>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                {relatedPosts.map((rPost) => (
                                    <Link
                                        key={rPost.slug}
                                        href={`/blog/${rPost.slug}`}
                                        className="group p-5 rounded-xl border border-[var(--card-border)] bg-[var(--surface)] hover:border-accent/40 transition-all flex flex-col justify-between"
                                    >
                                        <div>
                                            <div className="flex items-center gap-2 font-mono text-[10px] text-text-muted mb-2">
                                                <span>{formatDate(rPost.date)}</span>
                                                <span>·</span>
                                                <span className="text-accent/80">{rPost.readTime || '2 min'}</span>
                                            </div>
                                            <h4 className="font-grotesk font-semibold text-sm sm:text-base text-text group-hover:text-accent transition-colors line-clamp-2 mb-2 leading-snug">
                                                {rPost.title}
                                            </h4>
                                            <p className="text-xs text-text-muted line-clamp-2 leading-relaxed">
                                                {rPost.excerpt}
                                            </p>
                                        </div>
                                        <span className="text-xs font-mono text-accent mt-4 inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                                            <span>Baca log</span>
                                            <span>→</span>
                                        </span>
                                    </Link>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Navigasi Eksplorasi Cepat */}
                    <footer className="mt-12 pt-6 border-t border-[var(--divider)] flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
                        <Link
                            href="/blog"
                            className="text-text hover:text-accent transition-colors inline-flex items-center gap-1.5"
                        >
                            <span>←</span>
                            <span>INDEX BLOG</span>
                        </Link>
                        <div className="flex items-center gap-3 text-text-muted">
                            <Link href="/projects" className="hover:text-accent transition-colors">
                                PROYEK ↗
                            </Link>
                            <span className="text-text-muted/30">/</span>
                            <Link href="/experience" className="hover:text-accent transition-colors">
                                PENGALAMAN ↗
                            </Link>
                            <span className="text-text-muted/30">/</span>
                            <Link href="/awards" className="hover:text-accent transition-colors">
                                PENGHARGAAN ↗
                            </Link>
                        </div>
                    </footer>
                </article>
            </main>
        </>
    )
}
