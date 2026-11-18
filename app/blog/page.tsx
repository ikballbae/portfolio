'use client'

import { useState, useEffect, useRef, useMemo, useCallback, Suspense } from 'react'
import Link from 'next/link'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Navbar from '../components/Navbar'
import BlogHeader from '../components/blog/BlogHeader'
import FeaturedPost from '../components/blog/FeaturedPost'
import PostCard from '../components/blog/PostCard'
import CategoryFilter from '../components/blog/CategoryFilter'
import BlogEmptyState from '../components/blog/BlogEmptyState'
import { FeaturedSkeleton, PostCardSkeleton } from '../components/blog/PostCardSkeleton'
import { blogPosts } from '../data/blogData'

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger)
}

const POSTS_PER_PAGE = 6
const ALL_CATEGORIES = ['Semua', ...Array.from(new Set(blogPosts.map(p => p.category)))]

function BlogContent() {
    const [activeCategory, setActiveCategory] = useState('Semua')
    const [searchQuery, setSearchQuery] = useState('')
    const [visibleCount, setVisibleCount] = useState(POSTS_PER_PAGE)
    const [mounted, setMounted] = useState(false)

    const listRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        setMounted(true)
    }, [])

    // Category counts mapping
    const categoryCounts = useMemo(() => {
        const counts: Record<string, number> = {
            Semua: blogPosts.length,
        }
        blogPosts.forEach((post) => {
            counts[post.category] = (counts[post.category] || 0) + 1
        })
        return counts
    }, [])

    // Filter posts
    const filteredPosts = useMemo(() => {
        let posts = blogPosts

        if (activeCategory !== 'Semua') {
            posts = posts.filter(p => p.category === activeCategory)
        }

        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase()
            posts = posts.filter(p =>
                p.title.toLowerCase().includes(q) ||
                p.excerpt.toLowerCase().includes(q) ||
                p.tags.some(t => t.toLowerCase().includes(q))
            )
        }

        return posts
    }, [activeCategory, searchQuery])

    // Split into featured + rest
    const featuredPost = filteredPosts[0] || null
    const restPosts = filteredPosts.slice(1)
    const visiblePosts = restPosts.slice(0, visibleCount)
    const hasMore = visibleCount < restPosts.length

    // Reset visible count when filter changes
    useEffect(() => {
        setVisibleCount(POSTS_PER_PAGE)
    }, [activeCategory, searchQuery])

    // GSAP scroll animations
    useEffect(() => {
        if (!mounted || !listRef.current) return

        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        if (prefersReducedMotion) return

        const ctx = gsap.context(() => {
            const items = listRef.current?.querySelectorAll('[data-blog-item]')
            if (!items || items.length === 0) return

            gsap.fromTo(
                items,
                { opacity: 0, y: 16 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.45,
                    stagger: 0.08,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: listRef.current,
                        start: 'top 88%',
                        once: true,
                    },
                }
            )
        }, listRef)

        return () => {
            ctx.revert()
        }
    }, [mounted, filteredPosts, visiblePosts])

    const handleCategoryChange = useCallback((category: string) => {
        setActiveCategory(category)
    }, [])

    const handleSearchChange = useCallback((query: string) => {
        setSearchQuery(query)
    }, [])

    const handleResetFilters = useCallback(() => {
        setActiveCategory('Semua')
        setSearchQuery('')
    }, [])

    const handleLoadMore = () => {
        setVisibleCount(prev => prev + POSTS_PER_PAGE)
    }

    if (!mounted) {
        return (
            <>
                <Navbar />
                <main id="main-content" className="relative min-h-screen pt-20 sm:pt-24 md:pt-28 overflow-x-hidden w-full">
                    <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8 pb-16 sm:pb-24">
                        <BlogHeader />
                        <div className="mb-10">
                            <FeaturedSkeleton />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <PostCardSkeleton />
                            <PostCardSkeleton />
                        </div>
                    </div>
                </main>
            </>
        )
    }

    return (
        <>
            <Navbar />
            <main id="main-content" className="relative min-h-screen pt-20 sm:pt-24 md:pt-28 overflow-x-hidden w-full">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8 pb-16 sm:pb-24">
                    <BlogHeader />

                    <CategoryFilter
                        categories={ALL_CATEGORIES}
                        activeCategory={activeCategory}
                        searchQuery={searchQuery}
                        categoryCounts={categoryCounts}
                        totalFilteredCount={filteredPosts.length}
                        onCategoryChange={handleCategoryChange}
                        onSearchChange={handleSearchChange}
                    />

                    {filteredPosts.length === 0 ? (
                        <BlogEmptyState query={searchQuery} category={activeCategory} onReset={handleResetFilters} />
                    ) : (
                        <>
                            {/* Featured Post */}
                            {featuredPost && (
                                <FeaturedPost post={featuredPost} />
                            )}

                            {/* Daftar Tulisan Lanjutan (2 Kolom Teratur) */}
                            {visiblePosts.length > 0 && (
                                <div className="mt-12 sm:mt-16">
                                    <div className="flex items-center justify-between mb-6 pb-2 border-b border-[var(--card-border)]">
                                        <h2 className="text-base sm:text-lg font-bold text-text">
                                            Catatan & Tulisan Lainnya
                                        </h2>
                                        <span className="text-xs text-text-muted">
                                            {filteredPosts.length} total tulisan
                                        </span>
                                    </div>

                                    <div
                                        ref={listRef}
                                        className="grid grid-cols-1 md:grid-cols-2 gap-6"
                                    >
                                        {visiblePosts.map((post) => (
                                            <div key={post.slug} data-blog-item className="h-full">
                                                <PostCard post={post} />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Muat Lebih Banyak */}
                            {hasMore && (
                                <div className="flex justify-center mt-12">
                                    <button
                                        type="button"
                                        onClick={handleLoadMore}
                                        className="
                                            px-5 py-2.5 rounded-lg text-xs sm:text-sm font-medium
                                            bg-[var(--surface)] border border-[var(--card-border)] text-text hover:border-accent hover:text-accent
                                            transition-colors cursor-pointer
                                        "
                                    >
                                        Muat tulisan lainnya
                                    </button>
                                </div>
                            )}

                            {/* Alur Eksplorasi Bersih Terbuka */}
                            <div className="mt-16 sm:mt-24 p-6 sm:p-8 rounded-2xl bg-[var(--surface)] border border-[var(--card-border)] flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div>
                                    <h3 className="font-sans font-bold text-base sm:text-lg text-text mb-1">
                                        Lanjutkan Menjelajahi Portfolio
                                    </h3>
                                    <p className="text-xs sm:text-sm text-text-muted max-w-md leading-relaxed">
                                        Lihat implementasi sistem nyata, riwayat organisasi, dan sertifikat kompetisi.
                                    </p>
                                </div>
                                <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
                                    <Link
                                        href="/projects"
                                        className="px-4 py-2 text-xs font-medium rounded-lg bg-[var(--surface-light)] border border-[var(--card-border)] text-text hover:text-accent hover:border-accent transition-colors inline-flex items-center gap-1"
                                    >
                                        <span>Proyek</span>
                                        <span>↗</span>
                                    </Link>
                                    <Link
                                        href="/experience"
                                        className="px-4 py-2 text-xs font-medium rounded-lg bg-[var(--surface-light)] border border-[var(--card-border)] text-text hover:text-accent hover:border-accent transition-colors inline-flex items-center gap-1"
                                    >
                                        <span>Pengalaman</span>
                                        <span>↗</span>
                                    </Link>
                                    <Link
                                        href="/awards"
                                        className="px-4 py-2 text-xs font-medium rounded-lg bg-[var(--surface-light)] border border-[var(--card-border)] text-text hover:text-accent hover:border-accent transition-colors inline-flex items-center gap-1"
                                    >
                                        <span>Penghargaan</span>
                                        <span>↗</span>
                                    </Link>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </main>
        </>
    )
}

export default function BlogListPage() {
    return (
        <Suspense fallback={
            <>
                <Navbar />
                <main id="main-content" className="relative min-h-screen pt-20 sm:pt-24 md:pt-28 overflow-x-hidden w-full">
                    <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8 pb-16 sm:pb-24">
                        <BlogHeader />
                        <div className="mb-10">
                            <FeaturedSkeleton />
                        </div>
                    </div>
                </main>
            </>
        }>
            <BlogContent />
        </Suspense>
    )
}
