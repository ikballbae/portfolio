'use client'

import Navbar from '../components/Navbar'
import Experience from '../components/Experience'
import Contact from '../components/Contact'
import ScrollReveal from '../components/ScrollReveal'
import { useLoading } from '../context/LoadingContext'

export default function ExperiencePage() {
  const { isLoaded } = useLoading()

  return (
    <div
      className="relative overflow-x-clip w-full min-h-screen"
      style={{
        visibility: isLoaded ? 'visible' : 'hidden',
        opacity: isLoaded ? 1 : 0,
      }}
    >
      <Navbar />
      <main id="main-content" className="relative pt-24 sm:pt-28 md:pt-32 pb-16 w-full">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 mb-6">
          <ScrollReveal>
            <span className="font-sans font-semibold text-accent text-sm sm:text-base tracking-wide block mb-2">
              Work
            </span>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <h1 className="font-sans font-bold text-3xl sm:text-4xl md:text-5xl text-text tracking-tight mb-3">
              Experience
            </h1>
            <p className="text-text/75 text-base sm:text-lg leading-relaxed max-w-2xl">
              A comprehensive timeline of leadership roles, engineering work, and competition honors.
            </p>
          </ScrollReveal>
        </div>

        <Experience hideHeader />

        <div className="section-divider mt-16 sm:mt-24" />
        <Contact />
      </main>
    </div>
  )
}
