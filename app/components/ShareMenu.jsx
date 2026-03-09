'use client'
import { useState, useRef, useEffect } from 'react'

export default function ShareMenu({ slug, title }) {
    const [isOpen, setIsOpen] = useState(false)
    const [copied, setCopied] = useState(false)
    const menuRef = useRef(null)

    const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
    const postUrl = `${baseUrl}/blog/${slug}`
    const encodedUrl = encodeURIComponent(postUrl)
    const encodedTitle = encodeURIComponent(title)

    // Close menu on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setIsOpen(false)
            }
        }
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside)
        }
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [isOpen])

    const handleCopyLink = async (e) => {
        e.preventDefault()
        e.stopPropagation()
        try {
            await navigator.clipboard.writeText(postUrl)
            setCopied(true)
            setTimeout(() => {
                setCopied(false)
                setIsOpen(false)
            }, 1500)
        } catch {
            // Fallback
            const input = document.createElement('input')
            input.value = postUrl
            document.body.appendChild(input)
            input.select()
            document.execCommand('copy')
            document.body.removeChild(input)
            setCopied(true)
            setTimeout(() => {
                setCopied(false)
                setIsOpen(false)
            }, 1500)
        }
    }

    const handleNativeShare = async (e) => {
        e.preventDefault()
        e.stopPropagation()
        if (navigator.share) {
            try {
                await navigator.share({ title, url: postUrl })
                setIsOpen(false)
            } catch { }
        }
    }

    const shareLinks = [
        {
            label: 'Twitter / X',
            icon: (
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
            ),
            href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
        },
        {
            label: 'LinkedIn',
            icon: (
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
            ),
            href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
        },
        {
            label: 'WhatsApp',
            icon: (
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
            ),
            href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
        },
    ]

    const toggleMenu = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setIsOpen(!isOpen)
    }

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={toggleMenu}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg font-mono text-[10px] sm:text-xs tracking-wider transition-all duration-300 border cursor-pointer ${isOpen
                        ? 'bg-accent/10 border-accent/30 text-accent'
                        : 'bg-surface border-accent/5 text-text-muted/60 hover:border-accent/20 hover:bg-accent/5 hover:text-text-muted'
                    }`}
            >
                <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                SHARE
            </button>

            {/* Dropdown menu */}
            {isOpen && (
                <div className="absolute bottom-full mb-2 right-0 sm:left-0 sm:right-auto z-50 w-48 lab-card rounded-xl border border-accent/10 shadow-xl shadow-black/20 overflow-hidden animate-fade-up">
                    <div className="p-1.5">
                        {/* Copy link */}
                        <button
                            onClick={handleCopyLink}
                            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-mono text-text-muted hover:bg-accent/5 hover:text-accent transition-all duration-200 cursor-pointer"
                        >
                            {copied ? (
                                <>
                                    <svg className="w-3.5 h-3.5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="text-green-400">Copied!</span>
                                </>
                            ) : (
                                <>
                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                    </svg>
                                    Copy Link
                                </>
                            )}
                        </button>

                        <div className="h-[1px] bg-accent/5 mx-2 my-1" />

                        {/* Social links */}
                        {shareLinks.map((link) => (
                            <a
                                key={link.label}
                                href={link.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-mono text-text-muted hover:bg-accent/5 hover:text-accent transition-all duration-200"
                            >
                                {link.icon}
                                {link.label}
                            </a>
                        ))}

                        {/* Native share (mobile) */}
                        {typeof navigator !== 'undefined' && navigator.share && (
                            <>
                                <div className="h-[1px] bg-accent/5 mx-2 my-1" />
                                <button
                                    onClick={handleNativeShare}
                                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-mono text-text-muted hover:bg-accent/5 hover:text-accent transition-all duration-200 cursor-pointer"
                                >
                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                    </svg>
                                    More Options...
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
