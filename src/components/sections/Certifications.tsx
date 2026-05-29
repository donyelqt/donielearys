"use client"

import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Award, BookOpen, Code, Database, Cloud, Brain, Lock } from 'lucide-react'

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
  const prefersReducedMotion = useReducedMotion()

  return (
    <section id="certifications" className="py-20 px-4">
      <motion.div
        variants={prefersReducedMotion ? {} : containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="max-w-7xl mx-auto mb-12"
      >
        <motion.h2 variants={itemVariants} className="text-4xl md:text-5xl font-bold mb-4">Certifications</motion.h2>
        <motion.p variants={itemVariants} className="text-white/50 max-w-xl">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Professional credentials and continuous learning.
        </motion.p>
      </motion.div>

      <div className="max-w-7xl mx-auto">
        {certifications.map((cert, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            whileHover={{ scale: 1.01 }}
            className="group relative mb-6 p-6 bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-300"
          >
            <div className="flex flex-col lg:flex-row gap-6">
              <div className={`flex-shrink-0 w-full lg:w-48 h-32 rounded-lg bg-gradient-to-br ${cert.color} border border-white/10 flex items-center justify-center`}>
                <div className="p-3 bg-black/40 backdrop-blur-sm rounded-lg">
                  {cert.icon}
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <h3 className="text-lg font-bold tracking-tight mb-1">{cert.title}</h3>
                    <p className="text-[10px] font-mono uppercase tracking-widest text-white/40">{cert.issuer} · {cert.date}</p>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <span className="text-2xl font-bold text-white/80">{cert.progress}%</span>
                    <p className="text-[8px] font-mono uppercase text-white/30">Complete</p>
                  </div>
                </div>

                <p className="text-sm text-white/60 leading-relaxed mb-4">{cert.description}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {cert.skills.map((skill, j) => (
                    <span key={j} className="px-2 py-1 text-[9px] font-mono uppercase bg-white/5 border border-white/10 text-white/60">
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="relative h-1 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${cert.progress}%` }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + i * 0.1, duration: 0.8, ease: "easeOut" }}
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-white/40 to-white/60 rounded-full"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}