"use client";

import { Send, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useChatStore } from "@/store/useChatStore";

type BlogSharePayload = {
  id: string;
  title: string;
  postImage?: string;
};

type ChatSearchUser = {
  id: string;
  username: string;
  avatarUrl: string | null;
  bio: string | null;
};

const fallbackAvatar =
  "https://cdn-icons-png.flaticon.com/512/149/149071.png";

export default function ShareToChatModal({
  isOpen,
  blog,
  onClose,
}: {
  isOpen: boolean;
  blog: BlogSharePayload;
  onClose: () => void;
}) {
  const router = useRouter();
  const {
    conversations,
    fetchConversations,
    createConversation,
    sendMessage,
    connectSocket,
  } = useChatStore();
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState<ChatSearchUser[]>([]);
  const [isSendingTo, setIsSendingTo] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    connectSocket();
    fetchConversations();
  }, [connectSocket, fetchConversations, isOpen]);

  if (!isOpen) return null;

  const handleSearch = async (value: string) => {
    setQuery(value);

    if (value.trim().length < 2) {
      setUsers([]);
      return;
    }

    const res = await fetch(
      `/api/chat/users/search?q=${encodeURIComponent(value.trim())}`,
    );
    const data = await res.json();
    setUsers(data.success ? data.users : []);
  };

  const handleShare = async (receiverId: string, conversationId?: string) => {
    setIsSendingTo(receiverId);
    try {
      const targetConversationId =
        conversationId || (await createConversation(receiverId));

      if (!targetConversationId) {
        return;
      }

      await sendMessage({
        conversationId: targetConversationId,
        receiverId,
        content: "Shared a scroll",
        sharedBlogId: blog.id,
      });

      onClose();
      router.push(`/akaiBlogs/chat?conversation=${targetConversationId}`);
    } finally {
      setIsSendingTo(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-primary/20 bg-[#140a0a] shadow-2xl shadow-black/70">
        <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">
              Share Scroll
            </p>
            <h2 className="mt-1 line-clamp-1 text-lg font-black text-white">
              {blog.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-full border border-white/10 bg-white/[0.03] p-2 text-slate-400 hover:text-white"
          >
            <X size={17} />
          </button>
        </div>

        <div className="space-y-4 p-5">
          <input
            value={query}
            onChange={(event) => handleSearch(event.target.value)}
            placeholder="Search users to share..."
            className="w-full rounded-xl border border-white/[0.08] bg-black/35 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-slate-600 focus:border-primary/50"
          />

          <div className="max-h-80 space-y-2 overflow-y-auto no-scrollbar">
            {query.trim().length >= 2
              ? users.map((user) => (
                  <ShareTargetRow
                    key={user.id}
                    avatarUrl={user.avatarUrl}
                    username={user.username}
                    subtitle={user.bio || "Start a new chat"}
                    isSending={isSendingTo === user.id}
                    onClick={() => handleShare(user.id)}
                  />
                ))
              : conversations.map((conversation) =>
                  conversation.otherUser ? (
                    <ShareTargetRow
                      key={conversation.id}
                      avatarUrl={conversation.otherUser.avatarUrl}
                      username={conversation.otherUser.username}
                      subtitle="Existing conversation"
                      isSending={isSendingTo === conversation.otherUser.id}
                      onClick={() =>
                        handleShare(conversation.otherUser!.id, conversation.id)
                      }
                    />
                  ) : null,
                )}

            {query.trim().length < 2 && conversations.length === 0 && (
              <p className="py-8 text-center text-sm text-slate-500">
                Search for a user to share this scroll.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ShareTargetRow({
  avatarUrl,
  username,
  subtitle,
  isSending,
  onClick,
}: {
  avatarUrl: string | null;
  username: string;
  subtitle: string;
  isSending: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      disabled={isSending}
      className="flex w-full items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 text-left transition-colors hover:border-primary/30 hover:bg-primary/10 disabled:opacity-60"
    >
      <img
        src={avatarUrl || fallbackAvatar}
        alt={username}
        className="size-10 rounded-full object-cover"
      />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-bold text-white">{username}</p>
        <p className="truncate text-xs text-slate-500">{subtitle}</p>
      </div>
      <Send size={16} className="text-primary" />
    </button>
  );
}
