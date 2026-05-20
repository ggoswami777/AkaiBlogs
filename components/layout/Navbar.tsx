"use client";

import { Bell, Search, MessageSquare, Plus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const router = useRouter();
  const [headerSearch, setHeaderSearch] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (headerSearch.trim()) {
      router.push(`/akaiBlogs/search?q=${encodeURIComponent(headerSearch)}`);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center p-4">
      <div className="bg-[#1f141499] w-full max-w-400 rounded-full px-8 py-3 flex items-center justify-between border border-primary/10 backdrop-blur-[12px]">
        {/* logo */}
        <div className="flex items-center gap-3">
          <div className="size-8 text-primary">
            <svg
              fill="currentColor"
              viewBox="0 0 48 48"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M44 4H30.6666V17.3334H17.3334V30.6666H4V44H44V4Z"></path>
            </svg>
          </div>
          <Link href={`/akaiBlogs/feed`} >
            <h1 className="text-2xl font-black tracking-tighter text-slate-100">
            AkaiBlogs
          </h1>
          </Link>
          
        </div>

        {/* searchbar */}
        <form onSubmit={handleSearchSubmit} className="hidden lg:flex items-center gap-10">
          <div className="relative group">
            <input
              value={headerSearch}
              onChange={(e) => setHeaderSearch(e.target.value)}
              className="bg-black/40 border border-white/10 rounded-full px-6 py-1.5 text-sm w-64 focus:outline-none focus:border-primary transition-all text-slate-100"
              placeholder="Search the scrolls..."
              type="text"
            />
            <button type="submit" className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-primary transition-colors">
              <Search size={14} />
            </button>
          </div>
        </form>

        {/* actions */}
        <div className="flex items-center gap-4 md:gap-6">
          {/* Mobile Search Icon Link (visible on screens smaller than lg) */}
          <Link href="/akaiBlogs/search" className="text-slate-300 hover:text-primary transition-colors lg:hidden p-1 rounded-full hover:bg-white/5">
            <Search size={20} />
          </Link>

          <Link href="/akaiBlogs/create">
            <button className="bg-primary hover:bg-primary/90 text-white px-5 py-2 rounded-full text-xs font-bold transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-primary/20 flex items-center gap-2">
              <Plus size={16} />
              <span className="hidden sm:inline">New Scroll</span>
            </button>
          </Link>
          
          <button className="text-slate-300 hover:text-primary transition-colors hidden md:block">
            <MessageSquare size={20} />
          </button>
          
          <button className="text-slate-300 hover:text-primary transition-colors hidden sm:block">
            <Bell size={20} />
          </button>

          <Link href="/akaiBlogs/profile" className="w-10 h-10 rounded-full border-2 border-primary/50 p-0.5 hover:scale-110 transition-transform">
            <img
              alt="Profile"
              className="w-full h-full rounded-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDQREzBniPFG2Rv_94OnCxJg4cRDD40044S_MYT3ZXzSs4-9GW-Jv3-nb6sUnnqs2nTb6XE0OcJsPGnJDuMQJZ9QcIcQ_aHE1N7YwlkHcXxTBimzOzoqZ6IzCaH-CeERYMzm06b5vHmwCKTr24X--k89shI3ntfJqHPuc2pmf9UGQ60JwENsEpz0xxzRexZnHPo4N61bX1AIe4QBvRpu7bNUZKwep55iMNKLCoKqkRSQK4tfIUepeZ3C9uu4pIuIbkiT-5nAYtHiQ"
            />
          </Link>
        </div>


      </div>
    </nav>
  );
};

export default Navbar;
