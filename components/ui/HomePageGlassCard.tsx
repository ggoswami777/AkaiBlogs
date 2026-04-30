import React from 'react'
import { HomePageGlassCardType } from '@/types'

const HomePageGlassCard = ({ title, data, icon }: HomePageGlassCardType) => {
  return (
    <div className="glass-panel p-8 rounded-xl flex items-center justify-between border-l-4 border-l-primary group hover:bg-accent-dark/60 transition-colors">
      <div>
        <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-1">
          {title}
        </p>
        <p className="text-4xl font-black text-white">{data}</p>
      </div>
      <div className="text-primary/40 group-hover:text-primary transition-colors">
        <span className="material-symbols-outlined  ">{icon}</span>
      </div>
    </div>
  )
}

export default HomePageGlassCard