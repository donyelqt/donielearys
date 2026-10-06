"use client"

import { useEffect, useRef } from "react"
import { useTheme } from "next-themes"
import { useReducedMotion } from "framer-motion"

/* Cursor-reactive light on the dot grid.
 *
 * Geometry is locked to `.grid-pattern::before` in globals.css (32px tile,
 * `radial-gradient(circle at 1px 1px)`, `background-position: center`) so lit
 * dots land exactly on the static dots instead of drifting a half-cell off them.
 *
 * The light is neutral white on neutral white dots, so it reads as illumination
 * of the existing grid rather than a coloured object travelling over it.
 * Elevation on a dark surface is carried by luminance in every design system,
 * and the site already spends its single accent on nine semantic jobs.
 */

const GAP = 32
const DOT_RADIUS = 1
const HOVER_RADIUS = 115
const GROW_RADIUS = 7 // dot swells 1px -> 8px at full influence, keeping cell gaps visible
const PEAK_ALPHA = 0.42 // highest value still clearing WCAG AAA (4.7:1) for body-size white text
const FADE_IN_RATE = 11
const FADE_OUT_RATE = 4.5
const MAX_DPR = 2
const EXP_FLOOR = Math.exp(-4)

/** Normalized exponential falloff: 1 at the centre, exactly 0 at `radius`. */
function exponentialFalloff(distance: number, radius: number) {
  const t = Math.min(Math.max(distance / Math.max(radius, 1e-6), 0), 1)
  return (Math.exp(-4 * t * t) - EXP_FLOOR) / (1 - EXP_FLOOR)
}

export default function DotGridLight() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const { resolvedTheme } = useTheme()
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    if (resolvedTheme !== "dark") return
    // Reduced motion: no canvas at all. A cursor-following comet is exactly the
    // kind of unrequested motion the preference exists to suppress, and the
    // static CSS dot grid underneath is already a complete, calm backdrop.
    if (prefersReducedMotion) return

    const canvas = canvasRef.current
    if (!canvas) return
    const rawCtx = canvas.getContext("2d")
    if (!rawCtx) return

    // Function declarations below are hoisted, so TS widens these back to
    // `| null` inside them. Bind non-null aliases once.
    const context: CanvasRenderingContext2D = rawCtx
    const surface: HTMLCanvasElement = canvas

    // No cursor to follow on touch, and the effect is pure decoration there.
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return

    let width = 0
    let height = 0
    let dpr = 1
    let pointerX = 0
    let pointerY = 0
    let headX = 0
    let headY = 0
    let pointerInside = false
    let intensity = 0
    let rafId = 0
    let lastTime = 0
    let dirty: [number, number, number, number] | null = null
    let moved = false
    let settled = false

    function resize() {
      width = window.innerWidth
      height = window.innerHeight
      dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR)
      surface.width = Math.round(width * dpr)
      surface.height = Math.round(height * dpr)
      surface.style.width = `${width}px`
      surface.style.height = `${height}px`
      context.setTransform(dpr, 0, 0, dpr, 0, 0)
      // Geometry moved under the light; drop stale pixels before the next draw.
      dirty = null
      context.clearRect(0, 0, width, height)
      wake()
    }

    function draw() {
      if (dirty) {
        const [dx, dy, dw, dh] = dirty
        context.clearRect(dx, dy, dw, dh)
      }

      const minX = headX - HOVER_RADIUS
      const maxX = headX + HOVER_RADIUS
      const minY = headY - HOVER_RADIUS
      const maxY = headY + HOVER_RADIUS

      // Mirrors `background-position: center` on the CSS grid tile.
      const originX = (width - GAP) / 2 + 1
      const originY = (height - GAP) / 2 + 1

      const kFrom = Math.ceil((minX - originX) / GAP)
      const kTo = Math.floor((maxX - originX) / GAP)
      const jFrom = Math.ceil((minY - originY) / GAP)
      const jTo = Math.floor((maxY - originY) / GAP)

      let drawn = false
      let boxMinX = Infinity
      let boxMinY = Infinity
      let boxMaxX = -Infinity
      let boxMaxY = -Infinity

      for (let j = jFrom; j <= jTo; j++) {
        const y = originY + j * GAP
        for (let k = kFrom; k <= kTo; k++) {
          const x = originX + k * GAP

          const dx = x - headX
          const dy = y - headY
          const influence = exponentialFalloff(Math.sqrt(dx * dx + dy * dy), HOVER_RADIUS) * intensity
          if (influence < 0.004) continue

          const radius = DOT_RADIUS + influence * GROW_RADIUS
          // The light sits BEHIND content, so it is bounded by a legibility
          // budget, not by taste: an uncapped white dot composites to ~rgb(194)
          // and drops white display type to ~2:1 against it. PEAK_ALPHA caps the
          // brightest pixel this layer can emit.
          context.fillStyle = `rgba(255, 255, 255, ${influence * PEAK_ALPHA})`
          context.beginPath()
          context.arc(x, y, radius, 0, Math.PI * 2)
          context.fill()

          drawn = true
          boxMinX = Math.min(boxMinX, x - radius)
          boxMinY = Math.min(boxMinY, y - radius)
          boxMaxX = Math.max(boxMaxX, x + radius)
          boxMaxY = Math.max(boxMaxY, y + radius)
        }
      }

      dirty = drawn ? [boxMinX, boxMinY, boxMaxX - boxMinX, boxMaxY - boxMinY] : null
    }

    function tick(now: number) {
      const dt = lastTime === 0 ? 1 / 60 : Math.min((now - lastTime) / 1000, 0.05)
      lastTime = now

      const target = pointerInside ? 1 : 0
      const rate = pointerInside ? FADE_IN_RATE : FADE_OUT_RATE
      intensity += (target - intensity) * (1 - Math.exp(-rate * dt))
      if (Math.abs(target - intensity) < 0.001) intensity = target

      headX = pointerX
      headY = pointerY

      // Parked and settled costs nothing: no clear, no draw, no paint. The
      // guard must compare against the PREVIOUS frame's head, otherwise the
      // assignment above makes it a tautology that never fires again once the
      // cursor rests, and every later move is dropped.
      if (intensity === target && !moved && settled) {
        rafId = 0
        lastTime = 0
        moved = false
        settled = true
        return
      }

      draw()
      settled = intensity === target
      moved = false
      rafId = requestAnimationFrame(tick)
    }

    function wake() {
      if (rafId === 0) {
        lastTime = 0
        rafId = requestAnimationFrame(tick)
      }
    }

    function onPointerMove(event: PointerEvent) {
      pointerX = event.clientX
      pointerY = event.clientY
      pointerInside = true
      moved = true
      wake()
    }

    function onPointerLeave() {
      pointerInside = false
      wake()
    }

    function onVisibilityChange() {
      if (document.hidden) {
        cancelAnimationFrame(rafId)
        rafId = 0
        lastTime = 0
      }
    }

    resize()
    wake()

    window.addEventListener("resize", resize)
    window.addEventListener("pointermove", onPointerMove, { passive: true })
    document.addEventListener("pointerleave", onPointerLeave)
    document.addEventListener("visibilitychange", onVisibilityChange)

    return () => {
      cancelAnimationFrame(rafId)
      rafId = 0
      window.removeEventListener("resize", resize)
      window.removeEventListener("pointermove", onPointerMove)
      document.removeEventListener("pointerleave", onPointerLeave)
      document.removeEventListener("visibilitychange", onVisibilityChange)
    }
  }, [resolvedTheme, prefersReducedMotion])

  return <canvas ref={canvasRef} aria-hidden="true" className="fixed inset-0 -z-10 pointer-events-none" />
}
