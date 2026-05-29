import React from 'react'

export default function Footer() {
  return (
    <footer className="py-12 border-t border-white/5 mt-20">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex flex-col gap-2">
          <div className="text-xl font-bold tracking-tighter">DONIELE</div>
          <p className="text-white/30 text-sm">© 2026 Doniele Arys Antonio</p>
        </div>
        
        <div className="flex gap-8 text-sm text-white/40 font-medium">
          <a href="#" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Twitter</a>
          <a href="https://github.com/donyelqt" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">GitHub</a>
          <a href="https://linkedin.com/in/donielearysantonio" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">LinkedIn</a>
        </div>
      </div>
    </footer>
  )
}
