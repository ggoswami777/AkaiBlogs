import { create } from "zustand";
import { getSocket } from "@/lib/socket";
import type { ChatMessage } from "@/types/chat";
import { toast } from "react-toastify";
import { userProfileStore } from "./useProfileStore";
import React, { cache } from "react";
import { getOrDeriveSharedKey } from "@/lib/crypto/keyCache";
import { decryptMessage, encryptMessage } from "@/lib/crypto/crypto";

type ConversationSummary = {
  id: string;
  otherUser?: {
    id: string;
    username: string;
    avatarUrl: string | null;
  };
  lastMessage: ChatMessage | null;
  unreadCount: number;
  updatedAt: string;
};

const peerKeyCache = new Map<string, string>();

async function fetchPeerPublicKey(username: string): Promise<string> {
  const cached = peerKeyCache.get(username);
  if (cached) return cached;
  const res = await fetch(`/api/profile/${username}/public-key`);
  const data = await res.json();
  if (!data.success) throw new Error("Peer has no encryption key");
  peerKeyCache.set(username, data.publicKey);
  return data.publicKey;
}

async function decryptMsg(
  msg: ChatMessage,
  currentUserId: string,
): Promise<ChatMessage> {
  if (!msg.encryptedContent || !msg.iv || !msg.sender) return msg;
  try {
    const isMine = msg.senderId === currentUserId;
    const peerUserId = isMine ? msg.receiverId : msg.senderId;
    let peerUsername = "";
    if (!isMine && msg.sender?.username) {
      peerUsername = msg.sender.username;
    } else {
      const conversations = useChatStore.getState().conversations;
      const conv = conversations.find((c) => c.id === msg.conversationId);
      peerUsername = conv?.otherUser?.username || "";
    }

    let peerPublicKey = peerKeyCache.get(peerUsername) || "";
    if (!peerPublicKey && peerUsername) {
      try {
        peerPublicKey = await fetchPeerPublicKey(peerUsername);
      } catch (e) {}
    }
    if (!peerPublicKey) return { ...msg, content: "[Unable to decrypt]" };

    const sharedKey = await getOrDeriveSharedKey(
      currentUserId,
      peerUserId,
      peerPublicKey,
    );
    const decrypted = await decryptMessage(
      msg.encryptedContent,
      msg.iv,
      sharedKey,
    );
    return { ...msg, content: decrypted };
  } catch (error) {
    return { ...msg, content: "[Unable to decrypt]" };
  }
}
type ChatStore = {
  conversations: ConversationSummary[];
  messagesByConversation: Record<string, ChatMessage[]>;
  activeConversationId: string | null;
  typingUsers: Record<string, string[]>;
  onlineUserIds: Record<string, boolean>;
  cursors: Record<string, string | null>;

  setActiveConversationId: (conversationId: string | null) => void;
  fetchConversations: () => Promise<void>;
  createConversation: (receiverId: string) => Promise<string | null>;
  connectSocket: () => void;
  joinConversation: (conversationId: string) => void;
  startTyping: (payload: {
    conversationId: string;
    receiverId: string;
  }) => void;
  stopTyping: (payload: { conversationId: string; receiverId: string }) => void;
  sendMessage: (payload: {
    conversationId: string;
    receiverId: string;
    content?: string;
    sharedBlogId?: string;
  }) => Promise<void>;
  markRead: (conversationId: string) => void;
  isFetchingHistory: boolean;
  fetchMessages: (conversationId: string, cursor?: string) => Promise<void>;
};

export const useChatStore = create<ChatStore>((set, get) => ({
  conversations: [],
  messagesByConversation: {},
  activeConversationId: null,
  typingUsers: {},
  onlineUserIds: {},
  cursors: {},
  isFetchingHistory: false,
  setActiveConversationId: (conversationId) => {
    set({ activeConversationId: conversationId });
  },

  fetchConversations: async () => {
    const res = await fetch("/api/chat/conversations");
    const data = await res.json();

    if (data.success) {
      set({ conversations: data.conversations });
    }
  },

  createConversation: async (receiverId) => {
    const res = await fetch("/api/chat/conversations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ receiverId }),
    });
    const data = await res.json();

    if (!data.success) {
      throw new Error(data.error || "Failed to create conversation");
    }

    await get().fetchConversations();
    return data.conversation?.id || null;
  },

  fetchMessages: async (conversationId, cursor) => {
    if (get().isFetchingHistory) return;
    set({ isFetchingHistory: true });

    try {
      const url = cursor
        ? `/api/chat/conversations/${conversationId}/messages?cursor=${cursor}`
        : `/api/chat/conversations/${conversationId}/messages`;

      const res = await fetch(url);
      const data = await res.json();

      if (data.success) {
        const currentUserId = userProfileStore.getState().profile?.id;
        const decrypted = currentUserId
          ? await Promise.all(
              data.messages.map((m: ChatMessage) =>
                decryptMsg(m, currentUserId),
              ),
            )
          : data.messages;
        set((state) => {
          const exisitng = state.messagesByConversation[conversationId] || [];
          const newMessages = cursor ? [...decrypted, ...exisitng] : decrypted;
          return {
            messagesByConversation: {
              ...state.messagesByConversation,
              [conversationId]: newMessages,
            },
            cursors: {
              ...state.cursors,
              [conversationId]: data.nextCursor,
            },
          };
        });
      }
    } finally {
      set({ isFetchingHistory: false });
    }
  },

  connectSocket: () => {
    const socket = getSocket();

    socket.off("message:new");
    socket.off("message:read");
    socket.off("typing:start");
    socket.off("typing:stop");
    socket.off("presence:online");
    socket.off("presence:offline");

    socket.on("message:new", async (rawMessage) => {
      const currentUserId = userProfileStore.getState().profile?.id;
      const message = currentUserId
        ? await decryptMsg(rawMessage, currentUserId)
        : rawMessage;
      set((state) => {
        const existingMessages =
          state.messagesByConversation[message.conversationId] || [];

        const alreadyExists = existingMessages.some((m) => m.id === message.id);

        return {
          messagesByConversation: {
            ...state.messagesByConversation,
            [message.conversationId]: alreadyExists
              ? existingMessages
              : [...existingMessages, message],
          },
        };
      });

      if (
        message.senderId !== currentUserId &&
        get().activeConversationId !== message.conversationId
      ) {
        const isSharedBlog = !!message.sharedBlog;
        const toastText = isSharedBlog
          ? "shared a scroll"
          : message.content || "sent you a message";

        toast(
          ({ closeToast }) =>
            React.createElement(
              "div",
              {
                onClick: () => {
                  window.location.href = `/akaiBlogs/chat?conversation=${message.conversationId}`;
                  closeToast();
                },
                className:
                  "flex items-center justify-between gap-3 cursor-pointer text-slate-100 w-full",
              },
              React.createElement("img", {
                src:
                  message.sender?.avatarUrl ||
                  "https://cdn-icons-png.flaticon.com/512/149/149071.png",
                alt: "sender",
                className:
                  "size-10 rounded-xl object-cover border border-white/10 shrink-0",
              }),
              React.createElement(
                "div",
                { className: "min-w-0 flex-1" },
                React.createElement(
                  "p",
                  { className: "text-xs font-black text-white" },
                  message.sender?.username || "Someone",
                ),
                React.createElement(
                  "p",
                  { className: "text-[10px] text-white/60 truncate mt-0.5" },
                  toastText,
                ),
              ),

              isSharedBlog && message.sharedBlog?.coverImage
                ? React.createElement("img", {
                    src: message.sharedBlog.coverImage,
                    alt: message.sharedBlog.title || "scroll",
                    className:
                      "w-14 h-9 rounded-md object-cover border border-white/10 shrink-0",
                  })
                : null,
            ),
          {
            position: "top-center",
            autoClose: 4000,
            hideProgressBar: true,
            closeOnClick: false,
            theme: "dark",
            className:
              "bg-black/95 border border-primary/10 rounded-2xl shadow-2xl backdrop-blur-xl p-3",
          },
        );
      }

      get().fetchConversations();
    });

    socket.on("message:read", ({ conversationId, readAt }) => {
      set((state) => ({
        messagesByConversation: {
          ...state.messagesByConversation,
          [conversationId]:
            state.messagesByConversation[conversationId]?.map((message) => ({
              ...message,
              readAt: message.readAt || readAt,
            })) || [],
        },
      }));
    });

    socket.on("typing:start", ({ conversationId, userId }) => {
      set((state) => {
        const current = state.typingUsers[conversationId] || [];

        return {
          typingUsers: {
            ...state.typingUsers,
            [conversationId]: current.includes(userId)
              ? current
              : [...current, userId],
          },
        };
      });
    });

    socket.on("typing:stop", ({ conversationId, userId }) => {
      set((state) => ({
        typingUsers: {
          ...state.typingUsers,
          [conversationId]:
            state.typingUsers[conversationId]?.filter((id) => id !== userId) ||
            [],
        },
      }));
    });

    socket.on("presence:online", ({ userId }) => {
      set((state) => ({
        onlineUserIds: {
          ...state.onlineUserIds,
          [userId]: true,
        },
      }));
    });

    socket.on("presence:offline", ({ userId }) => {
      set((state) => ({
        onlineUserIds: {
          ...state.onlineUserIds,
          [userId]: false,
        },
      }));
    });
  },

  joinConversation: (conversationId) => {
    getSocket().emit("conversation:join", { conversationId });
  },

  startTyping: (payload) => {
    getSocket().emit("typing:start", payload);
  },

  stopTyping: (payload) => {
    getSocket().emit("typing:stop", payload);
  },

  sendMessage: async (payload) => {
    const socket = getSocket();
    const { conversationId, receiverId, content, sharedBlogId } = payload;
    let encryptedContent: string | undefined;
    let iv: string | undefined;
    if (content) {
      const currentUserId = userProfileStore.getState().profile?.id;
      if (!currentUserId) throw new Error("Not authenticated");

      const peerUsername = get().conversations.find((c) => c.otherUser?.id === receiverId)
        ?.otherUser?.username || "";

      const peerPublicKeyBase64 = await fetchPeerPublicKey(peerUsername);
      const sharedKey = await getOrDeriveSharedKey(
        currentUserId,
        receiverId,
        peerPublicKeyBase64,
      );
      const encrypted = await encryptMessage(content, sharedKey);
      encryptedContent = encrypted.ciphertext;
      iv = encrypted.iv;
    }
    await new Promise<void>((resolve, reject) => {
      socket.emit(
        "message:send",
        {
          conversationId,
          receiverId,
          content: undefined,
          encryptedContent,
          iv,
          sharedBlogId,
        },
        (response) => {
          if (!response.success) {
            reject(new Error(response.error || "Failed to send message"));
            return;
          }

          resolve();
        },
      );
    });
  },

  markRead: (conversationId) => {
    getSocket().emit("message:read", { conversationId });

    fetch("/api/chat/read", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ conversationId }),
    }).catch(() => {});
  },
}));
