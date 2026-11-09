"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useSyncExternalStore,
  type ReactNode,
} from "react"
import { Volume2, VolumeX } from "lucide-react"
import { playGlassCue, suspendGlassAudio } from "@/lib/click-sound"

const SOUND_KEY = "doniele-interface-sound"
const listeners = new Set<() => void>()

let soundEnabled = false
let soundPreferenceLoaded = false

function readSoundPreference() {
  try {
    return window.localStorage.getItem(SOUND_KEY) === "on"
  } catch {
    return false
  }
}

function getSoundSnapshot() {
  if (typeof window === "undefined") return false
  if (!soundPreferenceLoaded) {
    soundEnabled = readSoundPreference()
    soundPreferenceLoaded = true
  }
  return soundEnabled
}

function getSoundServerSnapshot() {
  return false
}

function subscribeToSound(listener: () => void) {
  listeners.add(listener)
  const onStorage = (event: StorageEvent) => {
    if (event.key !== SOUND_KEY) return
    soundEnabled = event.newValue === "on"
    soundPreferenceLoaded = true
    listener()
  }
  window.addEventListener("storage", onStorage)
  return () => {
    listeners.delete(listener)
    window.removeEventListener("storage", onStorage)
  }
}

function writeSoundPreference(enabled: boolean) {
  soundEnabled = enabled
  soundPreferenceLoaded = true
  try {
    window.localStorage.setItem(SOUND_KEY, enabled ? "on" : "off")
  } catch {
    // Private browsing can reject writes. The in-memory value still drives the UI.
  }
  for (const listener of listeners) listener()
}

const SOUND_TARGET_SELECTOR = [
  "a[href]",
  "button:not(:disabled)",
  "summary",
  "label[for]",
  "input[type='checkbox']:not(:disabled)",
  "input[type='radio']:not(:disabled)",
  "input[type='submit']:not(:disabled)",
  "input[type='button']:not(:disabled)",
  "input[type='reset']:not(:disabled)",
  "[role='button']:not([aria-disabled='true'])",
  "[role='checkbox']:not([aria-disabled='true'])",
  "[role='link']:not([aria-disabled='true'])",
  "[role='menuitem']:not([aria-disabled='true'])",
  "[role='option']:not([aria-disabled='true'])",
  "[role='radio']:not([aria-disabled='true'])",
  "[role='switch']:not([aria-disabled='true'])",
  "[role='tab']:not([aria-disabled='true'])",
  "[data-sound]",
].join(",")

function getSoundTarget(target: Element) {
  if (target.closest("[data-sound-ignore]")) return null
  return target.closest(SOUND_TARGET_SELECTOR)
}

type SoundContextValue = {
  enabled: boolean
  toggle: () => void
}

const SoundContext = createContext<SoundContextValue | null>(null)

export function ClickSoundProvider({ children }: { children: ReactNode }) {
  const enabled = useSyncExternalStore(
    subscribeToSound,
    getSoundSnapshot,
    getSoundServerSnapshot
  )
  const enabledRef = useRef(enabled)

  useEffect(() => {
    enabledRef.current = enabled
  }, [enabled])

  const toggle = useCallback(() => {
    const next = !getSoundSnapshot()
    enabledRef.current = next
    writeSoundPreference(next)
    playGlassCue(next ? "on" : "off")
  }, [])

  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      if (!enabledRef.current || event.button !== 0) return
      if (event.pointerType === "mouse" && (event.buttons & 1) === 0) return
      const target = event.target
      if (!(target instanceof Element) || !getSoundTarget(target)) return
      playGlassCue("click")
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (!enabledRef.current || event.repeat) return
      if (event.key !== "Enter" && event.key !== " ") return
      const target = event.target
      if (!(target instanceof Element)) return
      const control = getSoundTarget(target)
      if (!control) return
      if (event.key === " " && control.matches("a[href], [role='link']")) return
      playGlassCue("click")
    }

    /* Hover is mouse-only. Touch and pen have no settled hover state, and
       firing on tap would double every press with a tick. Moving inside one
       control (icon to label to edge) must stay silent; only a new control
       earns a cue. */
    const onPointerOver = (event: PointerEvent) => {
      if (!enabledRef.current || event.pointerType !== "mouse") return
      if (event.buttons !== 0) return
      const target = event.target
      if (!(target instanceof Element)) return
      const control = getSoundTarget(target)
      if (!control) return
      const from = event.relatedTarget
      if (from instanceof Node && control.contains(from)) return
      playGlassCue("hover")
    }

    const onVisibilityChange = () => {
      if (document.hidden) suspendGlassAudio()
    }

    document.addEventListener("pointerdown", onPointerDown, true)
    document.addEventListener("keydown", onKeyDown, true)
    document.addEventListener("pointerover", onPointerOver, true)
    document.addEventListener("visibilitychange", onVisibilityChange)
    return () => {
      document.removeEventListener("pointerdown", onPointerDown, true)
      document.removeEventListener("keydown", onKeyDown, true)
      document.removeEventListener("pointerover", onPointerOver, true)
      document.removeEventListener("visibilitychange", onVisibilityChange)
    }
  }, [])

  const value = useMemo(() => ({ enabled, toggle }), [enabled, toggle])

  return <SoundContext.Provider value={value}>{children}</SoundContext.Provider>
}

export function SoundToggle() {
  const sound = useContext(SoundContext)
  if (!sound) return null

  return (
    <button
      type="button"
      data-sound-ignore
      aria-pressed={sound.enabled}
      aria-label="Interface sounds"
      onClick={sound.toggle}
      className="flex items-center justify-center w-11 h-11 border border-foreground/20 text-foreground hover:bg-foreground/5 transition-colors focus-hard"
    >
      {sound.enabled ? (
        <Volume2 size={18} aria-hidden="true" />
      ) : (
        <VolumeX size={18} aria-hidden="true" />
      )}
    </button>
  )
}
