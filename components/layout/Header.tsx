import SearchBar from "@/components/ui/SearchBar"
import Link from 'next/link'
import { Bell, MessageSquare, Plus } from 'lucide-react'

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full glass-panel border-b border-primary/10">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-10">
          <Link href="/" className="flex items-center gap-3 active:scale-95 transition-transform">
            <div className="size-8 text-primary">
              <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path d="M44 4H30.6666V17.3334H17.3334V30.6666H4V44H44V4Z"></path>
              </svg>
            </div>
            
            <h2 className="text-2xl font-black tracking-tighter uppercase italic">AkaiBlogs</h2>
          </Link>
        </div>
        <div className="flex items-center gap-6">
          <SearchBar />
          
          <div className="hidden md:flex items-center gap-6 border-l border-white/10 pl-6 h-8">
            <Link href="/akaiBlogs/create">
              <button className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-full text-sm font-bold transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-primary/20 flex items-center gap-2">
                <Plus size={18} />
                <span>New Scroll</span>
              </button>
            </Link>

            <button className="text-slate-400 hover:text-primary transition-colors">
              <MessageSquare size={20} />
            </button>
            <button className="text-slate-400 hover:text-primary transition-colors">
              <Bell size={20} />
            </button>
          </div>

          <Link href="/akaiBlogs/profile" className="size-10 rounded-full border-2 border-primary/30 overflow-hidden hover:scale-110 transition-transform">
            <img
              alt="Profile"
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuARrNF78qTP1Qjs8WBhowU7Lkc1VfhyYOOo6WVPbSmDT1HKzHDwczfhNZda_UrGmb4HT8A1z19TeRhMkJ7dKz5dNNEZX6YuOedHRvBa4rm3aMj3a7xam19YC7oslObzYbPAMAun1BK-MCE4Xs7vgb00is7arR6xc7R9aumrGsPYSt1WuUA44pU_EZiUsM6LtCrpg8Woxr-YhntVUW_xOcGm3wpG5JxG4f_yX4yGs4Orl3ewnJHPlkJykGJa5CR_7wcgnQA_6t6m-g"
            />
          </Link>
        </div>
      </div>
    </header>

  )
}

export default Header