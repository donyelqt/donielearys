"use client"

import React from 'react'
import { BentoGrid, BentoGridItem } from '../BentoGrid'
import { 
  AppWindow, 
  Brain,
  Compass,
  Cpu,
  Database, 
  Globe, 
  Layout, 
  Server,
  ShieldCheck,
  Users,
  Zap 
} from 'lucide-react'

const projects = [
  {
    title: "Avaron",
    status: "Active Development",
    description: "AI-powered self-healing data center that automatically detects, diagnoses, and remediates infrastructure issues through intelligent agents and automated workflows.",
    header: (
      <div className="relative flex flex-1 w-full h-full min-h-[6rem] rounded-none bg-gradient-to-br from-violet-900/50 via-neutral-900 to-indigo-900/50 border border-white/5 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-4xl font-bold text-white/20">AV</span>
        </div>
      </div>
    ),
    icon: <Server className="h-4 w-4 text-violet-400" />,
    className: "md:col-span-2",
  },
  {
    title: "Tarana AI Waitlist",
    status: "Live",
    description: "High-converting waitlist landing page for Tarana AI's early access program featuring email capture, referral tracking, and real-time waitlist position updates.",
    header: (
      <div className="relative flex flex-1 w-full h-full min-h-[6rem] rounded-none bg-gradient-to-br from-amber-900/50 via-neutral-900 to-orange-900/50 border border-white/5 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-4xl font-bold text-white/20">TW</span>
        </div>
      </div>
    ),
    icon: <Users className="h-4 w-4 text-amber-400" />,
    className: "md:col-span-1",
  },
  {
    title: "Tarana AI",
    status: "Beta Testing",
    description: "Enterprise-grade Agentic AI RAG travel platform for Baguio City that generates real-time, personalized itineraries using multi-agent AI, vector embeddings, and live traffic/weather data.",
    header: (
      <div className="relative flex flex-1 w-full h-full min-h-[6rem] rounded-none bg-gradient-to-br from-pink-900/50 via-neutral-900 to-rose-900/50 border border-white/5 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-4xl font-bold text-white/20">TN</span>
        </div>
      </div>
    ),
    icon: <Compass className="h-4 w-4 text-pink-400" />,
    className: "md:col-span-1",
  },
{
    title: "AgenticHinaing",
    status: "Research Production",
    description: "Neuro-symbolic multi-agent civic social listening system with 18 autonomous agents across 7 pipeline nodes, featuring self-learning cyclic RAG, 5-signal credibility scoring, temporal-aware queries, and NLI-based claim verification for truth discovery.",
    header: (
      <div className="relative flex flex-1 w-full h-full min-h-[6rem] rounded-none bg-gradient-to-br from-cyan-900/50 via-neutral-900 to-teal-900/50 border border-white/5 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-4xl font-bold text-white/20">AG</span>
        </div>
      </div>
    ),
    icon: <Brain className="h-4 w-4 text-cyan-400" />,
    className: "md:col-span-2",
  },
]

export default function Projects() {
  return (
    <section id="projects" className="py-20 px-4">
      <div className="max-w-7xl mx-auto mb-12">
        <h2 className="text-3xl md:text-5xl font-bold mb-4">Featured Projects</h2>
        <p className="text-white/50 max-w-xl">
          A selection of my best work, ranging from AI systems to secure financial dashboards.
        </p>
      </div>
      <BentoGrid>
        {projects.map((project, i) => (
          <BentoGridItem
            key={i}
            title={project.title}
            description={project.description}
            header={project.header}
            icon={project.icon}
            className={project.className}
          />
        ))}
      </BentoGrid>
    </section>
  )
}
