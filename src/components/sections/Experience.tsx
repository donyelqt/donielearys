"use client"

import React, { memo } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { BentoGrid, BentoGridItem } from '../BentoGrid'
import { Briefcase, ChevronDown, ChevronUp, Code2, Globe, Rocket, Terminal } from 'lucide-react'

const experiences = [
  {
    id: 'accenture-2026',
    title: "Cloud Engineer Intern - Cloud Elite",
    company: "Accenture",
    location: "Manila, PH (Hybrid)",
    date: "Jun 2026 - Present",
    isCurrent: true,
    description: "Cloud Elite engineering intern at Accenture, specializing in cloud architecture, DevOps pipelines, and enterprise-scale infrastructure solutions.",
    icon: <Rocket className="h-4 w-4 text-white/60" />,
    className: "sm:col-span-1",
  },
  {
    id: 'avaron-2026',
    title: "AI Engineer, Agents & Ops (Contract)",
    company: "Avaron",
    location: "Atlanta, GA (Remote)",
    date: "Feb 2026 - Jun 2026",
    isCurrent: true,
    description: "Building the world's first autonomous self-healing data center. First and youngest Filipino software engineer architecting agentic AI infrastructure at Avaron. Collaborating with ex-IBM, Georgia Tech, and top US university developers.",
    icon: <Rocket className="h-4 w-4 text-white/60" />,
    className: "sm:col-span-1",
  },
  {
    id: 'tarana-ai-2025',
    title: "Full-Stack AI Engineer",
    company: "Tarana-ai",
    location: "Baguio City, PH",
    date: "2025 - Present",
    isCurrent: true,
    description: "LGU-supported agentic AI travel platform for Baguio City. Built multi-agent RAG pipeline with 100+ beta users, achieving 99%+ uptime. Selected for DICT STEP UP national startup pre-acceleration program.",
    icon: <Terminal className="h-4 w-4 text-white/60" />,
    className: "sm:col-span-1",
  },
  {
    id: 'perapinoy-2024',
    title: "Full-stack Developer",
    company: "PeraPinoy!",
    location: "Baguio City, PH",
    date: "2024 - 2025",
    isCurrent: false,
    description: "Founded and led the development of an AI-driven fintech MVP as CTO, leveraging Google Gemini APIs to revolutionize financial accessibility in the Philippines.",
    icon: <Code2 className="h-4 w-4 text-white/60" />,
    className: "sm:col-span-1",
  },
  {
    id: 'trifecta-2024',
    title: "Software Engineer Intern",
    company: "Trifecta Solutions",
    location: "Makati City, PH (Remote)",
    date: "2024 - 2025",
    isCurrent: false,
    description: "Led technical execution for a Web3 board strategy game, architecting matchmaking and core gameplay mechanics.",
    icon: <Code2 className="h-4 w-4 text-white/60" />,
    className: "sm:col-span-1",
  },
  {
    id: 'ai-singapore-2025',
    title: "AI/ML Engineer (National AI Student Challenge)",
    company: "AI Singapore",
    location: "Singapore (Hybrid)",
    date: "2025",
    isCurrent: false,
    description: "National AI Student Challenge Champion (Baguio), ranked Top 1 nationwide (Philippines), Top 3 in the PH League, and Top 15 in the ASEAN League for LLM optimization.",
    icon: <Briefcase className="h-4 w-4 text-white/60" />,
    className: "sm:col-span-1",
  },
  {
    id: 'uc-research-2025',
    title: "Applied AI Research Scientist",
    company: "Univ. Cordilleras",
    location: "Baguio City, PH",
    date: "2025 - Present",
    isCurrent: true,
    description: "Researching and building autonomous civic governance systems as an Applied AI Research Scientist for AgenticHinaing - a neuro-symbolic multi-agent civic social listening framework.",
    icon: <Globe className="h-4 w-4 text-white/60" />,
    className: "sm:col-span-1",
  },
  {
    id: 'dict-stepup-2025',
    title: "Startup Incubatee",
    company: "DICT STEP UP",
    location: "Hybrid",
    date: "2025 - 2026",
    isCurrent: false,
    description: "Selected for a national pre-acceleration program for Tarana-ai, an agentic travel app recognized as a promising tech venture by the Department of Information and Communications Technology.",
    icon: <Rocket className="h-4 w-4 text-white/60" />,
    className: "sm:col-span-1",
  },
  {
    id: 'aws-cloud-club-2025',
    title: "Chief Skill-Builder",
    company: "AWS Cloud Club",
    location: "UC Baguio",
    date: "Jan - Dec 2025",
    isCurrent: false,
    description: "Pioneered the AWS Learning Cloud Club as Chief Skill-Builder Chairperson to promote cloud and ML upskilling among CS students.",
    icon: <Briefcase className="h-4 w-4 text-white/60" />,
    className: "sm:col-span-1",
  },
  {
    id: 'datacamp-2025',
    title: "AI/ML Scholar",
    company: "DataCamp",
    location: "Remote",
    date: "2025 - 2026",
    isCurrent: false,
    description: "Selected as a scholar to master industry-aligned projects in data science, AI, and machine learning through DataCamp's structured learning path.",
    icon: <Terminal className="h-4 w-4 text-white/60" />,
    className: "sm:col-span-1",
  },
  ]

const ExperienceCard = memo(({ exp, index, reduced }: { exp: (typeof experiences)[0]; index: number; reduced: boolean }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: reduced ? 0 : 0.5, delay: index * 0.05 }}
      viewport={{ once: true }}
    >
      <BentoGridItem
        type="experience"
        title={
          <div className="flex items-center gap-2">
            <span className="text-sm sm:text-base md:text-lg font-bold leading-tight">{exp.title}</span>
          </div>
        }
        description={exp.description}
        header={
          <div className="flex flex-1 w-full h-full min-h-20 sm:min-h-24 lg:min-h-28 rounded-none bg-white/5 flex-col p-4 sm:p-5 justify-center border border-white/5">
            <div className="flex flex-col sm:flex-row justify-between gap-2 sm:gap-3 text-[10px] sm:text-[11px] font-mono text-white/40 mb-3 sm:mb-4 uppercase tracking-widest">
              <div className="flex items-center gap-2 flex-wrap">
                <span>{exp.date}</span>
                {exp.isCurrent && (
                  <span className="px-1.5 py-0.5 bg-green-500/20 text-green-400 text-[8px] font-mono uppercase tracking-wider rounded-sm border border-green-500/30">
                    Current
                  </span>
                )}
              </div>
              <span className="truncate">{exp.location}</span>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                {exp.icon}
              </div>
              <div className="text-base sm:text-lg md:text-xl font-bold tracking-tighter uppercase truncate">
                {exp.company}
              </div>
            </div>
          </div>
        }
        icon={null}
        className={exp.className}
      />
    </motion.div>
  )
})

ExperienceCard.displayName = 'ExperienceCard'

export default function Experience() {
  const [showAll, setShowAll] = React.useState(false)
  const prefersReducedMotion = useReducedMotion()

  return (
    <section id="experience" className="py-16 sm:py-20 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.5 }}
        viewport={{ once: true }}
        className="max-w-7xl mx-auto mb-8 sm:mb-12"
      >
        <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-4">Experience</h2>
        <p className="text-white/50 max-w-xl">
          A career built on pushing the boundaries of what's possible in tech.
        </p>
      </motion.div>

      <div className="max-w-7xl mx-auto">
        <BentoGrid>
          {experiences.slice(0, 5).map((exp, i) => (
            <ExperienceCard key={exp.id} exp={exp} index={i} reduced={!!prefersReducedMotion} />
          ))}
        </BentoGrid>

        <AnimatePresence>
          {showAll && (
            <motion.div
              initial={{ opacity: 0, maxHeight: 0 }}
              animate={{ opacity: 1, maxHeight: '120vh' }}
              exit={{ opacity: 0, maxHeight: 0 }}
              transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
              className="overflow-hidden mt-4"
            >
              <BentoGrid>
                {experiences.slice(5).map((exp, i) => (
                  <ExperienceCard key={exp.id} exp={exp} index={i + 5} reduced={!!prefersReducedMotion} />
                ))}
              </BentoGrid>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-10 sm:mt-12 mx-4 sm:mx-0 flex justify-center">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => setShowAll(!showAll)}
            className="group px-6 sm:px-8 py-3 border border-white/10 bg-white/5 hover:bg-white hover:text-black transition-all duration-300 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          >
            {showAll ? (
              <>
                Show Less <ChevronUp className="w-4 h-4 group-hover:-translate-y-1 transition-transform" />
              </>
            ) : (
              <>
                See More Experience <ChevronDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
              </>
            )}
          </motion.button>
        </div>
      </div>
    </section>
  )
}