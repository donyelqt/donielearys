"use client"

import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { BentoGrid, BentoGridItem } from '../BentoGrid'
import {
  Brain,
  Compass,
  Server,
  Users,
} from 'lucide-react'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
}

const statusColors: Record<string, string> = {
  'Active Development': 'bg-violet-500/20 text-violet-400 border-violet-500/30',
  'Live': 'bg-green-500/20 text-green-400 border-green-500/30',
  'Beta Testing': 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  'Research Production': 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
}

const projects = [
  {
    title: "Avaron",
    status: "Active Development",
    description: "AI-powered autonomous infrastructure platform for edge datacenters and modern compute. Features real-time telemetry, self-healing remediation, and operator-grade reporting. Built for defense and telecom operations with production deployments across active facilities.",
    header: (
      <div className="relative flex flex-1 w-full h-full min-h-[4rem] xs:min-h-[5rem] sm:min-h-[6rem] rounded-none bg-gradient-to-br from-violet-900/50 via-neutral-900 to-indigo-900/50 border border-white/5 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold text-white/20">AV</span>
        </div>
        <span className={`absolute top-1.5 right-1.5 xs:top-2 xs:right-2 sm:top-3 sm:right-3 px-1.5 py-0.5 xs:px-2 xs:py-1 text-[6px] xs:text-[7px] sm:text-[8px] font-mono uppercase border rounded-sm ${statusColors['Active Development']}`}>
          Active Development
        </span>
      </div>
    ),
    icon: <Server className="h-4 w-4 text-violet-400" />,
    className: "sm:col-span-2",
  },
  {
    title: "Tarana AI Waitlist",
    status: "Live",
    description: "High-converting waitlist landing page for Tarana AI's early access program featuring email capture, referral tracking, and real-time waitlist position updates. 150+ registered users on waitlist.",
    header: (
      <div className="relative flex flex-1 w-full h-full min-h-[4rem] xs:min-h-[5rem] sm:min-h-[6rem] rounded-none bg-gradient-to-br from-amber-900/50 via-neutral-900 to-orange-900/50 border border-white/5 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold text-white/20">TW</span>
        </div>
        <span className={`absolute top-1.5 right-1.5 xs:top-2 xs:right-2 sm:top-3 sm:right-3 px-1.5 py-0.5 xs:px-2 xs:py-1 text-[6px] xs:text-[7px] sm:text-[8px] font-mono uppercase border rounded-sm ${statusColors['Live']}`}>
          Live
        </span>
      </div>
    ),
    icon: <Users className="h-4 w-4 text-amber-400" />,
    className: "sm:col-span-1",
  },
  {
    title: "Tarana AI",
    status: "Beta Testing",
    description: "Enterprise-grade Agentic AI RAG travel platform for Baguio City that generates real-time, personalized itineraries using multi-agent AI, vector embeddings, live traffic/weather data. Supported by LGU Baguio City and deployed with 100+ beta users.",
    header: (
      <div className="relative flex flex-1 w-full h-full min-h-[4rem] xs:min-h-[5rem] sm:min-h-[6rem] rounded-none bg-gradient-to-br from-pink-900/50 via-neutral-900 to-rose-900/50 border border-white/5 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold text-white/20">TN</span>
        </div>
        <span className={`absolute top-1.5 right-1.5 xs:top-2 xs:right-2 sm:top-3 sm:right-3 px-1.5 py-0.5 xs:px-2 xs:py-1 text-[6px] xs:text-[7px] sm:text-[8px] font-mono uppercase border rounded-sm ${statusColors['Beta Testing']}`}>
          Beta Testing
        </span>
      </div>
    ),
    icon: <Compass className="h-4 w-4 text-pink-400" />,
    className: "sm:col-span-1",
  },
{
    title: "AgenticHinaing",
    status: "Research Production",
    description: "Neuro-symbolic multi-agent civic social listening system with 18 autonomous agents across 7 pipeline nodes, featuring self-learning cyclic RAG, 5-signal credibility scoring, temporal-aware queries, and NLI-based claim verification for truth discovery.",
    header: (
      <div className="relative flex flex-1 w-full h-full min-h-[4rem] xs:min-h-[5rem] sm:min-h-[6rem] rounded-none bg-gradient-to-br from-cyan-900/50 via-neutral-900 to-teal-900/50 border border-white/5 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold text-white/20">AG</span>
        </div>
        <span className={`absolute top-1.5 right-1.5 xs:top-2 xs:right-2 sm:top-3 sm:right-3 px-1.5 py-0.5 xs:px-2 xs:py-1 text-[6px] xs:text-[7px] sm:text-[8px] font-mono uppercase border rounded-sm ${statusColors['Research Production']}`}>
          Research Production
        </span>
      </div>
    ),
    icon: <Brain className="h-4 w-4 text-cyan-400" />,
    className: "sm:col-span-2",
  },
]

export default function Projects() {
  const prefersReducedMotion = useReducedMotion()

  return (
    <section id="projects" className="py-16 sm:py-20 px-4">
      <motion.div
        variants={prefersReducedMotion ? {} : containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="max-w-7xl mx-auto mb-8 sm:mb-12"
      >
        <motion.h2 variants={itemVariants} className="text-2xl sm:text-3xl md:text-5xl font-bold mb-4">Featured Projects</motion.h2>
        <motion.p variants={itemVariants} className="text-white/50 max-w-xl">
          A selection of my best work, ranging from AI systems to secure financial dashboards.
        </motion.p>
      </motion.div>
      <motion.div
        variants={prefersReducedMotion ? {} : containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <BentoGrid>
          {projects.map((project, i) => (
            <BentoGridItem
              type="project"
              key={i}
              title={project.title}
              description={project.description}
              header={project.header}
              icon={project.icon}
              className={project.className}
            />
          ))}
        </BentoGrid>
      </motion.div>
    </section>
  )
}