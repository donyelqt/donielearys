"use client"

import { useEffect, useState } from "react"
import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion"
import { ArrowUp } from "lucide-react"

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  return (
    <motion.div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 h-[2px] bg-white/20 origin-left z-50"
      style={{ scaleX }}
    />
  )
}

export function BackToTop() {
  const prefersReducedMotion = useReducedMotion()
  const [visible, setVisible] = useState(false)

  /* rAF-throttled; the button is fully removed from the DOM while out of
     range so it can never be tabbed to or clicked while invisible. */
  useEffect(() => {
    let rafId = 0
    const onScroll = () => {
      if (rafId) return
      rafId = requestAnimationFrame(() => {
        rafId = 0
        setVisible(window.scrollY > 100)
      })
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", onScroll)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [])

  if (!visible) return null

  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' })}
      className="fixed bottom-8 right-8 z-40 p-3 bg-white/10 backdrop-blur-sm border border-white/10 hover:bg-white/20 transition-colors rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
      aria-label="Back to top"
    >
      <ArrowUp className="w-5 h-5" />
    </motion.button>
  )
}