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
 * Motion is integrated against real elapsed time rather than per-frame lerps,
 * so the light behaves identically on 60Hz and 144Hz displays. The pointer is
 * followed by a spring-lagged head, and each trail segment chases the one ahead
 * of it with a progressively longer time constant. That chain is what makes a
 * fast swipe read as a stretched wave instead of a rigid blob glued to the
 * cursor, and a slow drift read as a soft halo.
 *
 * Falloff weighting is ported from the reference implementation this was
 * modelled on. The palette is deliberately NOT a port. That reference ramps
 * through a three-stop neon gradient; here the light is neutral white on
 * neutral white dots, so it reads as illumination of the existing grid instead
 * of a coloured object passing over it. Elevation on a dark surface is carried
 * by luminance in every design system, and the site already spends its single
 * accent on nine semantic jobs.
 */

const GAP = 32
const DOT_RADIUS = 1
const HOVER_RADIUS = 115 // ~3.6 cells, scaled from the reference's 90px at a 25px gap
const GROW_RADIUS = 7 // dot swells 1px -> 8px at full influence, keeping cell gaps visible
const PEAK_ALPHA = 0.42 // highest value still clearing WCAG AAA (4.7:1) for body-size white text
const TRAIL_SAMPLES = 8
const HEAD_TAU = 0.045 // seconds; how fast the light chases the cursor
const MAX_SPEED = 9000 // px/s ceiling, stops a re-entering pointer smearing a full-width streak
const FADE_IN_RATE = 11
const FADE_OUT_RATE = 4.5
const SNAP_EPSILON = 0.75 // px; commits a follower that is visually parked, killing the decay crawl
const COLLAPSE_TAU = 0.055 // seconds; tail catch-up once the cursor stops
const EXP_FLOOR = Math.exp(-4)

/* Per-segment time constants, seconds. Monotonic: the tail always lags further
 * than the segment ahead of it, which is what produces the comet taper. */
const SEGMENT_TAUS = [0.05, 0.075, 0.1, 0.135, 0.18, 0.24, 0.32]


/** Normalized exponential falloff: 1 at the centre, exactly 0 at `radius`. */
function exponentialFalloff(distance: number, radius: number) {
  const t = Math.min(Math.max(distance / Math.max(radius, 1e-6), 0), 1)
  return (Math.exp(-4 * t * t) - EXP_FLOOR) / (1 - EXP_FLOOR)
}

function distanceToSegment(
  px: number,
  py: number,
  ax: number,
  ay: number,
  bx: number,
  by: number
) {
  const pax = px - ax
  const pay = py - ay
  const bax = bx - ax
  const bay = by - ay
  const h = Math.min(Math.max((pax * bax + pay * bay) / Math.max(bax * bax + bay * bay, 1e-6), 0), 1)
  const dx = pax - bax * h
  const dy = pay - bay * h
  return Math.sqrt(dx * dx + dy * dy)
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
    let dirty: [number, number, number, number] | null = null

    const trail = new Float64Array(TRAIL_SAMPLES * 2)
    let seeded = false
    let pointerX = 0
    let pointerY = 0
    let headX = 0
    let headY = 0
    let pointerInside = false
    let intensity = 0
    let rafId = 0
    let lastTime = 0

    function resize() {
      width = window.innerWidth
      height = window.innerHeight
      dpr = Math.min(window.devicePixelRatio || 1, 2)
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

    /** Advances the head and the tail chain. Returns true once everything is parked. */
    function integrate(dt: number) {
      if (!seeded) {
        headX = pointerX
        headY = pointerY
        for (let i = 0; i < TRAIL_SAMPLES; i++) {
          trail[i * 2] = headX
          trail[i * 2 + 1] = headY
        }
        seeded = true
        return false
      }

      // Clamp per-frame travel so a pointer teleporting back into the window
      // cannot drag the whole trail across the viewport in one frame.
      const maxStep = MAX_SPEED * dt
      let gx = pointerX - headX
      let gy = pointerY - headY
      const gap = Math.hypot(gx, gy)
      if (gap > maxStep && gap > 0) {
        gx = (gx / gap) * maxStep
        gy = (gy / gap) * maxStep
      }

      // Framerate-independent approach factor for an exponential (spring) follower.
      const kHead = 1 - Math.exp(-dt / HEAD_TAU)
      headX += gx * kHead
      headY += gy * kHead

      // Exponential decay only ever approaches zero. Without a snap threshold
      // the tail crawls visibly past a stop, so an arrived follower is committed.
      const headArrived = Math.hypot(pointerX - headX, pointerY - headY) < SNAP_EPSILON
      if (headArrived) {
        headX = pointerX
        headY = pointerY
      }

      trail[0] = headX
      trail[1] = headY

      if (headArrived) {
        // The streak is a motion artifact. Once the cursor parks, the whole tail
        // is pulled straight at the head. Chasing leader-to-leader here is a
        // serial cascade, so settling time would scale as ln(gap/eps) * sum(tau)
        // and leave a visible streak hanging for seconds after the stop.
        const k = 1 - Math.exp(-dt / COLLAPSE_TAU)
        for (let i = 1; i < TRAIL_SAMPLES; i++) {
          let sx = trail[i * 2] + (headX - trail[i * 2]) * k
          let sy = trail[i * 2 + 1] + (headY - trail[i * 2 + 1]) * k
          if (Math.hypot(headX - sx, headY - sy) < SNAP_EPSILON) {
            sx = headX
            sy = headY
          }
          trail[i * 2] = sx
          trail[i * 2 + 1] = sy
        }
      } else {
        for (let i = 1; i < TRAIL_SAMPLES; i++) {
          const tau = SEGMENT_TAUS[i - 1]
          const k = 1 - Math.exp(-dt / tau)
          let sx = trail[i * 2] + (trail[(i - 1) * 2] - trail[i * 2]) * k
          let sy = trail[i * 2 + 1] + (trail[(i - 1) * 2 + 1] - trail[i * 2 + 1]) * k
          if (Math.hypot(trail[(i - 1) * 2] - sx, trail[(i - 1) * 2 + 1] - sy) < SNAP_EPSILON) {
            sx = trail[(i - 1) * 2]
            sy = trail[(i - 1) * 2 + 1]
          }
          trail[i * 2] = sx
          trail[i * 2 + 1] = sy
        }
      }

      let parked = headArrived
      for (let i = 1; i < TRAIL_SAMPLES && parked; i++) {
        if (trail[i * 2] !== headX || trail[i * 2 + 1] !== headY) parked = false
      }
      return parked
    }

    function draw() {
      if (dirty) {
        const [dx, dy, dw, dh] = dirty
        context.clearRect(dx, dy, dw, dh)
      }

      const tailRadius = HOVER_RADIUS * 0.42

      // Bound the work to the union of the light's footprints instead of
      // walking the whole viewport grid.
      let minX = headX - HOVER_RADIUS
      let maxX = headX + HOVER_RADIUS
      let minY = headY - HOVER_RADIUS
      let maxY = headY + HOVER_RADIUS
      for (let i = 1; i < TRAIL_SAMPLES; i++) {
        minX = Math.min(minX, trail[i * 2] - tailRadius)
        maxX = Math.max(maxX, trail[i * 2] + tailRadius)
        minY = Math.min(minY, trail[i * 2 + 1] - tailRadius)
        maxY = Math.max(maxY, trail[i * 2 + 1] + tailRadius)
      }

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
          let influence = exponentialFalloff(Math.sqrt(dx * dx + dy * dy), HOVER_RADIUS)

          for (let i = 0; i < TRAIL_SAMPLES - 1; i++) {
            const along = (i + 0.5) / (TRAIL_SAMPLES - 1)
            const radius = HOVER_RADIUS * (0.42 + (0.1 - 0.42) * along)
            const fade = Math.pow(1 - along, 1.65)
            const atSegment =
              exponentialFalloff(
                distanceToSegment(
                  x,
                  y,
                  trail[i * 2],
                  trail[i * 2 + 1],
                  trail[i * 2 + 2],
                  trail[i * 2 + 3]
                ),
                radius
              ) * fade
            if (atSegment > influence) influence = atSegment
          }

          influence *= intensity
          if (influence < 0.004) continue

          const radius = DOT_RADIUS + influence * GROW_RADIUS
          // The light sits BEHIND content, so it is bounded by a legibility
          // budget, not by taste: an uncapped white dot composites to ~rgb(194)
          // and drops white display type to ~2:1 against it. PEAK_ALPHA caps the
          // brightest pixel this layer can emit.
          //
          // Neutral white, matching `--grid-minor`. Tinting toward the accent
          // would recolour the dots as the cursor passes, which reads as a
          // coloured blob travelling over the page rather than light falling on
          // it, and it would spend an accent already carrying nine semantic
          // jobs (focus rings, timeline, status, progress).
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
      // First frame after a wake has no previous timestamp; assume one frame.
      const dt = lastTime === 0 ? 1 / 60 : Math.min((now - lastTime) / 1000, 0.05)
      lastTime = now

      const target = pointerInside ? 1 : 0
      const rate = pointerInside ? FADE_IN_RATE : FADE_OUT_RATE
      intensity += (target - intensity) * (1 - Math.exp(-rate * dt))
      if (Math.abs(target - intensity) < 0.001) intensity = target

      const parked = integrate(dt)

      // Parked head + settled intensity costs nothing: no clear, no draw, no paint.
      if (parked && intensity === target) {
        rafId = 0
        lastTime = 0
        return
      }

      draw()
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
    // Starts dark: the light only appears once the pointer actually enters the
    // window. Lighting up dead-centre on load would read as a fake cursor.
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

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 -z-10 pointer-events-none"
    />
  )
}
