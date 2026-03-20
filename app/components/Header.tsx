import React from 'react'
import SearchBar from './ui/SearchBar'
import { Inter } from 'next/font/google'
const interBold = Inter({
  subsets: ['latin'],
})
const Header = () => {


  return (
    <nav className="sticky top-0 z-50 glass border-b border-red-500/10">
      <div className="container-main flex justify-between items-center py-4">

        {/* LEFT: Logo */}
        <div className="flex items-center gap-10">

          {/* Logo */}
          <div className="flex items-center gap-3">
            <svg
              className="w-8 h-8 text-red-500"
              fill="currentColor"
              viewBox="0 0 48 48"
            >
              <path d="M44 4H30.6666V17.3334H17.3334V30.6666H4V44H44V4Z" />
            </svg>

            <h1 className="text-2xl font-black italic text-gradient tracking-tight">
              AkaiBlogs
            </h1>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">

            <a className="text-sm font-semibold uppercase cursor-pointer tracking-widest text-white/80 hover:text-red-500 transition-colors">
              Stories
            </a>

            <a className="text-sm font-semibold cursor-pointer uppercase tracking-widest text-white/80 hover:text-red-500 transition-colors">
              Clans
            </a>

            <a className="text-sm font-semibold cursor-pointer uppercase tracking-widest text-white/80 hover:text-red-500 transition-colors">
              Archive
            </a>

            <a className="text-sm font-semibold uppercase cursor-pointer tracking-widest text-white/80 hover:text-red-500 transition-colors">
              About
            </a>

          </nav>

        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-6">
          <SearchBar />
          <button className="btn-primary">Join Collective</button>
          <div className="avatar">U</div>
        </div>

      </div>
    </nav>
  )
}

export default Header