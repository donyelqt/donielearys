"use client"

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BentoGrid, BentoGridItem } from '../BentoGrid'
import { Briefcase, ChevronDown, ChevronUp, Code2, Globe, Rocket, Terminal } from 'lucide-react'

const experiences = [
  {
    title: "AI Engineer, Agents & Ops (Part-time, Equity)",
    company: "Avaron",
    location: "Atlanta, GA (Remote)",
    date: "2026 - Present",
    description: "Building the world's first autonomous self-healing data center. First and youngest Filipino software engineer architecting agentic AI infrastructure at Avaron. Collaborating with ex-IBM, Georgia Tech, and top US university developers.",
    icon: <Rocket className="h-4 w-4 text-neutral-500" />,
    className: "md:col-span-2",
  },
  {
    title: "Full-Stack AI Engineer & Co-Founder",
    company: "Tarana-ai",
    location: "Baguio City, PH",
    date: "2025 - Present",
    description: "LGU-supported agentic AI travel platform for Baguio City. Built multi-agent RAG pipeline with 100+ beta users, achieving 99%+ uptime. Selected for DICT STEP UP national startup pre-acceleration program.",
    icon: <Terminal className="h-4 w-4 text-neutral-500" />,
    className: "md:col-span-1",
  },
  {
    title: "Full-stack Developer (CTO)",
    company: "PeraPinoy!",
    location: "Baguio City, PH",
    date: "2024 - 2025",
    description: "Founded and led the development of an AI-driven fintech MVP as CTO, leveraging Google Gemini APIs to revolutionize financial accessibility in the Philippines.",
    icon: <Code2 className="h-4 w-4 text-neutral-500" />,
    className: "md:col-span-1",
  },
  {
    title: "Software Engineer Intern",
    company: "Trifecta Solutions",
    location: "Makati City, PH (Remote)",
    date: "2024 - 2025",
    description: "Led technical execution for a Web3 board strategy game, architecting matchmaking and core gameplay mechanics.",
    icon: <Code2 className="h-4 w-4 text-neutral-500" />,
    className: "md:col-span-1",
  },
  {
    title: "AI/ML Engineer (National AI Student Challenge)",
    company: "AI Singapore",
    location: "Singapore (Hybrid)",
    date: "2025",
    description: "National AI Student Challenge Champion (Baguio), ranked Top 1 nationwide (Philippines), Top 3 in the PH League, and Top 15 in the ASEAN League for LLM optimization.",
    icon: <Briefcase className="h-4 w-4 text-neutral-500" />,
    className: "md:col-span-1",
  },
  {
    title: "Applied AI Research Scientist",
    company: "Univ. Cordilleras",
    location: "Baguio City, PH",
    date: "2025 - Present",
    description: "Researching and building autonomous civic governance systems as an Applied AI Research Scientist for AgenticHinaing - a neuro-symbolic multi-agent civic social listening framework.",
    icon: <Globe className="h-4 w-4 text-neutral-500" />,
    className: "md:col-span-1",
  },
  {
    title: "Startup Incubatee",
    company: "DICT STEP UP",
    location: "Hybrid",
    date: "2025 - 2026",
    description: "Selected for a national pre-acceleration program for Tarana-ai, an agentic travel app recognized as a promising tech venture by the Department of Information and Communications Technology.",
    icon: <Rocket className="h-4 w-4 text-neutral-500" />,
    className: "md:col-span-1",
  },
  {
    title: "Chief Skill-Builder",
    company: "AWS Cloud Club",
    location: "UC Baguio",
    date: "2025",
    description: "Pioneered the AWS Learning Cloud Club as Chief Skill-Builder Chairperson to promote cloud and ML upskilling among CS students.",
    icon: <Briefcase className="h-4 w-4 text-neutral-500" />,
    className: "md:col-span-1",
  },
  {
    title: "AI/ML Scholar",
    company: "DataCamp",
    location: "Remote",
    date: "2025 - 2026",
    description: "Selected as a scholar to master industry-aligned projects in data science, AI, and machine learning through DataCamp's structured learning path.",
    icon: <Terminal className="h-4 w-4 text-neutral-500" />,
    className: "md:col-span-1",
  },
]

export default function Experience() {
  const [showAll, setShowAll] = React.useState(false)

  return (
    <section id="experience" className="py-20 px-4">
      <div className="max-w-7xl mx-auto mb-12 text-right">
        <h2 className="text-3xl md:text-5xl font-bold mb-4">Experience</h2>
        <p className="text-white/50 max-w-xl ml-auto">
          A career built on pushing the boundaries of what's possible on the tech.
        </p>
      </div>

      <div className="max-w-7xl mx-auto">
        <BentoGrid>
          {experiences.slice(0, 5).map((exp, i) => (
            <BentoGridItem
              key={i}
              title={`${exp.title} @ ${exp.company}`}
              description={exp.description}
              header={
                <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-none bg-white/5 flex-col p-4 justify-center border border-white/5">
                  <div className="flex justify-between items-center text-[10px] font-mono text-white/40 mb-2 uppercase tracking-widest">
                    <span>{exp.date}</span>
                    <span>{exp.location}</span>
                  </div>
                  <div className="text-2xl font-bold tracking-tighter uppercase">{exp.company}</div>
                </div>
              }
              icon={exp.icon}
              className={exp.className}
            />
          ))}
        </BentoGrid>

        <AnimatePresence>
          {showAll && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="overflow-hidden mt-4"
            >
              <BentoGrid>
                {experiences.slice(5).map((exp, i) => (
                  <BentoGridItem
                    key={i + 5}
                    title={`${exp.title} @ ${exp.company}`}
                    description={exp.description}
                    header={
                      <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-none bg-white/5 flex-col p-4 justify-center border border-white/5">
                        <div className="flex justify-between items-center text-[10px] font-mono text-white/40 mb-2 uppercase tracking-widest">
                          <span>{exp.date}</span>
                          <span>{exp.location}</span>
                        </div>
                        <div className="text-2xl font-bold tracking-tighter uppercase">{exp.company}</div>
                      </div>
                    }
                    icon={exp.icon}
                    className={exp.className}
                  />
                ))}
              </BentoGrid>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-12 flex justify-center">
          <button
            onClick={() => setShowAll(!showAll)}
            className="group px-8 py-3 border border-white/10 bg-white/5 hover:bg-white hover:text-black transition-all duration-300 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest"
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
          </button>
        </div>
      </div>
    </section>
  )
}
