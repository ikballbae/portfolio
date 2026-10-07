'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function BlogHeader() {
    return (
        <header className="mb-6 sm:mb-8">
            {/* Back link */}
            <Link
                href="/"
                className="
                    inline-flex items-center gap-2 text-sm font-medium text-text-muted hover:text-accent
                    transition-colors duration-200 mb-4 sm:mb-5 group
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent
                    focus-visible:ring-offset-2 focus-visible:ring-offset-bg rounded
                "
            >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1.5 transition-transform duration-200" strokeWidth={1.75} />
                <span>Kembali ke beranda</span>
            </Link>

            {/* Page title */}
            <div>
                <p className="text-[12px] sm:text-[13px] font-mono font-semibold text-accent tracking-widest uppercase mb-2">
                    Blog
                </p>
                <h1 className="font-syne font-extrabold text-3xl sm:text-4xl md:text-5xl leading-tight mb-3">
                    My <span className="text-accent">Journey</span>
                </h1>
                <p className="text-text-muted/90 text-sm sm:text-base max-w-[560px] leading-relaxed line-clamp-3 sm:line-clamp-none">
                    Dari ruang lomba LKS tanpa internet, panggung PKFest, hingga meja kerja content planner
                    — jurnal tentang teknologi, kreativitas, dan kepemimpinan.
                </p>
            </div>
        </header>
    )
}
