import { create } from "zustand";
import { getSocket } from "@/lib/socket";
import { toast } from "react-toastify";
import React from "react";

export type NotificationItem = {
  id: string;
  type: "LIKE" | "COMMENT" | "FOLLOW" | "NEW_MESSAGE";
  sender: { id?: string; username: string; avatarUrl: string | null };
  entityId?: string | null;
  entityBlog?: { id: string; title: string; coverImage: string | null } | null;
  read: boolean;
  createdAt: string;
};

type NotificationStore = {
  notifications: NotificationItem[];
  unreadCount: number;
  fetchNotifications: () => Promise<void>;
  markAllAsRead: () => Promise<void>;
  setupSocketListener: () => void;
};

const fallbackAvatar = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

function showNotificationToast(notification: NotificationItem) {
  const { type, sender, entityBlog } = notification;

  let actionText = "interacted with you";
  let href = `/akaiBlogs/profile/${sender.username}`;

  switch (type) {
    case "LIKE":
      actionText = "liked your scroll";
      if (entityBlog) href = `/akaiBlogs/blog/${entityBlog.id}`;
      break;
    case "COMMENT":
      actionText = "commented on your scroll";
      if (entityBlog) href = `/akaiBlogs/blog/${entityBlog.id}`;
      break;
    case "FOLLOW":
      actionText = "started following you";
      href = `/akaiBlogs/profile/${sender.username}`;
      break;
  }

  toast(
    ({ closeToast }) =>
      React.createElement(
        "div",
        {
          onClick: () => {
            window.location.href = href;
            closeToast();
          },
          className: "flex items-center justify-between gap-3 cursor-pointer text-slate-100 w-full",
        },
     
        React.createElement("img", {
          src: sender.avatarUrl || fallbackAvatar,
          alt: sender.username,
          className:
            "size-10 rounded-xl object-cover border border-white/10 shrink-0",
        }),
     
        React.createElement(
          "div",
          { className: "min-w-0 flex-1" },
          React.createElement(
            "p",
            { className: "text-xs font-black text-white" },
            sender.username
          ),
          React.createElement(
            "p",
            { className: "text-[10px] text-white/60 truncate mt-0.5" },
            actionText
          )
        ),

        entityBlog && entityBlog.coverImage
          ? React.createElement("img", {
              src: entityBlog.coverImage,
              alt: entityBlog.title,
              className:
                "w-14 h-9 rounded-md object-cover border border-white/10 shrink-0",
            })
          : null
      ),
    {
      position: "top-center",
      autoClose: 4000,
      hideProgressBar: true,
      closeOnClick: false,
      theme: "dark",
      className:
        "bg-black/95 border border-primary/10 rounded-2xl shadow-2xl backdrop-blur-xl p-3",
    }
  );
}

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  fetchNotifications: async () => {
    const res = await fetch("/api/notifications");
    const data = await res.json();
    if (data.success) {
      const unread = data.notifications.filter((n: any) => !n.read).length;
      set({ notifications: data.notifications, unreadCount: unread });
    }
  },
  markAllAsRead: async () => {
    const res = await fetch("/api/notifications/read", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ all: true })
    });
    if (res.ok) {
      set((state) => ({
        notifications: state.notifications.map((n) => ({ ...n, read: true })),
        unreadCount: 0
      }));
    }
  },
  setupSocketListener: () => {
    const socket = getSocket();
    socket.off("notification:new");
    socket.on("notification:new", (notification: NotificationItem) => {
      set((state) => ({
        notifications: [notification, ...state.notifications],
        unreadCount: state.unreadCount + 1
      }));

   
      if (
        notification.type === "LIKE" ||
        notification.type === "COMMENT" ||
        notification.type === "FOLLOW"
      ) {
        showNotificationToast(notification);
      }
    });
  }
}));
