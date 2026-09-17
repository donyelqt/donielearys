"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, useReducedMotion } from "framer-motion"
import { SectionHeader } from "@/components/SectionHeader"

/**
 * Root not-found page — brutalist design language.
 *
 * Theme: no theme-specific classes. Every color resolves from the semantic
 * token set (--background/--foreground/--crimson), which flips with the
 * `.dark` class on <html>, so light and dark both come out correct by
 * construction — same mechanism the rest of the site uses.
 *
 * Structure: SectionHeader grammar ([ 404 / ERROR ] eyebrow + barcode +
 * macro heading + rule), terminal "route trace" block, macro 404 numeral,
 * action row matching site-wide CTA styling (bg-foreground primary +
 * 1px-border secondary, focus-hard focus frame).
 */
export default function NotFound() {
  const prefersReducedMotion = useReducedMotion()
  const pathname = usePathname()

  const fadeUp = (delay: number) => ({
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    transition: prefersReducedMotion ? { duration: 0 } : { duration: 0.45, delay },
  })

  return (
    <section className="px-4 pt-6 pb-24 md:pb-32">
      <div className="max-w-7xl mx-auto">
        <SectionHeader index="404" eyebrow="ERROR" title="Route Not Found" meta="STATUS — ERR 404" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          {/* Terminal trace block — Preloader/Contact boot-line language */}
          <motion.div {...fadeUp(0.1)}>
            <div
              className="flex items-center gap-2 mb-3"
              role="status"
              aria-label="Terminal error trace: requested route not found on this server"
            >
              <span className="text-red-500 text-[13px] font-mono select-none leading-none" aria-hidden="true">❯</span>
              <span className="text-[10px] sm:text-[11px] font-mono font-bold text-foreground/60 uppercase tracking-[0.25em]">
                Error
              </span>
              <span className="flex-1 h-px bg-foreground/10 ml-1" aria-hidden="true" />
              <span className="flex items-center gap-1.5 text-[9px] font-mono uppercase tracking-[0.2em] text-foreground/40">
                <span
                  className="inline-block w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: "hsl(var(--crimson))" }}
                  aria-hidden="true"
                />
                not found
              </span>
              <span className="barcode hidden sm:block h-3 w-14 shrink-0" aria-hidden="true" />
            </div>

            <div className="border border-foreground/10 bg-background/60 backdrop-blur-sm">
              <div className="grid-divider">
                <div className="px-4 py-3 text-[11px] sm:text-xs font-mono uppercase tracking-[0.2em] text-foreground/40 flex items-baseline justify-between gap-3">
                  <span className="text-foreground/30">GET</span>
                  <span className="text-foreground/70 text-right break-all" aria-live="polite">
                    {pathname}
                  </span>
                </div>
                <div className="px-4 py-3 text-[11px] sm:text-xs font-mono uppercase tracking-[0.2em] flex items-baseline justify-between gap-3">
                  <span className="text-foreground/30">STATUS</span>
                  <span className="text-crimson font-bold">404 — NOT_FOUND</span>
                </div>
                <div className="px-4 py-3 text-[11px] sm:text-xs font-mono uppercase tracking-[0.2em] flex items-baseline justify-between gap-3">
                  <span className="text-foreground/30">CAUSE</span>
                  <span className="text-foreground/70 text-right">ROUTE DOES NOT EXIST ON THIS SERVER</span>
                </div>
                <div className="px-4 py-3 text-[11px] sm:text-xs font-mono uppercase tracking-[0.2em] flex items-baseline justify-between gap-3">
                  <span className="text-foreground/30">ACTION</span>
                  <span className="text-foreground/70 text-right">RETURN TO A VALID ROUTE</span>
                </div>
              </div>
              <div className="border-t border-foreground/10 px-4 py-2.5 text-[9px] font-mono uppercase tracking-[0.2em] text-foreground/25">
                <span className="text-foreground/40">{'// '}</span>
                errno 404: no matching route in route table
              </div>
            </div>
          </motion.div>

          {/* Macro numeral — display-mega, one red accent word pattern */}
          <motion.div {...fadeUp(0.18)} className="lg:justify-self-end lg:text-right">
            <p className="tactical-label mb-4">DEBUG STACK · DEPTH 1</p>
            <p className="display-mega text-foreground" aria-hidden="true">
              ERR<span className="text-accent">404</span>
            </p>
            <p className="mt-4 text-sm md:text-base text-foreground/50 max-w-md leading-relaxed lg:ml-auto">
              The page you requested was moved, renamed, or never existed. The route table has no entry for it.
            </p>
          </motion.div>
        </div>

        {/* Action row — site-wide CTA grammar: bg-foreground primary, 1px-border secondary */}
        <motion.div {...fadeUp(0.26)} className="mt-14 flex flex-col sm:flex-row gap-3">
          <Link
            href="/"
            aria-label="Return to the home page"
            className="px-6 py-3 bg-foreground text-background text-[11px] font-bold rounded-none flex items-center justify-center gap-2 hover:bg-foreground/90 transition-all uppercase tracking-widest focus-visible:outline-2 focus-visible:outline-crimson focus-visible:outline-offset-2"
          >
            <span className="text-background/70" aria-hidden="true">❯</span>
            Return Home
          </Link>
          <Link
            href="/#projects"
            aria-label="View featured projects"
            className="px-6 py-3 border border-foreground/20 text-foreground text-[11px] font-bold rounded-none flex items-center justify-center gap-2 hover:bg-foreground/5 transition-all uppercase tracking-widest focus-visible:outline-2 focus-visible:outline-crimson focus-visible:outline-offset-2"
          >
            <span className="text-foreground/50" aria-hidden="true">❯</span>
            View Projects
          </Link>
          <Link
            href="/#contact"
            aria-label="Go to contact section"
            className="px-6 py-3 border border-foreground/20 text-foreground text-[11px] font-bold rounded-none flex items-center justify-center gap-2 hover:bg-foreground/5 transition-all uppercase tracking-widest focus-visible:outline-2 focus-visible:outline-crimson focus-visible:outline-offset-2"
          >
            <span className="text-foreground/50" aria-hidden="true">❯</span>
            Contact Me
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
