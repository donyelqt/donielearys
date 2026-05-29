"use client"

import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Award, BookOpen, FileBadge, GraduationCap, Shield, Trophy, Medal, Star, Zap } from 'lucide-react'

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

const competitions = [
  {
    title: "AI Singapore - National AI Student Challenge",
    issuer: "AI Singapore",
    date: "2025",
    description: "National AI Student Challenge Champion (Baguio), ranked Top 1 nationwide (Philippines), Top 3 in the PH League, and Top 15 in the ASEAN League for LLM optimization.",
    icon: <Trophy className="h-5 w-5 text-amber-400" />,
    badge: "Rankings",
    badgeColor: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    achievement: "1st Place PH (Peak Rank)",
  },
  {
    title: "DICT STEP UP Pre-Acceleration Program",
    issuer: "Department of Information and Communications Technology",
    date: "2025",
    description: "Selected for regional pre-acceleration program for Tarana-ai, an agentic travel app recognized as a promising tech venture by DICT CAR Philippines.",
    icon: <Star className="h-5 w-5 text-cyan-400" />,
    badge: "Selected",
    badgeColor: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
    achievement: "Regional Selection",
  },
  {
    title: "AWS Cloud Club - Chief Skill-Builder",
    issuer: "UC Baguio",
    date: "2025",
    description: "Pioneered the AWS Learning Cloud Club as Chief Skill-Builder Chairperson to promote cloud and ML upskilling among CS students.",
    icon: <Medal className="h-5 w-5 text-green-400" />,
    badge: "Leadership",
    badgeColor: "bg-green-500/20 text-green-400 border-green-500/30",
    achievement: "Founded",
  },
  {
    title: "Philippine Startup Challenge",
    issuer: "DICT CAR",
    date: "2024",
    description: "Led technical execution for a Finance and Travel app, achieving Semi-Finalist in PSC9 and Finalist in PSCX with over 1000+ startups in the region CAR.",
    icon: <Zap className="h-5 w-5 text-violet-400" />,
    badge: "Finalist (9 & X)",
    badgeColor: "bg-violet-500/20 text-violet-400 border-violet-500/30",
    achievement: " Top Startups in the Cordillera Region",
  },
  {
    title: "AI.DEAS FOR IMPACT 2025",
    issuer: "DICT CAR",
    date: "2025",
    description: "Finalist in the AI.DEAS FOR IMPACT 2025 competition for solo develop traffic-aware navigation app",
    icon: <Shield className="h-5 w-5 text-blue-400" />,
    badge: "Finalist",
    badgeColor: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    achievement: "3rd Place",
  },
  {
    title: "Tarana AI - LGU Supported",
    issuer: "LGU Baguio City",
    date: "2025",
    description: "Enterprise-grade Agentic AI RAG travel platform supported by LGU Baguio City with 100+ beta users.",
    icon: <Award className="h-5 w-5 text-pink-400" />,
    badge: "LGU Partner",
    badgeColor: "bg-pink-500/20 text-pink-400 border-pink-500/30",
    achievement: "Gov Partnership",
  },
]

export default function Competitions() {
  const prefersReducedMotion = useReducedMotion()

  return (
    <section id="competitions" className="py-20 px-4">
      <motion.div
        variants={prefersReducedMotion ? {} : containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="max-w-7xl mx-auto mb-12"
      >
        <motion.h2 variants={itemVariants} className="text-4xl md:text-5xl font-bold mb-4">Competitions & Achievements</motion.h2>
        <motion.p variants={itemVariants} className="text-white/50 max-w-xl">
          Featured recognition, rankings, and achievements in AI, cloud, and software development.
        </motion.p>
      </motion.div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {competitions.map((comp, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            whileHover={{ y: -4 }}
            className="group relative p-6 bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-300"
          >
            <div className="absolute top-4 right-4">
              <span className={`px-2 py-1 text-[8px] font-mono uppercase border rounded-sm ${comp.badgeColor}`}>
                {comp.badge}
              </span>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-2 bg-white/5 border border-white/10">
                {comp.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-bold tracking-tight mb-1 pr-16">{comp.title}</h3>
                <p className="text-[10px] font-mono uppercase tracking-widest text-white/40 mb-3">{comp.issuer}</p>
                <p className="text-xs text-white/60 leading-relaxed line-clamp-3">{comp.description}</p>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center">
              <span className="text-[10px] font-mono text-white/30">{comp.date}</span>
              <span className="text-[10px] font-mono text-amber-400/60">{comp.achievement}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}