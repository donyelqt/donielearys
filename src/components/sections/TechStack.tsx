"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { 
  Code, 
  Cpu, 
  Layers, 
  Layout, 
  Palette, 
  Server, 
  Smartphone, 
  Terminal 
} from 'lucide-react'

const techs = [
  { name: "STACK_01", icon: Code, color: "text-blue-400" },
  { name: "STACK_02", icon: Layers, color: "text-white" },
  { name: "STACK_03", icon: Terminal, color: "text-blue-500" },
  { name: "STACK_04", icon: Palette, color: "text-cyan-400" },
  { name: "STACK_05", icon: Server, color: "text-green-500" },
  { name: "STACK_06", icon: Cpu, color: "text-purple-400" },
  { name: "STACK_07", icon: Smartphone, color: "text-pink-500" },
  { name: "STACK_08", icon: Layout, color: "text-slate-400" },
]

export default function TechStack() {
  return (
    <section className="py-20 px-4 bg-white/[0.02]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Tech Stack</h2>
          <p className="text-white/50 max-w-xl mx-auto">
            I leverage the most powerful tools in the industry to build robust applications.
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {techs.map((tech, i) => (
            <motion.div
              key={tech.name}
              whileHover={{ y: -5, scale: 1.02 }}
              className="group p-8 rounded-none glass flex flex-col items-center justify-center text-center gap-4 hover:border-white/20 transition-all cursor-default"
            >
              <div className={`p-4 rounded-none bg-white/5 ${tech.color} group-hover:scale-110 transition-transform duration-300`}>
                <tech.icon className="w-8 h-8" />
              </div>
              <h3 className="font-mono text-xs uppercase tracking-widest">{tech.name}</h3>
              <div className="absolute inset-0 bg-white/5 rounded-none opacity-0 group-hover:opacity-100 blur-xl transition-opacity -z-10" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
