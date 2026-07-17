"use client";

import Link from 'next/link';
import { Bell, MessageSquare, Plus, Heart, UserPlus, Check } from 'lucide-react';
import { useEffect, useState, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { userProfileStore } from "@/store/useProfileStore";
import { useNotificationStore } from "@/store/useNotificationStore";
import { useChatStore } from "@/store/useChatStore";

const fallbackAvatar =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuARrNF78qTP1Qjs8WBhowU7Lkc1VfhyYOOo6WVPbSmDT1HKzHDwczfhNZda_UrGmb4HT8A1z19TeRhMkJ7dKz5dNNEZX6YuOedHRvBa4rm3aMj3a7xam19YC7oslObzYbPAMAun1BK-MCE4Xs7vgb00is7arR6xc7R9aumrGsPYSt1WuUA44pU_EZiUsM6LtCrpg8Woxr-YhntVUW_xOcGm3wpG5JxG4f_yX4yGs4Orl3ewnJHPlkJykGJa5CR_7wcgnQA_6t6m-g";

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

const Header = () => {
  const router = useRouter();
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [showDropdown, setShowDropdown] = useState(false);

  const { profile, fetchProfile } = userProfileStore();
  const { notifications, unreadCount, fetchNotifications, markAllAsRead, setupSocketListener } = useNotificationStore();
  const connectChatSocket = useChatStore((s) => s.connectSocket);

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
    <header className="sticky top-0 z-50 w-full glass-panel border-b border-primary/10 bg-black/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-10">
          <Link href="/" className="flex items-center gap-3 active:scale-95 transition-transform">
            <div className="size-8 text-primary">
              <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path d="M44 4H30.6666V17.3334H17.3334V30.6666H4V44H44V4Z"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-black tracking-tighter uppercase italic text-white">AkaiBlogs</h2>
          </Link>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-6 md:border-l md:border-white/10 md:pl-6 h-8">
            <Link href="/akaiBlogs/create" className="hidden md:block">
              <button className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-full text-sm font-bold transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-primary/20 flex items-center gap-2">
                <Plus size={18} />
                <span>New Scroll</span>
              </button>
            </Link>

            <Link href="/akaiBlogs/chat" className="text-slate-400 hover:text-primary transition-colors">
              <MessageSquare size={20} />
            </Link>

            {/* Bell Icon with Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={handleBellClick} 
                className="text-slate-400 hover:text-primary transition-colors block relative p-1 rounded-full hover:bg-white/5"
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 flex size-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ea2a33] opacity-75"></span>
                    <span className="relative inline-flex rounded-full size-2.5 bg-[#ea2a33]"></span>
                  </span>
                )}
              </button>

              {/* Notification Popover Dropdown */}
              {showDropdown && (
                <div className="absolute right-0 mt-6 w-80 rounded-2xl bg-black/95 border border-primary/10 shadow-2xl backdrop-blur-xl z-50 overflow-hidden py-2 animate-in fade-in slide-in-from-top-2 duration-200">
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
                            : (notification as any).entityBlog
                              ? `/akaiBlogs/blog/${(notification as any).entityBlog.id}`
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
          </div>

          <Link href="/akaiBlogs/profile" className="size-10 rounded-full border-2 border-primary/30 overflow-hidden hover:scale-110 transition-transform">
            <img
              alt="Profile"
              className="w-full h-full object-cover"
              src={profile?.avatarUrl || fallbackAvatar}
            />
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
