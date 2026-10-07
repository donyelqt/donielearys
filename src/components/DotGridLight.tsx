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
const HOVER_RADIUS = 115 // ~3.6 cells, scaled from the reference's 90px at a 25px gap
const PEAK_ALPHA = 0.24 // measured ceiling for glyphs. Denser strokes overlap
                       // harder than the arcs they replaced, so this sits below
                       // the disc value and holds the composited peak at ~7:1
                       // under white display type.
// Adaptive ceiling. PEAK_ALPHA is the floor, applied where the light crosses
// text; over open grid nothing competes for the pixel, so the glyphs can run
// far brighter at no legibility cost. Full white measures 1.28:1 behind
// --foreground, which is why brightness is spent only where it is safe.
const BRIGHT_ALPHA = 0.9
const TEXT_PROBE_INTERVAL = 0.12 // seconds between hit-tests; per-frame is
                                 // needless layout work for a value that changes slowly

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

/**
 * True when the point sits over something that renders text, so the light has
 * a reason to stay dim. Walks up from the hit element looking for an element
 * that actually paints glyphs, since most text here is a bare <span> or
 * <div> inside a positioned card.
 */
function isOverText(x: number, y: number) {
  const hit = document.elementFromPoint(x, y)
  if (!hit) return false
  let el: Element | null = hit
  for (let depth = 0; el && depth < 6; depth++) {
    const tag = el.tagName
    if (tag === "P" || tag === "H1" || tag === "H2" || tag === "H3" || tag === "SPAN" || tag === "A") {
      return true
    }
    el = el.parentElement
  }
  return false
}

/* Density ramp. Influence selects the glyph, so the light reads as the cursor
 * writing onto the grid rather than dots swelling under it. Reuses the site's
 * existing terminal vocabulary (font-mono, the boot ASCII logo) instead of
 * inventing a new one. */
// Measured ink coverage at 14px in a 32px cell: a filled dot of radius 4
// covers ~50px, so the light end of the ramp must start where a glyph is still
// legible. "." and "·" covered only 2px and vanished against the static grid.
const ASCII_RAMP = ":+*xX#@" // sparse -> dense, min coverage 4px
const GLYPH_SIZE = 14 // px, sits inside the 32px cell
const GLYPH_INK_BOOST = 1.5 // glyph strokes cover far less area than a filled
                            // disc, so alpha needs a lift to match its weight


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
    let ceiling = PEAK_ALPHA
    let overText = false
    let sinceProbe = 0

    function resize() {
      width = window.innerWidth
      height = window.innerHeight
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      surface.width = Math.round(width * dpr)
      surface.height = Math.round(height * dpr)
      surface.style.width = `${width}px`
      surface.style.height = `${height}px`
      context.setTransform(dpr, 0, 0, dpr, 0, 0)
      // Canvas text state is expensive to parse, so the font and alignment are
      // configured once per resize rather than per glyph. The family is named
      // explicitly: `var(--font-geist-mono)` is valid CSS but does NOT resolve
      // in the canvas font shorthand, which silently fell back to 10px
      // sans-serif and rendered the ramp at a fraction of its intended size.
      context.font = `${GLYPH_SIZE}px "Geist Mono", "Geist Mono Fallback", ui-monospace, monospace`
      context.textAlign = "center"
      context.textBaseline = "middle"
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
            // Taper tuned for THIS grid, not ported. Measured against the
            // static dots at --grid-minor (alpha 20/255): the reference's
            // pow(1-along, 1.65) drove the last three segments to alpha 1-8,
            // below the background dots, so two thirds of the streak was
            // invisible on a real swipe despite the physics being correct.
            // These weights keep every segment above that floor while still
            // tapering, so the whole comet reads.
            const radius = HOVER_RADIUS * (0.42 + (0.22 - 0.42) * along)
            const fade = 0.62 + 0.38 * Math.pow(1 - along, 0.85)
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

          // The light sits BEHIND content, so brightness is spent only where it
          // is safe. Behind text the ceiling drops to PEAK_ALPHA, which measures
          // ~7:1 against --foreground; over open grid nothing competes for the
          // pixel, so the ceiling rises to BRIGHT_ALPHA and the glyphs read as
          // white rather than grey.
          //
          // Neutral white, matching `--grid-minor`. Tinting toward the accent
          // would recolour the grid as the cursor passes and spend an accent
          // already carrying nine semantic jobs.
          const glyph =
            ASCII_RAMP[
              Math.min(ASCII_RAMP.length - 1, Math.floor(influence * ASCII_RAMP.length))
            ]
          context.fillStyle = `rgba(255, 255, 255, ${Math.min(
            1,
            influence * ceiling * GLYPH_INK_BOOST
          )})`
          context.fillText(glyph, x, y)

          // Glyphs are wider than the previous 8px dot radius, so the dirty
          // rect is sized to the glyph box or stale marks survive between frames.
          const half = GLYPH_SIZE * 0.6
          drawn = true
          boxMinX = Math.min(boxMinX, x - half)
          boxMinY = Math.min(boxMinY, y - half)
          boxMaxX = Math.max(boxMaxX, x + half)
          boxMaxY = Math.max(boxMaxY, y + half)
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

      // Probe what is under the cursor, then ease the ceiling toward the safe
      // value for that context. Easing rather than snapping keeps the light
      // from flickering as the cursor crosses a heading. elementFromPoint forces
      // layout, so it is throttled to a fixed interval instead of every frame.
      sinceProbe += dt
      if (pointerInside && sinceProbe >= TEXT_PROBE_INTERVAL) {
        sinceProbe = 0
        overText = isOverText(pointerX, pointerY)
      }
      const ceilingTarget = overText ? PEAK_ALPHA : BRIGHT_ALPHA
      ceiling += (ceilingTarget - ceiling) * (1 - Math.exp(-7 * dt))
      if (Math.abs(ceilingTarget - ceiling) < 0.001) ceiling = ceilingTarget

      const parked = integrate(dt)

      // Parked head, settled intensity and settled ceiling costs nothing: no
      // clear, no draw, no paint.
      if (parked && intensity === target && ceiling === ceilingTarget) {
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
