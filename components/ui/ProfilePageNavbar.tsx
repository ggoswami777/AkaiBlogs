import { Settings } from "lucide-react"

export default function ProfilePageNavbar() {
  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-primary/20 px-4 md:px-10 py-3 bg-background-light dark:bg-background-dark sticky top-0 z-50">
      <div className="flex items-center gap-4 text-primary">
        <div className="size-8 flex items-center justify-center  text-primary">
          <svg
            fill="currentColor"
            viewBox="0 0 48 48"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M44 4H30.6666V17.3334H17.3334V30.6666H4V44H44V4Z"></path>
          </svg>
        </div>
        <h2 className="text-slate-900 dark:text-slate-100 text-lg font-bold leading-tight tracking-[-0.015em]">My Profile</h2>
      </div>
      <div className="flex gap-2">
        <button className="flex items-center justify-center rounded-full h-10 w-10 bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
          <span><Settings></Settings></span>
        </button>
      </div>
    </header>
  )
}