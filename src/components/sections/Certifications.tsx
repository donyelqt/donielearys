"use client"

import React, { useMemo } from 'react'
import { BookOpen, Code, Database, Cloud, Brain, Lock, Cog, Sparkles } from 'lucide-react'

const SCRAMBLE_CHARS = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`'

// Pre-generate scrambled text ONCE at module load — no per-frame state updates
function scrambleText(text: string): string {
  return text.split('').map(() => SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]).join('')
}

const certifications = [
  {
    title: "Lorem ipsum dolor sit amet",
    issuer: "Consectetur Adipiscing Elit",
    date: "2025 - Present",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    skills: ["React", "Node.js", "TypeScript", "PostgreSQL"],
    icon: <Brain className="h-6 w-6 text-violet-400" />,
    progress: 75,
    color: "from-violet-900/50 to-purple-900/50",
  },
  {
    title: "Sed do eiusmod tempor",
    issuer: "Incididunt Ut Labore",
    date: "2025",
    description: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    skills: ["AWS", "Cloud Computing", "Infrastructure"],
    icon: <Cloud className="h-6 w-6 text-amber-400" />,
    progress: 40,
    color: "from-amber-900/50 to-orange-900/50",
  },
  {
    title: "Duis aute irure dolor",
    issuer: "Reprehenderit Voluptate",
    date: "2023 - Present",
    description: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
    skills: ["Python", "Machine Learning", "Data Science"],
    icon: <Code className="h-6 w-6 text-cyan-400" />,
    progress: 85,
    color: "from-cyan-900/50 to-blue-900/50",
  },
  {
    title: "Excepteur sint occaecat",
    issuer: "Cupidatat Non Proident",
    date: "2024 - Present",
    description: "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    skills: ["LangChain", "Vector DBs", "Agentic AI"],
    icon: <BookOpen className="h-6 w-6 text-green-400" />,
    progress: 60,
    color: "from-green-900/50 to-emerald-900/50",
  },
  {
    title: "Nemo enim ipsam voluptatem",
    issuer: "Quia Voluptas Sit",
    date: "2026",
    description: "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores.",
    skills: ["Security", "Zero Trust", "Compliance"],
    icon: <Lock className="h-6 w-6 text-red-400" />,
    progress: 55,
    color: "from-red-900/50 to-rose-900/50",
  },
  {
    title: "Neque porro quisquam",
    issuer: "Est Qui Dolorem",
    date: "2024",
    description: "Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit.",
    skills: ["PostgreSQL", "MongoDB", "Redis"],
    icon: <Database className="h-6 w-6 text-pink-400" />,
    progress: 70,
    color: "from-pink-900/50 to-rose-900/50",
  },
]

export default function Certifications() {
  // Feature flag: set NEXT_PUBLIC_CERTIFICATIONS_ENABLED=false in .env.local to hide
  const isEnabled = process.env.NEXT_PUBLIC_CERTIFICATIONS_ENABLED !== 'false'
  if (!isEnabled) return null
  // Generate scrambled titles ONCE per mount (stable across re-renders)
  const crafts = useMemo(
    () => certifications.map((cert) => ({ ...cert, scrambledTitle: scrambleText(cert.title) })),
    []
  )

  return (
    <section id="certifications" className="py-20 px-4">
      <div className="max-w-7xl mx-auto mb-12">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">Certifications</h2>
        <p className="text-white/50 max-w-xl">
          Professional credentials and continuous learning.
        </p>
      </div>

      <div className="max-w-7xl mx-auto">
        {crafts.map((cert, i) => (
          <div
            key={i}
            className="group relative mb-6 p-6 bg-white/5 border border-white/10 transition-colors duration-300"
            style={{ animationDelay: `${i * 0.2}s` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-violet-900/10 via-transparent to-amber-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="flex flex-col lg:flex-row gap-6 relative">
              <div
                className={`flex-shrink-0 w-full lg:w-48 h-32 rounded-lg bg-gradient-to-br ${cert.color} border border-white/10 flex items-center justify-center crafting-fade-1`}
                style={{ animationDelay: `${i * 0.2}s` }}
              >
                <div className="p-3 bg-black/40 backdrop-blur-sm rounded-lg">
                  {cert.icon}
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <h3
                      className="text-lg font-bold tracking-tight mb-1 text-white/20 crafting-fade-2"
                      style={{ animationDelay: `${i * 0.2}s` }}
                    >
                      {cert.scrambledTitle}
                    </h3>
                    <p
                      className="text-[10px] font-mono uppercase tracking-widest text-white/20 crafting-fade-3"
                      style={{ animationDelay: `${i * 0.2}s` }}
                    >
                      {cert.issuer} · {cert.date}
                    </p>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <span
                      className="text-2xl font-bold text-white/20 crafting-fade-2 inline-block"
                      style={{ animationDelay: `${i * 0.2}s` }}
                    >
                      {cert.progress}%
                    </span>
                    <p className="text-[8px] font-mono uppercase text-white/10">LOCKED</p>
                  </div>
                </div>

                <div
                  className="text-sm text-white/20 leading-relaxed mb-4 font-mono crafting-fade-3"
                  style={{ animationDelay: `${i * 0.2}s` }}
                >
                  {'████████ ████████ ██████ ████ ███████ ██████ ████████ ████████ ████ ██████'}
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {cert.skills.map((skill, j) => (
                    <span
                      key={j}
                      className="px-2 py-1 text-[9px] font-mono uppercase bg-white/5 border border-white/10 text-white/20 crafting-fade-1"
                      style={{ animationDelay: `${i * 0.2 + j * 0.1}s` }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="relative h-1 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-violet-500/50 to-amber-500/50 rounded-full crafting-progress-bar"
                    style={{ animationDelay: `${i * 0.3}s` }}
                  />
                </div>
              </div>
            </div>

            <div
              className="absolute inset-0 pointer-events-none crafting-overlay"
              style={{ animationDelay: `${i * 0.2}s` }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <Cog className="h-12 w-12 text-white/10 animate-spin" />
              </div>
            </div>
          </div>
        ))}

        <div className="mt-8 flex items-center justify-center gap-3 text-white/40">
          <Sparkles className="h-4 w-4 animate-pulse" />
          <span className="text-sm font-mono uppercase tracking-widest">Crafting in progress...</span>
          <Sparkles className="h-4 w-4 animate-pulse" />
        </div>
      </div>
    </section>
  );
}