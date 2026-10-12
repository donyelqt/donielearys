"use client"

import React, { useCallback, useEffect, useRef, useState } from "react"
import { useReducedMotion } from "framer-motion"

/* Scripted cursor tour of the hero.
 *
 * A fixed, pointer-events-none SVG arrow carries a rounded tooltip and moves
 * between anchor points with translate3d. Tooltip text is revealed one
 * character at a time by toggling a class per <span>, with a caret at the
 * typed edge while characters are still landing.
 *
 * Deterministic by construction: a fixed step list, a fixed per-step dwell, and
 * rAF-driven interpolation. No randomness, no physics, and no dependency on
 * the pointer, so the sequence is identical on every run and safe to verify.
 *
 * Gated on the Preloader curtain having fully closed, ended only by the skip
 * button (or its keyboard equivalent), and suppressed entirely under
 * prefers-reduced-motion.
 */

/** Emitted by Preloader once the curtain has finished animating out. */
export const HERO_READY = "doniele:hero-ready"

const SEEN_KEY = "heroTourSeen"

const DWELL_MS = 2400 // time a step's text stays fully typed
const TYPE_MS = 26 // per character
const TRAVEL_MS = 780 // cursor travel between anchors
const FIRST_DELAY_MS = 700 // beat after the curtain before the tour starts
const BUBBLE_W = 300 // px; must match the max-w below, used to reserve room before choosing a side
const ARROW_TIP = 6 // px; the arrow glyph's tip sits this far into its 26px box
const BUBBLE_MARGIN = 12 // px; smallest gap the tooltip keeps from the viewport edge
const GAP = 28 // px; the horizontal offset the tooltip used before it became a clamp
const CURSOR_W = 26 // px; the cursor container's shrink-to-fit width (its only child is a 26x26 svg)

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
    text: "Based in the Philippines, building across the United States and Southeast Asia.",
    side: "down",
  },
  {
    target: "[data-tour='subtext']",
    text: "From local deployments to global platforms. Shipped, not theoretical.",
    side: "down",
  },
  {
    target: "[data-tour='achievements']",
    text: "Reached Top 20 Global in the AMD hackathon. Open this for the full record.",
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

/** Cubic ease-out used for every hop, so the glide settles rather than stops. */
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
  const [bubbleLeft, setBubbleLeft] = useState(28)
  const [bubbleMax, setBubbleMax] = useState(BUBBLE_W)

  const arrowRef = useRef<HTMLDivElement | null>(null)
  const timers = useRef<number[]>([])
  const raf = useRef(0)

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

      const fromX = Number(arrow.dataset.x ?? rect.left + 12)
      const fromY = Number(arrow.dataset.y ?? rect.top + 12)
      // Bubble sits to the RIGHT of the component by default, matching the
      // original design, with the tip on the component's right edge so pointer
      // and bubble travel the same way. Flips left only when the right edge is
      // too close to the viewport to fit it.
      const roomRight = window.innerWidth - rect.right
      const bubbleOnLeft = roomRight < BUBBLE_W + 46
      // Aim the tip AT the component: on its right or left edge, vertically
      // centred. The box parks ARROW_TIP back because the glyph tip sits that
      // far into its own 26px box. The old maths parked the box 14px above the
      // top edge, so the tip pointed at empty space above the component.
      const toX = bubbleOnLeft ? rect.left - ARROW_TIP : rect.right - ARROW_TIP
      const toY = rect.top + rect.height / 2 - ARROW_TIP
      arrow.dataset.x = String(toX)
      arrow.dataset.y = String(toY)
      setSide(stepDef.side)
      // The tooltip is w-max, so its rendered width GROWS as characters land;
      // a side chosen from today's length fits nothing by the end of the step.
      // So bound it by the widest it can ever get, which keeps it on screen
      // every frame of the typing. body { overflow-x: hidden } is why the
      // original overflow never showed as a scrollbar: it was simply cropped,
      // and the tooltip read as silently truncated text instead of misplaced.
      //
      // The bound also has to leave room for the cursor's own travel. The
      // bubble is a child of the cursor and rides the same translate3d, so it
      // spends TRAVEL_MS crossing from where the last step left off, and a
      // single offset has to hold it on screen at BOTH ends. On a phone that
      // is only possible if the bubble is narrower than the viewport by at
      // least the span between the two positions; without that term the range
      // below inverts, and preferring one margin then just pushes the bubble
      // off the other edge.
      const pathMin = Math.min(fromX, toX)
      const pathMax = Math.max(fromX, toX)
      const bubbleMax = Math.min(
        BUBBLE_W,
        window.innerWidth - BUBBLE_MARGIN * 2 - (pathMax - pathMin)
      )
      const preferred = bubbleOnLeft ? CURSOR_W - GAP - bubbleMax : GAP
      const minLeft = BUBBLE_MARGIN - pathMin
      const maxLeft = window.innerWidth - BUBBLE_MARGIN - bubbleMax - pathMax
      setBubbleMax(bubbleMax)
      // An inverted range means even a zero-span bubble will not fit. Let the
      // minimum win so it stays flush to the left margin rather than floating.
      setBubbleLeft(Math.min(Math.max(preferred, minLeft), Math.max(minLeft, maxLeft)))

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

  /* Replay from wherever the user happens to be standing.
   *
   * The tour anchors to elements inside the hero, so replaying it from the
   * contact section or the footer points a cursor at a target that is off
   * screen, with the bubble drifting out of the viewport alongside it. Put
   * the user back on the hero first, then start.
   *
   * `behavior: "instant"`, not "auto". The body's computed scroll-behavior is
   * `smooth` (globals.css @layer base, plus Tailwind's `scroll-smooth`), and
   * per CSSOM "auto" defers to that computed value rather than overriding it.
   * A glide would leave the tour measuring anchor rects mid-animation, since
   * goToStep reads getBoundingClientRect on its first timer tick.
   *
   * The scroll happens before run(), so the modal lock is not yet applied and
   * the jump is not fought by the body overflow the tour installs. */
  const replay = useCallback(() => {
    if (window.location.pathname !== "/") {
      window.location.assign("/")
      return
    }
    window.scrollTo({ top: 0, behavior: "instant" })
    run()
  }, [run])

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


  /* There is deliberately no scroll or resize bail here any more. Scrolling is
   * locked outright while the tour runs, so a scroll event is not a signal that
   * the user wants out; and a resize is not a failure either, since every step
   * re-measures its own anchor rect before it moves, so a viewport change
   * mid-step self-corrects on the next step. The only exit is the skip button. */

  /* Make the tour modal: nothing underneath it can be clicked, scrolled, or
   * activated by keyboard until the skip button ends it.
   *
   * Three separate mechanisms, because no single one covers every case. The
   * overlay stops the pointer, but it is a block the user can still scroll past
   * by wheel or touch. `overflow: hidden` on the body is the usual scroll lock
   * and follows the Navbar's mobile panel precedent, but iOS Safari ignores it
   * for touch, so wheel and touchmove are cancelled explicitly. Keyboard is its
   * own hole: the overlay intercepts the pointer only, so a link or button
   * that happens to hold focus still fires on Enter. Hence Escape finishes the
   * tour, the keyboard equivalent of the skip button, because trapping a
   * keyboard user with no way out is a WCAG 2.1.2 failure, and Enter/Space are
   * neutralised for the same reason. Tab is left alone: moving focus is not
   * activation, and stealing it would fight the screen reader. */
  useEffect(() => {
    if (!active || done || prefersReducedMotion) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    // `passive: false` or preventDefault() is ignored outright and the browser
    // logs a violation. removeEventListener matches on capture only, but the
    // options object is passed again so the two calls read as a pair.
    const OPTS: AddEventListenerOptions = { passive: false }
    const stopScroll = (event: Event) => event.preventDefault()
    window.addEventListener("wheel", stopScroll, OPTS)
    window.addEventListener("touchmove", stopScroll, OPTS)

    const onKeyDown = (event: KeyboardEvent) => {
      // Capture-phase, so this runs before any handler on the tour's own
      // buttons. Anything originating inside tour chrome is left completely
      // alone, which keeps the skip button operable and stops Enter on it from
      // being cancelled by the rule below.
      const target = event.target
      if (target instanceof Element && target.closest("[data-tour-ui]")) return
      if (event.key === "Escape") {
        finish()
        return
      }
      if (event.key === "Enter" || event.key === " ") event.preventDefault()
    }
    window.addEventListener("keydown", onKeyDown, true)

    return () => {
      window.removeEventListener("wheel", stopScroll, OPTS)
      window.removeEventListener("touchmove", stopScroll, OPTS)
      window.removeEventListener("keydown", onKeyDown, true)
      document.body.style.overflow = previousOverflow
    }
  }, [active, done, prefersReducedMotion, finish])

  useEffect(() => {
    return () => {
      clearTimers()
      cancelAnimationFrame(raf.current)
    }
  }, [clearTimers])

  if (prefersReducedMotion) return null

  const stepDef = step >= 0 ? STEPS[step] : null

  return (
    <>
      {/* The modal boundary. An empty full-viewport block that swallows pointer
          input so nothing on the page underneath can be clicked or tapped while
          the tour runs. z-80 puts it deliberately below the cursor and both tour
          buttons at z-90, so the tour's own chrome stays visible and clickable.
          Sibling of everything else in the fragment: nested inside the
          pointer-events-none cursor container it would be dead, and nested in
          the skip button it would cover the only way out. touch-none stops the
          browser's own gesture handling, overscroll-contain keeps a wheel or
          pull at the edge from chaining into the page behind it. */}
      {active && !done && (
        <div
          data-tour-ui
          className="fixed inset-0 z-[80] touch-none overscroll-contain"
        />
      )}
      {active && (
        <div
          ref={arrowRef}
          id="heroTourCursor"
          aria-hidden="true"
          className="fixed top-0 left-0 z-[90] pointer-events-none"
        >
          {/* Crimson: the accent is the site's one signal colour, and a red
              pointer reads as the agent acting on the page, not as decoration.
              The rim keeps the page background so the glyph separates from the
              bubble behind it. */}
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
              fill="hsl(var(--crimson))"
            />
          </svg>
          {/* w-max with a 300px ceiling, sized from the measured 7.2px advance
              width. At 260px a 67-character step wrapped to three lines with a
              three-character orphan, and an orphan line is what reads as
              truncated text. 300px fits 38 characters per line, so every step
              lands on two lines or fewer. Shrink-to-fit means a partially
              typed sentence hugs its own width instead of sitting in a box
              with 200px of dead space to its right. */}
          <div
            className={`tour-tooltip absolute flex w-max max-w-[300px] flex-col gap-1 bg-foreground px-3 py-2 font-mono text-[12px] leading-[1.5] text-background shadow-[0_10px_28px_-12px_rgba(0,0,0,0.55)] ${
              side === "up" ? "bottom-2" : "top-2"
            }`}
            style={{ left: bubbleLeft, maxWidth: bubbleMax }}
          >
            <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-crimson">
              Doniele Agent
            </span>
            {/* Breaks on WORD boundaries, not characters. Each character was its
                own flex item, and flexbox has no concept of words, so it filled
                a line to its limit and split whatever word straddled that
                point: "them" became "th" / "em", "across" became "acr" / "oss".
                Each word is now one unbreakable flex item, so wrapping can only
                happen between words. Characters keep their own spans for the
                typewriter reveal, and untyped ones are removed from layout
                rather than left transparent, which had the bubble showing a
                short sentence followed by blank space. */}
            <span className="flex flex-wrap items-start">
              {(() => {
                const words = stepDef?.text.split(" ") ?? []
                let cursor = 0
                return words.map((word, wi) => {
                  const chars = Array.from(word)
                  const start = cursor
                  cursor += chars.length
                  return (
                    <span key={`${step}-w${wi}`} className="whitespace-nowrap">
                      {chars.map((ch, ci) => (
                        <span
                          key={ci}
                          className={start + ci < typed ? "" : "hidden"}
                        >
                          {ch}
                        </span>
                      ))}
                      {wi < words.length - 1 && (
                        <span className={cursor < typed ? "" : "hidden"}>
                          {"\u00a0"}
                        </span>
                      )}
                    </span>
                  )
                })
              })()}
              {/* Caret sits at the typed edge and blinks while typing. */}
              {typed < (stepDef?.text.length ?? 0) && (
                <span className="ml-px inline-block h-[15px] w-[1.5px] animate-cursor-blink bg-background" />
              )}
            </span>
          </div>
        </div>
      )}

      {/* Lives beside the cursor container, never inside it. That container is
          aria-hidden, which strips its whole subtree from the accessibility
          tree, so the polite region nested there was never exposed to the
          screen reader and could never fire: the tour ran to completion in
          silence. Out here it announces the step's full text rather than the
          typed prefix, because the prefix advances every TYPE_MS and a region
          mutating dozens of times per second is either debounced into a
          garbled string or dropped outright. Gated on stepDef as well as active
          so the lead-in before the first step exists stays silent. */}
      {active && stepDef ? (
        <span className="sr-only" role="status" aria-live="polite">
          {stepDef.text}
        </span>
      ) : null}

      {/* Sibling of the cursor container, not a child of it: that container is
          pointer-events-none, so anything nested inside it would be unclickable.
          active && !done unmounts this at the exact moment the replay button
          mounts, so the two can never be on screen together. Quieter text and a
          dimmer glyph than replay: skipping is a way out, not a call to action. */}
      {active && !done && (
        <button
          type="button"
          data-tour-ui
          onClick={finish}
          className="fixed bottom-5 left-5 z-[90] flex items-center gap-2 border border-foreground/20 bg-background/70 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/40 backdrop-blur-sm transition-colors hover:border-foreground/40 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
        >
          <span className="text-crimson/60" aria-hidden="true">
            ▸
          </span>
          Skip tour
        </button>
      )}

      {replayVisible && done && (
        <button
          type="button"
          onClick={replay}
          data-tour-ui
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
