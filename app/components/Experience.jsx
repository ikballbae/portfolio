'use client'
import ScrollReveal from './ScrollReveal'
import ScrambleText from './ScrambleText'

const experiences = [
    {
        role: 'Chairperson',
        company: 'UKM Pengembangan Komputer',
        period: '2024 — Present',
        description: 'Leading a community of students to become future-ready tech talents. Spearheading PKFest tech summit, Tech Goes to School outreach programs, capacity building through Diklat, and weekly study clubs.',
        tags: ['Leadership', 'Tech Festival', 'Mentorship', 'Community'],
        type: 'LEAD',
    },
    {
        role: 'Full-Stack Developer',
        company: 'Freelance / Projects',
        period: '2023 — Present',
        description: 'Building scalable web applications using Next.js, React, Laravel, and Tailwind CSS. Developed e-commerce platforms, admin dashboards, and CMS with payment gateway integrations.',
        tags: ['Next.js', 'React', 'Laravel', 'Tailwind CSS'],
        type: 'WORK',
    },
    {
        role: '🏆 1st Place — LKS Web Technology',
        company: 'City Level — Pekalongan',
        period: '2024',
        description: 'Won first place in the LKS (Lomba Kompetensi Siswa) Web Technology competition at city level, and advanced to become a Finalist at Provincial Level (Central Java).',
        tags: ['Web Technology', 'Competition', 'HTML/CSS/JS'],
        type: 'AWARD',
    },
    {
        role: '🏆 1st Place — Graphic Design Competition',
        company: 'Institut Widya Pratama 2024',
        period: '2024',
        description: 'Won first place in the Graphic Design Competition, demonstrating the creative design skills that complement my engineering expertise.',
        tags: ['Graphic Design', 'UI/UX', 'Creative'],
        type: 'AWARD',
    },
]

function TimelineItem({ experience, index, isLast }) {
    const typeColors = {
        WORK: 'bg-accent/10 text-accent border border-accent/15',
        LEAD: 'bg-purple-400/10 text-purple-400 border border-purple-400/15',
        AWARD: 'bg-amber-400/10 text-amber-400 border border-amber-400/15',
        STUDY: 'bg-blue-400/10 text-blue-400 border border-blue-400/15',
    }

    return (
        <ScrollReveal delay={index * 0.15} direction="left" distance={30}>
            <div className="relative pl-6 sm:pl-8 md:pl-10 pb-8 sm:pb-10">
                {/* Timeline line */}
                {!isLast && (
                    <div
                        className="absolute left-[5px] sm:left-[7px] top-6 bottom-0 w-[1px]"
                        style={{ background: 'linear-gradient(to bottom, var(--accent), transparent)' }}
                    />
                )}

                {/* Dot */}
                <div className="absolute left-0 top-1.5 w-[11px] h-[11px] sm:w-[15px] sm:h-[15px] rounded-sm border border-accent/50 bg-bg flex items-center justify-center">
                    <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-accent rounded-sm" />
                </div>

                {/* Content Card */}
                <div className="lab-card rounded-lg p-4 sm:p-5 md:p-6 group">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 gap-1.5">
                        <div>
                            <h3 className="font-grotesk font-semibold text-sm sm:text-base md:text-lg text-text group-hover:text-accent transition-colors duration-300">
                                {experience.role}
                            </h3>
                            <span className="text-text-muted text-xs font-mono">{experience.company}</span>
                        </div>
                        <div className="flex items-center gap-2 self-start">
                            <span className={`text-[8px] sm:text-[9px] font-mono tracking-wider px-2 py-0.5 rounded-sm ${typeColors[experience.type] || typeColors.WORK}`}>
                                {experience.type}
                            </span>
                            <span className="text-[9px] sm:text-[10px] font-mono text-text-muted/60 whitespace-nowrap">{experience.period}</span>
                        </div>
                    </div>
                    <p className="text-text-muted text-xs sm:text-sm leading-relaxed mb-3">{experience.description}</p>
                    <div className="flex flex-wrap gap-1.5">
                        {experience.tags.map((t) => (
                            <span key={t} className="text-[8px] sm:text-[9px] font-mono text-text-muted/50 border border-text/5 px-2 py-0.5 rounded-sm">{t}</span>
                        ))}
                    </div>
                </div>
            </div>
        </ScrollReveal>
    )
}

export default function Experience() {
    return (
        <section id="experience" className="section-padding relative">
            <div className="max-w-4xl mx-auto">
                <ScrollReveal>
                    <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                        <span className="text-[10px] sm:text-xs font-mono text-accent tracking-wider">05</span>
                        <span className="w-8 sm:w-16 h-[1px] bg-accent/20" />
                        <span className="text-[10px] sm:text-xs font-mono text-text-muted tracking-wider uppercase">Experience / changelog</span>
                    </div>
                </ScrollReveal>

                <ScrollReveal delay={0.1}>
                    <h2 className="font-syne font-bold text-xl sm:text-2xl md:text-3xl lg:text-4xl mb-8 sm:mb-12">
                        <ScrambleText text="Leadership & " delay={0.2} />
                        <span className="text-accent"><ScrambleText text="Achievements" delay={0.2} /></span>
                    </h2>
                </ScrollReveal>

                <div className="relative">
                    {experiences.map((exp, i) => (
                        <TimelineItem key={exp.role} experience={exp} index={i} isLast={i === experiences.length - 1} />
                    ))}
                </div>
            </div>
        </section>
    )
}
