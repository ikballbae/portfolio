'use client'

import ScrollReveal from './ScrollReveal'

// Programming Languages
const languages = [
  { name: 'TypeScript', freq: 'frequent' },
  { name: 'JavaScript', freq: 'frequent' },
  { name: 'HTML', freq: 'frequent' },
  { name: 'CSS/SCSS', freq: 'frequent' },
  { name: 'PHP', freq: 'frequent' },
  { name: 'Python', freq: 'occasional' },
  { name: 'SQL', freq: 'frequent' },
]

// Technologies
const technologies = [
  { name: 'Tailwind CSS', freq: 'frequent' },
  { name: 'React', freq: 'frequent' },
  { name: 'Next.js', freq: 'frequent' },
  { name: 'Laravel', freq: 'frequent' },
  { name: 'Node.js', freq: 'occasional' },
  { name: 'CodeIgniter', freq: 'occasional' },
  { name: 'Express', freq: 'occasional' },
  { name: 'GSAP / Motion', freq: 'frequent' },
  { name: 'RESTful APIs', freq: 'frequent' },
]

// Softwares and Tools
const softwareTools = [
  { name: 'VS Code', freq: 'frequent' },
  { name: 'Git', freq: 'frequent' },
  { name: 'Figma', freq: 'frequent' },
  { name: 'Postman', freq: 'frequent' },
]

function SkillLabel({ name, freq }) {
  const isFrequent = freq === 'frequent'

  return (
    <div className="inline-flex flex-col items-center group cursor-default select-none">
      <div className="px-3 py-1.5 rounded-lg bg-surface border border-text/10 text-xs sm:text-sm font-sans font-medium text-text transition-all duration-150 group-hover:-translate-y-0.5 group-hover:border-text/25">
        {name}
      </div>
      <div className="w-full flex justify-center mt-1">
        {isFrequent ? (
          <span className="w-full h-[3px] rounded-full bg-accent" />
        ) : (
          <span className="w-4 h-[3px] rounded-full bg-accent/50" />
        )}
      </div>
    </div>
  )
}

export default function TechStack() {
  return (
    <section id="tech" className="section-padding relative">
      <div className="max-w-3xl mx-auto">
        {/* Work Eyebrow Tag */}
        <ScrollReveal>
          <span className="font-sans font-semibold text-accent text-sm sm:text-base tracking-wide block mb-2">
            Work
          </span>
        </ScrollReveal>

        {/* Page Title & Subtitle */}
        <div className="mb-8 sm:mb-10">
          <h1 className="font-sans font-bold text-3xl sm:text-4xl md:text-5xl text-text tracking-tight mb-3">
            Skills and Tools
          </h1>
          <p className="text-text/75 text-base sm:text-lg leading-relaxed">
            A look at all the programming languages, libraries, and tools I've worked with.
          </p>
        </div>

        {/* Narrative Intro */}
        <div className="space-y-4 text-text/80 text-sm sm:text-base leading-relaxed mb-10 sm:mb-12">
          <p>
            I started my journey in web development and design while studying Information Systems in Pekalongan. Over the years, I've worked with various languages and tech stacks across both backend and frontend.
          </p>
          <p>
            Even though the scope of web development is broad, I was very interested and focused on{' '}
            <strong className="text-text font-semibold">Front-End Development</strong> and{' '}
            <strong className="text-text font-semibold">UI/UX Design</strong>.
          </p>
        </div>

        {/* Divider */}
        <div className="w-full h-[1px] bg-text/10 my-8 sm:my-10" />

        {/* =========================================================================
            1. Front-End / Full-Stack Developer Narrative
           ========================================================================= */}
        <div className="mb-12 sm:mb-14">
          <h2 className="font-sans font-bold text-2xl sm:text-3xl text-text tracking-tight mb-3">
            Front-End Developer
          </h2>
          <div className="space-y-3 text-text/80 text-sm sm:text-base leading-relaxed mb-8">
            <p>
              I love creating something that is clean and minimalistic, attractive and has value, and of course, easy to use.
            </p>
            <p>
              I really enjoy creating websites with{' '}
              <strong className="text-text font-semibold">rich UI components</strong>, including:
            </p>
          </div>

          {/* Subsections */}
          <div className="space-y-7 sm:space-y-8 pl-1 sm:pl-2">
            <div>
              <h3 className="font-sans font-bold text-lg sm:text-xl text-text mb-2">
                TypeScript
              </h3>
              <p className="text-text/80 text-sm sm:text-base leading-relaxed mb-2">
                First of all, the programming language. I'm very used to using{' '}
                <strong className="text-text font-semibold">TypeScript</strong>, although website creation can be done using PHP, Python, etc.
              </p>
              <p className="text-text/80 text-sm sm:text-base leading-relaxed">
                The JavaScript superset, TypeScript, has accompanied me for my production projects. Strict types keep data contracts clear and refactoring predictable.
              </p>
            </div>

            <div>
              <h3 className="font-sans font-bold text-lg sm:text-xl text-text mb-2">
                React
              </h3>
              <p className="text-text/80 text-sm sm:text-base leading-relaxed mb-2">
                I really enjoy building single page application websites and React is my go-to library.
              </p>
              <p className="text-text/80 text-sm sm:text-base leading-relaxed">
                I've been using it extensively and have become proficient with custom hooks, component composition, and reactive state management.
              </p>
            </div>

            <div>
              <h3 className="font-sans font-bold text-lg sm:text-xl text-text mb-2">
                Next.js
              </h3>
              <p className="text-text/80 text-sm sm:text-base leading-relaxed">
                Next.js is my preferred web framework. I use the App Router for server rendering, Server Actions for mutations, and hybrid caching to deliver snappy page loads.
              </p>
            </div>

            <div>
              <h3 className="font-sans font-bold text-lg sm:text-xl text-text mb-2">
                Tailwind CSS
              </h3>
              <p className="text-text/80 text-sm sm:text-base leading-relaxed mb-2">
                For now, I love using Tailwind CSS for styling, even though I've used plain CSS and SCSS.
              </p>
              <p className="text-text/80 text-sm sm:text-base leading-relaxed">
                <strong className="text-text font-semibold">I'm really comfortable</strong> using it and I think it's a great tool for consistent design tokens and dark/light mode.
              </p>
            </div>

            <div>
              <h3 className="font-sans font-bold text-lg sm:text-xl text-text mb-2">
                Laravel & PHP
              </h3>
              <p className="text-text/80 text-sm sm:text-base leading-relaxed">
                On the backend side, Laravel is my framework of choice. Eloquent ORM makes relational database queries clean, while built-in middleware authentication keeps RESTful APIs structured.
              </p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-[1px] bg-text/10 my-8 sm:my-10" />

        {/* =========================================================================
            2. UI/UX Designer Narrative
           ========================================================================= */}
        <div className="mb-12 sm:mb-14">
          <h2 className="font-sans font-bold text-2xl sm:text-3xl text-text tracking-tight mb-3">
            UI/UX Designer
          </h2>
          <p className="text-text/80 text-sm sm:text-base leading-relaxed mb-6">
            In 2024, I won <strong className="text-text font-semibold">1st Place in the Graphic Design Competition</strong> at Institut Widya Pratama. I believe great software must be intuitive, tactile, and clear.
          </p>

          <div className="pl-1 sm:pl-2">
            <h3 className="font-sans font-bold text-lg sm:text-xl text-text mb-2">
              Figma
            </h3>
            <p className="text-text/80 text-sm sm:text-base leading-relaxed">
              Where my design process begins. I map out user flows, test responsive spacing with Auto Layout, and build component design systems here before writing any code.
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-[1px] bg-text/10 my-8 sm:my-10" />

        {/* =========================================================================
            3. Detail and Summary (enji.dev style, located at the end)
           ========================================================================= */}
        <div>
          <h2 className="font-sans font-bold text-2xl sm:text-3xl text-text tracking-tight mb-2">
            Detail and Summary
          </h2>
          <p className="text-text/75 text-sm sm:text-base leading-relaxed mb-4">
            I represent all data in labels to make it easier to read. The{' '}
            <strong className="text-text font-semibold">underline indicator</strong> shows how often I used the related item, e.g.:
          </p>

          {/* Legend */}
          <div className="flex items-center gap-4 mb-8 text-xs sm:text-sm">
            <div className="inline-flex flex-col items-center">
              <div className="px-3 py-1.5 rounded-lg bg-surface border border-text/10 text-text font-medium">
                Frequently Used
              </div>
              <span className="w-full h-[3px] rounded-full bg-accent mt-1" />
            </div>

            <div className="inline-flex flex-col items-center">
              <div className="px-3 py-1.5 rounded-lg bg-surface border border-text/10 text-text font-medium">
                Occasionally
              </div>
              <span className="w-4 h-[3px] rounded-full bg-accent/50 mt-1" />
            </div>
          </div>

          {/* Programming Languages */}
          <div className="mb-6 sm:mb-8">
            <h3 className="font-sans font-bold text-base sm:text-lg text-text mb-3">
              Programming Languages
            </h3>
            <div className="flex flex-wrap gap-x-2.5 gap-y-3.5">
              {languages.map((item) => (
                <SkillLabel key={item.name} name={item.name} freq={item.freq} />
              ))}
            </div>
          </div>

          {/* Technologies */}
          <div className="mb-6 sm:mb-8">
            <h3 className="font-sans font-bold text-base sm:text-lg text-text mb-3">
              Technologies
            </h3>
            <div className="flex flex-wrap gap-x-2.5 gap-y-3.5">
              {technologies.map((item) => (
                <SkillLabel key={item.name} name={item.name} freq={item.freq} />
              ))}
            </div>
          </div>

          {/* Softwares and Tools */}
          <div>
            <h3 className="font-sans font-bold text-base sm:text-lg text-text mb-3">
              Softwares and Tools
            </h3>
            <div className="flex flex-wrap gap-x-2.5 gap-y-3.5">
              {softwareTools.map((item) => (
                <SkillLabel key={item.name} name={item.name} freq={item.freq} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
