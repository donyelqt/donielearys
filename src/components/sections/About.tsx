"use client"

import React, { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { motion, useReducedMotion } from 'framer-motion'

const terminalLines = [
  { type: 'command', text: 'whoami', delay: 400 },
  { type: 'output', text: 'doniele - AI Software Engineer', delay: 800 },
  { type: 'command', text: 'cat skills.txt', delay: 1400 },
  { type: 'output', text: '◉ Agentic AI Systems', delay: 1900 },
  { type: 'output', text: '◉ Full-Stack Development', delay: 2100 },
  { type: 'output', text: '◉ Infrastructure Security', delay: 2300 },
  { type: 'output', text: '◉ Applied Machine Learning', delay: 2500 },
  { type: 'command', text: 'cat current_status.txt', delay: 3100 },
  { type: 'output', text: '💼 Accenture - Cloud Engineer Intern (Cloud Elite)', delay: 3600 },
  { type: 'output', text: '🚀 Avaron - AI Infrastructure & Security Engineer', delay: 3700 },
  { type: 'output', text: '📍 Baguio City, Philippines', delay: 3800 },
  { type: 'command', text: 'neofetch', delay: 4400 },
  { type: 'output', text: '', delay: 4900, isAscii: true },
  { type: 'command', text: 'cat achievement.txt', delay: 5400 },
  { type: 'output', text: '🏆 First & Youngest Filipino Software Engineer to build Autonomous Infrastructure @ Avaron', delay: 5900 },
  { type: 'output', text: '🎯 Deployed Tarana-ai at Baguio City with 150+ beta users & secured startup funding as solo full-stack AI engineer', delay: 6400 },
]

const asciiArt = `
       ██████╗ ███████╗██╗   ██╗
       ██╔══██╗██╔════╝██║   ██║
       ██║  ██║█████╗  ██║   ██║
       ██║  ██║██╔══╝  ╚██╗ ██╔╝
       ██████╔╝███████╗ ╚████╔╝
       ╚═════╝ ╚══════╝  ╚═══╝
`

export default function About() {
  const [displayedLines, setDisplayedLines] = useState<typeof terminalLines>([])
  const [currentLineIndex, setCurrentLineIndex] = useState(0)
  const [showCursor, setShowCursor] = useState(true)
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    const cursorTimer = setInterval(() => {
      setShowCursor(prev => !prev)
    }, 500)
    return () => clearInterval(cursorTimer)
  }, [])

  const addLine = useCallback((index: number) => {
    if (index < terminalLines.length) {
      setDisplayedLines(prev => [...prev, terminalLines[index]])
      setCurrentLineIndex(index + 1)
    }
  }, [])

  useEffect(() => {
    if (currentLineIndex >= terminalLines.length) return

    const currentItem = terminalLines[currentLineIndex]
    const baseDelay = currentLineIndex === 0 ? currentItem.delay : currentItem.delay - terminalLines[currentLineIndex - 1].delay

    const timer = setTimeout(() => {
      addLine(currentLineIndex)
    }, prefersReducedMotion ? 0 : baseDelay)

    return () => clearTimeout(timer)
  }, [currentLineIndex, addLine, prefersReducedMotion])

  return (
    <section id="about" className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <motion.h2 className="text-3xl md:text-5xl font-bold mb-4">About</motion.h2>
          <motion.p className="text-white/50 max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
            Self-taught full-stack engineer crafting agentic AI systems and robust infrastructure.
            From Baguio to global impact—one problem at a time.
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto relative"
        >
          <div className="macos-terminal rounded-2xl overflow-hidden shadow-2xl border border-white/10 mr-12">
            <div className="terminal-header flex items-center gap-3 px-4 py-3 bg-[#1a1a1a] border-b border-white/5">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
              </div>
              <div className="flex-1 text-center">
                <span className="text-xs text-white/40 font-mono">doniele@portfolio ~ bash</span>
              </div>
              <div className="w-8" />
            </div>
            <div className="terminal-body bg-[#0c0c0c] p-4 h-[520px] overflow-y-auto font-mono text-sm [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {displayedLines.map((line, index) => (
                <div key={index} className="mb-1">
                  {line.type === 'command' ? (
                    <div className="flex items-center gap-2">
                      <span className="text-red-500">❯</span>
                      <span className="text-white/90">{line.text}</span>
                    </div>
                  ) : line.isAscii ? (
                    <pre className="text-red-800 text-[10px] leading-none">{asciiArt}</pre>
                  ) : (
                    <div className="text-white/60 pl-4">{line.text}</div>
                  )}
                </div>
              ))}
              <div className="flex items-center">
                <span className="text-red-500 mr-2">❯</span>
                <span className={`text-white/90 ${showCursor ? 'opacity-100' : 'opacity-0'} transition-opacity duration-100`}>_</span>
              </div>
            </div>
          </div>
          <div className="absolute -top-3 -right-3 w-46 h-46 rounded-full overflow-hidden border-2 border-white/20 shadow-lg z-50">
            <Image
              src="/donielecolored.jpg"
              alt="Doniele"
              width={264}
              height={264}
              className="object-cover grayscale hover:grayscale-0 transition-all duration-500"
            />
          </div>
        </motion.div>
      </div>
    </section>
  )
}