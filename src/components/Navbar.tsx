"use client"

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { Menu, X, FileText, Sun, Moon } from 'lucide-react'
import { useTheme } from 'next-themes'

const showCertifications = process.env.NEXT_PUBLIC_CERTIFICATIONS_ENABLED !== 'false'

const navItems = [
  { name: 'Home', href: '#' },
  { name: 'About', href: '#about' },
  { name: 'Experience', href: '#experience' },
  { name: 'Projects', href: '#projects' },
  ...(showCertifications ? [{ name: 'Certifications', href: '#certifications' }] : []),
  { name: 'Validation', href: '#testimonials' },
  { name: 'Competitions', href: '#competitions' },
  { name: 'Contact', href: '#contact' },
]

const springConfig = {
  type: "spring" as const,
  stiffness: 350,
  damping: 35,
  mass: 0.5,
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('Home')
  const [indicatorPos, setIndicatorPos] = useState({ left: 0, width: 0 })
  const [mounted, setMounted] = useState(false)
  const navRef = useRef<HTMLDivElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const mobilePanelRef = useRef<HTMLDivElement>(null)
  const { resolvedTheme, setTheme } = useTheme()

  useEffect(() => setMounted(true), [])

  /* One rAF-throttled scroll listener drives both the backdrop state and
     active-section detection (previously two unthrottled listeners doing
     layout reads on every scroll event). */
  useEffect(() => {
    let rafId = 0

    const measure = () => {
      rafId = 0
      const scrollY = window.scrollY
      setScrolled(scrollY > 20)

      const heroEl = document.querySelector('section')
      if (heroEl && scrollY < heroEl.offsetTop + heroEl.offsetHeight - 100) {
        setActiveSection('Home')
        return
      }

      const sectionElements = navItems
        .filter(item => item.href !== '#')
        .map(item => ({
          name: item.name,
          el: document.getElementById(item.href.replace('#', ''))
        }))
        .filter((item): item is { name: string; el: HTMLElement } => item.el !== null)

      if (sectionElements.length === 0) return

      const threshold = scrollY + window.innerHeight * 0.5
      let found = 'Home'
      for (const section of sectionElements) {
        if (threshold >= section.el.offsetTop) found = section.name
      }
      setActiveSection(found)
    }

    const onScroll = () => {
      if (!rafId) rafId = requestAnimationFrame(measure)
    }

    measure()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [])

  useEffect(() => {
    const updateIndicator = () => {
      const activeIndex = navItems.findIndex(item => item.name === activeSection)
      if (navRef.current && activeIndex >= 0) {
        const navLinks = navRef.current.querySelectorAll('.nav-link')
        const activeLink = navLinks[activeIndex] as HTMLElement | undefined
        if (activeLink) {
          const parentRect = navRef.current.getBoundingClientRect()
          const linkRect = activeLink.getBoundingClientRect()
          setIndicatorPos({
            left: linkRect.left - parentRect.left,
            width: linkRect.width
          })
        }
      }
    }

    updateIndicator()
    /* Re-measure once webfonts settle — link widths shift after font swap. */
    document.fonts?.ready.then(updateIndicator)
    window.addEventListener('resize', updateIndicator)
    return () => window.removeEventListener('resize', updateIndicator)
  }, [activeSection])

  /* Mobile menu behavior: focus moves in, Tab cycles inside, Escape closes,
     body scroll locks, and focus returns to the toggle on close. */
  useEffect(() => {
    if (!mobileMenuOpen) return

    const previouslyFocused = document.activeElement as HTMLElement | null
    const panel = mobilePanelRef.current
    panel?.querySelector<HTMLElement>('a[href], button')?.focus()

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        setMobileMenuOpen(false)
        return
      }
      if (e.key === 'Tab' && panel) {
        const focusables = Array.from(
          panel.querySelectorAll<HTMLElement>('a[href], button')
        )
        if (focusables.length === 0) return
        const first = focusables[0]
        const last = focusables[focusables.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }

    document.addEventListener('keydown', onKeyDown)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
      previouslyFocused?.focus?.()
    }
  }, [mobileMenuOpen])

  const handleLinkClick = () => {
    setMobileMenuOpen(false)
  }

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-foreground focus:text-background focus:font-bold"
      >
        Skip to content
      </a>
      <div className="fixed top-0 left-0 right-0 z-50 flex justify-center border-b border-foreground/5">
        <motion.nav
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          aria-label="Primary"
          className={cn(
            "flex items-center justify-between w-full max-w-7xl px-6 py-4 transition-all duration-300",
            scrolled || mobileMenuOpen
              ? "bg-background"
              : "bg-transparent"
          )}
        >
          <div className="flex items-center gap-8">
            <Link
              href="#"
              aria-label="DonieleAI — back to top"
              className="text-xl font-bold tracking-tighter hover:opacity-80 transition-opacity"
            >
              DonieleAI
            </Link>
            <div className="hidden lg:flex gap-1 relative" ref={navRef}>
              {navItems.map((item) => {
                const isActive = activeSection === item.name
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    aria-current={isActive ? 'location' : undefined}
                    className={cn(
                      "nav-link px-5 py-2.5 text-[10px] font-mono uppercase tracking-widest transition-colors duration-200 relative z-10",
                      isActive ? "text-foreground" : "text-foreground/60 hover:text-foreground/80"
                    )}
                  >
                    {item.name}
                  </Link>
                )
              })}

              <motion.div
                className="absolute bottom-0 h-[1.5px] bg-linear-to-r from-[var(--indicator)] via-[var(--indicator)] to-[var(--indicator)]"
                style={{
                  left: indicatorPos.left,
                  width: indicatorPos.width,
                }}
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  left: indicatorPos.left,
                  width: indicatorPos.width,
                }}
                transition={springConfig}
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
              aria-label="Toggle color theme"
              className="flex items-center justify-center w-11 h-11 border border-foreground/20 text-foreground hover:bg-foreground/5 transition-colors focus-hard"
            >
              {!mounted ? (
                <span className="block w-[18px] h-[18px]" aria-hidden="true" />
              ) : resolvedTheme === 'dark' ? (
                <Sun size={18} aria-hidden="true" />
              ) : (
                <Moon size={18} aria-hidden="true" />
              )}
            </button>

            {/* Compact resume access below sm — the labeled CTA needs the wider header */}
            <Link
              href="/resume.pdf"
              aria-label="Access resume"
              className="sm:hidden flex items-center justify-center w-11 h-11 border border-foreground/20 text-foreground rounded-none hover:bg-foreground/5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50"
            >
              <FileText size={18} />
            </Link>
            <Link
              href="/resume.pdf"
              className="hidden sm:block px-6 py-2.5 text-[10px] font-bold bg-foreground text-background rounded-none hover:bg-foreground/90 transition-colors uppercase tracking-widest"
            >
              Access Resume
            </Link>

            <button
              ref={toggleRef}
              type="button"
              className="lg:hidden p-2.5 -m-1 text-foreground focus-hard"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
              aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                id="mobile-menu"
                ref={mobilePanelRef}
                role="dialog"
                aria-modal="true"
                aria-label="Site navigation"
                initial={{ opacity: 0, scaleY: 0 }}
                animate={{ opacity: 1, scaleY: 1 }}
                exit={{ opacity: 0, scaleY: 0 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                style={{ transformOrigin: "top" }}
                 className="absolute top-full left-0 right-0 bg-background border-b border-foreground/10 lg:hidden overflow-hidden"
              >
                <div className="flex flex-col p-6 gap-1">
                  {navItems.map((item) => {
                    const isActive = activeSection === item.name
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={handleLinkClick}
                        aria-current={isActive ? 'location' : undefined}
                        className={cn(
                          "px-5 py-3.5 text-base font-mono uppercase tracking-widest transition-colors relative",
                          isActive ? "text-foreground" : "text-foreground/60 hover:text-foreground"
                        )}
                      >
                        {item.name}
                        {isActive && (
                          <motion.div
                            className="absolute left-0 top-0 bottom-0 w-[2px] bg-linear-to-b from-[var(--indicator)] via-[var(--indicator)] to-[var(--indicator)] rounded-full"
                            initial={{ scaleY: 0 }}
                            animate={{ scaleY: 1 }}
                            exit={{ scaleY: 0 }}
                            transition={{ type: "spring", stiffness: 400, damping: 30 }}
                            style={{ originY: 0 }}
                          />
                        )}
                      </Link>
                    )
                  })}
                  <Link
                    href="/resume.pdf"
                    onClick={handleLinkClick}
                         className="mt-6 px-6 py-4 text-center text-xs font-bold bg-foreground text-background rounded-none uppercase tracking-widest"
                  >
                    Access Resume
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.nav>
      </div>
    </>
  )
}
