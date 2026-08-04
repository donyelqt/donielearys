"use client"

import React, { useState, useEffect } from "react"
import Preloader from "./Preloader"

/**
 * Thin client-only guard that shows the Preloader exactly once per
 * browser-tab session (sessionStorage). Subsequent client navigations
 * skip it entirely.
 */
export default function PreloaderWrapper({ children }: { children: React.ReactNode }) {
  const [show, setShow] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const seen = sessionStorage.getItem("doniele_preloader_seen")
    if (seen === "1") {
      setShow(false)
      return
    }
    sessionStorage.setItem("doniele_preloader_seen", "1")
  }, [])

  /* Before first hydration / mount, render nothing to match SSR */
  if (!mounted) {
    return (
      <div className="fixed inset-0 z-[9999] bg-black flex items-center justify-center">
        <div className="text-white/30 font-mono text-[10px] uppercase tracking-widest">
          initializing…
        </div>
      </div>
    )
  }

  return (
    <>
      {show && <Preloader />}
      {children}
    </>
  )
}