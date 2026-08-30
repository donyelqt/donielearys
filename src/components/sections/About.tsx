"use client"

import React, { useState, useEffect, useCallback, useRef } from 'react'
import Image from 'next/image'
import { motion, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { SectionHeader } from '../SectionHeader'

const terminalLines = [
  { type: 'command', text: 'whoami', delay: 400 },
  { type: 'output', text: 'doniele - AI & Software Engineer', delay: 800 },
  { type: 'command', text: 'cat skills.txt', delay: 1400 },
  { type: 'output', text: '◉ Agentic AI Systems', delay: 1900 },
  { type: 'output', text: '◉ Full-Stack Development', delay: 2100 },
  { type: 'output', text: '◉ Infrastructure Security', delay: 2300 },
  { type: 'output', text: '◉ Applied Machine Learning', delay: 2500 },
  { type: 'command', text: 'cat current_status.txt', delay: 3100 },
  { type: 'output', text: '💼 Accenture - Software Engineer Intern (Cloud Elite)', delay: 3600 },
  { type: 'output', text: '🚀 Avaron - AI Infrastructure & Security Engineer', delay: 3700 },
  { type: 'output', text: '📍 Baguio City, Philippines', delay: 3800 },
  { type: 'command', text: 'neofetch', delay: 4400 },
  { type: 'output', text: '', delay: 4900, isAscii: true },
  { type: 'command', text: 'cat achievement.txt', delay: 5400 },
  { type: 'output', text: '🏆 First & Youngest Filipino Software Engineer to build Autonomous Infrastructure @ Avaron', delay: 5900 },
  { type: 'output', text: '🎯 Deployed Tarana-ai at Baguio City with 150+ beta users & secured startup funding as solo full-stack AI engineer', delay: 6400 },
  { type: 'output', text: '🚀 AI Engineer @ Avaron (Feb 2026) - Deployed at Atlanta Tech Village, 4th largest US startup hub', delay: 6900 },
]

const asciiArt = `
██████╗ ███████╗██╗   ██╗
██╔══██╗██╔════╝██║   ██║
██║  ██║█████╗  ██║   ██║
██║  ██║██╔══╝  ╚██╗ ██╔╝
██████╔╝███████╗  ╚██╔╝
╚═════╝ ╚══════╝   ╚╝
`

function useTerminalTyping() {
  const [displayedLines, setDisplayedLines] = useState<typeof terminalLines>([])
  const [currentLineIndex, setCurrentLineIndex] = useState(0)
  const [showCursor, setShowCursor] = useState(true)
  const prefersReducedMotion = useReducedMotion()
  const cursorIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    cursorIntervalRef.current = setInterval(() => {
      setShowCursor(prev => !prev)
    }, 500)
    return () => {
      if (cursorIntervalRef.current !== null) clearInterval(cursorIntervalRef.current)
    }
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
    const baseDelay =
      currentLineIndex === 0
        ? currentItem.delay
        : currentItem.delay - terminalLines[currentLineIndex - 1].delay
    const timer = setTimeout(() => addLine(currentLineIndex), prefersReducedMotion ? 0 : baseDelay)
    return () => clearTimeout(timer)
  }, [currentLineIndex, addLine, prefersReducedMotion])

  return { displayedLines, showCursor }
}

function TerminalBody({
  displayedLines,
  showCursor,
  bodyClassName,
  textClass,
  promptClass,
  asciiClass,
}: {
  displayedLines: typeof terminalLines
  showCursor: boolean
  bodyClassName: string
  textClass: string
  promptClass: string
  asciiClass: string
}) {
  return (
    <div
      className={bodyClassName}
      style={{ contentVisibility: 'auto', contain: 'layout paint style' }}
    >
      {displayedLines.map((line, index) => (
        <div key={index} className="mb-1">
          {line.type === 'command' ? (
            <div className="flex items-center gap-2">
              <span className={promptClass}>❯</span>
              <span className={textClass}>{line.text}</span>
            </div>
          ) : line.isAscii ? (
            <pre className={`${asciiClass} text-[10px] leading-none`}>{asciiArt}</pre>
          ) : (
            <div className={`${textClass} pl-4`}>{line.text}</div>
          )}
        </div>
      ))}
      <div className="flex items-center">
        <span className={`${promptClass} mr-2`}>❯</span>
        <span className={`${textClass} ${showCursor ? 'opacity-100' : 'opacity-0'} transition-opacity duration-100`}>_</span>
      </div>
    </div>
  )
}

function TerminalWindow({
  variant,
  displayedLines,
  showCursor,
}: {
  variant: 'terminal' | 'brutalist'
  displayedLines: typeof terminalLines
  showCursor: boolean
}) {
  if (variant === 'brutalist') {
    return (
      <>
        <div className="relative overflow-hidden border border-foreground/15 mr-0 lg:mr-12">
          <div className="flex items-center gap-3 px-4 py-2.5 bg-[#0f0f0f] border-b border-foreground/15">
            <span className="text-[10px] font-mono text-crimson uppercase tracking-[0.2em]">[ doniele@portfolio ]</span>
            <div className="flex-1 text-center">
              <span className="text-[10px] font-mono text-white/40 uppercase tracking-[0.2em]">~ bash — session</span>
            </div>
            <span className="barcode h-3 w-10" aria-hidden="true" />
          </div>
          <TerminalBody
            displayedLines={displayedLines}
            showCursor={showCursor}
            bodyClassName="terminal-body bg-[#050505] p-4 h-[360px] sm:h-[440px] md:h-[520px] overflow-y-auto font-mono text-sm [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            textClass="text-white/60"
            promptClass="text-red-500"
            asciiClass="ascii-art text-red-800"
          />
        </div>
        <div className="absolute -top-3 -right-3 w-28 sm:w-40 md:w-48 lg:w-[184px] h-28 sm:h-40 md:h-48 lg:h-[184px] overflow-hidden border border-foreground/25 z-50">
          <Image
            src="/donielecolored.jpg"
            alt="Doniele"
            width={264}
            height={264}
            className="object-cover grayscale hover:grayscale-0 transition-all duration-500"
          />
        </div>
      </>
    )
  }

  return (
    <>
      <div className="apple-window relative overflow-hidden rounded-2xl mr-0 lg:mr-12 border border-white/10 bg-zinc-900 shadow-2xl shadow-black/40">
        <div className="flex items-center gap-2 px-4 py-3 bg-zinc-800 border-b border-white/10">
          <span className="traffic-light h-3 w-3 rounded-full bg-[#ff5f57] ring-1 ring-white/20" />
          <span className="traffic-light h-3 w-3 rounded-full bg-[#febc2e] ring-1 ring-white/20" />
          <span className="traffic-light h-3 w-3 rounded-full bg-[#28c840] ring-1 ring-white/20" />
          <div className="flex-1 text-center">
            <span className="text-[11px] font-mono text-white/40">doniele — zsh — 80×24</span>
          </div>
        </div>
        <TerminalBody
          displayedLines={displayedLines}
          showCursor={showCursor}
          bodyClassName="bg-black p-5 h-[360px] sm:h-[440px] md:h-[520px] overflow-y-auto font-mono text-sm [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          textClass="text-white/70"
          promptClass="text-red-500"
          asciiClass="ascii-art text-red-800"
        />
      </div>
      <div className="apple-portrait absolute -top-3 -right-3 w-28 sm:w-40 md:w-48 lg:w-[184px] h-28 sm:h-40 md:h-48 lg:h-[184px] overflow-hidden rounded-full border border-white/10 shadow-lg z-50">
        <Image
          src="/donielecolored.jpg"
          alt="Doniele"
          width={264}
          height={264}
          className="object-cover grayscale hover:grayscale-0 transition-all duration-500"
        />
      </div>
    </>
  )
}

export default function About() {
  const [variant, setVariant] = useState<'terminal' | 'brutalist'>('brutalist')
  const { displayedLines, showCursor } = useTerminalTyping()

  return (
    <section id="about" className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <SectionHeader index="01" title="About" />
        <p className="max-w-7xl mx-auto -mt-4 mb-12 text-[13px] md:text-sm leading-relaxed text-foreground/50 max-w-2xl">
          Self-taught full-stack engineer crafting agentic AI systems and robust infrastructure.
          From Baguio to global impact—one problem at a time.
        </p>

        <div className="flex items-center justify-end mb-4">
          <div className="inline-flex border border-foreground/20">
            <button
              type="button"
              onClick={() => setVariant('terminal')}
              className={cn(
                'px-3 py-1.5 text-[10px] font-mono uppercase tracking-[0.2em] transition-colors',
                variant === 'terminal'
                  ? 'bg-foreground text-background'
                  : 'text-foreground/50 hover:text-foreground'
              )}
            >
              Apple
            </button>
            <button
              type="button"
              onClick={() => setVariant('brutalist')}
              className={cn(
                'px-3 py-1.5 text-[10px] font-mono uppercase tracking-[0.2em] border-l border-foreground/20 transition-colors',
                variant === 'brutalist'
                  ? 'bg-foreground text-background'
                  : 'text-foreground/50 hover:text-foreground'
              )}
            >
              Brutal
            </button>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto relative"
        >
          <TerminalWindow variant={variant} displayedLines={displayedLines} showCursor={showCursor} />
        </motion.div>
      </div>
    </section>
  )
}
