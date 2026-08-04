"use client"

import { useEffect, useState } from "react"

/**
 * Soft radial gradient spotlight that follows the mouse.
 * Radius scales with viewport: tight on mobile, wide on desktop.
 * On touch-only devices, the gradient sits centered at 50%,50% as a
 * static ambient glow — no jarring transitions.
 */
export default function MouseSpotlight() {
  const [radius, setRadius] = useState(600)

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth
      setRadius(w < 640 ? 280 : w < 1024 ? 420 : 600)
    }
    update()
    window.addEventListener("resize", update, { passive: true })
    return () => window.removeEventListener("resize", update)
  }, [])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      document.documentElement.style.setProperty("--mouse-x", `${e.clientX}px`)
      document.documentElement.style.setProperty("--mouse-y", `${e.clientY}px`)
    }
    window.addEventListener("mousemove", handleMouseMove, { passive: true })
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return (
    <div
      className="fixed inset-0 pointer-events-none -z-10"
      style={
        {
          background: `radial-gradient(${radius}px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255,255,255,0.06), transparent 80%)`,
        } as React.CSSProperties
      }
    />
  )
}