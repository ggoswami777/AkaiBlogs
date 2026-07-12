"use client";

import { MessageCircle, PenLine } from "lucide-react";
import { Suspense, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useChatStore } from "@/store/useChatStore";
import { userProfileStore } from "@/store/useProfileStore";
import ChatUserSearch from "./ChatUserSearch";
import ConversationList from "./ConversationList";
import MessageThread from "./MessageThread";

function ChatShellContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestedConversationId = searchParams.get("conversation");
  const { profile, fetchProfile } = userProfileStore();
  const {
    conversations,
    messagesByConversation,
    activeConversationId,
    typingUsers,
    onlineUserIds,
    setActiveConversationId,
    fetchConversations,
    createConversation,
    fetchMessages,
    connectSocket,
    joinConversation,
    sendMessage,
    markRead,
    startTyping,
    stopTyping,
  } = useChatStore();

  useEffect(() => {
    fetchProfile();
    fetchConversations();
    connectSocket();
  }, [connectSocket, fetchConversations, fetchProfile]);

  const userWentBack = useRef(false);

  useEffect(() => {
    if (requestedConversationId) {
      userWentBack.current = false;
      setActiveConversationId(requestedConversationId);
    } else if (!userWentBack.current && !activeConversationId && conversations[0]?.id) {
      setActiveConversationId(conversations[0].id);
    }
  }, [requestedConversationId, activeConversationId, conversations, setActiveConversationId]);

  useEffect(() => {
    if (!activeConversationId) return;
    joinConversation(activeConversationId);
    fetchMessages(activeConversationId);
    markRead(activeConversationId);
  }, [activeConversationId, fetchMessages, joinConversation, markRead]);

  const activeConversation = conversations.find((c) => c.id === activeConversationId);
  const activeMessages = activeConversationId ? messagesByConversation[activeConversationId] || [] : [];
  const otherUser = activeConversation?.otherUser;

  const conversationUserIds = new Set(conversations.map((c) => c.otherUser?.id).filter(Boolean));
  const filteredOnlineUserIds: Record<string, boolean> = {};
  for (const id of conversationUserIds) {
    if (id && onlineUserIds[id]) filteredOnlineUserIds[id] = true;
  }

  const isTyping = Boolean(
    activeConversationId && typingUsers[activeConversationId]?.some((uid) => uid !== profile?.id),
  );

  const handleSelectConversation = (conversationId: string) => {
    userWentBack.current = false;
    setActiveConversationId(conversationId);
    router.replace(`/akaiBlogs/chat?conversation=${conversationId}`);
  };

  const handleStartConversation = async (receiverId: string) => {
    const conversationId = await createConversation(receiverId);
    if (!conversationId) return;
    userWentBack.current = false;
    setActiveConversationId(conversationId);
    router.replace(`/akaiBlogs/chat?conversation=${conversationId}`);
  };

  const handleBackToList = () => {
    userWentBack.current = true;
    setActiveConversationId(null);
    router.replace("/akaiBlogs/chat");
  };

  return (
    <main className="mx-auto flex h-[calc(100vh-5rem)] max-w-[1500px] flex-col px-3 pb-3 pt-3 md:px-5 md:pb-4 md:pt-4">
      <div
        className="flex min-h-0 flex-1 overflow-hidden rounded-3xl"
        style={{
          background: "rgba(10,4,4,0.92)",
          backdropFilter: "blur(32px) saturate(180%)",
          WebkitBackdropFilter: "blur(32px) saturate(180%)",
          border: "1px solid rgba(234,42,51,0.10)",
          boxShadow: "0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.03), inset 0 1px 0 rgba(255,255,255,0.04)",
        }}
      >
        {/* ── Sidebar ── */}
        <aside
          className={`flex flex-col md:w-[300px] md:min-w-[300px] ${
            activeConversationId ? "hidden md:flex" : "flex w-full"
          }`}
          style={{
            background: "rgba(15,6,6,0.85)",
            backdropFilter: "blur(20px)",
            borderRight: "1px solid rgba(255,255,255,0.04)",
          }}
        >
          {/* Sidebar Header */}
          <div className="flex items-center justify-between px-5 py-4">
            <div>
              <h1 className="text-base font-black tracking-tight text-white">Messages</h1>
              <p className="mt-0.5 text-[10px] font-medium text-white/30">
                {conversations.length} thread{conversations.length !== 1 ? "s" : ""}
              </p>
            </div>
            <button
              className="flex size-8 items-center justify-center rounded-xl text-white/40 transition-all hover:bg-white/[0.06] hover:text-white/70"
            >
              <PenLine size={15} />
            </button>
          </div>

          {/* Search */}
          <ChatUserSearch onStartConversation={handleStartConversation} />

          {/* Conversation List */}
          <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto">
            <ConversationList
              conversations={conversations}
              activeConversationId={activeConversationId}
              onlineUserIds={filteredOnlineUserIds}
              onSelect={handleSelectConversation}
            />
          </div>
        </aside>

        {/* ── Main Pane ── */}
        <section
          className={`min-h-0 flex-1 flex-col ${
            activeConversationId ? "flex" : "hidden md:flex"
          }`}
        >
          {activeConversationId && otherUser && profile?.id ? (
            <MessageThread
              currentUserId={profile.id}
              otherUser={otherUser}
              conversationId={activeConversationId}
              messages={activeMessages}
              isOnline={Boolean(filteredOnlineUserIds[otherUser.id])}
              isTyping={isTyping}
              onBackClick={handleBackToList}
              onSend={(content) =>
                sendMessage({
                  conversationId: activeConversationId,
                  receiverId: otherUser.id,
                  content,
                })
              }
              onTypingStart={startTyping}
              onTypingStop={stopTyping}
            />
          ) : (
            <div
              className="flex flex-1 flex-col items-center justify-center px-6 text-center"
              style={{ background: "radial-gradient(ellipse at 50% 25%, rgba(234,42,51,0.06) 0%, transparent 65%)" }}
            >
              <div
                className="mb-5 flex size-14 items-center justify-center rounded-2xl"
                style={{
                  background: "rgba(234,42,51,0.08)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(234,42,51,0.15)",
                }}
              >
                <MessageCircle className="text-primary" size={24} />
              </div>
              <h2 className="text-lg font-black text-white/90">Pick a conversation</h2>
              <p className="mt-2 max-w-[220px] text-xs leading-relaxed text-white/30">
                Open a thread on the left or search for someone new.
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default function ChatShell() {
  return (
    <Suspense
      fallback={
        <div className="flex h-[calc(100vh-5rem)] items-center justify-center">
          <p className="text-xs font-medium text-white/20 animate-pulse">Loading…</p>
        </div>
      }
    >
      <ChatShellContent />
    </Suspense>
  );
}
