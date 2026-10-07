import { FileSearch, RotateCcw } from 'lucide-react'

interface BlogEmptyStateProps {
    query?: string
    category?: string
    onReset?: () => void
}

export default function BlogEmptyState({ query, category, onReset }: BlogEmptyStateProps) {
    const hasFilter = (category && category !== 'Semua') || query

    return (
        <div className="flex flex-col items-center justify-center py-16 sm:py-24 text-center bg-surface/50 border border-[var(--card-border)] rounded-xl my-6">
            <div className="w-12 h-12 rounded-xl bg-surface-light border border-[var(--card-border)] flex items-center justify-center mb-4">
                <FileSearch className="w-6 h-6 text-accent" strokeWidth={1.5} />
            </div>
            <h3 className="font-syne font-semibold text-lg text-text mb-2">
                Tidak ada artikel ditemukan
            </h3>
            <p className="text-text-muted text-xs sm:text-sm max-w-sm mb-6 leading-relaxed">
                {hasFilter
                    ? 'Tidak ada artikel yang cocok dengan filter atau kata pencarian ini.'
                    : 'Artikel sedang disiapkan. Nantikan cerita-cerita baru segera.'}
            </p>
            {hasFilter && onReset && (
                <button
                    onClick={onReset}
                    className="
                        inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium
                        bg-accent text-bg hover:bg-accent-dark
                        transition-colors duration-200 cursor-pointer
                    "
                >
                    <RotateCcw className="w-3.5 h-3.5" strokeWidth={2} />
                    Reset Filter
                </button>
            )}
        </div>
    )
}
