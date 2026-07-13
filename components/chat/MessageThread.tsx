import { CheckCheck, ArrowLeft, MoreHorizontal } from "lucide-react";
import { useCallback, useEffect, useRef } from "react";
import type { ChatMessage } from "@/types/chat";
import MessageComposer from "./MessageComposer";
import SharedBlogMessageCard from "./SharedBlogMessageCard";
import { useChatStore } from "@/store/useChatStore";

type OtherUser = {
  id: string;
  username: string;
  avatarUrl: string | null;
};

const fallbackAvatar = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

export default function MessageThread({
  currentUserId,
  otherUser,
  conversationId,
  messages,
  isOnline,
  isTyping,
  onSend,
  onTypingStart,
  onTypingStop,
  onBackClick,
}: {
  currentUserId: string;
  otherUser?: OtherUser;
  conversationId: string;
  messages: ChatMessage[];
  isOnline: boolean;
  isTyping: boolean;
  onSend: (content: string) => Promise<void>;
  onTypingStart: (payload: { conversationId: string; receiverId: string }) => void;
  onTypingStop: (payload: { conversationId: string; receiverId: string }) => void;
  onBackClick?: () => void;
}) {
  // for message fetching blockwise convo history
  const observer = useRef<IntersectionObserver | null>(null);
  const { cursors, fetchMessages, isFetchingHistory } = useChatStore();
  const hasMore = cursors[conversationId] !== null && cursors[conversationId] !== undefined;
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, isTyping]);

  if (!otherUser) {
    return (
      <div className="flex flex-1 items-center justify-center text-xs text-white/20">
        Select a conversation.
      </div>
    );
  }
const topElementRef = useCallback(
  (node: HTMLDivElement | null) => {
    if (isFetchingHistory) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        fetchMessages(conversationId, cursors[conversationId] as string);
      }
    });

    if (node) observer.current.observe(node);
  },
  [isFetchingHistory, hasMore, conversationId, cursors, fetchMessages]
);

  return (
    <section className="flex min-h-0 flex-1 flex-col">
      {/* ── Header ── */}
      <header className="flex items-center justify-between gap-3 px-4 py-3 bg-[#0a0505] md:bg-[#0c0505]/80 md:backdrop-blur-xl border-b border-white/[0.04]">
        <div className="flex items-center gap-3">
          {onBackClick && (
            <button
              onClick={onBackClick}
              className="flex size-8 items-center justify-center rounded-xl text-white/30 transition-all hover:bg-white/[0.06] hover:text-white/70 md:hidden"
            >
              <ArrowLeft size={16} />
            </button>
          )}
          <div className="relative shrink-0">
            <img
              src={otherUser.avatarUrl || fallbackAvatar}
              alt={otherUser.username}
              className="size-9 rounded-xl object-cover"
              style={{ border: "1.5px solid rgba(255,255,255,0.08)" }}
            />
            {isOnline && (
              <span
                className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full"
                style={{ background: "#34d399", border: "2px solid #0c0505" }}
              />
            )}
          </div>
          <div>
            <p className="text-sm font-black text-white/90 leading-none">{otherUser.username}</p>
            <p className={`mt-0.5 text-[10px] font-medium ${isOnline ? "text-emerald-400" : "text-white/25"}`}>
              {isOnline ? "Online" : "Offline"}
            </p>
          </div>
        </div>

        <button className="flex size-8 items-center justify-center rounded-xl text-white/25 transition-all hover:bg-white/[0.05] hover:text-white/60">
          <MoreHorizontal size={16} />
        </button>
      </header>

      {/* ── Messages ── */}
      <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto px-4 py-5 bg-[#0a0505] md:bg-transparent"
        style={{
          backgroundImage: "radial-gradient(ellipse at 50% 0%, rgba(234,42,51,0.05) 0%, transparent 60%)",
        }}
      >
        <div className="mx-auto flex max-w-none w-full flex-col gap-2">
          <div ref={topElementRef} className="h-1 w-full" />
          
          {isFetchingHistory && (
            <div className="flex justify-center py-4">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white/80" />
            </div>
          )}
          {messages.length > 0 && (
            <div className="mb-3 flex justify-center">
              <span
                className="rounded-full px-3 py-1 text-[9px] font-bold uppercase tracking-widest text-white/20"
                style={{ background: "rgba(255,255,255,0.04)" }}
              >
                Today
              </span>
            </div>
          )}

          {messages.map((message) => {
            const isMine = message.senderId === currentUserId;
            return (
              <div
                key={message.id}
                className={`flex items-end gap-2 ${isMine ? "flex-row-reverse" : "flex-row"}`}
              >
                {!isMine && (
                  <img
                    src={otherUser.avatarUrl || fallbackAvatar}
                    alt={otherUser.username}
                    className="mb-4 size-6 shrink-0 rounded-full object-cover"
                  />
                )}

                <div className={`flex max-w-[68%] flex-col gap-1 ${isMine ? "items-end" : "items-start"}`}>
                  {/* Bubble */}
                  <div
                    className={`rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                      isMine
                        ? "bg-primary text-white md:bg-primary/20 md:backdrop-blur-xl md:border md:border-primary/30 md:text-white/90 rounded-br-sm"
                        : "bg-white/10 text-white md:bg-white/5 md:backdrop-blur-xl md:border md:border-white/10 md:text-white/80 rounded-bl-sm"
                    }`}
                  >
                    {message.content && (
                      <p className="whitespace-pre-wrap break-words">{message.content}</p>
                    )}
                    {message.sharedBlog && <SharedBlogMessageCard blog={message.sharedBlog} />}
                  </div>

                  {/* Meta */}
                  <div className={`flex items-center gap-1 px-1 ${isMine ? "flex-row-reverse" : ""}`}>
                    <span className="text-[9px] text-white/20">
                      {new Date(message.createdAt).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    {isMine && (
                      <CheckCheck
                        size={14}
                        className={message.readAt ? "text-emerald-400 shrink-0" : "text-white/20 shrink-0"}
                      />
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex items-end gap-2">
              <img
                src={otherUser.avatarUrl || fallbackAvatar}
                alt={otherUser.username}
                className="mb-4 size-6 shrink-0 rounded-full object-cover"
              />
              <div
                className="flex items-center gap-1 rounded-2xl px-4 py-3"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderBottomLeftRadius: "4px",
                }}
              >
                <span className="size-1.5 rounded-full bg-white/30 animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="size-1.5 rounded-full bg-white/30 animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="size-1.5 rounded-full bg-white/30 animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          )}

          <div ref={endRef} />
        </div>
      </div>

      {/* ── Composer ── */}
      <MessageComposer
        conversationId={conversationId}
        receiverId={otherUser.id}
        onSend={onSend}
        onTypingStart={onTypingStart}
        onTypingStop={onTypingStop}
      />
    </section>
  );
}
