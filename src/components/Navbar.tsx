"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'

const navItems = [
  { name: 'Home', href: '#' },
  { name: 'About', href: '#about' },
  { name: 'Experience', href: '#experience' },
  { name: 'Projects', href: '#projects' },
  { name: 'Certifications', href: '#certifications' },
  { name: 'Competitions', href: '#competitions' },
  { name: 'Contact', href: '#contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
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

            <div className="hidden lg:flex gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="px-5 py-2.5 text-[10px] font-mono uppercase tracking-widest text-foreground/80 hover:text-foreground transition-colors relative group"
                >
                  {item.name}
                  <motion.div
                    className="absolute bottom-1 left-5 right-5 h-[1px] bg-white opacity-0 group-hover:opacity-100 transition-opacity"
                    layoutId="nav-hover"
                  />
                </Link>
              ))}
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
                transition={{ duration: 0.2, ease: "easeOut" }}
                style={{ transformOrigin: "top" }}
                className="absolute top-full left-0 right-0 bg-black/95 backdrop-blur-2xl border-b border-white/10 lg:hidden overflow-hidden"
              >
                <div className="flex flex-col p-6 gap-1">
                  {navItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={handleLinkClick}
                      className="px-5 py-3.5 text-base font-mono uppercase tracking-widest text-foreground/80 hover:text-white transition-colors"
                    >
                      {item.name}
                    </Link>
                  ))}
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
