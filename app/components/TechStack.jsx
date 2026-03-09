'use client'
import ScrollReveal, { StaggerReveal } from './ScrollReveal'
import ScrambleText from './ScrambleText'
import {
    SiJavascript, SiTypescript, SiPython, SiPhp,
    SiReact, SiNextdotjs, SiNodedotjs, SiLaravel,
    SiCodeigniter, SiTailwindcss,
    SiMysql, SiPostgresql, SiMongodb, SiFigma,
    SiNpm, SiGit, SiPostman, SiNginx,
} from 'react-icons/si'

const techStack = [
    { name: 'JavaScript', icon: SiJavascript, color: '#F7DF1E' },
    { name: 'TypeScript', icon: SiTypescript, color: '#3178C6' },
    { name: 'PHP', icon: SiPhp, color: '#777BB4' },
    { name: 'Python', icon: SiPython, color: '#3776AB' },
    { name: 'React', icon: SiReact, color: '#61DAFB' },
    { name: 'Next.js', icon: SiNextdotjs, color: 'var(--text)' },
    { name: 'Node.js', icon: SiNodedotjs, color: '#339933' },
    { name: 'Laravel', icon: SiLaravel, color: '#FF2D20' },
    { name: 'CodeIgniter', icon: SiCodeigniter, color: '#EF4223' },
    { name: 'Tailwind CSS', icon: SiTailwindcss, color: '#06B6D4' },
    { name: 'MySQL', icon: SiMysql, color: '#4479A1' },
    { name: 'PostgreSQL', icon: SiPostgresql, color: '#336791' },
    { name: 'MongoDB', icon: SiMongodb, color: '#47A248' },
    { name: 'Figma', icon: SiFigma, color: '#F24E1E' },
    { name: 'npm', icon: SiNpm, color: '#CB3837' },
    { name: 'Git', icon: SiGit, color: '#F05032' },
    { name: 'Nginx', icon: SiNginx, color: '#009639' },
    { name: 'Postman', icon: SiPostman, color: '#FF6C37' },
]

export default function TechStack() {
    return (
        <section id="tech" className="section-padding relative">
            <div className="max-w-6xl mx-auto">
                {/* Section label */}
                <ScrollReveal>
                    <div className="flex items-center gap-2 sm:gap-3 mb-8 sm:mb-12 md:mb-16">
                        <span className="text-[10px] sm:text-xs font-mono text-accent tracking-wider">02</span>
                        <span className="w-8 sm:w-16 h-[1px] bg-accent/20" />
                        <span className="text-[10px] sm:text-xs font-mono text-text-muted tracking-wider uppercase">Tech Stack / skills.config</span>
                    </div>
                </ScrollReveal>

                <ScrollReveal>
                    <h3 className="font-syne font-bold text-lg sm:text-xl md:text-2xl text-text mb-6 sm:mb-8">
                        Tools I <span className="text-accent"><ScrambleText text="Work With" delay={0.2} /></span>
                    </h3>
                </ScrollReveal>

                <StaggerReveal stagger={0.05} direction="up">
                    <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-4">
                        {techStack.map((tech) => {
                            const Icon = tech.icon
                            return (
                                <div
                                    key={tech.name}
                                    data-reveal-item
                                    className="lab-card rounded-lg sm:rounded-xl p-3 sm:p-5 flex flex-col items-center gap-1.5 sm:gap-2.5 group hover:-translate-y-1 transition-all duration-300 hover:shadow-lg"
                                    style={{
                                        '--hover-color': tech.color,
                                        '--card-line-glow': tech.color
                                    }}
                                >
                                    <Icon
                                        className="text-xl sm:text-3xl text-text-muted group-hover:text-[var(--hover-color)] transition-colors duration-300"
                                        style={{ filter: tech.name === 'Next.js' ? 'none' : 'drop-shadow(0 0 8px rgba(0,0,0,0.1))' }}
                                    />
                                    <span className="text-[9px] sm:text-xs font-mono text-text-muted group-hover:text-[var(--hover-color)] transition-colors duration-300 text-center tracking-tight leading-tight">
                                        {tech.name}
                                    </span>

                                    {/* Hover glow effect background */}
                                    <div
                                        className="absolute inset-0 opacity-0 group-hover:opacity-[0.03] transition-opacity duration-300 rounded-lg sm:rounded-xl pointer-events-none"
                                        style={{ backgroundColor: 'var(--hover-color)' }}
                                    />
                                </div>
                            )
                        })}
                    </div>
                </StaggerReveal>

                <ScrollReveal delay={0.6}>
                    <div className="mt-6 sm:mt-8 p-3 sm:p-4 rounded-lg bg-surface border border-accent/5">
                        <span className="font-mono text-[10px] sm:text-xs text-text-muted block">
                            <span className="text-accent">{'>'}</span> always expanding the toolkit...
                            <span className="animate-blink text-accent">_</span>
                        </span>
                    </div>
                </ScrollReveal>
            </div>
        </section>
    )
}
