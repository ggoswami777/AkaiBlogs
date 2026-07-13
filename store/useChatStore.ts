import { create } from "zustand";
import { getSocket } from "@/lib/socket";
import type { ChatMessage } from "@/types/chat";

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
        set((state) => {
          const existing = state.messagesByConversation[conversationId] || [];

         
          const newMessages = cursor
            ? [...data.messages, ...existing]
            : data.messages;

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

    socket.on("message:new", (message) => {
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

    await new Promise<void>((resolve, reject) => {
      socket.emit("message:send", payload, (response) => {
        if (!response.success) {
          reject(new Error(response.error || "Failed to send message"));
          return;
        }

        resolve();
      });
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
