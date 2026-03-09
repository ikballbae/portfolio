'use client'
import { useState } from 'react'
import MagneticButton from './MagneticButton'
import ScrollReveal, { StaggerReveal } from './ScrollReveal'
import ScrambleText from './ScrambleText'
import { FaGithub, FaLinkedin, FaEnvelope, FaInstagram } from 'react-icons/fa'

const socials = [
    { name: 'GitHub', icon: FaGithub, href: 'https://github.com/ikballbae' },
    { name: 'LinkedIn', icon: FaLinkedin, href: 'https://linkedin.com/in/akhmad-ikbal-khoir' },
    { name: 'Email', icon: FaEnvelope, href: 'mailto:akhmadikballlkhoir@gmail.com' },
    { name: 'Instagram', icon: FaInstagram, href: 'https://instagram.com/ahmdikball' },
]

export default function Contact() {
    const [formSent, setFormSent] = useState(false)

    const handleSubmit = (e) => {
        e.preventDefault()
        setFormSent(true)
        setTimeout(() => setFormSent(false), 3000)
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
                                I am driven by impact and currently open for{' '}
                                <span className="text-text font-medium">internship opportunities</span> or{' '}
                                <span className="text-text font-medium">collaborations</span> where I can leverage my hybrid skills in development and design.
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
                                    href="mailto:akhmadikballlkhoir@gmail.com"
                                    className="inline-flex items-center gap-2 sm:gap-3 px-5 sm:px-6 py-2.5 sm:py-3 bg-accent text-bg font-grotesk font-semibold text-xs sm:text-sm rounded-md hover:bg-accent-dark transition-colors duration-300 group"
                                >
                                    <span className="font-mono text-[10px] sm:text-xs">{'>'}</span>
                                    init_connection()
                                    <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </a>
                            </MagneticButton>
                        </ScrollReveal>
                    </div>

                    {/* Right — Contact form */}
                    <ScrollReveal delay={0.3}>
                        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                            <div>
                                <label className="block text-[9px] sm:text-[10px] font-mono text-text-muted/60 uppercase tracking-wider mb-1.5">name</label>
                                <input type="text" required className="w-full bg-transparent border-b border-accent/10 focus:border-accent/50 py-2.5 text-sm text-text font-inter outline-none transition-colors duration-300 placeholder:text-text-muted/20" placeholder="Your name" />
                            </div>
                            <div>
                                <label className="block text-[9px] sm:text-[10px] font-mono text-text-muted/60 uppercase tracking-wider mb-1.5">email</label>
                                <input type="email" required className="w-full bg-transparent border-b border-accent/10 focus:border-accent/50 py-2.5 text-sm text-text font-inter outline-none transition-colors duration-300 placeholder:text-text-muted/20" placeholder="your@email.com" />
                            </div>
                            <div>
                                <label className="block text-[9px] sm:text-[10px] font-mono text-text-muted/60 uppercase tracking-wider mb-1.5">message</label>
                                <textarea required rows={3} className="w-full bg-transparent border-b border-accent/10 focus:border-accent/50 py-2.5 text-sm text-text font-inter outline-none transition-colors duration-300 resize-none placeholder:text-text-muted/20" placeholder="Tell me about your project..." />
                            </div>
                            <MagneticButton>
                                <span className={`inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 font-grotesk font-semibold text-xs sm:text-sm rounded-md transition-all duration-300 ${formSent ? 'bg-green-500/90 text-bg' : 'border border-accent/15 text-text-muted hover:border-accent/40 hover:text-accent'}`}>
                                    {formSent ? '✓ message_sent' : 'send_message()'}
                                </span>
                            </MagneticButton>
                        </form>
                    </ScrollReveal>
                </div>

                {/* Footer */}
                <ScrollReveal delay={0.5}>
                    <div className="mt-14 sm:mt-20 pt-6 border-t border-accent/5 flex flex-col sm:flex-row items-center justify-between gap-3">
                        <span className="text-[9px] sm:text-[10px] font-mono text-text-muted/40">© {new Date().getFullYear()} akhmad.ikbal — built with passion</span>
                        <span className="text-[9px] sm:text-[10px] font-mono text-text-muted/25">next.js + gsap + tailwind</span>
                    </div>
                </ScrollReveal>
            </div>
        </section>
    )
}
