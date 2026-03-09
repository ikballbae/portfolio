'use client'
import ScrollReveal, { StaggerReveal } from './ScrollReveal'
import ScrambleText from './ScrambleText'

const principles = [
  {
    tag: 'PRINCIPLE_01',
    title: 'Full-Stack Development',
    desc: 'Building scalable web apps using Next.js, React, Laravel, and Tailwind CSS — from concept to deployment.',
  },
  {
    tag: 'PRINCIPLE_02',
    title: 'Creative Design',
    desc: '1st Place winner of the 2024 Graphic Design Competition at Institut Widya Pratama. Specialized in crafting visual identities and creative assets for strategic branding and digital marketing.',
  },
  {
    tag: 'PRINCIPLE_03',
    title: 'Tech Leadership',
    desc: 'Chairperson of UKM Pengembangan Komputer — leading a community of students to become future-ready tech talents.',
  },
]

export default function About() {
  return (
    <section id="about" className="section-padding relative">
      <div className="max-w-6xl mx-auto">
        {/* Section label */}
        <ScrollReveal>
          <div className="flex items-center gap-2 sm:gap-3 mb-8 sm:mb-12 md:mb-16">
            <span className="text-[10px] sm:text-xs font-mono text-accent tracking-wider">01</span>
            <span className="w-8 sm:w-16 h-[1px] bg-accent/20" />
            <span className="text-[10px] sm:text-xs font-mono text-text-muted tracking-wider uppercase">About / README.md</span>
          </div>
        </ScrollReveal>

        {/* Main statement */}
        <div className="mb-10 sm:mb-14 md:mb-20">
          <h2 className="font-syne font-bold text-xl sm:text-2xl md:text-3xl lg:text-4xl leading-snug mb-6 sm:mb-8">
            <ScrollReveal delay={0.1}>
              <span><ScrambleText text="I don't just write code —" delay={0.2} duration={0.8} /></span>
            </ScrollReveal>
            <br />
            <ScrollReveal delay={0.25}>
              <span className="text-accent"><ScrambleText text="I build solutions that merge" delay={1.0} duration={0.8} /></span>
            </ScrollReveal>
            <br />
            <ScrollReveal delay={0.4}>
              <span><ScrambleText text="engineering logic with creative design." delay={1.8} duration={0.8} /></span>
            </ScrollReveal>
          </h2>

          <ScrollReveal delay={0.5}>
            <div className="max-w-xl">
              <p className="text-text-muted text-sm sm:text-base leading-relaxed mb-4">
                Information Systems student based in Pekalongan, Indonesia. I serve as the
                Chairperson of <span className="text-text font-medium">UKM Pengembangan Komputer</span>,
                leading a community of students to become future-ready tech talents.
              </p>
              <p className="text-text-muted text-sm sm:text-base leading-relaxed">
                My approach is a loop of{' '}
                <span className="font-mono text-accent text-xs sm:text-sm">design()</span> →{' '}
                <span className="font-mono text-accent text-xs sm:text-sm">develop()</span> →{' '}
                <span className="font-mono text-accent text-xs sm:text-sm">lead()</span> →{' '}
                <span className="font-mono text-accent text-xs sm:text-sm">impact()</span>
              </p>
            </div>
          </ScrollReveal>
        </div>

        {/* Principles — lab card style */}
        <StaggerReveal stagger={0.12} direction="up">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {principles.map((item) => (
              <div
                key={item.tag}
                data-reveal-item
                className="lab-card rounded-lg sm:rounded-xl p-5 sm:p-6 md:p-7 group hover:-translate-y-1 transition-transform duration-300"
              >
                <span className="text-[9px] sm:text-[10px] font-mono text-accent/40 tracking-wider block mb-3 sm:mb-4">
                  {item.tag}
                </span>
                <h3 className="font-grotesk font-semibold text-base sm:text-lg text-text mb-2 sm:mb-3 group-hover:text-accent transition-colors duration-300">
                  {item.title}
                </h3>
                <p className="text-text-muted text-xs sm:text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </StaggerReveal>
      </div>
    </section>
  )
}
