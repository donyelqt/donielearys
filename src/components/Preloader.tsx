"use client"

import React, { useState, useEffect, useCallback, useRef } from "react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"

/* Boot sequence lines */
interface BootLine {
  type: "prompt" | "output" | "success" | "warn" | "divider"
  text: string
}

const bootSequence: BootLine[] = [
  { type: "divider", text: "" },
  { type: "output", text: "⏣ Initializing DonieleOS v2.6 ..." },
  { type: "output", text: "→ Loading kernel modules" },
  { type: "success", text: "  ✓ kernel.sys — loaded" },
  { type: "success", text: "  ✓ agentic.sys — loaded" },
  { type: "success", text: "  ✓ infra.sys — loaded" },
  { type: "output", text: "→ Establishing secure socket" },
  { type: "success", text: "  ✓ TLS handshake — 200 OK" },
  { type: "output", text: "→ Validating credentials" },
  { type: "success", text: "  ✓ identity: doniele — CONFIRMED" },
  { type: "divider", text: "" },
  { type: "output", text: "⏣ Starting user session ..." },
  { type: "prompt", text: "❯ PORTFOLIO_READY" },
]

/* ASCII DONIELE block */
const asciiLogo = `
██████╗  ██████╗ ███╗   ██╗██╗███████╗██╗     ███████╗         ██████╗  █████╗  ██████╗  ███████╗
██╔══██╗██╔═══██╗████╗  ██║██║██╔════╝██║     ██╔════╝        ██╔════╝ ██╔══██╗ ██╔══██╗ ██╔════╝
██║  ██║██║   ██║██╔██╗ ██║██║█████╗  ██║     █████╗          ██║      ██║  ██║ ██║  ██║ █████╗
██║  ██║██║   ██║██║╚██╗██║██║██╔══╝  ██║     ██╔══╝          ██║      ██║  ██║ ██║  ██║ ██╔══╝
██████╔╝╚██████╔╝██║ ╚████║██║███████╗███████╗███████╗        ╚██████╗ ╚█████╔╝ ██████╔╝ ███████╗
╚═════╝  ╚═════╝ ╚═╝  ╚═══╝╚═╝╚══════╝╚══════╝╚══════╝         ╚═════╝  ╚════╝  ╚═════╝  ╚══════╝
`

/* Timing — total runtime kept under ~2.5s; skippable at any moment */
const LINE_GAP = 150
const PROGRESS_MS = 2200
const HOLD_AFTER_BOOT = 500
const CURTAIN_MS = 0.7
const CURTAIN_EASE: [number, number, number, number] = [0.76, 0, 0.24, 1]

/* ProgressBar — fills via transform scale, not layout-animating width */
function ProgressBar({ prefersReducedMotion }: { prefersReducedMotion: boolean | null }) {
  return (
    <div className="w-full h-[2px] bg-white/10 relative overflow-hidden">
      <motion.div
        className="absolute inset-y-0 left-0 w-full origin-left bg-linear-to-r from-white/40 via-white to-white/40"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={
          prefersReducedMotion
            ? { duration: 0 }
            : { duration: PROGRESS_MS / 1000, ease: "easeInOut" }
        }
      />
    </div>
  )
}

/* Preloader */
export default function Preloader() {
  const [visibleLines, setVisibleLines] = useState<BootLine[]>([])
  const [showLogo, setShowLogo] = useState(false)
  const [showProgress, setShowProgress] = useState(false)
  const [done, setDone] = useState(false)
  const [exit, setExit] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [showCursor, setShowCursor] = useState(true)
  const prefersReducedMotion = useReducedMotion()
  const rafRef = useRef<number>(0)
  const skippedRef = useRef(false)

  /* Blinking cursor — stops once the sequence completes */
  useEffect(() => {
    if (done) return
    const id = window.setInterval(() => setShowCursor((p) => !p), 500)
    return () => clearInterval(id)
  }, [done])

  /* Add one boot line */
  const addLine = useCallback((idx: number) => {
    if (idx >= bootSequence.length) {
      setDone(true)
      return
    }
    setVisibleLines((prev) => [...prev, bootSequence[idx]])
  }, [])

  /* Kick off staggered boot sequence. All state updates happen inside timer
     callbacks (never synchronously in the effect body); the reduced-motion
     path simply collapses every delay to zero. */
  useEffect(() => {
    const reduced = !!prefersReducedMotion
    const tmLogo = window.setTimeout(() => setShowLogo(true), reduced ? 0 : 200)
    const tmProg = window.setTimeout(() => setShowProgress(true), reduced ? 0 : 700)

    let idx = 0
    const tick = () => {
      addLine(idx)
      idx++
      if (idx <= bootSequence.length) {
        rafRef.current = window.setTimeout(tick, reduced ? 0 : LINE_GAP)
      }
    }
    rafRef.current = window.setTimeout(tick, reduced ? 0 : 700)

    return () => {
      clearTimeout(rafRef.current)
      clearTimeout(tmLogo)
      clearTimeout(tmProg)
    }
  }, [addLine, prefersReducedMotion])

  /* done -> hold -> exit */
  useEffect(() => {
    if (!done) return
    const hold = prefersReducedMotion ? 100 : HOLD_AFTER_BOOT
    const t = window.setTimeout(() => setExit(true), hold)
    return () => window.clearTimeout(t)
  }, [done, prefersReducedMotion])

  /* exit -> wait for curtain anim -> unmount */
  useEffect(() => {
    if (!exit) return
    const ms = prefersReducedMotion ? 0 : (CURTAIN_MS * 1000) + 100
    const t = window.setTimeout(() => setHidden(true), ms)
    return () => window.clearTimeout(t)
  }, [exit, prefersReducedMotion])

  /* Skip: any key or pointer press jumps straight to the curtain exit. */
  useEffect(() => {
    const skip = () => {
      if (skippedRef.current || exit) return
      skippedRef.current = true
      clearTimeout(rafRef.current)
      setShowLogo(true)
      setDone(true)
      setExit(true)
    }
    window.addEventListener("keydown", skip)
    window.addEventListener("pointerdown", skip)
    return () => {
      window.removeEventListener("keydown", skip)
      window.removeEventListener("pointerdown", skip)
    }
  }, [exit])

  if (hidden) return null

  return (
    <div className="fixed inset-0 z-[9999] overflow-hidden" aria-hidden={hidden} role="presentation">
      <span className="sr-only" role="status">
        {done ? "Portfolio ready" : "Loading portfolio"}
      </span>

      {/* Content layer */}
      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center bg-black"
        animate={exit ? { opacity: 0, scale: 0.97 } : { opacity: 1, scale: 1 }}
        transition={exit ? { duration: 0.25, ease: "easeIn" } : { duration: 0.6, ease: "easeOut" }}
      >
        {/* ASCII DONIELE logo */}
        <AnimatePresence>
          {showLogo && (
            <motion.pre
              initial={{ opacity: 0, filter: "blur(6px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, filter: "blur(4px)" }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.8, ease: "easeOut" }}
              className="ascii-art text-white/90 text-[5px] xs:text-[6px] sm:text-[7px] md:text-[8px] leading-tight text-center select-none mb-6"
              aria-hidden="true"
            >
              {asciiLogo}
            </motion.pre>
          )}
        </AnimatePresence>

        {/* Boot terminal */}
        <div className="w-full max-w-md mx-auto">
          <div className="border border-white/10 bg-white/[0.02] px-5 py-4">
            <div className="flex items-center gap-2 mb-3 pb-3 border-b border-white/5">
              <div className="flex gap-1.5">
                <div className="w-2 h-2 rounded-full bg-[#ff5f56]" />
                <div className="w-2 h-2 rounded-full bg-[#ffbd2e]" />
                <div className="w-2 h-2 rounded-full bg-[#27c93f]" />
              </div>
              <span className="text-[10px] font-mono text-white/30 uppercase tracking-widest ml-auto">
                boot — sh
              </span>
            </div>
            <div className="min-h-[200px] sm:min-h-[220px] max-h-[260px] overflow-y-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {visibleLines.map((line, i) => {
                if (line.type === "divider") return <div key={i} className="h-2" />
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="mb-0.5"
                  >
                    {line.type === "prompt" ? (
                      <div className="flex items-center gap-2">
                        <span className="text-red-500 text-sm flex-shrink-0">{'❯'}</span>
                        <span className="text-white/90 font-mono text-[11px] sm:text-xs">
                          {line.text}
                        </span>
                        <span
                          className={`inline-block w-2 h-[14px] bg-white/70 flex-shrink-0 ${
                            showCursor ? "opacity-100" : "opacity-0"
                          } transition-opacity duration-75`}
                        />
                      </div>
                    ) : line.type === "success" ? (
                      <div className="text-green-400/80 font-mono text-[10px] sm:text-[11px] pl-4">
                        {line.text}
                      </div>
                    ) : line.type === "warn" ? (
                      <div className="text-amber-400/80 font-mono text-[10px] sm:text-[11px] pl-4">
                        {line.text}
                      </div>
                    ) : (
                      <div className="text-white/50 font-mono text-[10px] sm:text-[11px]">
                        {line.text}
                      </div>
                    )}
                  </motion.div>
                )
              })}
            </div>
          </div>

          {/* Progress bar */}
          <AnimatePresence>
            {showProgress && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <div className="flex items-center justify-between mt-3 mb-1.5">
                  <span className="text-[10px] font-mono text-white/30 uppercase tracking-widest">
                    Initializing
                  </span>
                  <span className="text-[10px] font-mono text-white/20 tracking-wider">
                    {prefersReducedMotion ? "100%" : "loading..."}
                  </span>
                </div>
                <ProgressBar prefersReducedMotion={prefersReducedMotion} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Status dot */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: done ? 0.5 : 0.2 }}
            transition={{ duration: 0.6 }}
            className="mt-5 flex items-center justify-center gap-3"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span
                className={`absolute inline-flex h-full w-full rounded-full ${
                  done ? "bg-green-400" : "bg-red-400"
                } ${done ? "" : "animate-ping opacity-75"}`}
              />
              <span
                className={`relative inline-flex h-1.5 w-1.5 rounded-full ${
                  done ? "bg-green-500" : "bg-red-600"
                }`}
              />
            </span>
            <span className="text-[10px] font-mono text-white/30 uppercase tracking-widest">
              {done ? "System Ready" : "Booting..."}
            </span>
          </motion.div>
        </div>
      </motion.div>

      {/* Curtain exit shaders (above content, z-20) */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-1/2 bg-black z-20"
        animate={exit ? { scaleY: 1 } : { scaleY: 0 }}
        transition={
          exit
            ? { duration: CURTAIN_MS, ease: CURTAIN_EASE, delay: 0.12 }
            : { duration: 0 }
        }
        style={{ transformOrigin: "top", willChange: "transform" }}
      />
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-1/2 bg-black z-20"
        animate={exit ? { scaleY: 1 } : { scaleY: 0 }}
        transition={
          exit
            ? { duration: CURTAIN_MS, ease: CURTAIN_EASE, delay: 0.12 }
            : { duration: 0 }
        }
        style={{ transformOrigin: "bottom", willChange: "transform" }}
      />

      {/* Footer tags */}
      <div className="absolute bottom-4 left-6 text-[10px] font-mono text-white/15 uppercase tracking-widest select-none z-0">
        DonieleOS v2.6
      </div>
      <div className="absolute bottom-4 right-6 text-[10px] font-mono text-white/25 uppercase tracking-widest select-none z-0">
        {prefersReducedMotion ? "loading" : "click or press any key to skip"}
      </div>
    </div>
  )
}
