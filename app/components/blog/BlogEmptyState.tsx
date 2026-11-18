import { FileSearch, RotateCcw } from 'lucide-react'

interface BlogEmptyStateProps {
    query?: string
    category?: string
    onReset?: () => void
}

export default function BlogEmptyState({ query, category, onReset }: BlogEmptyStateProps) {
    const hasFilter = (category && category !== 'Semua') || query

    return (
        <div className="flex flex-col items-center justify-center py-16 sm:py-20 text-center bg-surface border border-text/10 rounded-xl sm:rounded-2xl my-6 px-4">
            <div className="w-12 h-12 rounded-xl bg-surface-light border border-text/10 flex items-center justify-center mb-4 text-text-muted">
                <FileSearch className="w-5 h-5 text-accent" strokeWidth={1.5} />
            </div>
            <h3 className="font-sans font-bold text-base sm:text-lg text-text mb-2">
                Tidak ada artikel ditemukan
            </h3>
            <p className="text-text-muted text-xs sm:text-sm max-w-sm mb-6 leading-relaxed">
                {hasFilter
                    ? 'Tidak ada artikel yang cocok dengan filter atau kata kunci pencarian ini.'
                    : 'Belum ada catatan untuk kategori ini.'}
            </p>
            {hasFilter && onReset && (
                <button
                    onClick={onReset}
                    type="button"
                    className="
                        inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium
                        bg-surface-light border border-text/15 text-text hover:border-accent hover:text-accent
                        transition-colors cursor-pointer
                    "
                >
                    <RotateCcw className="w-3.5 h-3.5" strokeWidth={1.5} />
                    <span>Reset filter</span>
                </button>
            )}
        </div>
    )
}
