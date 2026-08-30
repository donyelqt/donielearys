"use client"

import Image from "next/image"
import { motion, useReducedMotion } from "framer-motion"
import { ExternalLink, BadgeCheck, Award, Calendar, Building2 } from "lucide-react"
import { SectionHeader } from '../SectionHeader'

/* Single source of truth — add future certs here. No lorem, no scramble. */
const certifications = [
  {
    id: "sap-gen-ai-developer",
    title: "SAP Certified Associate",
    subtitle: "Generative AI Developer",
    issuer: "SAP",
    credentialId: "C_AIG_2409",
    date: "Aug 2026",
    status: "Certified" as const,
    featured: true as const,
    description:
      "Certifies ability to solve business problems using SAP's Generative AI Hub on SAP BTP — advanced prompt engineering, prompt template development, lifecycle management, and workflow orchestration in SAP AI Launchpad and SAP AI Core with LLMs.",
    skills: ["SAP AI Core", "Generative AI Hub", "SAP AI Launchpad", "LLMs", "Prompt Engineering", "Workflow Orchestration"],
    badge: "/sap-gen-ai-badge.png",
    verifyHref: "https://www.credly.com/badges/af0b8e32-f788-4bc4-8e31-dcaedde2c664",
    accent: "#0A2A6B",
  },
  {
    id: "google-ai-essentials",
    title: "Google AI Essentials",
    subtitle: "Specialization — Coursera",
    issuer: "Google · Coursera",
    credentialId: "Foundations",
    date: "2025",
    status: "Completed" as const,
    featured: false as const,
    description:
      "Foundational AI literacy — prompting essentials, responsible AI, and applying generative AI at work. Introductory breadth, not a system-based build.",
    skills: ["Prompting", "Responsible AI", "Gen AI at Work"],
    badge: null as string | null,
    verifyHref: "#", // replace with your Coursera share URL
  },
]

export default function Certifications() {
  const isEnabled = process.env.NEXT_PUBLIC_CERTIFICATIONS_ENABLED !== "false"
  const prefersReducedMotion = useReducedMotion()
  if (!isEnabled) return null

  const cert = certifications[0] as typeof certifications[0] & { badge: string }

  return (
    <section id="certifications" className="py-24 md:py-32 px-4 overflow-hidden">
      <SectionHeader index="04" title="Certifications" eyebrow="Credentials" meta="VERIFIED" />
      <div className="max-w-7xl mx-auto">
        <p className="-mt-4 mb-12 text-[13px] md:text-sm leading-relaxed text-foreground/55 max-w-[60ch]">
          Vendor-validated proof — not course completions. One credential shipped, more in pipeline. Every badge links to its issuer.
        </p>
      </div>

      {/* Featured credential — editorial, not card-grid */}
      <motion.article
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.55, ease: [0.25, 0.1, 0.25, 1] }}
        className="max-w-7xl mx-auto"
      >
        <div className="relative grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-0 border border-foreground/10 bg-foreground/[0.02] overflow-hidden">
           {/* Top rule — red accent owns the edge */}
           <div className="absolute top-0 inset-x-0 h-[2px] bg-[#0A4DB5]" aria-hidden="true" />
          <div className="absolute inset-0 pointer-events-none opacity-[0.015]" style={{ backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`, backgroundSize: `24px 24px` }} aria-hidden="true" />

           {/* Badge pane */}
           <div className="relative bg-[#F8F9FA] p-6 sm:p-8 flex flex-col items-center justify-center border-b lg:border-b-0 lg:border-r border-black/10">
              <div className="relative w-full max-w-[360px] aspect-square overflow-hidden bg-white border border-black/10">
              <Image
                src={cert.badge}
                alt="SAP Generative AI Developer — Certified badge"
                width={800}
                height={800}
                className="h-full w-full object-cover"
                priority
              />
            </div>
              <div className="relative mt-5 flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.2em] text-[#0A2A6B]/70">
                <BadgeCheck className="h-3.5 w-3.5 text-[#0A6ED1]" />
               Issued by SAP Certification
             </div>
          </div>

          {/* Detail pane — dark, matches site world */}
          <div className="relative p-6 sm:p-8 lg:p-10 flex flex-col">
            {/* Status */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-mono font-bold uppercase tracking-[0.18em] bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 bg-emerald-400 animate-pulse" aria-hidden="true" />
                Certified
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-mono uppercase tracking-[0.18em] bg-foreground/5 text-foreground/60 border border-foreground/10">
                <Award className="h-3 w-3" /> SAP BTP
              </span>
            </div>

            <h3 className="text-[22px] sm:text-[26px] font-bold tracking-tight leading-none text-foreground">
              {cert.title}
            </h3>
             <p className="mt-1 text-[18px] sm:text-[20px] font-bold tracking-tight leading-none text-[#5BA8FF]">{cert.subtitle}</p>

            <dl className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3 text-[10px] font-mono uppercase tracking-[0.18em] border-y border-foreground/10 py-4">
              <div>
                <dt className="text-foreground/35 flex items-center gap-1.5"><Building2 className="h-3 w-3" /> Issuer</dt>
                <dd className="mt-1 text-foreground/85 font-bold tracking-[0.12em]">{cert.issuer}</dd>
              </div>
              <div>
                <dt className="text-foreground/35 flex items-center gap-1.5"><Calendar className="h-3 w-3" /> Issued</dt>
                <dd className="mt-1 text-foreground/85">{cert.date}</dd>
              </div>
              <div>
                <dt className="text-foreground/35">Credential ID</dt>
                <dd className="mt-1 text-foreground/85 break-all">{cert.credentialId}</dd>
              </div>
            </dl>

            <p className="mt-5 text-[13px] sm:text-[14px] leading-[1.7] text-foreground/65 max-w-[62ch]">
              {cert.description}
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              {cert.skills.map((s) => (
                <span key={s} className="px-2.5 py-1 text-[10px] font-mono uppercase tracking-[0.14em] bg-foreground/[0.06] border border-foreground/10 text-foreground/70">
                  {s}
                </span>
              ))}
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <a
                href={cert.verifyHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-foreground text-background text-[11px] font-bold uppercase tracking-[0.16em] hover:bg-foreground/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                Verify Credential <ExternalLink className="h-3.5 w-3.5" />
              </a>
              <a
                href="#competitions"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-foreground/15 text-foreground text-[11px] font-bold uppercase tracking-[0.16em] hover:bg-foreground/5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50"
              >
                View proof context
              </a>
            </div>


          </div>
        </div>

        {/* Secondary — Foundations */}
        <div className="mt-4 border border-foreground/10 bg-foreground/[0.02] px-5 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="hidden sm:flex h-9 w-9 items-center justify-center rounded-sm bg-foreground text-background font-black text-[11px] tracking-tighter shrink-0">G</div>
            <div className="min-w-0">
              <p className="text-[13px] font-bold tracking-tight text-foreground leading-none">Google AI Essentials <span className="font-normal text-foreground/50">— Coursera</span></p>
              <p className="mt-1 text-[10px] font-mono uppercase tracking-[0.18em] text-foreground/40">Foundations · 2025 · Google · Coursera</p>
            </div>
          </div>
          <div className="sm:ml-auto flex items-center gap-2">
            <span className="hidden sm:inline-flex px-2 py-1 text-[10px] font-mono uppercase tracking-widest bg-foreground/5 border border-foreground/10 text-foreground/60">Prompting · Responsible AI</span>
            <a href="#" className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-[0.16em] text-foreground/60 hover:text-foreground transition-colors">Verify <ExternalLink className="h-3 w-3" /></a>
          </div>
        </div>

      </motion.article>
    </section>
  )
}
