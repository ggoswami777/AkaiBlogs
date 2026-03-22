import React from 'react'
import { HomeBlogCardType } from '@/lib/types'
import { Notebook } from 'lucide-react'

const HomeBlogCard = ({ title, author, category, image }: HomeBlogCardType) => {
  return (
    <div className="group relative aspect-4/5 overflow-hidden rounded-xl cursor-pointer">
      <img
        src={image}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-linear-to-t from-background-dark via-background-dark/20 to-transparent"></div>
      <div className="absolute bottom-0 left-0 p-8 w-full space-y-4">
        <span className="bg-primary text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider block w-fit">
          {category}
        </span>
        <h4 className="text-2xl font-black text-white leading-tight">
          {title}
        </h4>
        <div className="flex items-center gap-3 text-sm text-slate-300">
          <span className="material-symbols-outlined text-[#ea2a33] text-lg"><Notebook/></span>
          <span>{author}</span>
        </div>
      </div>
    </div>
  )
}

export default HomeBlogCard
