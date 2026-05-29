"use client"

import React, { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { motion, useReducedMotion } from 'framer-motion'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
}

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
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <motion.div
          variants={prefersReducedMotion ? {} : containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.h2 variants={itemVariants} className="text-3xl md:text-5xl font-bold mb-8">About</motion.h2>
          <motion.div variants={itemVariants} className="space-y-6 text-white/60 text-base leading-relaxed">
            <p>
              I'm Doniele Arys Antonio, a 3rd-year Computer Science student at the Center of Excellence in ITE at the University of the Cordilleras, driven by continuous learning in software engineering and AI systems. My journey in tech began early with a deep curiosity about how software works, leading me to become a self-taught full-stack engineer with a strong focus on agentic AI systems, infrastructure design, and applied machine learning.
            </p>
            <p>
              I'm currently an AI Infrastructure & Security Engineer at Avaron, a US-based company developing autonomous data center systems. My work centers on designing reliable agentic workflows and implementing infrastructure-level security for AI operations. Notably, I am the first and youngest Filipino software engineer contributing to this initiative.
            </p>
            <p>
              Beyond industry work, I've architected a novel AI-assisted autonomous civic governance framework for my CS thesis. This multi-agent architecture monitors public sentiment and translates it into verifiable, actionable governance insights—a novel approach grounded in research from Stanford, Microsoft Research, and related large-scale AI systems.
            </p>
            <p>
              Outside of tech, I'm a competitive spirit who enjoys gaming and basketball. This nature drives my commitment to problem-solving and innovation in my tech projects—from Baguio to the global stage.
            </p>
          </motion.div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="relative aspect-square rounded-none overflow-hidden glass p-1"
        >
          <Image 
            src="/donielecolored.jpg" 
            alt="Doniele Arys Antonio" 
            fill 
            className="object-cover grayscale hover:grayscale-0 transition-all duration-500 cursor-pointer"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
          <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-white/5 rounded-full blur-2xl" />
          <div className="absolute -top-6 -left-6 w-32 h-32 bg-white/5 rounded-full blur-2xl" />
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        viewport={{ once: true }}
        className="max-w-3xl mx-auto mt-16"
      >
        <div className="macos-terminal rounded-2xl overflow-hidden shadow-2xl border border-white/10">
          <div className="terminal-header flex items-center gap-2 px-4 py-3 bg-[#1a1a1a] border-b border-white/5">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
              <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
              <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
            </div>
            <div className="flex-1 text-center">
              <span className="text-xs text-white/40 font-mono">doniele@portfolio ~ bash</span>
            </div>
            <div className="w-16" />
          </div>
          <div className="terminal-body bg-[#0c0c0c] p-4 h-[400px] overflow-y-auto font-mono text-sm [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {displayedLines.map((line, index) => (
              <div key={index} className="mb-1">
                {line.type === 'command' ? (
                  <div className="flex items-center gap-2">
                    <span className="text-[#27c93f]">❯</span>
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
              <span className="text-[#27c93f] mr-2">❯</span>
              <span className={`text-white/90 ${showCursor ? 'opacity-100' : 'opacity-0'} transition-opacity duration-100`}>_</span>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
