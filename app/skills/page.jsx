'use client'

import Navbar from '../components/Navbar'
import TechStack from '../components/TechStack'
import Contact from '../components/Contact'
import { useLoading } from '../context/LoadingContext'

export default function SkillsPage() {
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
      <main className="relative pt-24 sm:pt-28 md:pt-32 pb-16 w-full">
        <TechStack />
        <div className="section-divider mt-16 sm:mt-24" />
        <Contact />
      </main>
    </div>
  )
}
