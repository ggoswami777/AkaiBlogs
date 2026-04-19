import { Home, Compass, Plus, MessageCircle, User } from "lucide-react"
import Link from "next/link"

export default function FooterNavigation() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 md:hidden bg-background-light dark:bg-background-dark border-t border-primary/10 px-4 py-2 flex justify-around items-center z-50">
      <Link href="/" className="flex flex-col items-center p-2 text-slate-500 hover:text-primary transition-colors">
        <Home size={20} />
        <span className="text-[10px] font-bold">Home</span>
      </Link>
      <Link href="/akaiBlogs/feed" className="flex flex-col items-center p-2 text-slate-500 hover:text-primary transition-colors">
        <Compass size={20} />
        <span className="text-[10px] font-bold">Explore</span>
      </Link>
      <button className="flex items-center justify-center p-2 bg-primary text-white rounded-full size-12 -mt-8 shadow-lg shadow-primary/40 border-4 border-background-dark active:scale-95 transition-transform">
        <Plus size={24} />
      </button>
      <Link href="/akaiBlogs/chat" className="flex flex-col items-center p-2 text-slate-500 hover:text-primary transition-colors">
        <MessageCircle size={20} />
        <span className="text-[10px] font-bold">Chats</span>
      </Link>
      <Link href="/akaiBlogs/profile" className="flex flex-col items-center p-2 text-slate-500 hover:text-primary transition-colors">
        <User size={20} />
        <span className="text-[10px] font-bold">Profile</span>
      </Link>
    </nav>
  )
}