"use client"

import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import NetworkBackground from '../NetworkBackground'

const GithubIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
)

const LinkedinIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
)

const TwitterIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
)

const MagneticButton = ({ 
  children, 
  onClick,
  className,
  ariaLabel
}: { 
  children: React.ReactNode
  onClick?: () => void
  className?: string
  ariaLabel?: string
}) => {
  const ref = React.useRef<HTMLButtonElement>(null)
  const prefersReducedMotion = useReducedMotion()

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (prefersReducedMotion || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    ref.current.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`
  }

  const handleMouseLeave = () => {
    if (prefersReducedMotion || !ref.current) return
    ref.current.style.transform = 'translate(0, 0)'
  }

  return (
    <motion.button
      ref={ref}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={className}
      aria-label={ariaLabel}
    >
      {children}
    </motion.button>
  )
}

export default function Hero() {
  const prefersReducedMotion = useReducedMotion()

  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center text-center px-4 overflow-hidden">
      <NetworkBackground />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-125 h-125 bg-white/[0.07] rounded-full blur-[120px] -z-10" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.5 }}
        className="flex items-center gap-2 px-3 py-1 rounded-none border border-white/10 bg-white/5 text-xs font-mono text-white/60 mb-8 uppercase tracking-widest"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-none bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-none h-2 w-2 bg-red-600"></span>
        </span>
        AI & Software Engineer
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.5, delay: 0.1 }}
        className="text-5xl md:text-8xl font-bold tracking-tighter bg-clip-text text-transparent bg-linear-to-br from-white via-white/80 to-white/40 mb-6 max-w-4xl uppercase"
      >
        Doniele Arys Antonio
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.5, delay: 0.2 }}
        className="text-lg md:text-xl text-white/60 max-w-2xl mb-10 leading-relaxed font-mono uppercase"
      >
        Building Intelligent Systems for Society
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.5, delay: 0.3 }}
        className="flex flex-wrap justify-center gap-4 mt-16"
      >
        <MagneticButton
          onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
          className="px-6 py-3 bg-white text-black text-[10px] font-bold rounded-none flex items-center gap-2 hover:bg-white/90 transition-all group uppercase tracking-widest focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
        >
          View Projects
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </MagneticButton>
        <MagneticButton
          onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
          className="px-6 py-3 border border-white/20 text-white text-[10px] font-bold rounded-none hover:bg-white/5 transition-all uppercase tracking-widest focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
        >
          Contact Me
        </MagneticButton>
      </motion.div>

<motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="mt-20 lg:mt-0 lg:absolute lg:bottom-10 flex gap-6 transition-opacity hover:opacity-100"
      >
        <a 
          href="https://github.com/donyelqt" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="w-6 h-6 text-white/50 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 rounded-sm"
          aria-label="GitHub Profile"
        >
          <GithubIcon />
        </a>
        <a 
          href="https://linkedin.com/in/donielearysantonio" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="w-6 h-6 text-white/50 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 rounded-sm"
          aria-label="LinkedIn Profile"
        >
          <LinkedinIcon />
        </a>
        <a 
          href="#" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="w-6 h-6 text-white/50 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 rounded-sm"
          aria-label="Twitter Profile"
        >
          <TwitterIcon />
        </a>
      </motion.div>
    </section>
  )
}
