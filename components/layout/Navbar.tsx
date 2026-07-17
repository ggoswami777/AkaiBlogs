"use client";

import { Bell, Search, MessageSquare, Plus, Heart, UserPlus, Check } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { userProfileStore } from "@/store/useProfileStore";
import { useNotificationStore } from "@/store/useNotificationStore";
import { useChatStore } from "@/store/useChatStore";

const fallbackAvatar =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDQREzBniPFG2Rv_94OnCxJg4cRDD40044S_MYT3ZXzSs4-9GW-Jv3-nb6sUnnqs2nTb6XE0OcJsPGnJDuMQJZ9QcIcQ_aHE1N7YwlkHcXxTBimzOzoqZ6IzCaH-CeERYMzm06b5vHmwCKTr24X--k89shI3ntfJqHPuc2pmf9UGQ60JwENsEpz0xxzRexZnHPo4N61bX1AIe4QBvRpu7bNUZKwep55iMNKLCoKqkRSQK4tfIUepeZ3C9uu4pIuIbkiT-5nAYtHiQ";

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [headerSearch, setHeaderSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  
  const { profile, fetchProfile } = userProfileStore();
  const { notifications, unreadCount, fetchNotifications, markAllAsRead, setupSocketListener } = useNotificationStore();
  const connectChatSocket = useChatStore((s) => s.connectSocket);

  const isChatPage = pathname.startsWith("/akaiBlogs/chat");

  useEffect(() => {
    fetchProfile();
    fetchNotifications();
    setupSocketListener();
    connectChatSocket();
  }, [fetchProfile, fetchNotifications, setupSocketListener, connectChatSocket]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (headerSearch.trim()) {
      router.push(`/akaiBlogs/search?q=${encodeURIComponent(headerSearch)}`);
    }
  };

  const handleBellClick = () => {
    if (window.innerWidth < 768) {
      router.push("/akaiBlogs/notifications");
    } else {
      setShowDropdown(!showDropdown);
    }
  };

  const getNotificationConfig = (type: string) => {
    switch (type) {
      case "LIKE":
        return {
          icon: <Heart className="size-3 text-[#ea2a33]" fill="#ea2a33" />,
          text: "liked your scroll",
        };
      case "COMMENT":
        return {
          icon: <MessageSquare className="size-3 text-sky-400" fill="currentColor" />,
          text: "commented on your scroll",
        };
      case "FOLLOW":
        return {
          icon: <UserPlus className="size-3 text-emerald-400" />,
          text: "started following you",
        };
      default:
        return {
          icon: <Bell className="size-3 text-slate-400" />,
          text: "interacted with you",
        };
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 flex justify-center p-4 ${isChatPage ? "hidden md:flex" : ""}`}>
      <div className="bg-[#1f141499] w-full max-w-400 rounded-full px-8 py-3 flex items-center justify-between border border-primary/10 backdrop-blur-[12px] relative">
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
        <div className="flex items-center gap-4 md:gap-6 relative">
          {/* Mobile Search Icon Link  */}
          <Link href="/akaiBlogs/search" className="text-slate-300 hover:text-primary transition-colors lg:hidden p-1 rounded-full hover:bg-white/5">
            <Search size={20} />
          </Link>

          <Link href="/akaiBlogs/create">
            <button className="bg-primary hover:bg-primary/90 text-white hidden px-5 py-2 rounded-full text-xs font-bold transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-primary/20 md:flex items-center gap-2">
              <Plus size={16} />
              <span className="hidden sm:inline">New Scroll</span>
            </button>
          </Link>
          
          <Link
            href="/akaiBlogs/chat"
            className="text-slate-300 hover:text-primary transition-colors hidden md:block"
            aria-label="Open chat"
          >
            <MessageSquare size={20} />
          </Link>
          
          {/* Bell Icon with Badge */}
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={handleBellClick} 
              className="text-slate-300 hover:text-primary transition-colors block relative p-1 rounded-full hover:bg-white/5"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 flex size-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ea2a33] opacity-75"></span>
                  <span className="relative inline-flex rounded-full size-2.5 bg-[#ea2a33]"></span>
                </span>
              )}
            </button>

            {/* Notification Dropdown (Desktop only popover) */}
            {showDropdown && (
              <div className="absolute right-0 mt-3 w-80 rounded-2xl bg-black/95 border border-primary/10 shadow-2xl backdrop-blur-xl z-50 overflow-hidden py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="flex items-center justify-between px-4 py-2 border-b border-white/5">
                  <span className="text-xs font-black tracking-tight text-white">Notifications</span>
                  {notifications.some((n) => !n.read) && (
                    <button 
                      onClick={markAllAsRead} 
                      className="text-[10px] font-bold text-primary hover:underline flex items-center gap-1"
                    >
                      <Check size={11} /> Mark all read
                    </button>
                  )}
                </div>

                <div className="max-h-64 overflow-y-auto no-scrollbar">
                  {notifications.length === 0 ? (
                    <div className="py-8 text-center text-[10px] text-white/30">
                      No new activity.
                    </div>
                  ) : (
                    notifications.slice(0, 5).map((notification) => {
                      const config = getNotificationConfig(notification.type);
                      const href =
                        notification.type === "FOLLOW"
                          ? `/akaiBlogs/profile/${notification.sender.username}`
                          : notification.entityBlog
                            ? `/akaiBlogs/blog/${notification.entityBlog.id}`
                            : "#";

                      return (
                        <Link
                          key={notification.id}
                          href={href}
                          onClick={() => setShowDropdown(false)}
                          className={`flex items-center gap-3 px-4 py-3 border-b border-white/[0.02] transition-colors hover:bg-white/[0.04] ${
                            notification.read ? "text-slate-400" : "bg-[#ea2a33]/5 text-white"
                          }`}
                        >
                          <img 
                            src={notification.sender.avatarUrl || fallbackAvatar} 
                            alt={notification.sender.username} 
                            className="size-7 rounded-lg object-cover shrink-0"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="text-[11px] leading-normal">
                              <span className="font-bold text-white pr-1">{notification.sender.username}</span>
                              {config.text}
                            </p>
                             <span className="text-[9px] text-white/20 mt-1 block">
                               {timeAgo(notification.createdAt)}
                             </span>
                          </div>
                          {(notification as any).entityBlog?.coverImage && (
                            <img
                              src={(notification as any).entityBlog.coverImage}
                              alt="scroll"
                              className="size-8 rounded-md object-cover border border-white/10 shrink-0"
                            />
                          )}
                          {!notification.read && (
                            <span className="size-1.5 rounded-full bg-primary shrink-0" />
                          )}
                        </Link>
                      );
                    })
                  )}
                </div>

                <Link 
                  href="/akaiBlogs/notifications" 
                  onClick={() => setShowDropdown(false)}
                  className="block text-center py-2 text-[10px] font-black text-white/50 hover:text-white transition-colors border-t border-white/5"
                >
                  View all notifications
                </Link>
              </div>
            )}
          </div>

          <Link href="/akaiBlogs/profile" className="w-10 h-10 rounded-full border-2 border-primary/50 p-0.5 hover:scale-110 transition-transform">
            <img
              alt="Profile"
              className="w-full h-full rounded-full object-cover"
              src={profile?.avatarUrl || fallbackAvatar}
            />
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
