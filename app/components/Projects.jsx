'use client'
import { useEffect, useRef, useState, useCallback } from 'react'
import { gsap } from 'gsap'
import Image from 'next/image'
import ScrollReveal from './ScrollReveal'
import ScrambleText from './ScrambleText'
import { useTheme } from './ThemeProvider'
const projects = [
    {
        title: 'Ideo Coffee',
        description: 'Dibangun untuk mengatasi selisih rekap transaksi kasir dan stok bahan harian yang sebelumnya dihitung manual. Mengintegrasikan katalog pesanan online, gateway pembayaran Midtrans, dan pencatatan kasir otomatis.',
        role: '[ISI: solo / tim, bagian yang dikerjakan]',
        problem: 'Pengelola kedai kesulitan merekap transaksi harian karena pesanan kasir dan stok fisik dicatat manual di buku.',
        demoUrl: '', // [ISI: url demo Ideo Coffee]
        repoUrl: '', // [ISI: url repo Ideo Coffee]
        image: '/work-1.png',
        imageLight: '/work-1-light.png',
        alt: 'Tampilan antarmuka sistem e-commerce dan aplikasi kasir Ideo Coffee',
        tags: ['Laravel', 'MySQL', 'Midtrans', 'Tailwind'],
    },
    {
        title: 'Jinmoo Indonesia',
        description: 'Menyusun katalog digital perusahaan manufaktur garmen dengan struktur halaman ringan dan jalur navigasi produk yang ringkas. Menghubungkan calon mitra bisnis langsung ke saluran kontak resmi tanpa kendala antarmuka. [ISI: hasil Lighthouse atau metrik nyata]',
        role: '[ISI: solo / tim, bagian yang dikerjakan]',
        problem: 'Mitra bisnis kesulitan melihat katalog manufaktur terbaru karena sebelumnya hanya mengandalkan dokumen PDF yang dibagikan manual.',
        demoUrl: '', // [ISI: url demo Jinmoo Indonesia]
        repoUrl: '', // [ISI: url repo Jinmoo Indonesia]
        image: '/work-2.png',
        imageLight: '/work-2-light.png',
        alt: 'Tampilan website company profile dan katalog produk manufaktur Jinmoo Indonesia',
        tags: ['Laravel', 'MySQL', 'Tailwind'],
    },
    {
        title: 'Kupas.Co',
        description: 'Tantangan teknis utama terletak pada visualisasi pergerakan stok multi-komoditas agar tren penjualan mudah dibaca pengambil keputusan. Sistem berbasis CodeIgniter ini mengolah histori transaksi menjadi grafik analitik interaktif menggunakan Chart.js.',
        role: '[ISI: solo / tim, bagian yang dikerjakan]',
        problem: 'Distributor buah kesulitan memprediksi komoditas yang cepat busuk karena rekap penjualan mingguan masih tercecer di nota fisik.',
        demoUrl: '', // [ISI: url demo Kupas.Co]
        repoUrl: '', // [ISI: url repo Kupas.Co]
        image: '/work-3.png',
        imageLight: '/work-3-light.png',
        alt: 'Tampilan dashboard manajemen inventaris dan grafik penjualan Kupas.Co',
        tags: ['CodeIgniter', 'MySQL', 'Bootstrap', 'Chart.js'],
    },
    {
        title: 'BrandKu',
        description: 'Sistem manajemen konten sederhana berbasis Next.js dengan perenderan statis dan pembaca file Markdown lokal untuk penulisan cepat tanpa setup database rumit. Dilengkapi integrasi Gemini API untuk [ISI: fungsi Gemini API, misal: membantu menyusun draf outline tulisan].',
        role: '[ISI: solo / tim, bagian yang dikerjakan]',
        problem: 'Penulis konten membutuhkan alat penerbitan tulisan sederhana tanpa setup database rumit agar draf bisa langsung tayang dari file Markdown.',
        demoUrl: '', // [ISI: url demo BrandKu]
        repoUrl: '', // [ISI: url repo BrandKu]
        image: '/work-4.png',
        imageLight: '/work-4-light.png',
        alt: 'Tampilan antarmuka generator halaman markdown dan editor konten BrandKu',
        tags: ['Next.js', 'Gemini API', 'Tailwind'],
    },
]

function ProjectCard({ project, onSelect }) {
    const { theme } = useTheme()
    const isLight = theme === 'light'
    const ref = useRef(null)

    useEffect(() => {
        if (typeof window === 'undefined') return
        const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        if (prefersReduced) return

        const el = ref.current
        if (!el) return

        const handleMouse = (e) => {
            const rect = el.getBoundingClientRect()
            const xPos = (e.clientX - rect.left) / rect.width - 0.5
            const yPos = (e.clientY - rect.top) / rect.height - 0.5
            gsap.to(el, {
                rotateY: xPos * 8,
                rotateX: -yPos * 8,
                duration: 0.4,
                ease: 'power2.out',
            })
        }

        const handleLeave = () => {
            gsap.to(el, {
                rotateY: 0,
                rotateX: 0,
                duration: 0.5,
                ease: 'power2.out',
            })
        }

        el.addEventListener('mousemove', handleMouse)
        el.addEventListener('mouseleave', handleLeave)

        return () => {
            el.removeEventListener('mousemove', handleMouse)
            el.removeEventListener('mouseleave', handleLeave)
        }
    }, [])

    return (
        <div ref={ref} style={{ perspective: '1000px' }} className="h-full">
            <div
                className="lab-card rounded-xl overflow-hidden group h-full flex flex-col justify-between"
                style={{ transformStyle: 'preserve-3d' }}
            >
                <div>
                    <div
                        onClick={() => onSelect(project)}
                        className="relative overflow-hidden h-40 sm:h-48 md:h-52 bg-transparent cursor-pointer"
                    >
                        <Image
                            src={isLight ? (project.imageLight || project.image) : project.image}
                            alt={project.alt || `Tampilan antarmuka ${project.title}`}
                            fill
                            className={`transition-transform duration-700 group-hover:scale-105 ${
                                isLight ? 'object-contain p-2 sm:p-3' : 'object-cover'
                            }`}
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px"
                        />
                        {!isLight && (
                            <div
                                className="absolute inset-0 pointer-events-none"
                                style={{ background: 'linear-gradient(to top, var(--surface), transparent 60%)' }}
                            />
                        )}
                    </div>

                    <div className="p-4 sm:p-5">
                        <div className="flex flex-wrap gap-1.5 mb-2.5">
                            {project.tags.map((tag) => (
                                <span key={tag} className="text-[10px] font-mono text-accent/80 border border-accent/15 px-2 py-0.5 rounded-sm bg-accent/5">
                                    {tag}
                                </span>
                            ))}
                        </div>

                        <h3
                            onClick={() => onSelect(project)}
                            className="font-grotesk font-semibold text-base sm:text-lg text-text mb-2 group-hover:text-accent transition-colors duration-200 cursor-pointer"
                        >
                            {project.title}
                        </h3>

                        <p className="text-text-muted text-xs sm:text-sm leading-relaxed mb-4">
                            {project.description}
                        </p>

                        {/* Baris Informasi Peran & Masalah */}
                        <div className="space-y-1.5 pt-3 border-t border-text/10 text-xs text-text-muted">
                            <p className="leading-snug">
                                <span className="text-text font-medium">Peran saya:</span>{' '}
                                <span className="text-text/80">{project.role}</span>
                            </p>
                            <p className="leading-snug">
                                <span className="text-text font-medium">Masalah:</span>{' '}
                                <span className="text-text/80">{project.problem}</span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer Kartu: Tombol Aksi Langsung */}
                <div className="p-4 sm:p-5 pt-0 mt-auto flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                        {project.demoUrl && !project.demoUrl.startsWith('[ISI:') ? (
                            <a
                                href={project.demoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="h-7 px-2.5 text-xs font-semibold rounded-md bg-accent text-bg hover:bg-accent-dark transition-colors inline-flex items-center gap-1 select-none"
                            >
                                <span>Live Demo</span>
                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                            </a>
                        ) : (
                            <span
                                className="h-7 px-2.5 text-[11px] font-medium rounded-md border border-text/10 text-text-muted/60 opacity-60 cursor-not-allowed select-none inline-flex items-center"
                                title="Demo segera hadir"
                            >
                                Demo (Segera hadir)
                            </span>
                        )}

                        {project.repoUrl && !project.repoUrl.startsWith('[ISI:') ? (
                            <a
                                href={project.repoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="h-7 px-2.5 text-xs font-semibold rounded-md border border-text/20 text-text hover:text-accent hover:border-accent transition-colors inline-flex items-center gap-1 select-none"
                            >
                                <span>GitHub</span>
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                                </svg>
                            </a>
                        ) : (
                            <span
                                className="h-7 px-2.5 text-[11px] font-medium rounded-md border border-text/10 text-text-muted/60 opacity-60 cursor-not-allowed select-none inline-flex items-center"
                                title="Repository privat atau segera hadir"
                            >
                                Repo (Segera hadir)
                            </span>
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={() => onSelect(project)}
                        className="text-xs font-mono text-text-muted hover:text-accent transition-colors flex items-center gap-1 select-none"
                    >
                        Lihat Detail →
                    </button>
                </div>
            </div>
        </div>
    )
}

function ProjectModal({ project, onClose }) {
    const { theme } = useTheme()
    const isLight = theme === 'light'
    const backdropRef = useRef(null)
    const contentRef = useRef(null)

    useEffect(() => {
        if (!project) return

        document.body.style.overflow = 'hidden'

        const prefersReduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
        if (prefersReduced) {
            gsap.set([backdropRef.current, contentRef.current], { opacity: 1, scale: 1, y: 0 })
            return () => {
                document.body.style.overflow = ''
            }
        }

        const tl = gsap.timeline()
        tl.fromTo(backdropRef.current, { opacity: 0 }, { opacity: 1, duration: 0.25, ease: 'power2.out' })
        tl.fromTo(
            contentRef.current,
            { opacity: 0, scale: 0.94, y: 20 },
            { opacity: 1, scale: 1, y: 0, duration: 0.35, ease: 'power3.out' },
            '-=0.1'
        )

        return () => {
            document.body.style.overflow = ''
        }
    }, [project])

    useEffect(() => {
        const handleKey = (e) => {
            if (e.key === 'Escape') handleClose()
        }
        window.addEventListener('keydown', handleKey)
        return () => window.removeEventListener('keydown', handleKey)
    }, [])

    const handleClose = useCallback(() => {
        const prefersReduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
        if (prefersReduced) {
            onClose()
            return
        }

        const tl = gsap.timeline({
            onComplete: () => {
                onClose()
            },
        })
        tl.to(contentRef.current, { opacity: 0, scale: 0.95, y: 15, duration: 0.2, ease: 'power2.in' })
        tl.to(backdropRef.current, { opacity: 0, duration: 0.15, ease: 'power2.in' }, '-=0.1')
    }, [onClose])

    if (!project) return null

    return (
        <div
            ref={backdropRef}
            className="project-modal-backdrop"
            onClick={(e) => {
                if (e.target === backdropRef.current) handleClose()
            }}
        >
            <div ref={contentRef} className="project-modal-content max-w-2xl w-full mx-4 rounded-xl overflow-hidden bg-surface border border-text/10 shadow-2xl">
                {/* Close button */}
                <button
                    onClick={handleClose}
                    className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-surface-light/80 hover:bg-accent/20 text-text-muted hover:text-accent transition-all duration-200"
                    aria-label="Tutup modal"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* Image */}
                <div className="relative w-full h-48 sm:h-56 md:h-64 overflow-hidden bg-transparent">
                    <Image
                        src={isLight ? (project.imageLight || project.image) : project.image}
                        alt={project.alt || `Tampilan antarmuka ${project.title}`}
                        fill
                        className={isLight ? 'object-contain p-3' : 'object-cover'}
                        sizes="(max-width: 640px) 95vw, 650px"
                    />
                    {!isLight && (
                        <div
                            className="absolute inset-0 pointer-events-none"
                            style={{ background: 'linear-gradient(to top, var(--surface), transparent 60%)' }}
                        />
                    )}
                </div>

                {/* Content */}
                <div className="p-5 sm:p-6 md:p-8">
                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-3">
                        {project.tags.map((tag) => (
                            <span key={tag} className="text-[10px] font-mono text-accent border border-accent/20 px-2.5 py-0.5 rounded-sm bg-accent/5">
                                {tag}
                            </span>
                        ))}
                    </div>

                    {/* Title */}
                    <h3 className="font-grotesk font-bold text-xl sm:text-2xl text-text mb-3">
                        {project.title}
                    </h3>

                    {/* Description */}
                    <p className="text-text-muted text-sm sm:text-base leading-relaxed mb-5">
                        {project.description}
                    </p>

                    {/* Meta info */}
                    <div className="space-y-2 p-3.5 rounded-lg bg-surface-light/50 border border-text/5 text-xs text-text-muted mb-5">
                        <p>
                            <strong className="text-text font-medium">Peran saya:</strong>{' '}
                            <span className="text-text/85">{project.role}</span>
                        </p>
                        <p>
                            <strong className="text-text font-medium">Masalah:</strong>{' '}
                            <span className="text-text/85">{project.problem}</span>
                        </p>
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-text/10">
                        {project.demoUrl && !project.demoUrl.startsWith('[ISI:') ? (
                            <a
                                href={project.demoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="h-9 px-4 text-xs font-semibold rounded-lg bg-accent text-bg hover:bg-accent-dark transition-colors inline-flex items-center gap-1.5"
                            >
                                <span>Live Demo</span>
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                            </a>
                        ) : (
                            <span className="h-9 px-3 text-xs font-medium rounded-lg border border-text/10 text-text-muted/60 opacity-60 cursor-not-allowed inline-flex items-center">
                                Live Demo (Segera hadir)
                            </span>
                        )}

                        {project.repoUrl && !project.repoUrl.startsWith('[ISI:') ? (
                            <a
                                href={project.repoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="h-9 px-4 text-xs font-semibold rounded-lg border border-text/20 text-text hover:text-accent hover:border-accent transition-colors inline-flex items-center gap-1.5"
                            >
                                <span>GitHub Repository</span>
                                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                                </svg>
                            </a>
                        ) : (
                            <span className="h-9 px-3 text-xs font-medium rounded-lg border border-text/10 text-text-muted/60 opacity-60 cursor-not-allowed inline-flex items-center">
                                GitHub (Segera hadir)
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function Projects({ hideHeader = false }) {
    const [selectedProject, setSelectedProject] = useState(null)

    return (
        <section id="projects" className={`${hideHeader ? 'py-4 sm:py-6' : 'section-padding'} relative`}>
            <div className="max-w-6xl mx-auto">
                {!hideHeader && (
                    <>
                        <ScrollReveal>
                            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                                <span className="text-[10px] sm:text-xs font-mono text-accent tracking-wider">03</span>
                                <span className="w-8 sm:w-16 h-[1px] bg-accent/20" />
                                <span className="text-[10px] sm:text-xs font-mono text-text-muted tracking-wider uppercase">Projects / lab_output</span>
                            </div>
                        </ScrollReveal>

                        <ScrollReveal delay={0.1}>
                            <h2 className="font-syne font-bold text-xl sm:text-2xl md:text-3xl lg:text-4xl mb-3 sm:mb-4">
                                <ScrambleText text="Built & " delay={0.2} />
                                <span className="text-accent"><ScrambleText text="Shipped" delay={0.2} /></span>
                            </h2>
                            <p className="text-text-muted text-xs sm:text-sm max-w-md mb-8 sm:mb-12">
                                Systems that went from idea → research → prototype → production.
                            </p>
                        </ScrollReveal>
                    </>
                )}

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                    {projects.map((project, i) => (
                        <ScrollReveal key={project.title} delay={i * 0.1} direction="scale">
                            <ProjectCard project={project} onSelect={setSelectedProject} />
                        </ScrollReveal>
                    ))}
                </div>
            </div>

            <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
        </section>
    )
}
