"use client";
import Link from "next/link";
import ScrollReveal from "./ScrollReveal";
import ScrambleText from "./ScrambleText";

const experiences = [
  {
    role: "Chairperson",
    company: "UKM Pengembangan Komputer",
    period: "2025 - 2026",
    description:
      "Lead Tech Goes to School, a student-run initiative I started to grow tech literacy on campus and across Pekalongan. I organize weekly study clubs on web programming, MySQL, and UI/UX, and mentor peers from first project to first deploy.",
    tags: ["Leadership", "Mentorship", "Community"],
    type: "LEAD",
  },
  {
    role: "Full-Stack Developer",
    company: "Freelance / Projects",
    period: "2023 - Present",
    description:
      "Building scalable web applications using Next.js, React, Laravel, and Tailwind CSS. Developed e-commerce platforms, admin dashboards, and CMS with payment gateway integrations.",
    tags: ["Next.js", "React", "Laravel", "Tailwind CSS"],
    type: "WORK",
  },
  {
    role: "Juara 1 Lomba Desain Poster, PK FEST",
    company: "STMIK Widya Pratama · Kampus",
    period: "Oktober 2024",
    description:
      "Kompetisi perancangan poster pada rangkaian acara PK FEST di STMIK Widya Pratama.",
    tags: ["Desain", "Poster", "Creative"],
    type: "AWARD",
  },
  {
    role: "Juara 1 LKS Web Technology",
    company: "Kemendikbud · Tingkat Kabupaten Pekalongan",
    period: "Maret 2024",
    description:
      "Mencakup perancangan antarmuka (UI/UX), pengembangan frontend, dan logika backend aplikasi web secara mandiri dan luring tanpa akses internet.",
    tags: ["Web Technology", "Competition", "Programming"],
    type: "AWARD",
  },
];

function TimelineItem({ experience, index, isLast }) {
  const typeColors = {
    WORK: "bg-accent/10 text-accent border border-accent/15",
    LEAD: "bg-purple-400/10 text-purple-400 border border-purple-400/15",
    AWARD: "bg-amber-400/10 text-amber-400 border border-amber-400/15",
    STUDY: "bg-blue-400/10 text-blue-400 border border-blue-400/15",
  };

  return (
    <ScrollReveal delay={index * 0.15} direction="left" distance={30}>
      <div className="relative pl-6 sm:pl-8 md:pl-10 pb-8 sm:pb-10">
        {/* Timeline line */}
        {!isLast && (
          <div
            className="absolute left-[5px] sm:left-[7px] top-6 bottom-0 w-[1px]"
            style={{
              background:
                "linear-gradient(to bottom, var(--accent), transparent)",
            }}
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
              <span className="text-text-muted text-xs font-mono">
                {experience.company}
              </span>
            </div>
            <div className="flex items-center gap-2 self-start">
              <span
                className={`text-[8px] sm:text-[9px] font-mono tracking-wider px-2 py-0.5 rounded-sm ${typeColors[experience.type] || typeColors.WORK}`}
              >
                {experience.type}
              </span>
              <span className="text-[9px] sm:text-[10px] font-mono text-text-muted/60 whitespace-nowrap">
                {experience.period}
              </span>
            </div>
          </div>
          <p className="text-text-muted text-xs sm:text-sm leading-relaxed mb-3">
            {experience.description}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {experience.tags.map((t) => (
              <span
                key={t}
                className="text-[8px] sm:text-[9px] font-mono text-text-muted/50 border border-text/5 px-2 py-0.5 rounded-sm"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </ScrollReveal>
  );
}

export default function Experience({ hideHeader = false }) {
  return (
    <section
      id="experience"
      className={`${hideHeader ? "py-4 sm:py-6" : "section-padding"} relative`}
    >
      <div className="max-w-4xl mx-auto">
        {!hideHeader && (
          <>
            <ScrollReveal>
              <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                <span className="text-[10px] sm:text-xs font-mono text-accent tracking-wider">
                  05
                </span>
                <span className="w-8 sm:w-16 h-[1px] bg-accent/20" />
                <span className="text-[10px] sm:text-xs font-mono text-text-muted tracking-wider uppercase">
                  Experience / changelog
                </span>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <h2 className="font-syne font-bold text-xl sm:text-2xl md:text-3xl lg:text-4xl mb-8 sm:mb-12">
                <ScrambleText text="Leadership & " delay={0.2} />
                <span className="text-accent">
                  <ScrambleText text="Achievements" delay={0.2} />
                </span>
              </h2>
            </ScrollReveal>
          </>
        )}

        <div className="relative">
          {experiences.map((exp, i) => (
            <TimelineItem
              key={exp.role}
              experience={exp}
              index={i}
              isLast={i === experiences.length - 1}
            />
          ))}
        </div>

        {/* Link to Awards page */}
        <div className="mt-8 pt-4 pl-6 sm:pl-8 md:pl-10">
          <Link
            href="/awards"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold border border-text/15 hover:border-accent hover:text-accent transition-colors duration-150 text-text/80 select-none"
          >
            <span>Lihat semua penghargaan</span>
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
