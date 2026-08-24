"use client"

import React, { useEffect, useSyncExternalStore } from "react"
import Preloader from "./Preloader"

/**
 * Thin client-only guard that shows the Preloader exactly once per
 * browser-tab session (sessionStorage). Subsequent client navigations
 * skip it entirely. Snapshot reads keep this free of hydration mismatches
 * and of setState-inside-effect cascades.
 */
const SEEN_KEY = "doniele_preloader_seen"

const emptySubscribe = () => () => {}
const getMounted = () => true
const getMountedServer = () => false
const getSeen = () => sessionStorage.getItem(SEEN_KEY) === "1"
const getSeenServer = () => false

export default function PreloaderWrapper({ children }: { children: React.ReactNode }) {
  const mounted = useSyncExternalStore(emptySubscribe, getMounted, getMountedServer)
  const seen = useSyncExternalStore(emptySubscribe, getSeen, getSeenServer)

  /* Side-effect only: mark the preloader as shown for this tab session. */
  useEffect(() => {
    sessionStorage.setItem(SEEN_KEY, "1")
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
      {!seen && <Preloader />}
      {children}
    </>
  )
}
