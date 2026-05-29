"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { Mail, MessageSquare, Send } from 'lucide-react'

export default function Contact() {
  return (
    <section id="contact" className="py-20 px-4">
      <div className="max-w-3xl mx-auto glass p-8 md:p-12 rounded-none text-center border-t-2 border-white/10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="w-16 h-16 bg-white/5 rounded-none flex items-center justify-center mx-auto mb-8 border border-white/10">
            <MessageSquare className="w-8 h-8 text-white/60" />
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tighter uppercase">Initialize Contact.</h2>
          <p className="text-white/50 text-sm font-mono mb-10 uppercase tracking-widest">
            Ready to deploy next-gen agentic systems?
          </p>
          
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
            <a 
              href="mailto:arysantonio123@gmail.com"
              className="w-full md:w-auto px-10 py-4 bg-white text-black font-bold rounded-none flex items-center justify-center gap-2 hover:bg-white/90 transition-all group uppercase tracking-tighter"
            >
              <Mail className="w-4 h-4" />
              Send Email
            </a>
            <a 
              href="https://linkedin.com/in/donielearysantonio"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full md:w-auto px-10 py-4 border border-white/20 text-white font-bold rounded-none hover:bg-white/5 transition-all flex items-center justify-center gap-2 uppercase tracking-tighter"
            >
              <Send className="w-4 h-4" />
              Ping System
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
