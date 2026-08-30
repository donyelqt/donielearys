"use client"

import React, { useEffect, useSyncExternalStore } from "react"
import Preloader from "./Preloader"

/**
 * Always shows the Preloader on every full load / refresh.
 * (Previously once-per-tab via sessionStorage — now disabled per request.)
 */
const emptySubscribe = () => () => {}
const getMounted = () => true
const getMountedServer = () => false

export default function PreloaderWrapper({ children }: { children: React.ReactNode }) {
  const mounted = useSyncExternalStore(emptySubscribe, getMounted, getMountedServer)

  if (!mounted) {
    return (
      <div className="fixed inset-0 z-[9999] bg-black flex items-center justify-center">
        <div className="text-white/30 font-mono text-[10px] uppercase tracking-widest">initializing…</div>
      </div>
    )
  }

  return (
    <>
      <Preloader />
      {children}
    </>
  )
}
