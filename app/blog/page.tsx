'use client'

import { useState, useEffect, useRef, useMemo, useCallback, Suspense } from 'react'
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

gsap.registerPlugin(ScrollTrigger)

const POSTS_PER_PAGE = 6
const ALL_CATEGORIES = ['Semua', ...Array.from(new Set(blogPosts.map(p => p.category)))]

function BlogContent() {
    const [activeCategory, setActiveCategory] = useState('Semua')
    const [searchQuery, setSearchQuery] = useState('')
    const [visibleCount, setVisibleCount] = useState(POSTS_PER_PAGE)
    const [mounted, setMounted] = useState(false)

    const gridRef = useRef<HTMLDivElement>(null)
    const gsapCtxRef = useRef<gsap.Context | null>(null)

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
        if (!mounted || !gridRef.current) return

        // Respect prefers-reduced-motion
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        if (prefersReducedMotion) return

        const ctx = gsap.context(() => {
            const cards = gridRef.current?.querySelectorAll('[data-blog-card]')
            if (!cards || cards.length === 0) return

            gsap.fromTo(
                cards,
                {
                    opacity: 0,
                    y: 16,
                },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.5,
                    stagger: 0.08,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: gridRef.current,
                        start: 'top 85%',
                        once: true,
                    },
                }
            )
        }, gridRef)

        gsapCtxRef.current = ctx

        return () => {
            ctx.revert()
        }
    }, [mounted, filteredPosts])

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

    // Skeleton while mounting
    if (!mounted) {
        return (
            <>
                <Navbar />
                <main className="relative min-h-screen pt-20 sm:pt-24 md:pt-24 overflow-x-hidden w-full">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-12 lg:px-20 pb-16 sm:pb-20">
                        <BlogHeader />
                        <div className="mb-8">
                            <FeaturedSkeleton />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            <PostCardSkeleton />
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
            <main className="relative min-h-screen pt-20 sm:pt-24 md:pt-24 overflow-x-hidden w-full">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-12 lg:px-20 pb-16 sm:pb-20">
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
                            {/* Featured post */}
                            {featuredPost && (
                                <FeaturedPost post={featuredPost} />
                            )}

                            {/* Post grid */}
                            {visiblePosts.length > 0 && (
                                <>
                                    <div className="flex items-center gap-3 mb-6">
                                        <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-text-muted">
                                            Artikel lainnya
                                        </h2>
                                        <div className="flex-1 h-px bg-[var(--card-border)]" />
                                    </div>

                                    <div
                                        ref={gridRef}
                                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                                    >
                                        {visiblePosts.map((post) => (
                                            <div key={post.slug} data-blog-card>
                                                <PostCard post={post} />
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}

                            {/* Load more */}
                            {hasMore && (
                                <div className="flex justify-center mt-10">
                                    <button
                                        onClick={handleLoadMore}
                                        className="
                                            px-6 py-3 rounded-lg text-xs sm:text-sm font-semibold
                                            border border-[var(--card-border)] text-text-muted
                                            hover:border-accent/40 hover:text-accent
                                            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent
                                            focus-visible:ring-offset-2 focus-visible:ring-offset-bg
                                            transition-all duration-200 cursor-pointer
                                        "
                                    >
                                        Muat lebih banyak
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </main>
        </>
    )
}

// Wrap in Suspense because useSearchParams is used in CategoryFilter
export default function BlogListPage() {
    return (
        <Suspense fallback={
            <>
                <Navbar />
                <main className="relative min-h-screen pt-20 sm:pt-24 md:pt-24 overflow-x-hidden w-full">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-12 lg:px-20 pb-16 sm:pb-20">
                        <div className="mb-8">
                            <FeaturedSkeleton />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            <PostCardSkeleton />
                            <PostCardSkeleton />
                        </div>
                    </div>
                </main>
            </>
        }>
            <BlogContent />
        </Suspense>
    )
}
