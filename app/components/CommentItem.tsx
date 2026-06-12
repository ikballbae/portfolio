import { useMemo } from 'react'

export type CommentType = {
    id: string
    author_name: string
    content: string
    created_at: string
}

export default function CommentItem({ comment }: { comment: CommentType }) {
    // Generate avatar color based on name
    const avatarColor = useMemo(() => {
        const colors = [
            'bg-blue-500/10 text-blue-500 border-blue-500/20',
            'bg-purple-500/10 text-purple-500 border-purple-500/20',
            'bg-pink-500/10 text-pink-500 border-pink-500/20',
            'bg-amber-500/10 text-amber-500 border-amber-500/20',
            'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
        ]
        let hash = 0
        for (let i = 0; i < comment.author_name.length; i++) {
            hash = comment.author_name.charCodeAt(i) + ((hash << 5) - hash)
        }
        return colors[Math.abs(hash) % colors.length]
    }, [comment.author_name])

    const initial = comment.author_name.charAt(0).toUpperCase()

    // Format date: e.g. "2 hours ago" or absolute date
    const formattedDate = useMemo(() => {
        const date = new Date(comment.created_at)
        const now = new Date()
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

        if (diffInSeconds < 60) return 'Just now'
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
        if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`
        
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    }, [comment.created_at])

    return (
        <div className="flex gap-4 p-4 sm:p-5 lab-card rounded-xl border border-text/5 hover:border-accent/20 transition-colors duration-300">
            {/* Avatar */}
            <div className={`w-10 h-10 sm:w-12 sm:h-12 shrink-0 rounded-full flex items-center justify-center border font-syne font-bold text-lg ${avatarColor}`}>
                {initial}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                    <h4 className="font-syne font-semibold text-text text-sm sm:text-base truncate">
                        {comment.author_name}
                    </h4>
                    <span className="w-1 h-1 rounded-full bg-text/20 shrink-0" />
                    <span className="text-text-muted text-xs font-mono shrink-0">
                        {formattedDate}
                    </span>
                </div>
                
                {/* 
                  Penting: Kita HANYA merender text biasa untuk mencegah XSS.
                  Tidak menggunakan dangerouslySetInnerHTML.
                */}
                <p className="text-text-muted text-sm sm:text-base leading-relaxed break-words whitespace-pre-wrap">
                    {comment.content}
                </p>
            </div>
        </div>
    )
}
