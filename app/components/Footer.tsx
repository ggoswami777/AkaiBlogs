const Footer = () => {
  return (
    <footer className="py-12 bg-[rgb(var(--accent-dark)/0.3)] border-t border-red-500/10">
      <div className="flex flex-col md:flex-row justify-between items-center px-6 gap-6 container-main">
        <div className="flex items-center gap-3">
          <svg
            className="w-6 h-6 text-red-500"
            fill="currentColor"
            viewBox="0 0 48 48"
          >
            <path d="M44 4H30.6666V17.3334H17.3334V30.6666H4V44H44V4Z" />
          </svg>

          <h1 className="text-xl font-black italic text-gradient tracking-tight">
            AkaiBlogs
          </h1>
        </div>
        <div className="font-inter flex items-center font-bold text-md uppercase cursor-pointer tracking-widest gap-8">
          <a className="font-semibold text-slate-400 hover:text-red-500 transition-colors">Discord</a>
          <a className="font-semibold text-slate-400 hover:text-red-500 transition-colors">X / Twitter</a>
          <a className="font-semibold text-slate-400 hover:text-red-500 transition-colors">Instagram</a>
        </div>
        <p className="text-slate-500 text-sm font-medium">© 2024 Zolo Collective. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default Footer;