'use client'
import ScrollReveal, { StaggerReveal, CountUp, LineGrow } from './ScrollReveal'

const learningItems = [
    {
        year: '2024',
        items: [
            { type: 'LEADERSHIP', title: 'PKFest — Tech Festival', source: 'UKM PengKom', insight: 'Spearheading a flagship tech summit focused on AI, Cyber Security, and Modern Programming.' },
            { type: 'INITIATIVE', title: 'Tech Goes to School', source: 'Outreach Program', insight: 'Teaching UI/UX, Web Programming, and Game Dev to vocational and high school students.' },
            { type: 'AWARD', title: '1st Place — LKS Web Technology', source: 'City Level Pekalongan', insight: 'Competed and won at city level, then advanced as Finalist at Provincial Level (Central Java).' },
        ]
    },
    {
        year: '2023',
        items: [
            { type: 'PROJECT', title: 'Full-Stack Web Applications', source: 'Next.js + Laravel', insight: 'Built scalable web apps with payment integrations, admin dashboards, and CMS platforms.' },
            { type: 'LEADERSHIP', title: 'Weekly Study Clubs', source: 'UKM PengKom', insight: 'Facilitating mentorship sessions on Database Management, UI/UX, Full-Stack Web, and Game Dev.' },
            { type: 'COURSE', title: 'React & Next.js Deep Dive', source: 'Self-study', insight: 'Server components fundamentally change how we think about rendering and data flow.' },
        ]
    },
    {
        year: '2022',
        items: [
            { type: 'COURSE', title: 'Laravel & PHP Mastery', source: 'Bootcamp + self-study', insight: 'Laravel\'s service container and Eloquent ORM taught me clean architecture deeply.' },
            { type: 'LEADERSHIP', title: 'Capacity Building (Diklat)', source: 'UKM PengKom', insight: 'Directed recruitment and training camp to build a solid, high-performing organizational team.' },
            { type: 'PROJECT', title: 'First Full-Stack Application', source: 'Learning project', insight: 'The best way to learn is to build something real and iterate on it.' },
        ]
    },
]

const typeColors = {
    COURSE: 'text-blue-400 border-blue-400/20 bg-blue-400/5',
    LEADERSHIP: 'text-purple-400 border-purple-400/20 bg-purple-400/5',
    INITIATIVE: 'text-teal-400 border-teal-400/20 bg-teal-400/5',
    PROJECT: 'text-accent border-accent/20 bg-accent/5',
    AWARD: 'text-amber-400 border-amber-400/20 bg-amber-400/5',
    EXPERIMENT: 'text-amber-400 border-amber-400/20 bg-amber-400/5',
}

export default function LearningJourney() {
    return (
        <section id="learning" className="section-padding relative">
            <div className="max-w-6xl mx-auto">
                <ScrollReveal>
                    <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                        <span className="text-[10px] sm:text-xs font-mono text-accent tracking-wider">04</span>
                        <span className="w-8 sm:w-16 h-[1px] bg-accent/20" />
                        <span className="text-[10px] sm:text-xs font-mono text-text-muted tracking-wider uppercase">Journey / growth_log</span>
                    </div>
                </ScrollReveal>

                <ScrollReveal delay={0.1}>
                    <h2 className="font-syne font-bold text-xl sm:text-2xl md:text-3xl lg:text-4xl mb-3 sm:mb-4">
                        Growth &amp; <span className="text-accent">Impact</span>
                    </h2>
                    <p className="text-text-muted text-xs sm:text-sm max-w-lg mb-8 sm:mb-12">
                        The journey that drives everything: learn deeply, lead by example, build with purpose, and create lasting impact.
                    </p>
                </ScrollReveal>

                {/* Timeline by year */}
                <div className="space-y-10 sm:space-y-14">
                    {learningItems.map((yearGroup) => (
                        <div key={yearGroup.year}>
                            <ScrollReveal>
                                <div className="flex items-center gap-3 mb-5 sm:mb-6">
                                    <span className="font-syne font-bold text-2xl sm:text-3xl text-accent/30">{yearGroup.year}</span>
                                    <LineGrow className="flex-1 h-[1px] bg-accent/10" />
                                </div>
                            </ScrollReveal>

                            <StaggerReveal stagger={0.1}>
                                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                                    {yearGroup.items.map((item) => (
                                        <div
                                            key={item.title}
                                            data-reveal-item
                                            className="lab-card rounded-lg p-4 sm:p-5 group notebook-lines hover:-translate-y-1 transition-transform duration-300"
                                        >
                                            <div className="flex items-center justify-between mb-3">
                                                <span className={`text-[8px] sm:text-[9px] font-mono tracking-wider px-2 py-0.5 rounded-sm border ${typeColors[item.type]}`}>
                                                    {item.type}
                                                </span>
                                                <span className="text-[9px] sm:text-[10px] font-mono text-text-muted/40">{item.source}</span>
                                            </div>
                                            <h4 className="font-grotesk font-semibold text-sm sm:text-base text-text mb-2 group-hover:text-accent transition-colors duration-300">{item.title}</h4>
                                            <div className="flex items-start gap-2 mt-3 pt-3 border-t border-accent/5">
                                                <span className="text-accent text-xs flex-shrink-0 mt-0.5">💡</span>
                                                <p className="text-text-muted text-[11px] sm:text-xs leading-relaxed italic">&quot;{item.insight}&quot;</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </StaggerReveal>
                        </div>
                    ))}
                </div>

                {/* Stats footer */}
                <ScrollReveal delay={0.3}>
                    <div className="mt-10 sm:mt-14 p-4 sm:p-5 rounded-lg bg-surface border border-accent/5">
                        <div className="grid grid-cols-3 gap-4 sm:gap-6 text-center">
                            <div>
                                <span className="block font-syne font-bold text-xl sm:text-2xl text-accent">
                                    <CountUp target={3} suffix="" />
                                </span>
                                <span className="text-[9px] sm:text-[10px] font-mono text-text-muted uppercase tracking-wider">Competition Wins</span>
                            </div>
                            <div>
                                <span className="block font-syne font-bold text-xl sm:text-2xl text-accent">
                                    <CountUp target={4} suffix="+" />
                                </span>
                                <span className="text-[9px] sm:text-[10px] font-mono text-text-muted uppercase tracking-wider">Initiatives Led</span>
                            </div>
                            <div>
                                <span className="block font-syne font-bold text-xl sm:text-2xl text-accent">∞</span>
                                <span className="text-[9px] sm:text-[10px] font-mono text-text-muted uppercase tracking-wider">Impact Driven</span>
                            </div>
                        </div>
                    </div>
                </ScrollReveal>
            </div>
        </section>
    )
}
