"use client"

import React from 'react'
import { motion } from 'framer-motion'
import {
  Code,
  Cpu,
  Layers,
  Layout,
  Palette,
  Server,
  Terminal,
  Database,
  GitBranch,
  Container,
  Cloud,
  TerminalSquare,
  FlaskConical,
  Brain,
  Shield
} from 'lucide-react'

const techRow1 = [
  { name: "Next.js", icon: Code, color: "text-white" },
  { name: "React", icon: Layout, color: "text-cyan-400" },
  { name: "TypeScript", icon: TerminalSquare, color: "text-blue-400" },
  { name: "Tailwind CSS", icon: Palette, color: "text-sky-400" },
  { name: "PostgreSQL", icon: Database, color: "text-blue-500" },
  { name: "Docker", icon: Container, color: "text-blue-400" },
  { name: "Python", icon: Terminal, color: "text-yellow-400" },
  { name: "AWS", icon: Cloud, color: "text-orange-400" },
]

const techRow2 = [
  { name: "TensorFlow", icon: Brain, color: "text-orange-400" },
  { name: "PyTorch", icon: Cpu, color: "text-red-400" },
  { name: "LangChain", icon: Layers, color: "text-teal-400" },
  { name: "Kubernetes", icon: Server, color: "text-blue-500" },
  { name: "Git", icon: GitBranch, color: "text-orange-500" },
  { name: "FastAPI", icon: FlaskConical, color: "text-green-400" },
  { name: "Node.js", icon: Server, color: "text-green-500" },
  { name: "Anthropic", icon: Shield, color: "text-purple-400" },
]

function TechItem({ name, icon: Icon, color }: { name: string, icon: React.ElementType, color: string }) {
  return (
    <div className="flex items-center gap-3 px-6 py-3 border border-white/10 rounded-none mx-2 group cursor-pointer bg-white/5 hover:bg-white/10 transition-all duration-300">
      <div className={`${color} group-hover:scale-110 transition-transform duration-300`}>
        <Icon className="w-5 h-5" />
      </div>
      <span className="font-mono text-xs uppercase tracking-widest text-white/70 group-hover:text-white transition-colors whitespace-nowrap">
        {name}
      </span>
    </div>
  )
}

function MarqueeRow({ items, direction = 'left' }: { items: typeof techRow1, direction?: 'left' | 'right' }) {
  const duplicatedItems = [...items, ...items]
  const animationClass = direction === 'left' ? 'animate-marquee-left' : 'animate-marquee-right'

  return (
    <div className="relative overflow-hidden py-4 group">
      <div className={`flex whitespace-nowrap ${animationClass}`} style={{ willChange: 'transform', transform: 'translateZ(0)' }}>
        {duplicatedItems.map((tech, i) => (
          <TechItem key={`${tech.name}-${i}`} {...tech} />
        ))}
      </div>
      <div className="absolute inset-0 pointer-events-none bg-linear-to-r from-background via-transparent to-background z-10" />
    </div>
  )
}

export default function TechStack() {
  return (
    <section className="py-24 px-4 bg-white/2 overflow-hidden">
      <div className="max-w-7xl mx-auto mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Tech Stack</h2>
          <p className="text-white/50 max-w-xl mx-auto">
            I leverage the most powerful tools in the industry to build robust applications.
          </p>
        </motion.div>
      </div>

      <div className="flex flex-col gap-4">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          viewport={{ once: true }}
          className="group"
        >
          <MarqueeRow items={techRow1} direction="left" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
          className="group"
        >
          <MarqueeRow items={techRow2} direction="right" />
        </motion.div>
      </div>
    </section>
  )
}