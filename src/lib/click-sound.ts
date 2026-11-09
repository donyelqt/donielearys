export type GlassCue = "click" | "on" | "off"

type PartialSpec = {
  ratio: number
  gain: number
  decay: number
}

type CueSpec = {
  base: number
  partials: readonly PartialSpec[]
  noise: {
    frequency: number
    q: number
    gain: number
  }
}

/*
 * Glass is an inharmonic partial stack plus a noise transient. Harmonic ratios
 * read as a musical beep; these ratios keep the strike metallic and brittle.
 */
const CUES: Record<GlassCue, CueSpec> = {
  click: {
    base: 1760,
    partials: [
      { ratio: 1, gain: 0.1, decay: 0.18 },
      { ratio: 2.32, gain: 0.05, decay: 0.11 },
      { ratio: 4.05, gain: 0.028, decay: 0.07 },
    ],
    noise: { frequency: 5400, q: 2.6, gain: 0.045 },
  },
  on: {
    base: 2093,
    partials: [
      { ratio: 1, gain: 0.11, decay: 0.16 },
      { ratio: 2.76, gain: 0.055, decay: 0.1 },
      { ratio: 5.4, gain: 0.03, decay: 0.06 },
    ],
    noise: { frequency: 6200, q: 3, gain: 0.04 },
  },
  off: {
    base: 1174,
    partials: [
      { ratio: 1, gain: 0.09, decay: 0.12 },
      { ratio: 2, gain: 0.04, decay: 0.075 },
      { ratio: 3.3, gain: 0.02, decay: 0.05 },
    ],
    noise: { frequency: 2800, q: 1.8, gain: 0.035 },
  },
}

const MIN_CUE_GAP_SECONDS = 0.04

type AudioGraph = {
  context: AudioContext
  master: GainNode
  noise: AudioBuffer
}

/* Fast Refresh re-evaluates the module, so keep the graph on globalThis.
   A second AudioContext per reload burns the browser's small per-page cap. */
const globalStore = globalThis as typeof globalThis & {
  __donieleGlassAudio?: AudioGraph
}

let audio = globalStore.__donieleGlassAudio ?? null
let audioUnavailable = false
let lastCueAt = Number.NEGATIVE_INFINITY

function getAudioGraph(): AudioGraph | null {
  if (typeof window === "undefined" || audioUnavailable) return null
  if (audio) return audio

  const AudioContextConstructor =
    window.AudioContext ??
    (window as Window & { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext
  if (!AudioContextConstructor) {
    audioUnavailable = true
    return null
  }

  let context: AudioContext | null = null
  try {
    context = new AudioContextConstructor({ latencyHint: "interactive" })
    const compressor = context.createDynamicsCompressor()
    compressor.threshold.value = -20
    compressor.knee.value = 12
    compressor.ratio.value = 6
    compressor.attack.value = 0.002
    compressor.release.value = 0.12

    const output = context.createGain()
    output.gain.value = 0.5
    output.connect(compressor)
    compressor.connect(context.destination)

    const noiseLength = Math.max(1, Math.floor(context.sampleRate * 0.02))
    const buffer = context.createBuffer(1, noiseLength, context.sampleRate)
    const samples = buffer.getChannelData(0)
    const decaySamples = context.sampleRate * 0.0025
    for (let index = 0; index < samples.length; index += 1) {
      samples[index] =
        (Math.random() * 2 - 1) * Math.exp(-index / decaySamples)
    }

    audio = { context, master: output, noise: buffer }
    globalStore.__donieleGlassAudio = audio
    return audio
  } catch {
    if (context) void context.close().catch(() => {})
    audioUnavailable = true
    return null
  }
}

function scheduleCue(graph: AudioGraph, cue: GlassCue): void {
  const { context, master, noise: noiseBuffer } = graph
  const now = context.currentTime
  if (now - lastCueAt < MIN_CUE_GAP_SECONDS) return
  lastCueAt = now

  const spec = CUES[cue]
  const cueGain = context.createGain()
  cueGain.gain.value = cue === "off" ? 0.75 : 1

  const highpass = context.createBiquadFilter()
  highpass.type = "highpass"
  highpass.frequency.value = cue === "off" ? 620 : 900
  highpass.Q.value = 0.7

  const lowpass = context.createBiquadFilter()
  lowpass.type = "lowpass"
  lowpass.frequency.value = 12000

  cueGain.connect(highpass)
  highpass.connect(lowpass)
  lowpass.connect(master)

  const detune = (Math.random() * 2 - 1) * 12
  const level = 0.85 + Math.random() * 0.3

  for (const partial of spec.partials) {
    const oscillator = context.createOscillator()
    const envelope = context.createGain()
    oscillator.type = "sine"
    oscillator.frequency.value = spec.base * partial.ratio
    oscillator.detune.value = detune

    envelope.gain.setValueAtTime(0.0001, now)
    envelope.gain.exponentialRampToValueAtTime(
      partial.gain * level,
      now + 0.004
    )
    envelope.gain.exponentialRampToValueAtTime(0.0001, now + partial.decay)

    oscillator.connect(envelope)
    envelope.connect(cueGain)
    oscillator.start(now)
    oscillator.stop(now + partial.decay + 0.02)
  }

  const source = context.createBufferSource()
  const bandpass = context.createBiquadFilter()
  const noiseGain = context.createGain()
  source.buffer = noiseBuffer
  bandpass.type = "bandpass"
  bandpass.frequency.value = spec.noise.frequency
  bandpass.Q.value = spec.noise.q
  noiseGain.gain.value = spec.noise.gain * level
  source.connect(bandpass)
  bandpass.connect(noiseGain)
  noiseGain.connect(cueGain)
  source.start(now)
  source.stop(now + 0.03)
}

export function playGlassCue(cue: GlassCue): void {
  const graph = getAudioGraph()
  if (!graph) return

  if (graph.context.state === "suspended") {
    graph.context
      .resume()
      .then(() => scheduleCue(graph, cue))
      .catch(() => {})
    return
  }

  scheduleCue(graph, cue)
}

export function suspendGlassAudio(): void {
  if (audio?.context.state === "running") {
    void audio.context.suspend().catch(() => {})
  }
}
