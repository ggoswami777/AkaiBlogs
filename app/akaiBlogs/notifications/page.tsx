"use client";

import { useEffect } from "react";
import { useNotificationStore } from "@/store/useNotificationStore";
import { Bell, Heart, MessageSquare, UserPlus, Check } from "lucide-react";
import Link from "next/link";

const fallbackAvatar = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function NotificationsPage() {
  const { notifications, fetchNotifications, markAllAsRead, setupSocketListener } = useNotificationStore();

  useEffect(() => {
    fetchNotifications();
    setupSocketListener();
  }, [fetchNotifications, setupSocketListener]);

  const getNotificationConfig = (type: string) => {
    switch (type) {
      case "LIKE":
        return {
          icon: <Heart className="size-3 text-[#ea2a33]" fill="#ea2a33" />,
          text: "liked your scroll",
          color: "border-[#ea2a33]/20 bg-[#ea2a33]/5",
        };
      case "COMMENT":
        return {
          icon: <MessageSquare className="size-3 text-sky-400" fill="currentColor" />,
          text: "commented on your scroll",
          color: "border-sky-500/20 bg-sky-500/5",
        };
      case "FOLLOW":
        return {
          icon: <UserPlus className="size-3 text-emerald-400" />,
          text: "started following you",
          color: "border-emerald-500/20 bg-emerald-500/5",
        };
      default:
        return {
          icon: <Bell className="size-3 text-slate-400" />,
          text: "interacted with you",
          color: "border-slate-500/20 bg-slate-500/5",
        };
    }
  };

  return (
    <main className="min-h-[calc(100vh-5rem)] bg-[#0a0505] text-slate-100 py-10 px-4">
      <div className="max-w-xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
              <Bell className="text-primary size-6 animate-pulse" /> Notifications
            </h1>
            <p className="text-xs text-white/30 mt-1">Your scrolls and clan updates</p>
          </div>
          {notifications.some((n) => !n.read) && (
            <button
              onClick={markAllAsRead}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold text-white bg-primary/20 hover:bg-primary/30 border border-primary/30 transition-all active:scale-95"
            >
              <Check size={13} />
              Mark all read
            </button>
          )}
        </div>

        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center border border-white/5 bg-white/[0.02] rounded-3xl backdrop-blur-md">
            <div className="size-12 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-white/30 mb-4">
              <Bell size={20} />
            </div>
            <p className="text-sm font-semibold text-white/70">No activity yet</p>
            <p className="text-xs text-white/30 mt-1 max-w-[200px]">When users interact with you, it will show up here.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification) => {
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
                  className={`flex items-center gap-4 p-4 rounded-2xl border transition-all hover:bg-white/[0.03] active:scale-[0.98] ${
                    notification.read
                      ? "bg-white/[0.01] border-white/5 text-slate-300"
                      : "bg-[#ea2a33]/10 border-primary/20 text-white"
                  }`}
                >
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    <div className="relative shrink-0 mt-0.5">
                      <img
                        src={notification.sender.avatarUrl || fallbackAvatar}
                        alt={notification.sender.username}
                        className="size-9 rounded-xl object-cover border border-white/10"
                      />
                      <div className={`absolute -bottom-1 -right-1 size-5 rounded-full border border-[#0a0505] flex items-center justify-center ${config.color}`}>
                        {config.icon}
                      </div>
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs leading-relaxed">
                        <span className="font-bold text-white pr-1">
                          {notification.sender.username}
                        </span>
                        {config.text}
                      </p>
                      <p className="text-[10px] text-white/20 mt-1">
                        {timeAgo(notification.createdAt)}
                      </p>
                    </div>
                  </div>
                  {(notification as any).entityBlog?.coverImage && (
                    <img
                      src={(notification as any).entityBlog.coverImage}
                      alt="scroll"
                      className="size-12 rounded-xl object-cover border border-white/10 shrink-0"
                    />
                  )}
                  {!notification.read && (
                    <div className="size-2 rounded-full bg-primary shrink-0" />
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
