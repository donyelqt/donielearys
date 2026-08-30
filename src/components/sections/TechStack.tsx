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
  SiTensorflow,
  SiPytorch,
  SiLangchain,
  SiKubernetes,
  SiGit,
  SiFastapi,
  SiNodedotjs,
  SiAnthropic,
} from 'react-icons/si'

const techRow1 = [
  { name: "Next.js", Icon: SiNextdotjs },
  { name: "React", Icon: SiReact },
  { name: "TypeScript", Icon: SiTypescript },
  { name: "Tailwind CSS", Icon: SiTailwindcss },
  { name: "PostgreSQL", Icon: SiPostgresql },
  { name: "Docker", Icon: SiDocker },
  { name: "Python", Icon: SiPython },
  { name: "AWS", Icon: "aws" as const },
]

const techRow2 = [
  { name: "TensorFlow", Icon: SiTensorflow },
  { name: "PyTorch", Icon: SiPytorch },
  { name: "LangChain", Icon: SiLangchain },
  { name: "Kubernetes", Icon: SiKubernetes },
  { name: "Git", Icon: SiGit },
  { name: "FastAPI", Icon: SiFastapi },
  { name: "Node.js", Icon: SiNodedotjs },
  { name: "Anthropic", Icon: SiAnthropic },
]

function TechItem({ name, Icon }: { name: string; Icon: React.ElementType | "aws" }) {
  return (
    <div className="flex items-center gap-3 px-6 py-3 border border-foreground/10 rounded-none mx-2 group bg-foreground/5 hover:bg-foreground/10 transition-all duration-300">
      {Icon === "aws" ? (
        <div className="flex items-center justify-center w-5 h-5 border border-foreground/15 group-hover:border-foreground/30 transition-colors duration-300">
          <span className="font-mono text-[7px] font-bold text-foreground/85 group-hover:text-foreground tracking-tight leading-none">
            AWS
          </span>
        </div>
      ) : (
        <div className="text-foreground group-hover:scale-110 transition-transform duration-300">
          <Icon className="w-5 h-5" />
        </div>
      )}
      <span className="font-mono text-xs uppercase tracking-widest text-foreground/70 group-hover:text-foreground transition-colors whitespace-nowrap">
        {name}
      </span>
    </div>
  )
}

function MarqueeRow({ items, direction = 'left' }: { items: typeof techRow1; direction?: 'left' | 'right' }) {
  const animationClass = direction === 'left' ? 'animate-marquee-left' : 'animate-marquee-right'

  return (
    <div className="relative overflow-hidden py-4 group">
      <div
        className={`flex ${animationClass}`}
        style={{ width: 'max-content', willChange: 'transform', backfaceVisibility: 'hidden' }}
      >
        {/* Copies after the first are pure loop padding — hidden from assistive tech */}
        {[0, 1, 2, 3].map((copy) => (
          <div key={copy} aria-hidden={copy > 0 || undefined} className="flex">
            {items.map((tech, i) => (
              <div key={`${tech.name}-${i}`} className="flex-shrink-0">
                <TechItem {...tech} />
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="absolute inset-0 pointer-events-none bg-linear-to-r from-background via-transparent to-background z-10" />
    </div>
  )
}

export default function TechStack() {
  return (
    <section className="py-24 px-4 bg-foreground/2 overflow-hidden">
      <div className="max-w-7xl mx-auto mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-gradient text-3xl md:text-5xl font-bold mb-4">Tech Stack</h2>
          <p className="text-foreground/50 max-w-xl mx-auto">
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