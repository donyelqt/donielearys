"use client"

import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Quote, BadgeCheck } from 'lucide-react'
import { SectionHeader } from '@/components/SectionHeader'

const testimonials = [
  {
    name: 'Richard Jakelski',
    role: 'Former US-Based IBM Senior Software Engineer',
    quote:
      "The agentic design is good, designed well, and in my opinion would be good to go for at least a large scale demo environment. Overall great work.",
    context: 'CS Thesis Validation · AgenticHinaing Eval Framework · Apr 2026',
    pending: false,
    attribution: 'Email · GPG-signed · Apr 17, 2026',
  },
  {
    name: 'Accenture Advanced Application Engineering Manager',
    role: 'Accenture Cloud Elite Program · SWE Intern',
    quote:
      "Just start working already, don't bother graduating. You've experienced everything there is to experience. You'll be the one teaching the other interns here.",
    context: 'Personal Recognition During Debrief · 2026',
    pending: false,
        attribution: 'Verbal · Microsoft Teams debrief · Witnessed by 30+ fellow interns',
  },
      {
        name: 'Taiwanese Developer',
        role: 'International Developer · Taiwan · PH Startup Week 2025',
        quote: 'Good young software engineer',
        context: 'PH Startup Week 2025 · Nov 14, 2025',
        pending: false,
        attribution: 'Verbal · Witnessed by UC InTTO employees at PH Startup Week 2025',
      },
      {
        name: 'Former Investor',
        role: 'Ideaspace · PH Startup Week 2025',
        quote: 'It doesn\'t matter if your team are students as long as they have the talent, grit and passion.',
        context: 'PH Startup Week 2025 · Nov 14, 2025',
        pending: false,
        attribution: 'Verbal · Witnessed by UC InTTO employees at PH Startup Week 2025',
      },
      {
        name: 'Leandro',
        role: 'Project Technical Staff · Incubator Baguio · Former E27 Singapore & UC InTTO',
        quote:
          'Based on your skill, I think you\'re more than capable of building a system that isn\'t easy to replicate, right?',
        context: 'Co-founder feedback on Tarana-ai architecture',
        pending: false,
        attribution: 'Verbal · 2025',
      },
]

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

export default function Testimonials() {
  const prefersReducedMotion = useReducedMotion()

  return (
    <section id="testimonials" className="py-20 px-4">
      <SectionHeader index="05" title="Validation" eyebrow="Validation" meta="ENDORSED" />
      <div className="max-w-7xl mx-auto">
        <motion.p
          variants={prefersReducedMotion ? {} : itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="-mt-4 mb-12 text-foreground/50 max-w-xl"
        >
          Recognition from collaborators, mentors, and senior engineers who
          reviewed the work firsthand.
        </motion.p>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
        {testimonials.map((t, i) => (
          <motion.div
            key={i}
            variants={prefersReducedMotion ? {} : itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className={`relative p-6 border border-foreground/10 bg-foreground/[0.02] hover:bg-foreground/[0.04] hover:border-foreground/20 transition-all duration-300 ${
              i < 3
                ? 'lg:col-span-2'
                : i === 3
                  ? 'lg:col-span-2 lg:col-start-2'
                  : 'lg:col-span-2 lg:col-start-4'
            }`}
          >
            {t.pending && (
              <div className="absolute -top-2 left-4 px-2 py-0.5 text-[8px] font-mono uppercase bg-foreground/10 text-foreground/50 tracking-wider z-20">
                Pending Quote
              </div>
            )}
            {!t.pending && (
              <div className="absolute -top-2 left-4 px-2 py-0.5 text-[8px] font-mono uppercase bg-red-500/20 text-red-400 border border-red-500/30 dark:bg-green-500/20 dark:text-green-400 dark:border-green-500/30 tracking-wider z-20 flex items-center gap-1">
                <BadgeCheck className="w-2.5 h-2.5" />
                Verified
              </div>
            )}

            <Quote className="w-5 h-5 text-foreground/15 mb-4" />

            {t.quote ? (
              <p className="text-foreground/80 text-sm leading-relaxed mb-6 italic">
                &ldquo;{t.quote}&rdquo;
              </p>
            ) : (
              <div className="mb-6 min-h-[80px] flex items-center justify-center border border-dashed border-foreground/10 p-4">
                <span className="text-[10px] font-mono uppercase tracking-widest text-foreground/25 text-center">
                  Awaiting verification
                </span>
              </div>
            )}

            <div className="border-t border-foreground/5 pt-4">
              <p className="text-foreground font-bold text-sm mb-1">{t.name}</p>
              <p className="text-[10px] font-mono uppercase tracking-widest text-foreground/40 mb-2">
                {t.role}
              </p>
              <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-foreground/25">
                {t.context}
              </p>
              {t.attribution && (
                <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-foreground/20 mt-1">
                  {t.attribution}
                </p>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}