"use client"

import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Award, BadgeCheck, BookOpen, FileBadge, GraduationCap, Rocket, Shield, Trophy, Medal, Star, Zap } from 'lucide-react'

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
    title: "AMD Developer Hackathon",
    issuer: "AMD | Google Deepmind",
    date: "Jul 2026",
    description: "Top 20 Global Standing out of 20,000+ participants & 4,000+ teams worldwide as a solo competitor. Achieved 94% high agent accuracy on the AMD Harness Eval across 8 domains while using only 4,000+ tokens, demonstrating highly efficient general-purpose AI agents without sacrificing accuracy. Mentored and judged by senior software engineers from Google, AMD, AWS, and more.",
    icon: <Trophy className="h-5 w-5 text-amber-300" />,
    badge: "Top 20 Global",
    badgeColor: "bg-white text-black font-bold border-white/50",
    achievement: "94% Accuracy | 4K Tokens",
    highlight: true,
  },
  {
    title: "AI Singapore - National AI Student Challenge",
    issuer: "AWS | AI Singapore",
    date: "2025",
    description: "National AI Student Challenge Champion (Top 1 Baguio), ranked Top 1 nationwide (Philippines), Top 3 in the PH League, and Top 9-11 peak rank and final rank of Top 15 in the ASEAN League for LLM optimization.",
    icon: <Trophy className="h-5 w-5 text-amber-400" />,
    badge: "Rankings",
    badgeColor: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    achievement: "1st Place PH (Peak Rank)",
  },
  {
    title: "CS Thesis Project Validated by Former US-Based IBM Senior SWE",
    issuer: "Richard Jakelski",
    date: "Apr 2026",
    description: "Externally validated and evaluated through the AgenticHinaing Eval Framework — grounded in agentic system evaluation methodologies drawn from research-level implementation standards. CS Thesis Project associated with University of the Cordilleras.",
    icon: <BadgeCheck className="h-5 w-5 text-indigo-400" />,
    badge: "Validated",
    badgeColor: "bg-indigo-500/20 text-indigo-300 border-indigo-500/40",
    achievement: "External Validation",
  },
{
    title: "Avaron - Atlanta Tech Village",
    issuer: "Atlanta Tech Village (4th Largest US Startup Hub)",
    date: "2026",
    description: "AI Engineer at Avaron, deployed at Atlanta Tech Village in Buckhead - the 4th largest startup hub in the United States. Building world's first autonomous self-healing data center.",
    icon: <Rocket className="h-5 w-5 text-red-400" />,
    badge: "Venture Engineer",
    badgeColor: "bg-red-500/20 text-red-400 border-red-500/30",
    achievement: "4th Largest US Tech Hub",
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
    achievement: "Founding Team",
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
    <section id="competitions" className="py-20 px-4 overflow-x-hidden">
      <motion.div
        variants={prefersReducedMotion ? {} : containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        className="max-w-7xl mx-auto mb-12"
      >
        <motion.h2 variants={itemVariants} className="text-4xl md:text-5xl font-bold mb-4">Featured Competitions & Achievements</motion.h2>
        <motion.p variants={itemVariants} className="text-white/50 max-w-xl">
          Featured recognition, rankings, and achievements in AI, cloud, and software development.
        </motion.p>
      </motion.div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {competitions.map((comp, i) => (
          <motion.article
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1, margin: "0px 0px -50px 0px" }}
            transition={{ delay: prefersReducedMotion ? 0 : i * 0.05, duration: 0.4, ease: "easeOut" }}
            style={{ transform: "translateZ(0)" }}
            className={`card-hover-lift relative p-6 border rounded-sm transition-[border-color,box-shadow] duration-300 ${
                comp.highlight
                  ? "bg-red-900/30 border-red-600/50 hover:border-red-500/70 shadow-[0_0_30px_-8px_rgba(220,38,38,0.15)] hover:shadow-[0_0_40px_-8px_rgba(220,38,38,0.25)]"
                  : "bg-white/5 border-white/10 hover:border-white/20"
              }`}
          >
            {comp.highlight && (
              <div className="absolute -top-2 left-4 px-2 py-0.5 text-[8px] font-mono uppercase bg-red-600 text-white tracking-wider z-20 rounded-sm shadow-lg">
                Featured
              </div>
            )}
            <div className="absolute top-4 right-4 z-10">
              <span className={`px-2 py-1 text-[8px] font-mono uppercase border rounded-sm ${comp.badgeColor}`}>
                {comp.badge}
              </span>
            </div>

            <div className="flex items-start gap-4">
              <div className={`shrink-0 p-2 border ${comp.highlight ? "bg-red-950/60 border-red-600/40" : "bg-white/5 border-white/10"}`}>
                {comp.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-bold tracking-tight mb-1 pr-20 md:pr-16 break-words">{comp.title}</h3>
                <p className="text-[10px] font-mono uppercase tracking-widest text-white/40 mb-3 break-words">{comp.issuer}</p>
                <p className="text-xs text-white/60 leading-relaxed line-clamp-3 break-words">{comp.description}</p>
              </div>
            </div>

            <div className={`mt-4 pt-4 border-t flex flex-wrap justify-between items-center gap-2 ${comp.highlight ? "border-red-600/30" : "border-white/5"}`}>
              <span className="text-[10px] font-mono text-white/30">{comp.date}</span>
              <span className={`text-[10px] font-mono ${comp.highlight ? "text-amber-300/80" : "text-amber-400/60"}`}>{comp.achievement}</span>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  )
}