"use client"

import React, { useRef, useCallback, useEffect, useState } from 'react'
import { motion, useReducedMotion, useMotionValue, AnimatePresence } from 'framer-motion'
import { ArrowRight, ChevronDown, Trophy, Users, Globe, Cpu } from 'lucide-react'
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

const MOTION_SPRING = { type: "spring", stiffness: 400, damping: 25 } as const

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
  const rafId = useRef<number>(0)

  const motionX = useMotionValue(0)
  const motionY = useMotionValue(0)

  useEffect(() => {
    return () => cancelAnimationFrame(rafId.current)
  }, [])

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    if (prefersReducedMotion || !ref.current) return
    if (rafId.current) cancelAnimationFrame(rafId.current)
    const rect = ref.current.getBoundingClientRect()
    const mx = e.clientX - rect.left - rect.width / 2
    const my = e.clientY - rect.top - rect.height / 2

    rafId.current = requestAnimationFrame(() => {
      motionX.set(mx * 0.2)
      motionY.set(my * 0.2)
    })
  }, [prefersReducedMotion, motionX, motionY])

  const handleMouseLeave = useCallback(() => {
    if (prefersReducedMotion) return
    if (rafId.current) cancelAnimationFrame(rafId.current)
    rafId.current = requestAnimationFrame(() => {
      motionX.set(0)
      motionY.set(0)
    })
  }, [prefersReducedMotion, motionX, motionY])

  return (
    <motion.button
      ref={ref}
      style={{ x: motionX, y: motionY }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      transition={MOTION_SPRING}
      className={className}
      aria-label={ariaLabel}
    >
      {children}
    </motion.button>
  )
}


const achievements = [
  {
    title: "AMD Developer Hackathon: ACT II",
    subtitle: "AMD | Google Deepmind",
    stat: "Top 20 Global - Solo",
    detail: "94% accuracy · 4K tokens · Solo · 8 domains",
    highlight: true,
  },
  {
    title: "AI Singapore — National AI Student Challenge",
    subtitle: "AWS | AI Singapore",
    stat: "1st Place PH (Peak)",
    detail: "Top 1-3 PH League · Top 9-15 ASEAN",
  },
  {
    title: "Avaron — Atlanta Tech Village",
    subtitle: "4th Largest US Startup Hub",
    stat: "AI Engineer",
    detail: "Autonomous self-healing data center",
  },
  {
    title: "CS Thesis — External Validation",
    subtitle: "Former US-Based IBM Senior SWE",
    stat: "Validated",
    detail: "AgenticHinaing Eval Framework",
  },
]

const AchievementDropdown = () => {
  const [open, setOpen] = useState(false)
  const [iconIndex, setIconIndex] = useState(0)
  const primary = achievements[0]

  useEffect(() => {
    const interval = setInterval(() => {
      setIconIndex(i => (i + 1) % 2)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative w-full max-w-md mx-auto mt-2">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 px-4 py-3 bg-red-900/20 border border-red-600/40 hover:border-red-500/60 text-left transition-all duration-300 shadow-[0_0_20px_-6px_rgba(220,38,38,0.12)] hover:shadow-[0_0_30px_-6px_rgba(220,38,38,0.2)] group"
      >
        <div className="p-2 bg-red-950/60 border border-red-600/40 shrink-0 relative w-8 h-8 flex items-center justify-center">
          <AnimatePresence mode="wait">
            {iconIndex === 0 ? (
              <motion.div
                key="amd"
                initial={{ opacity: 0, rotateY: 90, scale: 0.6, filter: "blur(4px)" }}
                animate={{ opacity: 1, rotateY: 0, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, rotateY: -90, scale: 0.6, filter: "blur(4px)" }}
                transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-amber-300 drop-shadow-[0_0_8px_rgba(252,211,77,0.4)]">
                  <path d="M18.324 9.137l1.559 1.56h2.556v2.557L24 14.814V9.137zM2 9.52l-2 4.96h1.309l.37-.982H3.9l.408.982h1.338L3.432 9.52zm4.209 0v4.955h1.238v-3.092l1.338 1.562h.188l1.338-1.556v3.091h1.238V9.52H10.47l-1.592 1.845L7.287 9.52zm6.283 0v4.96h2.057c1.979 0 2.88-1.046 2.88-2.472 0-1.36-.937-2.488-2.747-2.488zm1.237.91h.792c1.17 0 1.63.711 1.63 1.57 0 .728-.372 1.572-1.616 1.572h-.806zm-10.985.273l.791 1.932H2.008zm17.137.307l-1.604 1.603v2.25h2.246l1.604-1.607h-2.246z" fill="currentColor" />
                </svg>
              </motion.div>
            ) : (
              <motion.div
                key="trophy"
                initial={{ opacity: 0, rotateY: 90, scale: 0.6, filter: "blur(4px)" }}
                animate={{ opacity: 1, rotateY: 0, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, rotateY: -90, scale: 0.6, filter: "blur(4px)" }}
                transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <Trophy className="h-5 w-5 text-amber-300 drop-shadow-[0_0_8px_rgba(252,211,77,0.4)]" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-bold text-white tracking-tight truncate">{primary.title}</p>
          <p className="text-[8px] font-mono text-white/40 uppercase tracking-wider truncate">{primary.subtitle}</p>
        </div>
        <div className="shrink-0 flex items-center gap-2">
          <span className="px-1.5 py-0.5 text-[8px] font-mono font-bold bg-white text-black uppercase tracking-wider">{primary.stat}</span>
          <ChevronDown className={`h-3.5 w-3.5 text-white/50 transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
        </div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-x-0 top-full mt-2 bg-black/90 border border-white/10 backdrop-blur-xl z-20"
          >
            {achievements.slice(1).map((a, i) => (
              <div
                key={i}
                className={`flex items-center gap-3 px-4 py-2.5 border-b border-white/5 last:border-0 hover:bg-white/[0.03] transition-colors cursor-default ${a.highlight ? "bg-red-900/10" : ""}`}
              >
                <div className="p-1 bg-white/5 border border-white/10 shrink-0">
                  <Trophy className="h-3.5 w-3.5 text-white/40" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-bold text-white/80 truncate">{a.title}</p>
                  <p className="text-[8px] font-mono text-white/30 uppercase truncate">{a.subtitle}</p>
                </div>
                <div className="shrink-0 text-right">
                  <span className="block text-[8px] font-mono font-bold text-amber-400/70 uppercase">{a.stat}</span>
                  <span className="block text-[7px] font-mono text-white/30">{a.detail}</span>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-center gap-6 mt-2 text-[8px] font-mono text-white/45 uppercase tracking-widest">
        <span className="flex items-center gap-1"><Users className="h-2.5 w-2.5" /> 20,000+ participants</span>
        <span className="flex items-center gap-1"><Globe className="h-2.5 w-2.5" /> 4,000+ teams</span>
        <span className="flex items-center gap-1"><Cpu className="h-2.5 w-2.5" /> 8 domains</span>
      </div>
    </div>
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
        className="text-4xl md:text-8xl font-bold tracking-tighter bg-clip-text text-transparent bg-linear-to-br 
        from-white via-white/80 to-white/40 mb-6 max-w-4xl uppercase"
      >
        Doniele Antonio
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.5, delay: 0.2 }}
        className="text-lg md:text-xl text-white/60 max-w-2xl mb-4 leading-relaxed font-mono uppercase"
      >
        From Local to Global
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.5, delay: 0.25 }}
        className="mb-8"
      >
        <AchievementDropdown />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.5, delay: 0.3 }}
        className="flex flex-wrap justify-center gap-4"
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
        <motion.a
          whileHover={{ scale: 1.15 }}
          href="https://github.com/donyelqt"
          target="_blank"
          rel="noopener noreferrer"
          className="w-6 h-6 text-white/50 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 rounded-sm"
          aria-label="GitHub Profile"
        >
          <GithubIcon />
        </motion.a>
        <motion.a
          whileHover={{ scale: 1.15 }}
          href="https://linkedin.com/in/donielearysantonio"
          target="_blank"
          rel="noopener noreferrer"
          className="w-6 h-6 text-white/50 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 rounded-sm"
          aria-label="LinkedIn Profile"
        >
          <LinkedinIcon />
        </motion.a>
        <motion.a
          whileHover={{ scale: 1.15 }}
          href="#"
          target="_blank"
          rel="noopener noreferrer"
          className="w-6 h-6 text-white/50 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 rounded-sm"
          aria-label="Twitter Profile"
        >
          <TwitterIcon />
        </motion.a>
      </motion.div>
    </section>
  )
}
