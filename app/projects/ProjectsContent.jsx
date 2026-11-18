'use client'

import Navbar from '../components/Navbar'
import Projects from '../components/Projects'
import Contact from '../components/Contact'
import { useLoading } from '../context/LoadingContext'

export default function ProjectsContent() {
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
      <main id="main-content" className="relative pt-20 sm:pt-24 md:pt-28 pb-16 w-full">
        {/* Header Bersih & Editorial (Selaras dengan /experience dan /awards) */}
        <header className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8 mb-8 sm:mb-14">
          <h1 className="font-sans font-bold text-2xl sm:text-3xl md:text-4xl text-text tracking-tight">
            Proyek
          </h1>
          <p className="text-text-muted text-xs sm:text-sm mt-2 max-w-xl leading-relaxed">
            Koleksi aplikasi web, platform, dan sistem informasi yang dibangun untuk memecahkan masalah nyata.
          </p>
        </header>

        {/* Daftar Showcase Proyek */}
        <Projects hideHeader />

        <div className="section-divider mt-16 sm:mt-24" />
        <Contact />
      </main>
    </div>
  )
}
