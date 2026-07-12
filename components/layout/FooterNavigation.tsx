"use client"

import { Home, Compass, Plus, MessageCircle, User } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function FooterNavigation() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    if (path === "/") {
      return pathname === "/"
    }
    return pathname.startsWith(path)
  }
  return (
    <nav className="fixed bottom-0 left-0 right-0 md:hidden bg-background-light dark:bg-background-dark border-t border-primary/10 px-4 py-2 flex justify-around items-center z-50">
      <Link
        href="/"
        className={`flex flex-col items-center p-2 transition-colors ${
          isActive("/") ? "text-primary" : "text-slate-500 hover:text-primary"
        }`}
      >
        <Home size={20} />
        <span className="text-[10px] font-bold">Home</span>
      </Link>
      <Link
        href="/akaiBlogs/feed"
        className={`flex flex-col items-center p-2 transition-colors ${
          isActive("/akaiBlogs/feed") ? "text-primary" : "text-slate-500 hover:text-primary"
        }`}
      >
        <Compass size={20} />
        <span className="text-[10px] font-bold">Explore</span>
      </Link>
      <Link
        href="/akaiBlogs/create"
        className="flex items-center justify-center p-2 bg-primary text-white rounded-full size-12 -mt-8 shadow-lg shadow-primary/40 border-4 border-background-dark active:scale-95 transition-transform"
      >
        <Plus size={24} />
      </Link>
      <Link
        href="/akaiBlogs/chat"
        className={`flex flex-col items-center p-2 transition-colors ${
          isActive("/akaiBlogs/chat") ? "text-primary" : "text-slate-500 hover:text-primary"
        }`}
      >
        <MessageCircle size={20} />
        <span className="text-[10px] font-bold">Chats</span>
      </Link>
      <Link
        href="/akaiBlogs/profile"
        className={`flex flex-col items-center p-2 transition-colors ${
          isActive("/akaiBlogs/profile") ? "text-primary" : "text-slate-500 hover:text-primary"
        }`}
      >
        <User size={20} />
        <span className="text-[10px] font-bold">Profile</span>
      </Link>
    </nav>
  )
}