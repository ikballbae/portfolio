'use client'

import { useCallback, useState, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search, X } from 'lucide-react'

interface CategoryFilterProps {
    categories: string[]
    activeCategory: string
    searchQuery: string
    categoryCounts: Record<string, number>
    totalFilteredCount: number
    onCategoryChange: (category: string) => void
    onSearchChange: (query: string) => void
}

const categoryLabels: Record<string, string> = {
    Semua: 'Semua',
    LEADERSHIP: 'Kepemimpinan',
    ACHIEVEMENT: 'Penghargaan',
    CREATIVE: 'Kreatif & Desain',
    TECHNICAL: 'Teknis',
    EXPERIENCE: 'Pengalaman',
}

export default function CategoryFilter({
    categories,
    activeCategory,
    searchQuery,
    categoryCounts,
    totalFilteredCount,
    onCategoryChange,
    onSearchChange,
}: CategoryFilterProps) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [localSearch, setLocalSearch] = useState(searchQuery)
    const inputRef = useRef<HTMLInputElement>(null)
    const debounceRef = useRef<NodeJS.Timeout | null>(null)

    // Sync URL → state on mount & when searchParams change
    useEffect(() => {
        const cat = searchParams.get('kategori') || 'Semua'
        const q = searchParams.get('cari') || ''
        if (cat !== activeCategory) onCategoryChange(cat)
        if (q !== searchQuery) {
            setLocalSearch(q)
            onSearchChange(q)
        }
    }, [searchParams, activeCategory, searchQuery, onCategoryChange, onSearchChange])

    // Cleanup debounce timer on unmount
    useEffect(() => {
        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current)
        }
    }, [])

    const updateURL = useCallback(
        (category: string, search: string) => {
            const params = new URLSearchParams()
            if (category && category !== 'Semua') params.set('kategori', category)
            if (search) params.set('cari', search)
            const qs = params.toString()
            router.replace(`/blog${qs ? `?${qs}` : ''}`, { scroll: false })
        },
        [router]
    )

    const handleCategoryClick = (category: string) => {
        onCategoryChange(category)
        updateURL(category, localSearch)
    }

    const handleSearchInput = (value: string) => {
        setLocalSearch(value)
        if (debounceRef.current) clearTimeout(debounceRef.current)
        debounceRef.current = setTimeout(() => {
            onSearchChange(value)
            updateURL(activeCategory, value)
        }, 300)
    }

    const clearSearch = () => {
        setLocalSearch('')
        onSearchChange('')
        updateURL(activeCategory, '')
        inputRef.current?.focus()
    }

    return (
        <div className="mb-10 sm:mb-12 space-y-3">
            {/* Top row: Categories pills + Unified Search bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                {/* Clean Category Pills */}
                <nav className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-1" aria-label="Kategori Blog">
                    {categories.map((cat) => {
                        const count = categoryCounts[cat] || 0
                        const isActive = activeCategory === cat
                        const label = categoryLabels[cat] || cat

                        return (
                            <button
                                key={cat}
                                type="button"
                                onClick={() => handleCategoryClick(cat)}
                                className={`
                                    px-3.5 py-1.5 text-xs rounded-full transition-all whitespace-nowrap inline-flex items-center gap-1.5 cursor-pointer select-none
                                    ${isActive
                                        ? 'bg-accent text-bg font-semibold shadow-sm'
                                        : 'bg-[var(--surface)] text-text-muted hover:text-text border border-[var(--card-border)] hover:border-text/30'
                                    }
                                `}
                            >
                                <span>{label}</span>
                                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-medium ${isActive ? 'bg-black/20 text-bg' : 'text-text-muted/60'}`}>
                                    {count}
                                </span>
                            </button>
                        )
                    })}
                </nav>

                {/* Minimalist Dark-Themed Search Bar */}
                <div className="relative w-full sm:w-56 flex-shrink-0">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted/60 pointer-events-none" />
                    <input
                        ref={inputRef}
                        type="text"
                        value={localSearch}
                        onChange={(e) => handleSearchInput(e.target.value)}
                        placeholder="Cari artikel..."
                        className="
                            w-full pl-8 pr-8 py-1.5 text-xs rounded-full bg-[var(--surface)] border border-[var(--card-border)]
                            text-text placeholder:text-text-muted/50 focus:outline-none focus:border-accent
                            transition-colors
                        "
                    />
                    {localSearch && (
                        <button
                            type="button"
                            onClick={clearSearch}
                            aria-label="Hapus pencarian"
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text"
                        >
                            <X className="w-3.5 h-3.5" />
                        </button>
                    )}
                </div>
            </div>

            {/* Filter status active note */}
            {(activeCategory !== 'Semua' || searchQuery) && (
                <div className="flex items-center justify-between text-xs text-text-muted pt-1">
                    <span>
                        Menampilkan {totalFilteredCount} artikel
                        {activeCategory !== 'Semua' && ` dalam kategori ${categoryLabels[activeCategory] || activeCategory}`}
                        {searchQuery && ` untuk "${searchQuery}"`}
                    </span>
                    <button
                        type="button"
                        onClick={() => {
                            handleCategoryClick('Semua')
                            clearSearch()
                        }}
                        className="text-text hover:text-accent underline transition-colors"
                    >
                        Reset filter
                    </button>
                </div>
            )}
        </div>
    )
}
