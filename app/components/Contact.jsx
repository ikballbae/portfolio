'use client'
import { useState, useRef, useEffect } from 'react'
import MagneticButton from './MagneticButton'
import ScrollReveal, { StaggerReveal } from './ScrollReveal'
import ScrambleText from './ScrambleText'
import { FaGithub, FaLinkedin, FaEnvelope, FaInstagram } from 'react-icons/fa'

const socials = [
    { name: 'GitHub', icon: FaGithub, href: 'https://github.com/ikballbae' },
    { name: 'LinkedIn', icon: FaLinkedin, href: 'https://linkedin.com/in/akhmad-ikbal-khoir' },
    { name: 'Email', icon: FaEnvelope, href: 'mailto:akhmadikbalkhoir@gmail.com' },
    { name: 'Instagram', icon: FaInstagram, href: 'https://instagram.com/ahmdikball' },
]

export default function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
        hp: '', // Honeypot field
    })
    const [status, setStatus] = useState('idle') // 'idle' | 'loading' | 'success' | 'error'
    const [statusMessage, setStatusMessage] = useState('')
    const [turnstileToken, setTurnstileToken] = useState('')

    const turnstileContainerRef = useRef(null)
    const turnstileWidgetIdRef = useRef(null)
    const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY

    // Setup Cloudflare Turnstile if site key is configured
    useEffect(() => {
        if (!siteKey || !turnstileContainerRef.current) return

        const renderTurnstile = () => {
            if (window.turnstile && turnstileContainerRef.current) {
                try {
                    turnstileWidgetIdRef.current = window.turnstile.render(turnstileContainerRef.current, {
                        sitekey: siteKey,
                        theme: 'dark',
                        size: 'normal',
                        callback: (token) => {
                            setTurnstileToken(token)
                        },
                        'expired-callback': () => {
                            setTurnstileToken('')
                        },
                        'error-callback': () => {
                            setTurnstileToken('')
                        },
                    })
                } catch {
                    // Widget might already be rendered
                }
            }
        }

        if (typeof window !== 'undefined' && window.turnstile) {
            renderTurnstile()
        } else if (typeof window !== 'undefined') {
            const scriptId = 'cf-turnstile-script'
            if (!document.getElementById(scriptId)) {
                const script = document.createElement('script')
                script.id = scriptId
                script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
                script.async = true
                script.defer = true
                script.onload = renderTurnstile
                document.head.appendChild(script)
            }
        }

        return () => {
            if (turnstileWidgetIdRef.current && window.turnstile) {
                try {
                    window.turnstile.remove(turnstileWidgetIdRef.current)
                } catch {
                    // Ignore removal error on unmount
                }
            }
        }
    }, [siteKey])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
        if (status === 'error') {
            setStatus('idle')
            setStatusMessage('')
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        // 1. Client-Side Validation (UX)
        const trimmedName = formData.name.trim()
        const trimmedEmail = formData.email.trim()
        const trimmedMessage = formData.message.trim()

        if (trimmedName.length < 2 || trimmedName.length > 80) {
            setStatus('error')
            setStatusMessage('Nama harus antara 2 hingga 80 karakter.')
            return
        }

        if (/[\r\n]/.test(trimmedName) || /[\r\n]/.test(trimmedEmail)) {
            setStatus('error')
            setStatusMessage('Nama dan email tidak boleh mengandung karakter baris baru.')
            return
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(trimmedEmail) || trimmedEmail.length > 254) {
            setStatus('error')
            setStatusMessage('Format email tidak valid.')
            return
        }

        if (trimmedMessage.length < 10 || trimmedMessage.length > 2000) {
            setStatus('error')
            setStatusMessage('Pesan harus antara 10 hingga 2000 karakter.')
            return
        }

        if (siteKey && !turnstileToken) {
            setStatus('error')
            setStatusMessage('Harap selesaikan verifikasi keamanan Turnstile terlebih dahulu.')
            return
        }

        // 2. Dispatch to Server Route Handler
        setStatus('loading')
        setStatusMessage('')

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: trimmedName,
                    email: trimmedEmail,
                    message: trimmedMessage,
                    hp: formData.hp,
                    turnstileToken,
                }),
            })

            const data = await res.json().catch(() => ({}))

            if (!res.ok) {
                setStatus('error')
                setStatusMessage(data.error || 'Gagal mengirim pesan, coba lagi nanti.')
                return
            }

            // Success
            setStatus('success')
            setStatusMessage(data.message || 'Pesan berhasil dikirim! Saya akan segera merespons.')
            setFormData({ name: '', email: '', message: '', hp: '' })
            setTurnstileToken('')

            if (turnstileWidgetIdRef.current && window.turnstile) {
                try {
                    window.turnstile.reset(turnstileWidgetIdRef.current)
                } catch {
                    // Ignore reset error
                }
            }

            // Auto-revert success button indicator after 6 seconds
            setTimeout(() => {
                setStatus((prev) => (prev === 'success' ? 'idle' : prev))
            }, 6000)
        } catch {
            setStatus('error')
            setStatusMessage('Gagal mengirim pesan, coba lagi nanti.')
        }
    }

    return (
        <section id="contact" className="section-padding relative blueprint-grid-subtle">
            <div className="max-w-6xl mx-auto">
                <ScrollReveal>
                    <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                        <span className="text-[10px] sm:text-xs font-mono text-accent tracking-wider">06</span>
                        <span className="w-8 sm:w-16 h-[1px] bg-accent/20" />
                        <span className="text-[10px] sm:text-xs font-mono text-text-muted tracking-wider uppercase">Contact / init_connection</span>
                    </div>
                </ScrollReveal>

                {/* Large CTA heading */}
                <div className="mb-8 sm:mb-12">
                    <h2 className="font-syne font-extrabold text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl leading-[1.05]">
                        <ScrollReveal delay={0.1}>
                            <span><ScrambleText text="Let's collaborate" delay={0.2} /></span>
                        </ScrollReveal>
                        <br />
                        <ScrollReveal delay={0.3}>
                            <span className="text-accent"><ScrambleText text="on something meaningful." delay={0.4} /></span>
                        </ScrollReveal>
                    </h2>
                </div>

                <div className="grid lg:grid-cols-2 gap-10 sm:gap-12 lg:gap-16">
                    {/* Left */}
                    <div>
                        <ScrollReveal delay={0.3}>
                            <p className="text-text-muted text-sm sm:text-base leading-relaxed mb-6 sm:mb-8 max-w-md">
                                Saya mencari posisi Junior Web Developer atau magang. Stack harian saya Laravel dan Next.js.
                            </p>
                        </ScrollReveal>

                        <StaggerReveal stagger={0.08} baseDelay={0.4}>
                            <div className="flex items-center gap-3 mb-6 sm:mb-8">
                                {socials.map((social) => {
                                    const Icon = social.icon
                                    return (
                                        <a
                                            key={social.name}
                                            href={social.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            data-reveal-item
                                            className="w-9 h-9 sm:w-10 sm:h-10 lab-card rounded-md flex items-center justify-center text-text-muted hover:text-accent hover:border-accent/30 hover:-translate-y-1 transition-all duration-300"
                                            aria-label={social.name}
                                        >
                                            <Icon className="text-sm sm:text-base" />
                                        </a>
                                    )
                                })}
                            </div>
                        </StaggerReveal>

                        <ScrollReveal delay={0.6}>
                            <MagneticButton>
                                <a
                                    href="mailto:akhmadikbalkhoir@gmail.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 sm:gap-3 px-5 sm:px-6 py-2.5 sm:py-3 bg-accent text-bg font-grotesk font-semibold text-xs sm:text-sm rounded-md hover:bg-accent-dark transition-colors duration-300 group"
                                >
                                    <span className="font-mono text-[10px] sm:text-xs">{'>'}</span>
                                    Kirim Email Langsung
                                    <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </a>
                            </MagneticButton>
                        </ScrollReveal>
                    </div>

                    {/* Right — Contact form */}
                    <ScrollReveal delay={0.3}>
                        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5" noValidate>
                            {/* Honeypot field (hidden from humans, filled by spam bots) */}
                            <div
                                className="absolute opacity-0 -z-50 pointer-events-none select-none h-0 w-0 overflow-hidden"
                                aria-hidden="true"
                                tabIndex={-1}
                            >
                                <label htmlFor="user_company_website">Company Website</label>
                                <input
                                    id="user_company_website"
                                    type="text"
                                    name="hp"
                                    value={formData.hp}
                                    onChange={handleChange}
                                    autoComplete="off"
                                    tabIndex={-1}
                                />
                            </div>

                            <div>
                                <label htmlFor="contact_name" className="block text-[9px] sm:text-[10px] font-mono text-text-muted/60 uppercase tracking-wider mb-1.5">
                                    name
                                </label>
                                <input
                                    id="contact_name"
                                    name="name"
                                    type="text"
                                    required
                                    maxLength={80}
                                    disabled={status === 'loading'}
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full bg-transparent border-b border-accent/10 focus:border-accent/50 py-2.5 text-sm text-text font-inter outline-none transition-colors duration-300 placeholder:text-text-muted/20 disabled:opacity-50"
                                    placeholder="Your name"
                                />
                            </div>

                            <div>
                                <label htmlFor="contact_email" className="block text-[9px] sm:text-[10px] font-mono text-text-muted/60 uppercase tracking-wider mb-1.5">
                                    email
                                </label>
                                <input
                                    id="contact_email"
                                    name="email"
                                    type="email"
                                    required
                                    maxLength={254}
                                    disabled={status === 'loading'}
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full bg-transparent border-b border-accent/10 focus:border-accent/50 py-2.5 text-sm text-text font-inter outline-none transition-colors duration-300 placeholder:text-text-muted/20 disabled:opacity-50"
                                    placeholder="your@email.com"
                                />
                            </div>

                            <div>
                                <label htmlFor="contact_message" className="block text-[9px] sm:text-[10px] font-mono text-text-muted/60 uppercase tracking-wider mb-1.5">
                                    message
                                </label>
                                <textarea
                                    id="contact_message"
                                    name="message"
                                    required
                                    rows={3}
                                    maxLength={2000}
                                    disabled={status === 'loading'}
                                    value={formData.message}
                                    onChange={handleChange}
                                    className="w-full bg-transparent border-b border-accent/10 focus:border-accent/50 py-2.5 text-sm text-text font-inter outline-none transition-colors duration-300 resize-none placeholder:text-text-muted/20 disabled:opacity-50"
                                    placeholder="Tell me about your project..."
                                />
                            </div>

                            {/* Cloudflare Turnstile widget container (rendered when NEXT_PUBLIC_TURNSTILE_SITE_KEY is provided) */}
                            {siteKey && (
                                <div className="pt-1">
                                    <div ref={turnstileContainerRef} className="my-1" />
                                </div>
                            )}

                            <div>
                                <MagneticButton
                                    type="submit"
                                    disabled={status === 'loading'}
                                    className={status === 'loading' ? 'cursor-not-allowed opacity-75' : ''}
                                >
                                    <span
                                        className={`inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 font-grotesk font-semibold text-xs sm:text-sm rounded-md transition-all duration-300 ${
                                            status === 'success'
                                                ? 'bg-green-500/90 text-bg'
                                                : status === 'loading'
                                                ? 'border border-accent/40 text-accent bg-accent/5'
                                                : 'border border-accent/15 text-text-muted hover:border-accent/40 hover:text-accent'
                                        }`}
                                    >
                                        {status === 'loading' && (
                                            <svg className="animate-spin -ml-1 mr-1.5 h-3.5 w-3.5 text-accent" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                            </svg>
                                        )}
                                        {status === 'loading'
                                            ? 'Mengirim...'
                                            : status === 'success'
                                            ? '✓ message_sent'
                                            : 'send_message()'}
                                    </span>
                                </MagneticButton>

                                {/* Feedback banners */}
                                {status === 'success' && (
                                    <p className="text-xs font-mono text-accent mt-3 flex items-center gap-1.5">
                                        <span>✓</span> {statusMessage}
                                    </p>
                                )}
                                {status === 'error' && (
                                    <p className="text-xs font-mono text-red-400 mt-3 flex items-center gap-1.5">
                                        <span>✕</span> {statusMessage}
                                    </p>
                                )}
                            </div>
                        </form>
                    </ScrollReveal>
                </div>

                {/* Footer */}
                <ScrollReveal delay={0.5}>
                    <div className="mt-14 sm:mt-20 pt-6 border-t border-accent/10 flex flex-col sm:flex-row items-center justify-between gap-3">
                        <span className="text-[9px] sm:text-[10px] font-mono text-text-muted/80">© {new Date().getFullYear()} akhmad.ikbal · Dibangun dengan Next.js, GSAP, dan Tailwind.</span>
                        <span className="text-[9px] sm:text-[10px] font-mono text-text-muted/70">Next.js + GSAP + Tailwind</span>
                    </div>
                </ScrollReveal>
            </div>
        </section>
    )
}
