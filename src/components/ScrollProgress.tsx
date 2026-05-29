"use client"

import { motion, useScroll, useSpring } from "framer-motion"
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
      className="fixed top-0 left-0 right-0 h-[2px] bg-white/20 origin-left z-50"
      style={{ scaleX }}
    />
  )
}

export function BackToTop() {
  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleClick}
      className="fixed bottom-8 right-8 z-40 p-3 bg-white/10 backdrop-blur-sm border border-white/10 hover:bg-white/20 transition-colors rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
      aria-label="Back to top"
    >
      <ArrowUp className="w-5 h-5" />
    </motion.button>
  )
}