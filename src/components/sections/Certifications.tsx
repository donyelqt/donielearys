"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { Award, CheckCircle2, ExternalLink } from 'lucide-react'

const certifications = [
  {
    name: "CERT_01",
    issuer: "Coursera",
    date: "2025 - 2026",
    link: "#",
  },
  {
    name: "CERT_02",
    issuer: "DataCamp",
    date: "2025 - 2026",
    link: "#",
  },
  {
    name: "CERT_03",
    issuer: "Amazon Web Services",
    date: "2024",
    link: "#",
  },
]

export default function Certifications() {
  return (
    <section id="certifications" className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-12">
          <Award className="w-8 h-8 text-white/40" />
          <h2 className="text-3xl md:text-5xl font-bold">Certifications</h2>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          {certifications.map((cert, i) => (
            <motion.div
              key={cert.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="p-6 rounded-none glass hover:border-white/20 transition-all flex flex-col justify-between gap-6"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <CheckCircle2 className="w-6 h-6 text-green-400/60" />
                  <span className="text-xs font-mono text-white/30 tracking-tighter">{cert.date}</span>
                </div>
                <h3 className="text-xl font-bold mb-1 tracking-tighter">{cert.name}</h3>
                <p className="text-white/40 text-xs font-mono uppercase tracking-widest">{cert.issuer}</p>
              </div>
              
              <a 
                href={cert.link} 
                className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/60 hover:text-white transition-colors group/link"
              >
                Verify Certificate
                <ExternalLink className="w-3 h-3 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
