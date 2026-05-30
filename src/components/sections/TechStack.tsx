"use client"

import React from 'react'
import { motion } from 'framer-motion'
import {
  SiNextdotjs,
  SiReact,
  SiTypescript,
  SiTailwindcss,
  SiPostgresql,
  SiDocker,
  SiPython,
  SiServerless,
  SiTensorflow,
  SiPytorch,
  SiKubernetes,
  SiGithub,
  SiNodedotjs,
  SiGraphql,
} from 'react-icons/si'

const techRow1 = [
  { name: "Next.js", Icon: SiNextdotjs },
  { name: "React", Icon: SiReact },
  { name: "TypeScript", Icon: SiTypescript },
  { name: "Tailwind CSS", Icon: SiTailwindcss },
  { name: "PostgreSQL", Icon: SiPostgresql },
  { name: "Docker", Icon: SiDocker },
  { name: "Python", Icon: SiPython },
  { name: "AWS", Icon: SiServerless },
]

const techRow2 = [
  { name: "TensorFlow", Icon: SiTensorflow },
  { name: "PyTorch", Icon: SiPytorch },
  { name: "LangChain", Icon: SiGraphql },
  { name: "Kubernetes", Icon: SiKubernetes },
  { name: "Git", Icon: SiGithub },
  { name: "FastAPI", Icon: SiPython },
  { name: "Node.js", Icon: SiNodedotjs },
  { name: "Anthropic", Icon: SiReact },
]

function TechItem({ name, Icon }: { name: string, Icon: React.ElementType }) {
  return (
    <div className="flex items-center gap-3 px-6 py-3 border border-white/10 rounded-none mx-2 group cursor-pointer bg-white/5 hover:bg-white/10 transition-all duration-300">
      <div className="text-white group-hover:scale-110 transition-transform duration-300">
        <Icon className="w-5 h-5" />
      </div>
      <span className="font-mono text-xs uppercase tracking-widest text-white/70 group-hover:text-white transition-colors whitespace-nowrap">
        {name}
      </span>
    </div>
  )
}

function MarqueeRow({ items, direction = 'left' }: { items: typeof techRow1, direction?: 'left' | 'right' }) {
  const animationClass = direction === 'left' ? 'animate-marquee-left' : 'animate-marquee-right'

  return (
    <div className="relative overflow-hidden py-4 group">
      <div
        className={`flex ${animationClass}`}
        style={{ width: 'max-content', willChange: 'transform', backfaceVisibility: 'hidden' }}
      >
        {[0, 1, 2, 3].map((copy) =>
          items.map((tech, i) => (
            <div key={`${copy}-${tech.name}-${i}`} className="flex-shrink-0">
              <TechItem {...tech} />
            </div>
          ))
        )}
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