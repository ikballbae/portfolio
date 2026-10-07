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
    LEADERSHIP: 'Leadership',
    ACHIEVEMENT: 'Achievement',
    CREATIVE: 'Creative',
    TECHNICAL: 'Technical',
    EXPERIENCE: 'Experience',
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

    // Sync URL → state on mount
    useEffect(() => {
        const cat = searchParams.get('kategori') || 'Semua'
        const q = searchParams.get('cari') || ''
        if (cat !== activeCategory) onCategoryChange(cat)
        if (q !== searchQuery) {
            setLocalSearch(q)
            onSearchChange(q)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // Keyboard shortcut '/' to focus search
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (
                e.key === '/' &&
                document.activeElement?.tagName !== 'INPUT' &&
                document.activeElement?.tagName !== 'TEXTAREA'
            ) {
                e.preventDefault()
                inputRef.current?.focus()
            }
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [])

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
        }, 350)
    }

    const clearSearch = () => {
        if (debounceRef.current) clearTimeout(debounceRef.current)
        setLocalSearch('')
        onSearchChange('')
        updateURL(activeCategory, '')
    }

    return (
        <div className="mb-6 sm:mb-8 pb-4 border-b border-[var(--card-border)]">
            <div className="flex flex-col-reverse md:flex-row md:items-center justify-between gap-4">
                {/* Category tabs */}
                <div
                    className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-hide max-w-full"
                    role="tablist"
                    aria-label="Filter kategori artikel"
                >
                    {categories.map((cat) => {
                        const isActive = cat === activeCategory
                        const label = categoryLabels[cat] || cat
                        const count = categoryCounts[cat] ?? 0
                        return (
                            <button
                                key={cat}
                                role="tab"
                                aria-selected={isActive}
                                onClick={() => handleCategoryClick(cat)}
                                className={`
                                    shrink-0 inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer
                                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg
                                    ${isActive
                                        ? 'bg-accent text-bg font-semibold shadow-sm shadow-accent/20'
                                        : 'text-text-muted hover:text-text hover:bg-surface-light border border-transparent'
                                    }
                                `}
                            >
                                <span>{label}</span>
                                <span className={`text-[11px] font-mono ${isActive ? 'opacity-80' : 'opacity-50'}`}>
                                    {count}
                                </span>
                            </button>
                        )
                    })}
                </div>

                {/* Search bar */}
                <div className="relative w-full md:w-[280px] lg:w-[320px] shrink-0">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted/50" strokeWidth={1.5} />
                    <input
                        ref={inputRef}
                        type="search"
                        value={localSearch}
                        onChange={(e) => handleSearchInput(e.target.value)}
                        placeholder="Cari artikel..."
                        aria-label="Cari artikel"
                        className="
                            w-full pl-9 pr-14 py-2 sm:py-2 rounded-lg text-xs sm:text-sm
                            bg-surface border border-[var(--card-border)]
                            text-text placeholder:text-text-muted/40
                            focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent/30
                            transition-all duration-200
                        "
                    />
                    <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
                        {localSearch ? (
                            <button
                                onClick={clearSearch}
                                aria-label="Hapus pencarian"
                                className="text-text-muted/50 hover:text-text p-1 transition-colors cursor-pointer"
                            >
                                <X className="w-3.5 h-3.5" strokeWidth={1.5} />
                            </button>
                        ) : (
                            <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono text-text-muted/40 bg-surface-light border border-[var(--card-border)] rounded">
                                /
                            </kbd>
                        )}
                    </div>
                </div>
            </div>

            {/* Results count indicator */}
            <div className="mt-3 flex items-center justify-between text-xs font-mono text-text-muted/60">
                <span>
                    Menampilkan {totalFilteredCount} artikel
                    {activeCategory !== 'Semua' && ` dalam ${categoryLabels[activeCategory] || activeCategory}`}
                    {searchQuery && ` untuk "${searchQuery}"`}
                </span>
            </div>
        </div>
    )
}
