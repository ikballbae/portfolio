'use client'

import { useEffect, useState, useRef, useCallback, Suspense } from 'react'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from './ThemeProvider'
import { useLoading } from '../context/LoadingContext'

const blogCategories = [
  { label: 'Leadership', href: '/blog?kategori=LEADERSHIP', category: 'LEADERSHIP' },
  { label: 'Experience', href: '/blog?kategori=EXPERIENCE', category: 'EXPERIENCE' },
  { label: 'Creative', href: '/blog?kategori=CREATIVE', category: 'CREATIVE' },
  { label: 'Achievement', href: '/blog?kategori=ACHIEVEMENT', category: 'ACHIEVEMENT' },
]

function SearchParamWatcher({ onChange }) {
  const searchParams = useSearchParams()
  useEffect(() => {
    const cat = searchParams ? searchParams.get('kategori') : ''
    onChange(cat || '')
  }, [searchParams, onChange])
  return null
}

function ThemeToggle({ testId = 'theme-toggle' }) {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      type="button"
      data-testid={testId}
      className="w-9 h-9 rounded-xl flex items-center justify-center text-text-muted hover:text-text hover:bg-text/[0.06] active:scale-95 transition-all duration-150"
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      <AnimatePresence mode="wait" initial={false}>
        {theme === 'dark' ? (
          <motion.svg
            key="sun"
            className="w-[17px] h-[17px]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.8}
            initial={{ rotate: -45, opacity: 0, scale: 0.7 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: 45, opacity: 0, scale: 0.7 }}
            transition={{ duration: 0.2 }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </motion.svg>
        ) : (
          <motion.svg
            key="moon"
            className="w-[17px] h-[17px]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.8}
            initial={{ rotate: -45, opacity: 0, scale: 0.7 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: 45, opacity: 0, scale: 0.7 }}
            transition={{ duration: 0.2 }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </motion.svg>
        )}
      </AnimatePresence>
    </button>
  )
}

export default function Navbar() {
  const { isLoaded } = useLoading()
  const pathname = usePathname()
  const [currentCategory, setCurrentCategory] = useState('')

  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const dropdownRef = useRef(null)
  const dropdownTimerRef = useRef(null)

  const handleCategoryChange = useCallback((cat) => {
    setCurrentCategory(cat)
  }, [])

  const checkIsCategoryActive = (category) => {
    if (!category) return pathname === '/blog' && !currentCategory
    return pathname.startsWith('/blog') && currentCategory.toUpperCase() === category.toUpperCase()
  }

  const isBlogActive = pathname.startsWith('/blog')
  const isProjectsActive = pathname.startsWith('/projects')
  const isExperienceActive = pathname.startsWith('/experience')
  const isAwardsActive = pathname.startsWith('/awards')

  const closeMenu = useCallback(() => {
    setMenuOpen(false)
    setDropdownOpen(false)
  }, [])

  const handleDropdownEnter = () => {
    if (dropdownTimerRef.current) clearTimeout(dropdownTimerRef.current)
    setDropdownOpen(true)
  }

  const handleDropdownLeave = () => {
    dropdownTimerRef.current = setTimeout(() => {
      setDropdownOpen(false)
    }, 150)
  }

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev)
  }

  // Click outside & Escape handling for dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setDropdownOpen(false)
    }
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleKeyDown)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [dropdownOpen])

  // Reset states on route change
  useEffect(() => {
    setDropdownOpen(false)
    setMenuOpen(false)
  }, [pathname])

  // Clean scroll listener for frosted navbar background
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.documentElement.style.overflow = 'hidden'
      document.body.style.overflow = 'hidden'
    } else {
      document.documentElement.style.overflow = ''
      document.body.style.overflow = ''
    }
    return () => {
      document.documentElement.style.overflow = ''
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  return (
    <div
      style={{
        visibility: isLoaded ? 'visible' : 'hidden',
        pointerEvents: isLoaded ? 'auto' : 'none',
      }}
      aria-hidden={!isLoaded}
    >
      {/* Accessible Skip Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-accent focus:text-bg focus:font-bold focus:rounded-md focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-accent"
      >
        Lewati ke konten utama
      </a>

      <Suspense fallback={null}>
        <SearchParamWatcher onChange={handleCategoryChange} />
      </Suspense>

      {/* Header Container — enji.dev h-16 format */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-200 ${
          scrolled
            ? 'bg-bg/80 backdrop-blur-md border-b border-text/[0.08]'
            : 'bg-transparent border-b border-transparent'
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 h-16 flex items-center justify-between">

          {/* Left: NavLogo (Bespoke enji.dev squircle + typography) */}
          <Link
            href="/"
            onClick={closeMenu}
            className="flex items-center gap-2 group select-none py-1"
            aria-label="akhmadikbal — Home"
          >
            <div
              className={`w-7 h-7 rounded-lg border-2 flex items-center justify-center transition-all duration-200 ${
                pathname === '/'
                  ? 'border-accent bg-accent text-bg font-black'
                  : 'border-accent text-accent group-hover:bg-accent/10 font-bold'
              }`}
            >
              <span className="text-xs leading-none">A</span>
            </div>
            <div className="text-[15px] font-bold tracking-tight">
              <span className="text-text">akhmad</span>
              <span className="text-accent">ikbal</span>
            </div>
          </Link>

          {/* Center / Desktop Nav: enji.dev NavLinkDropdown style */}
          <nav className="hidden lg:flex items-center gap-1.5" aria-label="Main Navigation">
            <Link
              href="/projects"
              className={`h-9 px-3 text-[13px] font-bold rounded-xl flex items-center transition-colors duration-150 select-none ${
                isProjectsActive
                  ? 'text-accent'
                  : 'text-text/70 hover:text-text hover:bg-text/[0.06]'
              }`}
            >
              Projects
            </Link>

            <Link
              href="/experience"
              className={`h-9 px-3 text-[13px] font-bold rounded-xl flex items-center transition-colors duration-150 select-none ${
                isExperienceActive
                  ? 'text-accent'
                  : 'text-text/70 hover:text-text hover:bg-text/[0.06]'
              }`}
            >
              Experience
            </Link>

            <Link
              href="/awards"
              className={`h-9 px-3 text-[13px] font-bold rounded-xl flex items-center transition-colors duration-150 select-none ${
                isAwardsActive
                  ? 'text-accent'
                  : 'text-text/70 hover:text-text hover:bg-text/[0.06]'
              }`}
            >
              Awards
            </Link>

            <div
              ref={dropdownRef}
              className="relative"
              onMouseEnter={handleDropdownEnter}
              onMouseLeave={handleDropdownLeave}
            >
              {/* Blog ▾ Pill Trigger (enji.dev nav-link--label style) */}
              <button
                onClick={toggleDropdown}
                type="button"
                aria-expanded={dropdownOpen}
                aria-haspopup="true"
                className={`flex h-9 items-center gap-1 rounded-full px-4 text-[13px] font-bold transition-all duration-150 cursor-pointer select-none ${
                  isBlogActive || dropdownOpen
                    ? 'bg-accent/15 text-accent'
                    : 'bg-accent/[0.08] dark:bg-accent/10 text-accent hover:bg-accent/15'
                }`}
              >
                <span>Blog</span>
                <svg
                  className={`w-3 h-3 -mr-0.5 transition-transform duration-200 stroke-[2.5] ${
                    dropdownOpen ? '-rotate-90' : 'rotate-90'
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>

              {/* Floating Dropdown Card (Aligned with Portfolio's Monochrome & Lime Palette) */}
              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute top-11 left-0 w-44 rounded-2xl border border-black/[0.08] dark:border-white/[0.08] bg-surface/95 dark:bg-[#121212]/95 backdrop-blur-md p-1.5 shadow-xl shadow-black/5 dark:shadow-2xl dark:shadow-black/70 z-50 flex flex-col gap-0.5"
                  >
                    <Link
                      href="/blog"
                      onClick={() => setDropdownOpen(false)}
                      className={`h-8 px-3 text-xs font-semibold rounded-xl flex items-center transition-colors duration-150 ${
                        pathname === '/blog' && !currentCategory
                          ? 'bg-accent/15 text-accent font-bold'
                          : 'text-text/80 hover:text-accent hover:bg-text/[0.06]'
                      }`}
                    >
                      All Posts
                    </Link>

                    {blogCategories.map((item) => {
                      const isActive = checkIsCategoryActive(item.category)
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setDropdownOpen(false)}
                          className={`h-8 px-3 text-xs font-semibold rounded-xl flex items-center transition-colors duration-150 ${
                            isActive
                              ? 'bg-accent/15 text-accent font-bold'
                              : 'text-text/80 hover:text-accent hover:bg-text/[0.06]'
                          }`}
                        >
                          {item.label}
                        </Link>
                      )
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>

          {/* Right Actions: GitHub + Theme Toggle + Mobile Toggle */}
          <div className="flex items-center gap-1.5">
            <a
              href="https://github.com/ikballbae"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub Profile"
              className="hidden sm:flex w-8 h-8 rounded-xl items-center justify-center text-text-muted hover:text-text hover:bg-text/[0.06] active:scale-95 transition-all duration-150"
            >
              <svg className="w-[17px] h-[17px]" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
              </svg>
            </a>

            <div className="hidden sm:block h-3.5 w-px bg-text/10 mx-0.5" aria-hidden="true" />

            <ThemeToggle testId="desktop-theme-toggle" />

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              type="button"
              data-testid="mobile-menu-toggle"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu-panel"
              aria-label={menuOpen ? 'Close Menu' : 'Open Menu'}
              className="lg:hidden w-9 h-9 rounded-xl flex items-center justify-center text-text-muted hover:text-text hover:bg-text/[0.06] active:scale-95 transition-all duration-150"
            >
              <div className="w-[17px] flex flex-col gap-[4.5px]">
                <span className={`block h-[1.5px] bg-current transition-all duration-200 origin-center ${menuOpen ? 'rotate-45 translate-y-[6px]' : ''}`} />
                <span className={`block h-[1.5px] bg-current transition-all duration-200 ${menuOpen ? 'opacity-0 scale-x-0' : ''}`} />
                <span className={`block h-[1.5px] bg-current transition-all duration-200 origin-center ${menuOpen ? '-rotate-45 -translate-y-[6px]' : ''}`} />
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer (Clean, intentional, zero-slop) */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu-panel"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="fixed inset-0 z-40 bg-bg lg:hidden flex flex-col pt-16 px-6 pb-8"
          >
            <div className="flex-1 flex flex-col justify-center gap-6 max-w-sm mx-auto w-full">
              {/* Home */}
              <div>
                <Link
                  href="/"
                  onClick={closeMenu}
                  className={`text-2xl font-bold tracking-tight transition-colors duration-150 ${
                    pathname === '/' ? 'text-accent' : 'text-text hover:text-accent'
                  }`}
                >
                  Home
                </Link>
              </div>

              {/* Projects */}
              <div>
                <Link
                  href="/projects"
                  onClick={closeMenu}
                  className={`text-2xl font-bold tracking-tight transition-colors duration-150 ${
                    isProjectsActive ? 'text-accent' : 'text-text hover:text-accent'
                  }`}
                >
                  Projects
                </Link>
              </div>

              {/* Experience */}
              <div>
                <Link
                  href="/experience"
                  onClick={closeMenu}
                  className={`text-2xl font-bold tracking-tight transition-colors duration-150 ${
                    isExperienceActive ? 'text-accent' : 'text-text hover:text-accent'
                  }`}
                >
                  Experience
                </Link>
              </div>

              {/* Awards */}
              <div>
                <Link
                  href="/awards"
                  onClick={closeMenu}
                  className={`text-2xl font-bold tracking-tight transition-colors duration-150 ${
                    isAwardsActive ? 'text-accent' : 'text-text hover:text-accent'
                  }`}
                >
                  Awards
                </Link>
              </div>

              {/* Blog & Subcategories */}
              <div className="flex flex-col gap-2 pt-4 border-t border-text/[0.08]">
                <Link
                  href="/blog"
                  onClick={closeMenu}
                  className={`text-2xl font-bold tracking-tight transition-colors duration-150 ${
                    pathname === '/blog' && !currentCategory ? 'text-accent' : 'text-text hover:text-accent'
                  }`}
                >
                  Blog
                </Link>
                <div className="flex flex-col gap-2.5 pl-3 border-l-2 border-accent/20 mt-1">
                  <Link
                    href="/blog"
                    onClick={closeMenu}
                    className={`text-sm font-semibold transition-colors duration-150 ${
                      pathname === '/blog' && !currentCategory ? 'text-accent' : 'text-text-muted hover:text-text'
                    }`}
                  >
                    All Posts
                  </Link>
                  {blogCategories.map((item) => {
                    const isActive = checkIsCategoryActive(item.category)
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={closeMenu}
                        className={`text-sm font-semibold transition-colors duration-150 ${
                          isActive ? 'text-accent' : 'text-text-muted hover:text-text'
                        }`}
                      >
                        {item.label}
                      </Link>
                    )
                  })}
                </div>
              </div>

              {/* Actions: Contact */}
              <div className="pt-4 border-t border-text/[0.08] flex flex-col gap-3">
                <a
                  href="mailto:akhmadikbalkhoir@gmail.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={closeMenu}
                  className="text-sm font-bold text-accent hover:underline flex items-center gap-1.5"
                >
                  <span>Hubungi via Email</span>
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Mobile Footer */}
            <div className="text-center text-xs text-text-muted/80 font-mono">
              akhmadikbal &mdash; 2026
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
