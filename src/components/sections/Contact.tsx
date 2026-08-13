"use client"

import React, { useCallback, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

const EMAIL = 'arysantonio123@gmail.com'
const GITHUB_URL = 'https://github.com/donyelqt'
const LINKEDIN_URL = 'https://linkedin.com/in/donielearysantonio'

export default function Contact() {
  const prefersReducedMotion = useReducedMotion()
  const [copied, setCopied] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleCopy = useCallback(async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(EMAIL)
      } else {
        const ta = document.createElement('textarea')
        ta.value = EMAIL
        ta.setAttribute('readonly', '')
        ta.style.position = 'absolute'
        ta.style.left = '-9999px'
        document.body.appendChild(ta)
        ta.select()
        document.execCommand('copy')
        document.body.removeChild(ta)
      }
      setCopied(true)
      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => setCopied(false), 1800)
    } catch {
      /* silently fall back — mailto still works */
    }
  }, [])

  return (
    <section id="contact" className="py-24 md:py-32 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Terminal session header — matches Preloader/About/Hero language */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.45 }}
          viewport={{ once: true, amount: 0.4 }}
          className="flex items-center gap-2 mb-3"
        >
          <span className="text-red-500 text-[13px] font-mono select-none leading-none" aria-hidden="true">❯</span>
          <h2 className="text-[10px] sm:text-[11px] font-mono font-bold text-white/60 uppercase tracking-[0.2em] sm:tracking-[0.25em]">
            Contact
          </h2>
          <span className="flex-1 h-px bg-white/10 ml-1" aria-hidden="true" />
          <span className="flex items-center gap-1.5 text-[9px] font-mono uppercase tracking-[0.2em] text-white/40">
            <span
              className="inline-block w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: 'hsl(var(--crimson))', boxShadow: '0 0 6px hsla(var(--crimson), 0.55)' }}
              aria-hidden="true"
            />
            open
          </span>
        </motion.div>

        {/* Headline — uses site-wide tracking-tighter uppercase pattern */}
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.45, delay: 0.05 }}
          viewport={{ once: true, amount: 0.4 }}
          className="text-4xl md:text-6xl font-bold tracking-tighter bg-clip-text text-transparent bg-linear-to-br from-white via-white/80 to-white/40 mb-6 uppercase"
        >
          Initialize Contact.
        </motion.h2>

        {/* Metadata strip — monospace, terminal-feel, mirrors Preloader/Competitions */}
        <motion.dl
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.45, delay: 0.1 }}
          viewport={{ once: true, amount: 0.4 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 mb-10 text-[10px] font-mono uppercase tracking-[0.2em] border-t border-b border-white/5 py-4"
        >
          <div className="flex items-baseline justify-between gap-3 sm:contents">
            <dt className="text-white/30">Status</dt>
            <dd className="text-white/70 sm:text-left">
              AI Engineer · Cloud Elite @ Accenture
            </dd>
          </div>
          <div className="flex items-baseline justify-between gap-3 sm:contents">
            <dt className="text-white/30">Response</dt>
            <dd className="text-white/70 sm:text-left">{'< 24h'}</dd>
          </div>
          <div className="flex items-baseline justify-between gap-3 sm:contents">
            <dt className="text-white/30">Channels</dt>
            <dd className="text-white/70 sm:text-left">Email · GitHub · LinkedIn</dd>
          </div>
          <div className="flex items-baseline justify-between gap-3 sm:contents">
            <dt className="text-white/30">Location</dt>
            <dd className="text-white/70 sm:text-left">Baguio City, PH · UTC+8</dd>
          </div>
        </motion.dl>

        {/* Action row — single primary + clipboard secondary, matching Hero button styling */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.45, delay: 0.15 }}
          viewport={{ once: true, amount: 0.4 }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <a
            href={`mailto:${EMAIL}`}
            aria-label={`Send email to ${EMAIL}`}
            className="px-6 py-3 bg-white text-black text-[11px] font-bold rounded-none flex items-center justify-center gap-2 hover:bg-white/90 transition-all uppercase tracking-widest focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          >
            <span className="text-black/70" aria-hidden="true">❯</span>
            Send Email
          </a>
          <button
            type="button"
            onClick={handleCopy}
            aria-label={copied ? 'Email address copied to clipboard' : 'Copy email address to clipboard'}
            aria-live="polite"
            className="px-6 py-3 border border-white/20 text-white text-[11px] font-bold rounded-none hover:bg-white/5 transition-all uppercase tracking-widest flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          >
            <span className="text-white/50" aria-hidden="true">❯</span>
            {copied ? 'Copied' : 'Copy Address'}
          </button>
        </motion.div>

        {/* Profile links — direct to GitHub & LinkedIn, same CTA styling as Hero */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.45, delay: 0.2 }}
          viewport={{ once: true, amount: 0.4 }}
          className="flex flex-col sm:flex-row gap-3 mt-3"
        >
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open GitHub profile (donyelqt)"
            className="px-6 py-3 border border-white/20 text-white text-[11px] font-bold rounded-none hover:bg-white/5 transition-all uppercase tracking-widest flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          >
            <span className="text-white/50" aria-hidden="true">❯</span>
            GitHub
          </a>
          <a
            href={LINKEDIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open LinkedIn profile (donielearysantonio)"
            className="px-6 py-3 border border-white/20 text-white text-[11px] font-bold rounded-none hover:bg-white/5 transition-all uppercase tracking-widest flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          >
            <span className="text-white/50" aria-hidden="true">❯</span>
            LinkedIn
          </a>
        </motion.div>

        {/* Email fallback link — assistive tech + JS-disabled fallback */}
        <p className="mt-6 text-[9px] font-mono uppercase tracking-[0.2em] text-white/25 break-all">
          <span className="text-white/40">{'// '}</span>
          {EMAIL}
        </p>
      </div>
    </section>
  )
}
