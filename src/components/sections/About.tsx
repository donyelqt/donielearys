"use client"

import React from 'react'
import { motion } from 'framer-motion'

export default function About() {
  return (
    <section id="about" className="py-20 px-4">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-8">Passionate about craft, driven by technology.</h2>
          <div className="space-y-6 text-white/60 text-lg leading-relaxed">
            <p>
              I’m Doniele Arys Antonio, a 3rd-year Computer Science student at the Center of Excellence in ITE at the University of the Cordilleras, driven by continuous learning in software engineering and AI systems. My journey in tech began early with a deep curiosity about how software works, leading me to become a self-taught full-stack engineer with a strong focus on agentic AI systems, infrastructure design, and applied machine learning.
            </p>
            <p>
              I'm currently an AI Infrastructure & Security Engineer at Avaron, a US-based company developing autonomous data center systems. My work centers on designing reliable agentic workflows and implementing infrastructure-level security for AI operations. Notably, I am the first and youngest Filipino software engineer contributing to this initiative.
            </p>
            <p>
              Beyond industry work, I've architected a novel AI-assisted autonomous civic governance framework for my CS thesis. This multi-agent architecture monitors public sentiment and translates it into verifiable, actionable governance insights—a novel approach grounded in research from Stanford, Microsoft Research, and related large-scale AI systems.
            </p>
            <p>
              Outside of tech, I’m a competitive spirit who enjoys gaming and basketball. This nature drives my commitment to problem-solving and innovation in my tech projects—from Baguio to the global stage.
            </p>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="relative aspect-square rounded-none overflow-hidden glass p-1"
        >
          <div className="w-full h-full bg-gradient-to-br from-white/10 to-transparent rounded-none flex items-center justify-center">
            <span className="text-8xl grayscale">👨‍💻</span>
          </div>
          {/* Decorative elements */}
          <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-white/5 rounded-full blur-2xl" />
          <div className="absolute -top-6 -left-6 w-32 h-32 bg-white/5 rounded-full blur-2xl" />
        </motion.div>
      </div>
    </section>
  )
}
