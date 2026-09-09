"use client"

import Image from "next/image"
import { motion, useReducedMotion } from "framer-motion"
import { ExternalLink, BadgeCheck, Award, Calendar, Building2 } from "lucide-react"
import { SectionHeader } from '../SectionHeader'

type CertStatus = "Certified" | "In Progress" | "Completed"

interface Certification {
  id: string
  title: string
  subtitle: string
  issuer: string
  credentialId: string
  date: string
  status: CertStatus
  featured: boolean
  description: string
  skills: string[]
  badge: string | null
  verifyHref: string
  accent?: string
  accentFg?: string
  badgeAspect?: number
  badgeWidth?: number
}

/* Single source of truth — add future certs here. No lorem, no scramble.
   featured:true renders the editorial hero block; everything else renders
   as a scannable Foundations ledger. `accent`/`accentFg` are the issuer's
   verified brand colors (sampled from the official badge artwork, not invented). */
const certifications: Certification[] = [
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
    accent: "#0A4DB5",
    accentFg: "#5BA8FF",
    badgeAspect: 1,
    badgeWidth: 2048,
  },
  {
    id: "datacamp-ai-engineer-associate",
    title: "AI Engineer for Developers",
    subtitle: "Associate Certification",
    issuer: "DataCamp",
    credentialId: "AIEDEVA-2026",
    date: "2026",
    status: "Certified" as const,
    featured: true as const,
    description:
      "DataCamp's AI Engineer for Developers Associate validates applied AI engineering — building, deploying, and evaluating AI systems within production developer workflows. Assessed via timed exam (AIEDEVA101, AI governance, model usage, programming, application development) and a practical exam (AIEDEVA501P) requiring three Python tasks against a real-world scenario.",
    skills: ["AI Engineering", "LLMs", "Prompt Engineering", "Python", "MLOps", "Responsible AI"],
    badge: "/certification-ai-engineer-for-developers-associate-badge.png",
    verifyHref: "https://www.datacamp.com/certification/ai-engineer-for-developers-associate",
    accent: "#e58620",
    accentFg: "#03d35a",
    badgeAspect: 640 / 784,
    badgeWidth: 640,
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
  {
    id: "gcp-essential-foundation",
    title: "Essential Google Cloud Infrastructure",
    subtitle: "Foundation",
    issuer: "Google Cloud",
    credentialId: "25521704",
    date: "Jul 2026",
    status: "Completed" as const,
    featured: false as const,
    description:
      "Core GCP building blocks — Compute Engine, Virtual Private Cloud, Cloud Storage, and IAM fundamentals for standing up secure cloud infrastructure.",
    skills: ["Compute Engine", "VPC", "Cloud Storage", "IAM"],
    badge: null as string | null,
    verifyHref: "#", // replace with Google Cloud Skills Boost / Credly URL
  },
  {
    id: "gcp-essential-core-services",
    title: "Essential Google Cloud Infrastructure",
    subtitle: "Core Services",
    issuer: "Google Cloud",
    credentialId: "25527211",
    date: "Jul 2026",
    status: "Completed" as const,
    featured: false as const,
    description:
      "Managed compute and data services — Cloud SQL, Spanner, Pub/Sub, and load balancing for production-grade cloud applications.",
    skills: ["Cloud SQL", "Spanner", "Pub/Sub", "Load Balancing"],
    badge: null as string | null,
    verifyHref: "#",
  },
  {
    id: "gcp-select-database",
    title: "Select a Google Cloud Database",
    subtitle: "for Your Applications",
    issuer: "Google Cloud",
    credentialId: "25537563",
    date: "Jul 2026",
    status: "Completed" as const,
    featured: false as const,
    description:
      "Database selection trade-offs — relational vs. NoSQL, Cloud SQL, Firestore, Bigtable, and Spanner fit for application workloads.",
    skills: ["Cloud SQL", "Firestore", "Bigtable", "Spanner"],
    badge: null as string | null,
    verifyHref: "#",
  },
  {
    id: "gcp-gke-getting-started",
    title: "Getting Started with Google Kubernetes Engine",
    subtitle: "GKE Fundamentals",
    issuer: "Google Cloud",
    credentialId: "25545855",
    date: "Jul 2026",
    status: "Completed" as const,
    featured: false as const,
    description:
      "Container orchestration with GKE — clusters, nodes, pods, deployments, and kubectl workflows for running scalable workloads.",
    skills: ["GKE", "Kubernetes", "Containers", "kubectl"],
    badge: null as string | null,
    verifyHref: "#",
  },
  {
    id: "gcp-cloud-run-fundamentals",
    title: "Developing Applications with Cloud Run",
    subtitle: "on Google Cloud: Fundamentals",
    issuer: "Google Cloud",
    credentialId: "25547305",
    date: "Jul 2026",
    status: "Completed" as const,
    featured: false as const,
    description:
      "Serverless containers with Cloud Run — deploying, scaling, and wiring containerized services to events and HTTP traffic.",
    skills: ["Cloud Run", "Serverless", "Containers", "Events"],
    badge: null as string | null,
    verifyHref: "#",
  },
]

export default function Certifications() {
  const isEnabled = process.env.NEXT_PUBLIC_CERTIFICATIONS_ENABLED !== "false"
  const prefersReducedMotion = useReducedMotion()
  if (!isEnabled) return null

  const featuredCerts = certifications.filter((c) => c.featured)
  const foundations = certifications.filter((c) => !c.featured)

  return (
    <section id="certifications" className="py-24 md:py-32 px-4 overflow-hidden">
      <SectionHeader index="04" title="Certifications" eyebrow="Credentials" meta="VERIFIED" />
      <div className="max-w-7xl mx-auto">
        <p className="-mt-4 mb-12 text-[13px] md:text-sm leading-relaxed text-foreground/55 max-w-[60ch]">
          Vendor-validated proof — not course completions. Professional certifications featured, plus a growing set of foundational skill badges across SAP, DataCamp, and Google Cloud. Each links to its issuer.
        </p>
      </div>

      {/* Featured credentials — editorial, not card-grid. One block per issuer,
          each styled with that issuer's verified brand accent. */}
      <div className="max-w-7xl mx-auto space-y-8">
        {featuredCerts.map((cert) => {
          const accent = cert.accent ?? "#0A4DB5"
          const accentFg = cert.accentFg ?? "#5BA8FF"
          const aspect = cert.badgeAspect ?? 1
          const srcWidth = cert.badgeWidth ?? 800
          return (
            <motion.article
              key={cert.id}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.55, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <div className="relative grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-0 border border-foreground/10 bg-foreground/[0.02] overflow-hidden">
                {/* Top rule — issuer accent owns the edge */}
                <div className="absolute top-0 inset-x-0 h-[2px]" style={{ backgroundColor: accent }} aria-hidden="true" />
                <div className="absolute inset-0 pointer-events-none opacity-[0.015]" style={{ backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`, backgroundSize: `24px 24px` }} aria-hidden="true" />

                {/* Badge pane — light, matches the badge's own substrate */}
                <div className="relative bg-[#F8F9FA] p-6 sm:p-8 flex flex-col items-center justify-center border-b lg:border-b-0 lg:border-r border-black/10">
                  <div className="relative w-full max-w-[360px] overflow-hidden bg-white border border-black/10" style={{ aspectRatio: `${aspect} / 1` }}>
                    <Image
                      src={cert.badge as string}
                      alt={`${cert.issuer} ${cert.title} — Certified badge`}
                      width={srcWidth}
                      height={Math.round(srcWidth / aspect)}
                      className="h-full w-full object-cover"
                      priority
                    />
                  </div>
                  <div className="relative mt-5 flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.2em]" style={{ color: accentFg }}>
                    <BadgeCheck className="h-3.5 w-3.5" style={{ color: accentFg }} />
                    Issued by {cert.issuer} Certification
                  </div>
                </div>

                {/* Detail pane — dark, matches site world */}
                <div className="relative p-6 sm:p-8 lg:p-10 flex flex-col">
                  {/* Status */}
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-mono font-bold uppercase tracking-[0.18em] bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                      <span className="w-1.5 h-1.5 bg-emerald-400 animate-pulse" aria-hidden="true" />
                      {cert.status}
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-mono uppercase tracking-[0.18em] bg-foreground/5 text-foreground/60 border border-foreground/10">
                      <Award className="h-3 w-3" /> {cert.issuer}
                    </span>
                  </div>

                  <h3 className="text-[22px] sm:text-[26px] font-bold tracking-tight leading-none text-foreground">
                    {cert.title}
                  </h3>
                  <p className="mt-1 text-[18px] sm:text-[20px] font-bold tracking-tight leading-none" style={{ color: accentFg }}>{cert.subtitle}</p>

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
            </motion.article>
          )
})}
      </div>

      {/* Foundations ledger — compact, scannable, non-featured */}
      <div className="max-w-7xl mx-auto mt-8">
        <p className="mb-3 text-[10px] font-mono uppercase tracking-[0.3em] text-foreground/40">
          Foundational Skill Badges · {foundations.length}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {foundations.map((c) => (
            <div
              key={c.id}
              className="group relative flex flex-col gap-3 border border-foreground/10 bg-foreground/[0.02] p-4 transition-colors hover:border-foreground/20 hover:bg-foreground/[0.04]"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center bg-foreground text-background font-black text-[11px] tracking-tighter">
                  G
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-bold leading-tight tracking-tight text-foreground">{c.title}</p>
                  <p className="mt-0.5 text-[11px] leading-tight text-foreground/55">{c.subtitle}</p>
                  <p className="mt-1 text-[10px] font-mono uppercase tracking-[0.18em] text-foreground/40">{c.issuer}</p>
                </div>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="truncate text-[9px] font-mono uppercase tracking-[0.18em] text-foreground/35">
                  ID {c.credentialId}
                </span>
                <a
                  href={c.verifyHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex shrink-0 items-center gap-1 text-[10px] font-mono uppercase tracking-[0.16em] text-foreground/55 transition-colors hover:text-foreground"
                >
                  Verify <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}