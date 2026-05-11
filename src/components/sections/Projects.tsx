"use client"

import React from 'react'
import { BentoGrid, BentoGridItem } from '../BentoGrid'
import { 
  AppWindow, 
  Database, 
  Globe, 
  Layout, 
  ShieldCheck, 
  Zap 
} from 'lucide-react'

const projects = [
  {
    title: "PROJECT_01",
    status: "Active Deployment",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
    header: (
      <div className="relative flex flex-1 w-full h-full min-h-[6rem] rounded-none bg-gradient-to-br from-neutral-200 dark:from-neutral-900 dark:to-neutral-800 to-neutral-100 border border-white/5 overflow-hidden">
        <div className="absolute top-2 right-2 px-2 py-0.5 bg-green-500/10 border border-green-500/20 text-[8px] font-mono text-green-400 uppercase tracking-widest animate-pulse">
          Updating...
        </div>
      </div>
    ),
    icon: <Zap className="h-4 w-4 text-neutral-500" />,
    className: "md:col-span-2",
  },
  {
    title: "PROJECT_02",
    status: "Beta Testing",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
    header: (
      <div className="relative flex flex-1 w-full h-full min-h-[6rem] rounded-none bg-gradient-to-br from-neutral-200 dark:from-neutral-900 dark:to-neutral-800 to-neutral-100 border border-white/5 overflow-hidden">
        <div className="absolute top-2 right-2 px-2 py-0.5 bg-green-500/10 border border-green-500/20 text-[8px] font-mono text-green-400 uppercase tracking-widest animate-pulse">
          Updating...
        </div>
      </div>
    ),
    icon: <Database className="h-4 w-4 text-neutral-500" />,
    className: "md:col-span-1",
  },
  {
    title: "PROJECT_03",
    status: "In Progress",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
    header: (
      <div className="relative flex flex-1 w-full h-full min-h-[6rem] rounded-none bg-gradient-to-br from-neutral-200 dark:from-neutral-900 dark:to-neutral-800 to-neutral-100 border border-white/5 overflow-hidden">
        <div className="absolute top-2 right-2 px-2 py-0.5 bg-green-500/10 border border-green-500/20 text-[8px] font-mono text-green-400 uppercase tracking-widest animate-pulse">
          Updating...
        </div>
      </div>
    ),
    icon: <Globe className="h-4 w-4 text-neutral-500" />,
    className: "md:col-span-1",
  },
  {
    title: "PROJECT_04",
    status: "Architecture Design",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
    header: (
      <div className="relative flex flex-1 w-full h-full min-h-[6rem] rounded-none bg-gradient-to-br from-neutral-200 dark:from-neutral-900 dark:to-neutral-800 to-neutral-100 border border-white/5 overflow-hidden">
        <div className="absolute top-2 right-2 px-2 py-0.5 bg-green-500/10 border border-green-500/20 text-[8px] font-mono text-green-400 uppercase tracking-widest animate-pulse">
          Updating...
        </div>
      </div>
    ),
    icon: <ShieldCheck className="h-4 w-4 text-neutral-500" />,
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
