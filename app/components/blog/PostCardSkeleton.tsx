export function FeaturedSkeleton() {
    return (
        <div className="mb-14 sm:mb-16 rounded-2xl bg-[var(--surface)] border border-[var(--card-border)] overflow-hidden animate-pulse">
            <div className="grid grid-cols-1 lg:grid-cols-12">
                <div className="lg:col-span-5 min-h-[220px] sm:min-h-[260px] lg:min-h-[320px] bg-[var(--surface-light)]" />
                <div className="lg:col-span-7 p-6 sm:p-8 space-y-4">
                    <div className="w-40 h-4 rounded bg-[var(--surface-light)]" />
                    <div className="w-3/4 h-7 rounded bg-[var(--surface-light)]" />
                    <div className="w-full h-4 rounded bg-[var(--surface-light)]" />
                    <div className="w-2/3 h-4 rounded bg-[var(--surface-light)]" />
                    <div className="w-32 h-4 rounded bg-[var(--surface-light)] pt-4" />
                </div>
            </div>
        </div>
    )
}

export function PostCardSkeleton() {
    return (
        <div className="rounded-xl overflow-hidden bg-[var(--surface)] border border-[var(--card-border)] animate-pulse flex flex-col h-full">
            <div className="w-full aspect-[16/10] bg-[var(--surface-light)]" />
            <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                    <div className="w-36 h-4 rounded bg-[var(--surface-light)]" />
                    <div className="w-4/5 h-5 rounded bg-[var(--surface-light)]" />
                    <div className="w-full h-3.5 rounded bg-[var(--surface-light)]" />
                    <div className="w-3/5 h-3.5 rounded bg-[var(--surface-light)]" />
                </div>
                <div className="w-24 h-4 rounded bg-[var(--surface-light)] pt-3" />
            </div>
        </div>
    )
}
