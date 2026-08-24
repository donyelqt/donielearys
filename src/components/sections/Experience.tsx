"use client"
import React, { memo } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

interface ExperienceEntry {
  id: string
  title: string
  company: string
  location: string
  date: string
  periodLabel: string
  isCurrent: boolean
  description: string
  icon: React.ReactNode
  color: string
  validationBadge?: string
}
const experiences: ExperienceEntry[] = [
  {
    id: 'stealth-2023',
    title: "Software Engineer",
    company: "Stealth",
    location: "Remote · Freelance",
    date: "Aug 2023 - Oct 2024",
    periodLabel: "2023",
    isCurrent: false,
    description: "Full-stack freelance software engineering — shipping production code across web and infrastructure projects.",
    icon: <CodeIcon />,
    color: "#7A8A99",
  },
  {
    id: 'perapinoy-2024',
    title: "Founding AI Engineer & Technical Lead",
    company: "PeraPinoy!",
    location: "Baguio City, CAR, Philippines · Hybrid",
    date: "Jul 2024 - Apr 2025",
    periodLabel: "2024",
    isCurrent: false,
    description: "Founded a startup and became CTO and lead software engineer, joining our university's startup incubator. Led a 3-person team, spearheading MVP development of an AI fintech app built on Google Gemini APIs and SDKs. Built skills across startup development, Supabase, and full-stack engineering.",
    icon: <CodeIcon />,
    color: "#1ABCFE",
  },
  {
    id: 'trifecta-2024',
    title: "Software Engineer Intern",
    company: "Illustrados | Trifecta Solutions",
    location: "Makati, NCR, Philippines · Remote",
    date: "Oct 2024 - Feb 2025",
    periodLabel: "2024",
    isCurrent: false,
    description: "Lead Software Engineer for Raksha: War Odyssey, a Web3 board strategy game integrating blockchain for gamification tokens. Used MERN Stack, Socket.io, and TypeScript to architect the game's technical backbone. Spearheaded matchmaking system, hero selection lobby, and core board game mechanics.",
    icon: <CodeIcon />,
    color: "#1ABCFE",
  },
  {
    id: 'aws-cloud-club-2025',
    title: "Chief Skill-Builder Chairperson",
    company: "AWS Cloud Club | UC Baguio",
    location: "Baguio City, CAR, Philippines",
    date: "Jan 2025 - Mar 2026",
    periodLabel: "2025",
    isCurrent: false,
    description: "Pioneered the AWS Learning Cloud Club at UC Baguio — first-ever Chief Skill-Builder Chairperson. Conducted end-to-end technical workshops covering Amazon SageMaker Labs, Jupyter Notebooks, Python, and ML libraries. Instituted Git/GitHub version control workflows into student-led model training and deployment pipelines.",
    icon: <BriefcaseIcon />,
    color: "#F0B232",
  },
  {
    id: 'datacamp-2025',
    title: "Data Science & Engineering Scholar",
    company: "DataCamp",
    location: "Remote · Seasonal",
    date: "Jan 2025 - Feb 2026",
    periodLabel: "2025",
    isCurrent: false,
    description: "Selected as a DataCamp Scholar through Google Developer Groups on Campus at Polytechnic University of the Philippines. Gained access to 500+ courses and 110+ industry-aligned projects in data science, machine learning, and applied AI.",
    icon: <TerminalIcon />,
    color: "#47B8E0",
  },
  {
    id: 'ai-singapore-2025',
    title: "AI/ML Engineer",
    company: "AI Singapore",
    location: "Singapore · Hybrid",
    date: "Mar 2025 - Apr 2025",
    periodLabel: "2025",
    isCurrent: false,
    description: "Competed in the National AI Student Challenge 2025 Regional Track organized by AI Singapore and AWS, representing UC and the Philippines — a solo competition using Amazon SageMaker, PartyRock, and Python to surpass a reference LLM across four AI domains: prompt engineering, foundational models, agentic AI, and responsible AI.\n\n🏆 Crowned champion in the Baguio League.\n🇵🇭 Ranked Top 1 nationwide — Top 3 Philippines League.\n🌍 Ranked Top 15–16 in the ASEAN League (peak rank Top 9–11).",
    icon: <BriefcaseIcon />,
    color: "#F0B232",
  },
  {
    id: 'dict-stepup-2025',
    title: "Startup Incubatee",
    company: "DICT STEP UP CAR",
    location: "Hybrid",
    date: "Jun 2025 - Apr 2026",
    periodLabel: "2025",
    isCurrent: false,
    description: "Accepted into the DICT STEP UP Pre-Acceleration Program 2025, a government-backed national startup initiative in the Cordillera Administrative Region. Tarana-ai — an agentic AI travel app generating real-time, personalized itineraries for Baguio City — officially recognized as a promising early-stage tech venture receiving government mentoring and ecosystem support.",
    icon: <RocketIcon />,
    color: "#C75EDC",
  },
  {
    id: 'tarana-ai-2025',
    title: "Member of Technical Staff, Lead AI Engineer",
    company: "Tarana-ai backed by UC inTTO & DOST-TARAKI",
    location: "Baguio City, CAR, Philippines · Part-time",
    date: "Apr 2025 - Present",
    periodLabel: "2025",
    isCurrent: true,
    description: "Led engineering execution across teams of 5-10+ members (core team + interns) for the LGU-backed agentic AI travel platform, owning architecture, infrastructure, security, and scalability for 100% of core platform features. Co-founded with a non-technical partner handling operations and business development. BFF-based DDD monolith reduced cross-domain coupling ~40%. Real-time itinerary engine raised recommendation relevance ~45%. Custom Agentic AI + RAG pipeline (Gemini API, pgvector, PostgreSQL) lifted contextual accuracy ~50%. 99%+ uptime via Vercel, Supabase, NextAuth.js, serving 150+ waitlisted and 130+ beta users. Generated $470+ USD in startup funding. Recognized at Philippine Startup Week 2025. Engaged by DOST-PCIEERD for startup ecosystem insights.",
    icon: <TerminalIcon />,
    color: "#E84D4D",
  },
  {
    id: 'uc-research-2025',
    title: "Applied AI Research Engineer",
    company: "University of the Cordilleras",
    location: "Baguio City, CAR, Philippines",
    date: "Dec 2025 - Present",
    periodLabel: "2025",
    isCurrent: true,
    description: "Lead researcher on AgenticHinaing—a neuro-symbolic multi-agent civic social listening framework. Used it for a technical interview at Silicon Peach by a former senior dev of IBM and was accepted to advance from 80% completion to full autonomous data center deployment at Atlanta Tech Village, built by contributors from IBM, Yahoo, Apple, Georgia Tech, NVIDIA, UCLA, UC Berkeley, and Red Hat Asia. Technically validated by a former IBM senior software engineer using ICLR, NAACL, and EMNLP evaluation frameworks — achieved TRL 7 Technology Readiness Level.",
    icon: <GlobeIcon />,
    color: "#4DAED4",
    validationBadge: "Ex-IBM Senior Software Engineer (US-based IBM)",
  },
  {
    id: 'avaron-2026',
    title: "AI Agent Infrastructure Engineer",
    company: "Avaron",
    location: "Atlanta, Georgia, United States · Remote",
    date: "Feb 2026 - Jun 2026",
    periodLabel: "2026",
    isCurrent: false,
    description: "Led agentic AI infrastructure and security architecture for the mission and vision of avaron to be the world's first autonomous self-healing data center platform. Resolved NVIDIA/Docker CUDA mismatches, achieving 10x–42x inference speed gains. Engineered LangGraph workflows with Pydantic v2 for 99%+ response reliability. Secured ₱600,000+ in funding. Achieved SOC 2, OWASP, and NIST 800-53 compliance. Led code reviews and maintained architectural coherence across a distributed team with contributors from ex-IBM, UCLA, AWS, UC Berkeley, NVIDIA, Georgia Tech, Yahoo, and Red Hat Asia.",
    icon: <RocketIcon />,
    color: "#E84D4D",
  },
  {
    id: 'avaron-atv-2026',
    title: "Venture Engineer",
    company: "Atlanta Tech Village",
    location: "Atlanta, Georgia, United States",
    date: "Feb 2026 - Jun 2026",
    periodLabel: "2026",
    isCurrent: false,
    description: "Fourth-largest tech hub in the United States. Drove technical execution and system hardening for Avaron, architected core agentic infrastructure delivering the reliability required to enable and secure high-value international corporate partnerships.",
    icon: <RocketIcon />,
    color: "#E84D4D",
  },
  {
    id: 'accenture-2026',
    title: "Software Engineer Intern · Cloud Elite",
    company: "Accenture",
    location: "Quezon City, NCR, Philippines",
    date: "Jun 2026 - Present",
    periodLabel: "2026",
    isCurrent: true,
    description: "led team of 8 members owning 100% of product direction, full-stack, infrastructure, & AI agent for enterprise banking solutions with 7 microservices & zero trust security principles\n\nled technical architecture debriefs for a 30+ engineering intern cohort, translating monolithic vs. microservices architectures and REST APIs into production engineering practices, giving 60%+ of the cohort early exposure to production-oriented system architecture\n\nrecognized by an Advanced Application Engineering Manager for technical communication and real-world software architecture experience\n\nreceived individualized recognition as the only intern personally encouraged by an Advanced Application Engineering Manager to pursue a full-time software engineering role before graduation and to mentor fellow Cloud Elite interns during debrief",
    icon: <RocketIcon />,
    color: "#E84D4D",
  },
]
const startYear = (date: string) => {
  const m = date.match(/(\w{3,9})[\s-]+(\d{4})/)
  return m ? parseInt(m[2]) : 9999
}

const endYear = (date: string) => {
  if (date.toLowerCase().includes('present')) return 9999
  const m = date.match(/(\w{3,9})[\s-]+(\d{4})/)
  if (!m) return 9999
  const end = date.includes(' - ') ? date.split(' - ')[1] : m[0]
  const n = end.match(/(\d{4})/)
  return n ? parseInt(n[1]) : 9999
}

/* Reverse-chronological: newest start year first, then newest end year
   (Present = 9999 sorts to the top within its year). */
const sortedExperiences = [...experiences].sort((a, b) => {
  const ay = startYear(a.date), by = startYear(b.date)
  if (ay !== by) return by - ay
  return endYear(b.date) - endYear(a.date)
})

const TRAJECTORY_COLOR = "hsl(var(--crimson))"

const EASE_OUT_CUBIC: [number, number, number, number] = [0.25, 0.1, 0.25, 1]
const EASE_BACK_OUT: [number, number, number, number] = [0.175, 0.885, 0.32, 1.275]

const cardVariants = {
  hidden: { opacity: 0, x: -30 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, delay: i * 0.06, ease: EASE_OUT_CUBIC },
  }),
}

const dotVariants = {
  hidden: { scale: 0, opacity: 0 },
  visible: (i: number) => ({
    scale: 1,
    opacity: 1,
    transition: { duration: 0.35, delay: i * 0.06 + 0.1, ease: EASE_BACK_OUT },
  }),
}

const EntryCard = memo(({ exp, index }: { exp: ExperienceEntry; index: number }) => {
  const active = exp.isCurrent
  return (
    <motion.div
      custom={index}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-10% 0px -8% 0px" }}
      variants={cardVariants}
      className="relative pl-10 md:pl-14"
    >
      <div className="relative">
        <div className="absolute -left-10 md:-left-12 top-[0.6rem]">
          <motion.div
            custom={index}
            variants={dotVariants}
            className="relative flex items-center justify-center w-3 h-3"
          >
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: `radial-gradient(circle, ${exp.color}55 0%, transparent 70%)`,
                filter: 'blur(4px)',
                opacity: 0.6,
              }}
            />
            <div
              className="relative w-[7px] h-[7px] rounded-full"
              style={{
                backgroundColor: active ? exp.color : TRAJECTORY_COLOR,
                boxShadow: active ? `0 0 10px ${exp.color}99` : `0 0 4px hsla(var(--crimson), 0.45)`,
              }}
            />
          </motion.div>
        </div>

        <div
          className="group relative rounded-none border border-white/10 bg-white/[0.02] p-5 md:p-6 transition-all duration-300 hover:bg-white/5"
          style={
            active
              ? {
                  borderLeftColor: `hsla(var(--crimson), 0.55)`,
                  borderLeftWidth: '1.5px',
                  background: `linear-gradient(90deg, hsla(var(--crimson), 0.06) 0%, hsla(var(--crimson), 0.015) 55%, transparent 100%)`,
                }
              : undefined
          }
        >
          {active && (
            <div
              className="absolute inset-0 rounded-none pointer-events-none"
              style={{ background: `radial-gradient(ellipse at 0% 50%, hsla(var(--crimson), 0.05) 0%, transparent 50%)` }}
            />
          )}

          <div className="relative flex flex-col sm:flex-row sm:items-start justify-between gap-2 sm:gap-4 mb-2.5">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2.5 mb-1">
                <span
                  className="shrink-0 flex items-center justify-center w-7 h-7 rounded-[6px] text-white/80"
                  style={{ backgroundColor: `${exp.color}20`, border: `1px solid ${exp.color}35` }}
                >
                  <span className="scale-[0.85]">{exp.icon}</span>
                </span>
                <h3 className="text-[13px] md:text-[15px] font-bold leading-tight text-white/90 tracking-tight">
                  {exp.title}
                </h3>
              </div>
              <p className="text-[11px] md:text-[13px] font-bold tracking-tight pl-[2.2rem]" style={{ color: exp.color }}>
                {exp.company}
              </p>
               {exp.validationBadge && (
                 <span
                   className="inline-flex items-center mt-1.5 ml-[2.2rem] text-[9px] font-mono uppercase tracking-[0.15em] px-2 py-0.5"
                   style={{
                     color: '#C8E0FF',
                     borderColor: '#0062D533',
                     backgroundColor: 'rgba(0, 98, 213, 0.08)',
                     borderStyle: 'solid',
                     borderWidth: '1px',
                   }}
                 >
                  <svg className="w-2.5 h-2.5 mr-1 shrink-0" viewBox="0 0 24 24" fill="none" stroke="#0062D5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 12l2 2 4-4" />
                    <circle cx="12" cy="12" r="10" />
                  </svg>
                  {exp.validationBadge}
                </span>
              )}
            </div>
            <div className="shrink-0 text-left sm:text-right">
              <span className="text-[10px] md:text-[11px] font-mono text-white/35 uppercase tracking-[0.14em]">
                {exp.date}
              </span>
              {active && (
                <span
                  className="block mt-1 text-[9px] font-mono uppercase tracking-[0.2em] font-bold"
                  style={{ color: TRAJECTORY_COLOR }}
                >
                  ─ current
                </span>
              )}
            </div>
          </div>

          <p className="relative text-[11px] md:text-[13px] text-white/40 leading-[1.7] pl-[2.2rem] whitespace-pre-line">
            {exp.description}
          </p>

          <div className="relative flex items-center gap-3 mt-3.5 pl-[2.2rem] flex-wrap">
            <svg className="w-2.5 h-2.5 text-white/15 shrink-0" viewBox="0 0 10 10" fill="currentColor">
              <circle cx="5" cy="5" r="1.5" />
            </svg>
            <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-white/18">
              {exp.location}
            </span>
            {active && (
              <span
                  className="text-[9px] font-mono uppercase tracking-[0.2em] px-1.5 py-0.5"
                  style={{
                    color: TRAJECTORY_COLOR,
                    backgroundColor: `hsla(var(--crimson), 0.1)`,
                    border: `1px solid hsla(var(--crimson), 0.2)`,
                  }}
              >
                  active
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
})

EntryCard.displayName = 'EntryCard'

const PeriodBlock = memo(({ period, entries, startIndex }: { period: string; entries: ExperienceEntry[]; startIndex: number }) => (
  <div className="relative">
    <div className="relative pl-10 md:pl-14 mb-5">
      <div className="absolute left-[0.2rem] md:left-[0.2rem] top-1">
        <div
          className="w-2.5 h-2.5 rounded-full"
          style={{
            backgroundColor: entries.some(e => e.isCurrent) ? TRAJECTORY_COLOR : `hsla(var(--crimson), 0.7)`,
            boxShadow: entries.some(e => e.isCurrent) ? `0 0 8px ${TRAJECTORY_COLOR}` : 'none',
          }}
        />
      </div>
      <span
        className="text-[10px] font-mono uppercase tracking-[0.35em] font-bold"
        style={{ color: `hsla(var(--crimson), 0.85)` }}
      >
        {period}
      </span>
    </div>
    <div className="relative flex flex-col gap-2.5 md:gap-3">
      {entries.length > 1 && (
        <div
          className="absolute left-[0.28rem] md:left-[0.28rem] top-2 bottom-2 w-px"
          style={{ background: `linear-gradient(to bottom, hsla(var(--crimson), 0.3), hsla(var(--crimson), 0.08))` }}
        />
      )}
      {entries.map((exp, i) => (
        <EntryCard key={exp.id} exp={exp} index={startIndex + i} />
      ))}
    </div>
  </div>
))

PeriodBlock.displayName = 'PeriodBlock'

export default function Experience() {
  const prefersReducedMotion = useReducedMotion()
  const reduced = !!prefersReducedMotion

  const periods = ['2026', '2025', '2024', '2023'] as const
  const groupedByPeriod: Record<string, ExperienceEntry[]> = {}
  for (const p of periods) groupedByPeriod[p] = []
  for (const exp of sortedExperiences) {
    const year = exp.date.match(/(\d{4})/)?.[1] ?? '2026'
    if (!groupedByPeriod[year]) groupedByPeriod[year] = []
    groupedByPeriod[year].push(exp)
  }

  let globalIndex = 0
  const blocks: { period: string; entries: ExperienceEntry[]; startIndex: number }[] = []
  for (const p of periods) {
    const entries = groupedByPeriod[p]
    if (entries.length) {
      blocks.push({ period: p, entries, startIndex: globalIndex })
      globalIndex += entries.length
    }
  }

  return (
    <section id="experience" className="py-24 md:py-32 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: reduced ? 0 : 0.5 }}
        viewport={{ once: true }}
        className="max-w-7xl mx-auto mb-16 md:mb-20"
      >
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h2 className="text-gradient text-2xl sm:text-3xl md:text-5xl font-bold tracking-tight mb-3">
              Career Trajectory
            </h2>
            <p className="text-white/45 max-w-lg text-sm md:text-base leading-relaxed">
              From local labs to global deployments — a chronological path of building, researching, and shipping.
            </p>
          </div>
          <span
            className="text-[10px] font-mono uppercase tracking-[0.25em] flex-shrink-0"
            style={{ color: TRAJECTORY_COLOR }}
          >
            {sortedExperiences.length} milestones
          </span>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto">
        <div className="relative">
          <div
            className="hidden md:block absolute left-7 top-3 bottom-3 w-px"
            style={{
              background: `linear-gradient(to bottom, transparent, hsla(var(--crimson), 0.35) 5%, hsla(var(--crimson), 0.35) 95%, transparent)`,
            }}
          />

          <div className="relative flex flex-col gap-10 md:gap-12">
            {blocks.map(({ period, entries, startIndex }) => (
              <PeriodBlock key={period} period={period} entries={entries} startIndex={startIndex} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function RocketIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
      <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
      <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
    </svg>
  )
}

function GlobeIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
      <path d="M2 12h20" />
    </svg>
  )
}

function TerminalIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="4 17 10 11 4 5" />
      <line x1="12" x2="20" y1="19" y2="19" />
    </svg>
  )
}

function BriefcaseIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  )
}

function CodeIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  )
}
