'use client'

import { useState, useCallback } from 'react'
import { Share2, Link2, Check } from 'lucide-react'

interface ShareButtonProps {
    slug: string
    title: string
    variant?: 'default' | 'featured'
}

export default function ShareButton({ slug, title, variant = 'default' }: ShareButtonProps) {
    const [showToast, setShowToast] = useState(false)

    const getPostUrl = useCallback(() => {
        const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
        return `${baseUrl}/blog/${slug}`
    }, [slug])

    const handleShare = async (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()

        const postUrl = getPostUrl()

        // Try Web Share API first (mobile)
        if (typeof navigator !== 'undefined' && navigator.share) {
            try {
                await navigator.share({ title, url: postUrl })
                return
            } catch {
                // User cancelled or API unavailable, fall through to clipboard
            }
        }

        // Fallback: copy to clipboard
        try {
            await navigator.clipboard.writeText(postUrl)
        } catch {
            // Final fallback for older browsers
            const input = document.createElement('input')
            input.value = postUrl
            document.body.appendChild(input)
            input.select()
            document.execCommand('copy')
            document.body.removeChild(input)
        }

        setShowToast(true)
        setTimeout(() => setShowToast(false), 2000)
    }

    const isFeatured = variant === 'featured'

    return (
        <div className="relative">
            <button
                onClick={handleShare}
                aria-label="Bagikan artikel"
                className={`
                    inline-flex items-center gap-2 rounded-lg font-medium transition-all duration-200
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg
                    cursor-pointer active:scale-95
                    ${isFeatured
                        ? 'px-4 py-2.5 text-sm border border-[var(--card-border)] text-text-muted hover:text-accent hover:border-accent/30 bg-surface'
                        : 'px-3 py-2 text-xs border border-[var(--card-border)] text-text-muted hover:text-accent hover:border-accent/30'
                    }
                `}
            >
                <Share2 className="w-3.5 h-3.5" strokeWidth={1.5} />
                <span>Bagikan</span>
            </button>

            {/* Toast */}
            {showToast && (
                <div
                    role="status"
                    aria-live="polite"
                    className="
                        absolute bottom-full mb-2 left-1/2 -translate-x-1/2
                        flex items-center gap-1.5 px-3 py-2 rounded-lg
                        bg-accent text-bg text-xs font-medium whitespace-nowrap
                        animate-fade-up shadow-lg
                    "
                >
                    <Check className="w-3.5 h-3.5" strokeWidth={2} />
                    Tautan disalin
                </div>
            )}
        </div>
    )
}
