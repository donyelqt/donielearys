"use client"

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'

const navItems = [
  { name: 'Home', href: '#' },
  { name: 'About', href: '#about' },
  { name: 'Experience', href: '#experience' },
  { name: 'Projects', href: '#projects' },
  { name: 'Certifications', href: '#certifications' },
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
  const navRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const updateIndicator = () => {
      const activeIndex = navItems.findIndex(item => item.name === activeSection)
      if (navRef.current && activeIndex >= 0) {
        const navLinks = navRef.current.querySelectorAll('.nav-link')
        const activeLink = navLinks[activeIndex] as HTMLElement
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
    window.addEventListener('resize', updateIndicator)
    return () => window.removeEventListener('resize', updateIndicator)
  }, [activeSection])

  useEffect(() => {
    const getSectionActiveFromScroll = () => {
      const scrollY = window.scrollY
      const innerHeight = window.innerHeight
      const heroEl = document.querySelector('section')

      if (heroEl) {
        const heroBottom = heroEl.offsetTop + heroEl.offsetHeight
        if (scrollY < heroBottom - 100) {
          setActiveSection('Home')
          return
        }
      }

      const sectionElements = navItems
        .filter(item => item.href !== '#')
        .map(item => ({
          name: item.name,
          el: document.getElementById(item.href.replace('#', ''))
        }))
        .filter((item): item is { name: string; el: HTMLElement } => item.el !== null)

      if (sectionElements.length === 0) return

      const threshold = scrollY + innerHeight * 0.5
      let found = 'Home'

      for (let i = 0; i < sectionElements.length; i++) {
        const sectionTop = sectionElements[i].el.offsetTop
        if (threshold >= sectionTop) {
          found = sectionElements[i].name
        }
      }

      setActiveSection(found)
    }

    getSectionActiveFromScroll()
    window.addEventListener('scroll', getSectionActiveFromScroll, { passive: true })
    return () => window.removeEventListener('scroll', getSectionActiveFromScroll)
  }, [])

  const handleLinkClick = () => {
    setMobileMenuOpen(false)
  }

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-white focus:text-black focus:font-bold"
      >
        Skip to content
      </a>
      <div className="fixed top-0 left-0 right-0 z-50 flex justify-center border-b border-white/5">
        <motion.nav
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className={cn(
            "flex items-center justify-between w-full max-w-7xl px-6 py-4 transition-all duration-300",
            scrolled || mobileMenuOpen
              ? "bg-black/90 backdrop-blur-xl"
              : "bg-transparent"
          )}
        >
          <div className="flex items-center gap-8">
            <div className="text-xl font-bold tracking-tighter">DonieleAI</div>
            <div className="hidden lg:flex gap-1 relative" ref={navRef}>
              {navItems.map((item) => {
                const isActive = activeSection === item.name
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "nav-link px-5 py-2.5 text-[10px] font-mono uppercase tracking-widest transition-colors duration-200 relative z-10",
                      isActive ? "text-white" : "text-foreground/60 hover:text-foreground/80"
                    )}
                  >
                    {item.name}
                  </Link>
                )
              })}

              <motion.div
                className="absolute bottom-0 h-[1.5px] bg-gradient-to-r from-white/60 via-white to-white/60"
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
            <Link
              href="/resume.pdf"
              className="hidden sm:block px-6 py-2.5 text-[10px] font-bold bg-white text-black rounded-none hover:bg-white/90 transition-colors uppercase tracking-widest"
            >
              Access Resume
            </Link>

            <button
              className="lg:hidden p-2 text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 rounded-sm"
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
                initial={{ opacity: 0, scaleY: 0 }}
                animate={{ opacity: 1, scaleY: 1 }}
                exit={{ opacity: 0, scaleY: 0 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                style={{ transformOrigin: "top" }}
                className="absolute top-full left-0 right-0 bg-black/95 backdrop-blur-2xl border-b border-white/10 lg:hidden overflow-hidden"
              >
                <div className="flex flex-col p-6 gap-1">
                  {navItems.map((item) => {
                    const isActive = activeSection === item.name
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={handleLinkClick}
                        className={cn(
                          "px-5 py-3.5 text-base font-mono uppercase tracking-widest transition-colors relative",
                          isActive ? "text-white" : "text-foreground/60 hover:text-white"
                        )}
                      >
                        {item.name}
                        {isActive && (
                          <motion.div
                            className="absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-white/80 via-white to-white/80 rounded-full"
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
                    className="mt-6 px-6 py-4 text-center text-xs font-bold bg-white text-black rounded-none uppercase tracking-widest"
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
