import { useMemo } from 'react'

export type CommentType = {
    id: string
    author_name: string
    content: string
    created_at: string
}

export default function CommentItem({ comment }: { comment: CommentType }) {
    const initial = comment.author_name ? comment.author_name.charAt(0).toUpperCase() : '?'

    // Format tanggal Indonesia yang natural
    const formattedDate = useMemo(() => {
        try {
            const date = new Date(comment.created_at)
            const now = new Date()
            const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

            if (diffInSeconds < 60) return 'Baru saja'
            if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m lalu`
            if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}j lalu`
            if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}h lalu`

            return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
        } catch {
            return ''
        }
    }, [comment.created_at])

    return (
        <div className="py-4 sm:py-5 border-b border-[var(--divider)] first:border-t flex items-start gap-3.5">
            {/* Minimalist Avatar */}
            <div className="w-8 h-8 rounded-full bg-surface-light border border-[var(--card-border)] flex items-center justify-center font-mono text-xs font-medium text-text-muted shrink-0">
                {initial}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2 mb-1">
                    <span className="font-sans font-semibold text-sm text-text">
                        {comment.author_name}
                    </span>
                    <span className="text-text-muted/30 text-xs select-none">·</span>
                    <time dateTime={comment.created_at} className="text-xs text-text-muted">
                        {formattedDate}
                    </time>
                </div>

                <p className="text-sm text-text-muted leading-relaxed break-words whitespace-pre-wrap">
                    {comment.content}
                </p>
            </div>
        </div>
    )
}
