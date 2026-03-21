import React from 'react'

const Footer = () => {
  return (
    <footer className="border-t border-primary/10 bg-accent-dark/30 py-12 font-display">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="size-6 text-primary">
              <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path d="M44 4H30.6666V17.3334H17.3334V30.6666H4V44H44V4Z"></path>
              </svg>
            </div>
            <h2 className="text-xl font-black tracking-tighter uppercase italic text-white">Zolo</h2>
          </div>
          <div className="flex items-center gap-8 text-slate-400 text-sm font-bold uppercase tracking-widest">
            <a className="hover:text-primary transition-colors" href="#">Discord</a>
            <a className="hover:text-primary transition-colors" href="#">X / Twitter</a>
            <a className="hover:text-primary transition-colors" href="#">Instagram</a>
          </div>
          <p className="text-slate-500 text-sm font-medium">© 2024 Zolo Collective. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer;