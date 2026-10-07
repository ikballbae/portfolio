export function FeaturedSkeleton() {
    return (
        <div className="rounded-xl overflow-hidden bg-surface border border-[var(--card-border)] animate-pulse">
            {/* Image skeleton */}
            <div className="w-full aspect-[21/9] bg-surface-light" />
            <div className="p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-20 h-5 rounded bg-surface-light" />
                    <div className="w-24 h-4 rounded bg-surface-light" />
                </div>
                <div className="w-3/4 h-7 rounded bg-surface-light mb-3" />
                <div className="w-full h-4 rounded bg-surface-light mb-2" />
                <div className="w-2/3 h-4 rounded bg-surface-light mb-6" />
                <div className="w-36 h-11 rounded-lg bg-surface-light" />
            </div>
        </div>
    )
}

export function PostCardSkeleton() {
    return (
        <div className="rounded-xl overflow-hidden bg-surface border border-[var(--card-border)] animate-pulse">
            <div className="w-full aspect-[16/10] bg-surface-light" />
            <div className="p-5">
                <div className="flex items-center gap-2 mb-3">
                    <div className="w-16 h-4 rounded bg-surface-light" />
                    <div className="w-20 h-4 rounded bg-surface-light" />
                </div>
                <div className="w-full h-5 rounded bg-surface-light mb-2" />
                <div className="w-3/4 h-5 rounded bg-surface-light mb-4" />
                <div className="w-full h-4 rounded bg-surface-light mb-2" />
                <div className="w-2/3 h-4 rounded bg-surface-light" />
            </div>
        </div>
    )
}
