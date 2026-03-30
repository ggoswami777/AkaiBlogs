const Footer2 = () => {
  return (
    <footer className="bg-obsidian border-t border-white/5 pt-20 pb-10">
      <div className="max-w-400 mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="size-8 text-primary">
                <svg
                  fill="currentColor"
                  viewBox="0 0 48 48"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M44 4H30.6666V17.3334H17.3334V30.6666H4V44H44V4Z"></path>
                </svg>
              </div>
              <h2 className="text-2xl font-black text-slate-100">ZOLO</h2>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Forging a new era of digital storytelling through timeless aesthetics and sharp narratives.
            </p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6 text-[10px] uppercase tracking-widest">Chronicles</h4>
            <ul className="space-y-4 text-slate-400 text-xs">
              <li><a className="hover:text-primary transition-colors" href="#">Latest Scrolls</a></li>
              <li><a className="hover:text-primary transition-colors" href="#">The Dojo</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6 text-[10px] uppercase tracking-widest">The Guild</h4>
            <ul className="space-y-4 text-slate-400 text-xs">
              <li><a className="hover:text-primary transition-colors" href="#">Our Ethos</a></li>
              <li><a className="hover:text-primary transition-colors" href="#">Support Shrine</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6 text-[10px] uppercase tracking-widest">Legal</h4>
            <ul className="space-y-4 text-slate-400 text-xs">
              <li><a className="hover:text-primary transition-colors" href="#">Terms of Honor</a></li>
              <li><a className="hover:text-primary transition-colors" href="#">Privacy Scroll</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em]">
          <p>© 2024 ZOLO SHOGUNATE. ALL RIGHTS RESERVED.</p>
          <div className="flex gap-8">
            <span className="hover:text-white cursor-pointer transition-colors">TOKYO</span>
            <span className="hover:text-white cursor-pointer transition-colors">KYOTO</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer2;