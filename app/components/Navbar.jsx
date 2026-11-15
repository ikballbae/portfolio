'use client'
import { useEffect, useState, useRef, useCallback } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from './ThemeProvider'
import { useLoading } from '../context/LoadingContext'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

const navLinks = [
  { label: 'Projects', href: '#projects' },
  { label: 'Blog', href: '/blog' },
  { label: 'About', href: '#about' },
]

const workItems = [
  { label: 'Skills & Tools', href: '/skills' },
  { label: 'Experience', href: '/experience' },
  { label: 'Contact', href: '#contact' },
]

function ThemeToggle({ testId = 'theme-toggle' }) {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      type="button"
      data-testid={testId}
      className="relative w-10 h-10 min-w-[40px] min-h-[40px] flex items-center justify-center text-text-muted active:scale-[0.97] lg:hover:text-accent transition-colors duration-200"
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      <AnimatePresence mode="wait" initial={false}>
        {theme === 'dark' ? (
          <motion.svg
            key="sun"
            className="w-[18px] h-[18px]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.75}
            initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </motion.svg>
        ) : (
          <motion.svg
            key="moon"
            className="w-[18px] h-[18px]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.75}
            initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
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
  const isHomePage = pathname === '/'

  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('')
  const [hoveredLink, setHoveredLink] = useState(null)
  const [workDropdownOpen, setWorkDropdownOpen] = useState(false)
  const navRef = useRef(null)
  const progressRef = useRef(null)
  const drawerRef = useRef(null)
  const drawerLinksRef = useRef([])
  const workDropdownRef = useRef(null)
  const navTween = useRef(null)
  const progressTween = useRef(null)
  const drawerTlRef = useRef(null)

  const resolveHref = (href) => {
    if (href.startsWith('#') && !isHomePage) {
      return `/${href}`
    }
    return href
  }

  const checkIsActive = (href) => {
    if (href.startsWith('/')) {
      if (href === '/') return pathname === '/' && !activeSection
      return pathname.startsWith(href)
    }
    if (href.startsWith('#')) {
      return isHomePage && activeSection === href
    }
    return false
  }

  const closeMenu = useCallback(() => {
    setMenuOpen(false)
    setWorkDropdownOpen(false)
  }, [])

  // Close work dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (workDropdownRef.current && !workDropdownRef.current.contains(e.target)) {
        setWorkDropdownOpen(false)
      }
    }
    if (workDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [workDropdownOpen])

  // Scroll listener for glass effect & active states
  useEffect(() => {
    const handleScroll = () => {
      const isMobile = window.innerWidth < 1024
      const threshold = isMobile ? 8 : 50
      setScrolled(window.scrollY > threshold)

      if (isHomePage) {
        const sections = ['contact', 'projects', 'about']
        const scrollPos = window.scrollY + 200
        let current = ''
        for (const id of sections) {
          const el = document.getElementById(id)
          if (el) {
            const top = el.offsetTop
            const height = el.offsetHeight
            if (scrollPos >= top && scrollPos < top + height) {
              current = `#${id}`
              break
            }
          }
        }
        setActiveSection(current)
      }
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll, { passive: true })

    // Progress bar tied to ScrollTrigger
    if (progressRef.current) {
      progressTween.current = gsap.to(progressRef.current, {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: document.documentElement,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.3,
        },
      })
    }

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
      if (progressTween.current?.scrollTrigger) progressTween.current.scrollTrigger.kill()
      if (progressTween.current) progressTween.current.kill()
      if (navTween.current) navTween.current.kill()
    }
  }, [])

  // Animate navbar entrance ONLY AFTER isLoaded is true
  useEffect(() => {
    if (!navRef.current) return

    if (isLoaded) {
      gsap.set(navRef.current, { y: -40, opacity: 0, force3D: true })
      navTween.current = gsap.to(navRef.current, {
        y: 0,
        opacity: 1,
        duration: 0.6,
        ease: 'power3.out',
        delay: 0.1,
      })
    } else {
      gsap.set(navRef.current, { y: -40, opacity: 0 })
    }
  }, [isLoaded])

  // Kunci scroll tanpa lompatan posisi & animasi panel layar penuh GSAP
  useEffect(() => {
    const drawer = drawerRef.current
    const links = drawerLinksRef.current.filter(Boolean)

    if (drawerTlRef.current) {
      drawerTlRef.current.kill()
      drawerTlRef.current = null
    }

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (menuOpen) {
      document.documentElement.style.overflow = 'hidden'
      document.body.style.overflow = 'hidden'

      if (drawer) {
        gsap.set(drawer, { visibility: 'visible', pointerEvents: 'auto' })
        if (prefersReducedMotion) {
          gsap.set(drawer, { clipPath: 'inset(0% 0% 0% 0%)', opacity: 1 })
          gsap.set(links, { y: 0, opacity: 1 })
        } else {
          const tl = gsap.timeline()
          drawerTlRef.current = tl
          tl.fromTo(
            drawer,
            { clipPath: 'inset(0% 0% 100% 0%)', opacity: 1 },
            {
              clipPath: 'inset(0% 0% 0% 0%)',
              duration: 0.42,
              ease: 'expo.out',
            }
          ).fromTo(
            links,
            { y: 22, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.34,
              stagger: 0.045,
              ease: 'power3.out',
            },
            0.12
          )
        }
      }
    } else {
      document.documentElement.style.overflow = ''
      document.body.style.overflow = ''

      if (drawer) {
        if (prefersReducedMotion) {
          gsap.set(drawer, {
            clipPath: 'inset(0% 0% 100% 0%)',
            visibility: 'hidden',
            pointerEvents: 'none',
          })
        } else {
          const tl = gsap.timeline({
            onComplete: () => {
              gsap.set(drawer, { visibility: 'hidden', pointerEvents: 'none' })
            },
          })
          drawerTlRef.current = tl
          tl.to(links, {
            y: -12,
            opacity: 0,
            duration: 0.18,
            stagger: 0.02,
            ease: 'power2.in',
          }).to(
            drawer,
            {
              clipPath: 'inset(0% 0% 100% 0%)',
              duration: 0.3,
              ease: 'power3.inOut',
            },
            0.05
          )
        }
      }
    }

    return () => {
      document.documentElement.style.overflow = ''
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  // Tutup dengan tombol Escape
  useEffect(() => {
    if (!menuOpen) return
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        closeMenu()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [menuOpen, closeMenu])

  return (
    <div
      style={{
        visibility: isLoaded ? 'visible' : 'hidden',
        pointerEvents: isLoaded ? 'auto' : 'none',
      }}
      aria-hidden={!isLoaded}
    >
      {/* Scroll Progress */}
      <div
        ref={progressRef}
        className="fixed top-0 left-0 right-0 h-[2px] bg-accent z-[100] origin-left"
        style={{ transform: 'scaleX(0)' }}
      />

      {/* Navbar */}
      <nav
        ref={navRef}
        data-testid="navbar"
        className={`fixed top-0 w-full z-50 h-[60px] lg:h-auto flex items-center transition-all duration-300 ${scrolled ? 'is-scrolled' : ''}`}
      >
        <div className={`absolute inset-x-0 bottom-0 h-px transition-opacity duration-300 bg-gradient-to-r from-transparent via-text/8 to-transparent ${scrolled ? 'opacity-100' : 'opacity-0'}`} />

        <div className="w-full flex items-center justify-between hero-safe-px md:px-12 lg:px-20 h-[60px] lg:h-auto lg:py-5">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group shrink-0 z-[60]">
            <span className="w-6 h-6 bg-accent flex items-center justify-center text-bg font-bold text-xs rounded-[4px] shrink-0 group-hover:opacity-80 transition-opacity duration-200 select-none">
              A
            </span>
            <span className="font-syne font-bold text-[15px] text-text group-hover:text-accent transition-colors duration-300">
              akhmadikbal
            </span>
          </Link>

          {/* Desktop Nav — flat, enji.dev style with animated gliding pill */}
          <div
            className="hidden lg:flex items-center mx-6"
            onMouseLeave={() => setHoveredLink(null)}
          >
            {/* Primary links */}
            {navLinks.map((link, i) => {
              const isActive = checkIsActive(link.href)
              return (
                <span key={link.href} className="flex items-center">
                  {i > 0 && (
                    <span className="text-text-muted/20 mx-1 text-xs select-none pointer-events-none" aria-hidden="true">·</span>
                  )}
                  <Link
                    href={resolveHref(link.href)}
                    onMouseEnter={() => setHoveredLink(link.href)}
                    className={`px-3 py-1.5 text-[13px] font-grotesk transition-colors duration-200 relative rounded-full z-10 flex items-center justify-center ${
                      isActive ? 'text-accent font-semibold' : 'text-text-muted hover:text-text'
                    }`}
                  >
                    <span className="relative z-10">{link.label}</span>
                    {isActive && (
                      <motion.div
                        layoutId="activeNavPill"
                        className="absolute inset-0 bg-accent/15 border border-accent/35 rounded-full -z-0 shadow-[0_0_12px_rgba(var(--accent-rgb),0.18)]"
                        transition={{ type: "spring", stiffness: 380, damping: 28 }}
                      />
                    )}
                    {hoveredLink === link.href && !isActive && (
                      <motion.div
                        layoutId="hoverNavPill"
                        className="absolute inset-0 bg-text/8 rounded-full -z-0"
                        transition={{ type: "spring", stiffness: 380, damping: 28 }}
                      />
                    )}
                  </Link>
                </span>
              )
            })}

            {/* Work pill */}
            <span className="flex items-center mx-1.5">
              <span className="text-text-muted/20 mx-1 text-xs select-none pointer-events-none" aria-hidden="true">·</span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-accent text-bg text-[12px] font-grotesk font-bold rounded-full cursor-default select-none shadow-[0_0_10px_rgba(var(--accent-rgb),0.25)]">
                Work
                <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
            </span>

            {/* Work sub-links */}
            {workItems.map((item) => {
              const isActive = checkIsActive(item.href)
              return (
                <span key={item.href} className="flex items-center">
                  <span className="text-text-muted/20 mx-1 text-xs select-none pointer-events-none" aria-hidden="true">·</span>
                  <Link
                    href={resolveHref(item.href)}
                    onMouseEnter={() => setHoveredLink(item.href)}
                    className={`px-3 py-1.5 text-[13px] font-grotesk transition-colors duration-200 relative rounded-full z-10 flex items-center justify-center ${
                      isActive ? 'text-accent font-semibold' : 'text-text-muted hover:text-text'
                    }`}
                  >
                    <span className="relative z-10">{item.label}</span>
                    {isActive && (
                      <motion.div
                        layoutId="activeNavPill"
                        className="absolute inset-0 bg-accent/15 border border-accent/35 rounded-full -z-0 shadow-[0_0_12px_rgba(var(--accent-rgb),0.18)]"
                        transition={{ type: "spring", stiffness: 380, damping: 28 }}
                      />
                    )}
                    {hoveredLink === item.href && !isActive && (
                      <motion.div
                        layoutId="hoverNavPill"
                        className="absolute inset-0 bg-text/8 rounded-full -z-0"
                        transition={{ type: "spring", stiffness: 380, damping: 28 }}
                      />
                    )}
                  </Link>
                </span>
              )
            })}
          </div>

          {/* Desktop Right — GitHub + Theme */}
          <div className="hidden lg:flex items-center gap-1 shrink-0">
            <a
              href="https://github.com/ikballbae"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="w-9 h-9 flex items-center justify-center text-text-muted hover:text-text transition-colors duration-200"
            >
              <svg className="w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
              </svg>
            </a>
            <div className="w-px h-4 bg-text/10 mx-0.5" />
            <ThemeToggle testId="desktop-theme-toggle" />
          </div>

          {/* Mobile Right */}
          <div className="flex lg:hidden items-center gap-1 z-[60]">
            <ThemeToggle testId="mobile-theme-toggle" />
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              type="button"
              data-testid="mobile-menu-toggle"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu-panel"
              aria-label={menuOpen ? 'Close Menu' : 'Open Menu'}
              className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center text-text-muted hover:text-text active:scale-[0.95] transition-all duration-200"
            >
              <div className="w-[18px] flex flex-col gap-[5px]">
                <span className={`block h-px bg-current transition-all duration-300 origin-center ${menuOpen ? 'rotate-45 translate-y-[6px]' : ''}`} />
                <span className={`block h-px bg-current transition-all duration-300 ${menuOpen ? 'opacity-0 scale-x-0' : ''}`} />
                <span className={`block h-px bg-current transition-all duration-300 origin-center ${menuOpen ? '-rotate-45 -translate-y-[6px]' : ''}`} />
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Panel */}
      <div
        ref={drawerRef}
        id="mobile-menu-panel"
        data-testid="mobile-menu-panel"
        aria-hidden={!menuOpen}
        style={{
          clipPath: 'inset(0% 0% 100% 0%)',
          visibility: 'hidden',
          pointerEvents: 'none',
        }}
        className="fixed inset-0 z-[70] bg-bg lg:hidden flex flex-col"
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between hero-safe-px h-[60px] border-b border-text/8">
          <Link href="/" onClick={closeMenu} className="flex items-center gap-2">
            <span className="w-6 h-6 bg-accent flex items-center justify-center text-bg font-bold text-xs rounded-[4px] select-none">A</span>
            <span className="font-syne font-bold text-[15px] text-text">akhmadikbal</span>
          </Link>
          <button
            onClick={closeMenu}
            type="button"
            aria-label="Close Menu"
            className="w-11 h-11 flex items-center justify-center text-text-muted hover:text-text active:scale-[0.95] transition-all duration-200"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Nav links */}
        <ul className="flex flex-col flex-1 justify-center hero-safe-px">
          {navLinks.map((link, idx) => {
            const isActive = checkIsActive(link.href)
            return (
              <li
                key={link.href}
                ref={(el) => { drawerLinksRef.current[idx] = el }}
              >
                <Link
                  href={resolveHref(link.href)}
                  onClick={closeMenu}
                  className="flex items-center justify-between py-3 group"
                >
                  <span className={`font-syne text-3xl sm:text-4xl font-bold leading-none transition-colors duration-200 ${
                    isActive ? 'text-accent' : 'text-text group-hover:text-accent'
                  }`}>
                    {link.label}
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="mobileActiveIndicator"
                      className="flex items-center gap-2"
                      transition={{ type: "spring", stiffness: 350, damping: 28 }}
                    >
                      <span className="text-[10px] font-mono tracking-wider uppercase text-accent font-semibold px-2 py-0.5 rounded-full bg-accent/10 border border-accent/25">
                        Active
                      </span>
                      <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                    </motion.div>
                  )}
                </Link>
              </li>
            )
          })}

          {/* Work subsection */}
          <li
            ref={(el) => { drawerLinksRef.current[navLinks.length] = el }}
            className="mt-3 pt-4 border-t border-text/10 flex flex-col gap-0.5"
          >
            <span className="inline-flex items-center gap-1.5 self-start px-2.5 py-0.5 bg-accent/15 text-accent text-[10px] font-grotesk font-bold rounded-full mb-2 select-none">
              Work
              <svg className="w-2 h-2" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
            {workItems.slice(0, 2).map((item) => {
              const isActive = checkIsActive(item.href)
              return (
                <Link
                  key={item.href}
                  href={resolveHref(item.href)}
                  onClick={closeMenu}
                  className={`flex items-center justify-between py-2 font-syne text-xl font-semibold transition-colors duration-200 ${
                    isActive ? 'text-accent' : 'text-text-muted hover:text-accent'
                  }`}
                >
                  <span>{item.label}</span>
                  {isActive && (
                    <motion.span
                      layoutId="mobileWorkIndicator"
                      className="w-2 h-2 rounded-full bg-accent animate-pulse"
                      transition={{ type: "spring", stiffness: 350, damping: 28 }}
                    />
                  )}
                </Link>
              )
            })}
          </li>

          {/* CTA */}
          <li
            ref={(el) => { drawerLinksRef.current[navLinks.length + 1] = el }}
            className="mt-7"
          >
            <Link
              href={resolveHref('#contact')}
              onClick={closeMenu}
              className={`inline-flex items-center gap-2 text-sm font-grotesk font-medium border px-5 py-2.5 transition-all duration-200 ${
                checkIsActive('#contact')
                  ? 'bg-accent text-bg border-accent font-semibold'
                  : 'text-accent border-accent/30 hover:border-accent hover:bg-accent/5'
              }`}
            >
              Let&apos;s Talk
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </li>
        </ul>

        {/* Drawer footer */}
        <div
          ref={(el) => { drawerLinksRef.current[navLinks.length + 2] = el }}
          className="hero-safe-px py-5 border-t border-text/10 flex items-center justify-between"
        >
          <span className="font-mono text-[10px] text-text-muted/30 uppercase tracking-widest">Akhmad Ikbal &mdash; 2024</span>
          <a
            href="https://github.com/ikballbae"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="text-text-muted/40 hover:text-accent transition-colors duration-200"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  )
}
