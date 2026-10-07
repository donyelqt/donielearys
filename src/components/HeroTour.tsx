"use client"

import React, { useCallback, useEffect, useRef, useState } from "react"
import { useReducedMotion } from "framer-motion"

/* Scripted cursor tour of the hero.
 *
 * Model is taken from bryllim.com's live implementation, extracted from the
 * DOM rather than guessed: a fixed, pointer-events-none SVG arrow carrying a
 * rounded tooltip, positioned with translate3d; tooltip text is revealed one
 * character at a time by toggling a class per <span>, with a caret bar that
 * tracks the typed width. The tooltip is "talking" only while characters land.
 *
 * Deterministic by construction: a fixed step list, a fixed per-step dwell, and
 * rAF-driven interpolation between anchor points. There is no randomness, no
 * physics, and no dependency on the pointer, so the sequence is identical on
 * every run and safe to verify.
 *
 * Gated on the Preloader curtain having fully closed, dismissed by any real
 * pointer or key input, and suppressed entirely under prefers-reduced-motion.
 */

/** Emitted by Preloader once the curtain has finished animating out. */
export const HERO_READY = "doniele:hero-ready"

const SEEN_KEY = "heroTourSeen"

const DWELL_MS = 2400 // time a step's text stays fully typed
const TYPE_MS = 26 // per character
const TRAVEL_MS = 780 // cursor travel between anchors
const FIRST_DELAY_MS = 700 // beat after the curtain before the tour starts
const BUBBLE_W = 260 // px; fixed bubble width, must match the element below

type Align = "up" | "down" | "left" | "right"

interface Step {
  /** CSS selector for the element this step points at. */
  target: string
  text: string
  /** Which side of the anchor the tooltip sits on. */
  side: Align
}

const STEPS: Step[] = [
  {
    target: "[data-tour='role']",
    text: "I'm Doniele. I build AI systems and the infrastructure behind them.",
    side: "down",
  },
  {
    target: "[data-tour='name']",
    text: "Based in the Philippines, working across Baguio and Singapore.",
    side: "down",
  },
  {
    target: "[data-tour='subtext']",
    text: "From local deployments to global platforms. Shipped, not theoretical.",
    side: "down",
  },
  {
    target: "[data-tour='achievements']",
    text: "Top 20 Global in the AMD hackathon. Open this for the full record.",
    side: "down",
  },
  {
    target: "[data-tour='ctas']",
    text: "Projects and contact, one click away.",
    side: "up",
  },
  {
    target: "[data-tour='social']",
    text: "GitHub and LinkedIn. That is the whole tour.",
    side: "up",
  },
]

/** Cubic ease used for every hop, matching the reference's smooth glide. */
const EASE = (t: number) => 1 - Math.pow(1 - t, 3)

/** Session-scoped "already toured" check. Tolerates private mode, where the
 * read throws and the tour simply replays rather than crashing the page. */
function hasSeenTour() {
  try {
    return window.sessionStorage.getItem(SEEN_KEY) === "1"
  } catch {
    return false
  }
}

export default function HeroTour() {
  const prefersReducedMotion = useReducedMotion()

  const [step, setStep] = useState(-1)
  const [active, setActive] = useState(false)
  const [typed, setTyped] = useState(0)
  // Derived at render, not assigned from an effect: reading sessionStorage here
  // is a pure lookup, and doing it lazily keeps the mount effect setState-free.
  const [alreadySeen, setAlreadySeen] = useState(() => hasSeenTour())
  const [done, setDone] = useState(false)
  const [replayVisible, setReplayVisible] = useState(false)
  const [side, setSide] = useState<Align>("down")
  const [bubbleSide, setBubbleSide] = useState<"left" | "right">("right")

  const arrowRef = useRef<HTMLDivElement | null>(null)
  const timers = useRef<number[]>([])
  const raf = useRef(0)
  const dismissed = useRef(false)

  const clearTimers = useCallback(() => {
    timers.current.forEach((t) => window.clearTimeout(t))
    timers.current = []
  }, [])

  const finish = useCallback(() => {
    clearTimers()
    setActive(false)
    setStep(-1)
    setDone(true)
    setReplayVisible(true)
    setAlreadySeen(true)
    try {
      window.sessionStorage.setItem(SEEN_KEY, "1")
    } catch {
      /* private mode: tour simply replays next load */
    }
  }, [clearTimers])

  /** Runs the full sequence. Deterministic: fixed steps, fixed dwell. */
  const run = useCallback(() => {
    if (prefersReducedMotion) return
    dismissed.current = false
    setDone(false)
    setReplayVisible(false)
    // Replay must clear the seen flag, otherwise the mount effect's guard keeps
    // short-circuiting and the sequence never restarts.
    setAlreadySeen(false)
    // Mount the arrow before any timer can fire, otherwise goToStep finds a
    // null ref and the sequence stalls silently.
    setActive(true)
    clearTimers()

    let index = 0

    const goToStep = (i: number) => {
      const stepDef = STEPS[i]
      const el = document.querySelector(stepDef.target)
      if (!el) {
        // Target missing (layout change): skip rather than stall the tour.
        if (i + 1 < STEPS.length) goToStep(i + 1)
        else finish()
        return
      }

      const rect = el.getBoundingClientRect()
      const arrow = arrowRef.current
      // `active` is set before the first timer fires, so the arrow is mounted
      // by the time this runs. Bailing here would deadlock the sequence.
      if (!arrow) return

      // Park OUTSIDE the target and hang the bubble AWAY from it, on whichever
      // side has room. Anchoring at the corner and offsetting the bubble
      // inboard put it back inside the element, which rendered the bubble text
      // white-on-white over the H1.
      const fromX = Number(arrow.dataset.x ?? rect.left + 12)
      const fromY = Number(arrow.dataset.y ?? rect.top + 12)
      const roomRight = window.innerWidth - (rect.left + rect.width)
      const placeRight = roomRight >= BUBBLE_W + 40
      const anchorX = placeRight ? rect.left + rect.width + 12 : rect.left - 12
      const toX = Math.min(Math.max(12, anchorX), window.innerWidth - 12)
      const rawY = stepDef.side === "up" ? rect.bottom + 14 : rect.top - 14
      const toY = Math.min(Math.max(12, rawY), window.innerHeight - 12)
      arrow.dataset.x = String(toX)
      arrow.dataset.y = String(toY)
      setSide(stepDef.side)
      setBubbleSide(placeRight ? "right" : "left")

      const travelStart = performance.now()
      cancelAnimationFrame(raf.current)
      const travel = (now: number) => {
        const t = Math.min(1, (now - travelStart) / TRAVEL_MS)
        const e = EASE(t)
        arrow.style.transform = `translate3d(${fromX + (toX - fromX) * e}px, ${
          fromY + (toY - fromY) * e
        }px, 0)`
        if (t < 1) raf.current = requestAnimationFrame(travel)
      }
      raf.current = requestAnimationFrame(travel)

      // Type once the cursor has arrived.
      timers.current.push(
        window.setTimeout(() => {
          setStep(i)
          setTyped(0)
        }, TRAVEL_MS)
      )

      for (let c = 1; c <= stepDef.text.length; c++) {
        timers.current.push(
          window.setTimeout(() => setTyped(c), TRAVEL_MS + c * TYPE_MS)
        )
      }

      const typedMs = TRAVEL_MS + stepDef.text.length * TYPE_MS
      timers.current.push(
        window.setTimeout(
          () => {
            index = i + 1
            if (index < STEPS.length) goToStep(index)
            else finish()
          },
          typedMs + DWELL_MS
        )
      )
    }

    timers.current.push(window.setTimeout(() => goToStep(0), FIRST_DELAY_MS))
  }, [clearTimers, finish, prefersReducedMotion])

  /* Kick off once the Preloader curtain has closed.
   *
   * A bare one-shot event is not enough: HeroTour mounts inside Hero, which is
   * itself only revealed after the Preloader unmounts, so the listener is often
   * attached *after* the event has already fired. The Preloader therefore sets
   * a sticky flag on documentElement as well as dispatching, and this checks the
   * flag first, then falls back to the event for the case where it mounts first. */
  useEffect(() => {
    if (prefersReducedMotion || alreadySeen) return
    const onReady = () => run()
    if (document.documentElement.hasAttribute(HERO_READY)) {
      onReady()
      return
    }
    document.addEventListener(HERO_READY, onReady)
    return () => document.removeEventListener(HERO_READY, onReady)
  }, [run, prefersReducedMotion, alreadySeen])

  /* Any real input dismisses. Never on the replay click itself. */
  useEffect(() => {
    if (done || prefersReducedMotion) return

    const dismiss = () => {
      if (dismissed.current) return
      dismissed.current = true
      finish()
    }
    // `true` capture so it fires before component handlers. removeEventListener
    // only needs the capture flag, not the passive option object.
    const OPTS: AddEventListenerOptions = { capture: true, passive: true }
    window.addEventListener("pointerdown", dismiss, true)
    window.addEventListener("keydown", dismiss, true)
    window.addEventListener("wheel", dismiss, OPTS)
    window.addEventListener("touchstart", dismiss, OPTS)
    return () => {
      window.removeEventListener("pointerdown", dismiss, true)
      window.removeEventListener("keydown", dismiss, true)
      window.removeEventListener("wheel", dismiss, true)
      window.removeEventListener("touchstart", dismiss, true)
    }
  }, [done, finish, prefersReducedMotion])

  /* Scroll or resize invalidates the anchor rects; end the tour rather than
     point at a stale position. */
  useEffect(() => {
    if (step < 0) return
    const bail = () => {
      if (!dismissed.current) {
        dismissed.current = true
        finish()
      }
    }
    window.addEventListener("scroll", bail, { passive: true })
    window.addEventListener("resize", bail)
    return () => {
      window.removeEventListener("scroll", bail)
      window.removeEventListener("resize", bail)
    }
  }, [step, finish])

  useEffect(() => {
    return () => {
      clearTimers()
      cancelAnimationFrame(raf.current)
    }
  }, [clearTimers])

  if (prefersReducedMotion) return null

  const stepDef = step >= 0 ? STEPS[step] : null
  const visibleText = stepDef ? stepDef.text.slice(0, typed) : ""

  return (
    <>
      {active && (
        <div
          ref={arrowRef}
          id="heroTourCursor"
          aria-hidden="true"
          className="fixed top-0 left-0 z-[90] pointer-events-none"
        >
          {/* The arrow is the bubble's pointer, not a second graphic: its body
              takes the same colour as the tooltip background and its rim the
              same colour as the tooltip text, so the two read as one object.
              Both are the semantic tokens, so the pairing also inverts cleanly
              with the theme instead of needing a dark-mode branch. */}
          <svg className="block" width="26" height="26" viewBox="0 0 24 24" fill="none">
            <path
              d="M5.5 5.5l3.9 11.7 2.2-5.6 5.6-2.2-11.7-3.9z"
              fill="none"
              stroke="hsl(var(--background))"
              strokeWidth="3.5"
              strokeLinejoin="round"
            />
            <path
              d="M5.5 5.5l3.9 11.7 2.2-5.6 5.6-2.2-11.7-3.9z"
              fill="hsl(var(--foreground))"
            />
          </svg>
          {/* Compact and wraps: an Apple-style callout is a small precise bubble,
              not a banner. `whitespace-nowrap` here was forcing the whole
              sentence onto one 721px line, which is what made it read as a
              slab. Capped width keeps it to two or three short lines. */}
          <div
            className={`tour-tooltip absolute flex w-[260px] flex-col gap-1 bg-foreground px-3 py-2 font-mono text-[12px] leading-[1.5] text-background shadow-[0_10px_28px_-12px_rgba(0,0,0,0.55)] ${
              side === "up" ? "bottom-2" : "top-2"
            } ${bubbleSide === "left" ? "right-7" : "left-7"}`}
          >
            <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-crimson">
              Doniele Agent
            </span>
            <span className="inline-flex items-start">
              {stepDef?.text.split("").map((ch, i) => (
                <span
                  key={`${step}-${i}`}
                  className={i < typed ? "opacity-100" : "opacity-0"}
                >
                  {ch === " " ? "\u00a0" : ch}
                </span>
              ))}
              {/* Caret sits at the typed edge and blinks while typing. */}
              {typed < (stepDef?.text.length ?? 0) && (
                <span className="ml-px inline-block h-[15px] w-[1.5px] animate-cursor-blink bg-background" />
              )}
            </span>
          </div>
          <span className="sr-only" role="status" aria-live="polite">
            {stepDef ? visibleText : ""}
          </span>
        </div>
      )}

      {replayVisible && done && (
        <button
          type="button"
          onClick={run}
          className="fixed bottom-5 left-5 z-[90] flex items-center gap-2 border border-foreground/20 bg-background/70 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/60 backdrop-blur-sm transition-colors hover:border-foreground/40 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
        >
          <span className="text-crimson" aria-hidden="true">
            ▸
          </span>
          Take the tour again
        </button>
      )}
    </>
  )
}
