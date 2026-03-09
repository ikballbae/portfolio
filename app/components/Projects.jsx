'use client'
import { useEffect, useRef, useState, useCallback } from 'react'
import { gsap } from 'gsap'
import Image from 'next/image'
import ScrollReveal from './ScrollReveal'
import ScrambleText from './ScrambleText'

const projects = [
    {
        title: 'Ideo Coffee',
        description: 'Sistem e-commerce kopi premium dengan manajemen inventaris real-time. Mengintegrasikan alur pemesanan yang mulus dan sistem pembayaran digital untuk operasional cafe yang modern.',
        image: '/work-1.png',
        tags: ['Laravel', 'MySQL', 'Midtrans', 'Tailwind'],
    },
    {
        title: 'Jinmoo Indonesia',
        description: 'Digital presence untuk brand manufaktur. Fokus pada performa core web vitals dan SEO engine, menghasilkan interface yang responsif dengan load time di bawah 1 detik.',
        image: '/work-2.png',
        tags: ['Laravel', 'MySQL', 'Tailwind'],
    },
    {
        title: 'Kupas.Co',
        description: 'Sistem manajemen suplai buah berbasis web. Dilengkapi dengan dashboard analitik Chart.js untuk memantau tren penjualan dan efisiensi stok secara periodik.',
        image: '/work-3.png',
        tags: ['CodeIgniter', 'MySQL', 'Bootstrap', 'Chart.js'],
    },
    {
        title: 'BrandKu',
        description: 'Eksperimen Headless CMS kustom untuk fleksibilitas konten. Riset mendalam pada teknik markdown parsing dan optimasi static site generation untuk kecepatan maksimal.',
        image: '/work-4.png',
        tags: ['Next.JS', 'Gemini API', 'Tailwind'],
    },
]

function ProjectCard({ project, onSelect }) {
    const ref = useRef(null)

    useEffect(() => {
        const el = ref.current
        if (!el) return

        const handleMouse = (e) => {
            const rect = el.getBoundingClientRect()
            const xPos = (e.clientX - rect.left) / rect.width - 0.5
            const yPos = (e.clientY - rect.top) / rect.height - 0.5
            gsap.to(el, {
                rotateY: xPos * 10,
                rotateX: -yPos * 10,
                duration: 0.4,
                ease: 'power2.out',
            })
        }

        const handleLeave = () => {
            gsap.to(el, {
                rotateY: 0,
                rotateX: 0,
                duration: 0.6,
                ease: 'elastic.out(1, 0.5)',
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
        <div ref={ref} style={{ perspective: '1000px' }}>
            <div
                onClick={() => onSelect(project)}
                className="block lab-card rounded-lg sm:rounded-xl overflow-hidden group cursor-pointer h-full"
                style={{ transformStyle: 'preserve-3d' }}
            >
                <div className="relative overflow-hidden h-36 sm:h-44 md:h-52">
                    <Image src={project.image} alt={project.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, var(--surface), transparent)' }} />
                </div>

                <div className="p-4 sm:p-5 md:p-6">
                    <div className="flex flex-wrap gap-1.5 mb-3">
                        {project.tags.map((tag) => (
                            <span key={tag} className="text-[8px] sm:text-[9px] font-mono text-accent/60 border border-accent/10 px-2 py-0.5 rounded-sm">{tag}</span>
                        ))}
                    </div>
                    <h3 className="font-grotesk font-semibold text-sm sm:text-base md:text-lg text-text mb-2 group-hover:text-accent transition-colors duration-300">{project.title}</h3>
                    <p className="text-text-muted text-xs sm:text-sm leading-relaxed line-clamp-2">{project.description}</p>
                    <div className="mt-3 sm:mt-4 flex items-center gap-1.5 text-text-muted group-hover:text-accent transition-colors duration-300">
                        <span className="text-[9px] sm:text-[10px] font-mono tracking-wider">DETAIL_PROJECT</span>
                        <svg className="w-3 h-3 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    )
}

function ProjectModal({ project, onClose }) {
    const backdropRef = useRef(null)
    const contentRef = useRef(null)

    useEffect(() => {
        if (!project) return

        // Lock body scroll
        document.body.style.overflow = 'hidden'

        // GSAP enter animation
        const tl = gsap.timeline()
        tl.fromTo(backdropRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: 'power2.out' })
        tl.fromTo(
            contentRef.current,
            { opacity: 0, scale: 0.92, y: 30 },
            { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: 'back.out(1.4)' },
            '-=0.15'
        )

        return () => {
            document.body.style.overflow = ''
        }
    }, [project])

    // Close on Escape
    useEffect(() => {
        const handleKey = (e) => {
            if (e.key === 'Escape') handleClose()
        }
        window.addEventListener('keydown', handleKey)
        return () => window.removeEventListener('keydown', handleKey)
    }, [])

    const handleClose = useCallback(() => {
        const tl = gsap.timeline({
            onComplete: () => {
                onClose()
            },
        })
        tl.to(contentRef.current, { opacity: 0, scale: 0.92, y: 20, duration: 0.25, ease: 'power2.in' })
        tl.to(backdropRef.current, { opacity: 0, duration: 0.2, ease: 'power2.in' }, '-=0.1')
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
            <div ref={contentRef} className="project-modal-content">
                {/* Close button */}
                <button
                    onClick={handleClose}
                    className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-surface-light/80 hover:bg-accent/20 text-text-muted hover:text-accent transition-all duration-300"
                    aria-label="Close modal"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* Image */}
                <div className="relative w-full h-48 sm:h-56 md:h-64 overflow-hidden rounded-t-xl">
                    <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 95vw, (max-width: 1024px) 80vw, 600px"
                        priority
                    />
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, var(--surface), transparent 60%)' }} />
                </div>

                {/* Content */}
                <div className="p-5 sm:p-6 md:p-8">
                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                        {project.tags.map((tag) => (
                            <span key={tag} className="text-[9px] sm:text-[10px] font-mono text-accent border border-accent/20 px-2.5 py-1 rounded-sm bg-accent/5">
                                {tag}
                            </span>
                        ))}
                    </div>

                    {/* Title */}
                    <h3 className="font-syne font-bold text-xl sm:text-2xl md:text-3xl text-text mb-4">
                        {project.title}
                    </h3>

                    {/* Divider */}
                    <div className="h-[1px] w-full bg-gradient-to-r from-accent/20 via-accent/10 to-transparent mb-4" />

                    {/* Description */}
                    <p className="text-text-muted text-sm sm:text-base leading-relaxed">
                        {project.description}
                    </p>
                </div>
            </div>
        </div>
    )
}

export default function Projects() {
    const [selectedProject, setSelectedProject] = useState(null)

    return (
        <section id="projects" className="section-padding relative">
            <div className="max-w-6xl mx-auto">
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
