"use client"

import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'

const nodes = [
  { id: 1, x: 10, y: 20, label: 'PLANNING', special: true },
  { id: 2, x: 30, y: 15, label: 'REQUIREMENTS' },
  { id: 3, x: 50, y: 10, label: 'DESIGN', special: true },
  { id: 4, x: 70, y: 15, label: 'DEVELOPMENT' },
  { id: 5, x: 90, y: 20, label: 'TESTING', special: true },
  { id: 6, x: 80, y: 50, label: 'DEPLOYMENT' },
  { id: 7, x: 68, y: 78, label: 'MAINTENANCE', special: true }, // x:60
  { id: 8, x: 30, y: 74, label: 'OPTIMIZATION' }, // x:40
  { id: 9, x: 20, y: 50, label: 'ANALYSIS' },
]

const edges = [
  [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8], [8, 9], [9, 1]
]

const EdgeWithSignal = ({ from, to, index }: { from: typeof nodes[0], to: typeof nodes[0], index: number }) => {
  const prefersReducedMotion = useReducedMotion()

  return (
    <React.Fragment key={`edge-group-${index}`}>
      <motion.line
        x1={`${from.x}%`}
        y1={`${from.y}%`}
        x2={`${to.x}%`}
        y2={`${to.y}%`}
        stroke="white"
        strokeWidth="0.5"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ 
          pathLength: 1, 
          opacity: [0.05, 0.2, 0.05] 
        }}
        transition={{ 
          pathLength: prefersReducedMotion ? { duration: 0 } : { duration: 2, delay: index * 0.1 },
          opacity: { duration: 3, repeat: Infinity, ease: "easeInOut", delay: index * 0.2 }
        }}
      />
      {!prefersReducedMotion && (
        <motion.circle
          r="4"
          fill="white"
          initial={{ 
            cx: `${from.x}%`, 
            cy: `${from.y}%`,
            opacity: 0 
          }}
          animate={{ 
            cx: [`${from.x}%`, `${to.x}%`], 
            cy: [`${from.y}%`, `${to.y}%`],
            opacity: [0, 1, 0]
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity, 
            ease: "linear",
            delay: index * 0.5
          }}
        />
      )}
    </React.Fragment>
  )
}

const AnimatedNode = ({ node }: { node: typeof nodes[0] }) => {
  const prefersReducedMotion = useReducedMotion()

  return (
    <g key={`node-${node.id}`}>
      {node.special && (
        <motion.circle
          cx={`${node.x}%`}
          cy={`${node.y}%`}
          r="40"
          stroke="white"
          strokeWidth="1"
          strokeOpacity="0.2"
          fill="none"
          animate={{ 
            r: [40, 60, 40], 
            opacity: [0.1, 0.3, 0.1],
            strokeWidth: [1, 2, 1]
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: node.id * 0.2 }}
        />
      )}
      <motion.circle
        cx={`${node.x}%`}
        cy={`${node.y}%`}
        r="10"
        fill="white"
        initial={prefersReducedMotion ? { opacity: 0.5 } : { scale: 0 }}
        animate={{ 
          scale: 1,
          filter: prefersReducedMotion ? "none" : ["drop-shadow(0 0 0px #fff)", "drop-shadow(0 0 10px #fff)", "drop-shadow(0 0 0px #fff)"],
          opacity: [0.5, 1, 0.5]
        }}
        transition={{ 
          scale: prefersReducedMotion ? { duration: 0 } : { delay: node.id * 0.1 },
          filter: { duration: 2, repeat: Infinity, delay: node.id * 0.3 },
          opacity: { duration: 2, repeat: Infinity, delay: node.id * 0.3 }
        }}
      />
      <motion.text
        x={`${node.x}%`}
        y={`${node.y + 5}%`}
        textAnchor="middle"
        fill="white"
        fontFamily="monospace"
        fontWeight="bold"
        className="uppercase tracking-widest text-[6px] md:text-[12px] lg:text-[14px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.2, 0.6, 0.2] }}
        transition={{ duration: 2, repeat: Infinity, delay: node.id * 0.3 }}
      >
        {node.label}
      </motion.text>
    </g>
  )
}

export default function NetworkBackground() {
  const prefersReducedMotion = useReducedMotion()

  return (
    <div 
      className="absolute inset-0 overflow-hidden pointer-events-none -z-10" 
      style={{ opacity: 0.3 }}
    >
      <svg width="100%" height="100%" className="absolute inset-0">
        <defs>
          <radialGradient id="nodeGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="white" stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
        </defs>

        {edges.map(([fromId, toId], i) => {
          const fromNode = nodes.find(n => n.id === fromId)!
          const toNode = nodes.find(n => n.id === toId)!
          return <EdgeWithSignal key={i} from={fromNode} to={toNode} index={i} />
        })}

        {nodes.map((node) => (
          <AnimatedNode key={node.id} node={node} />
        ))}
      </svg>
    </div>
  )
}
