type ConversationSummary = {
  id: string;
  otherUser?: {
    id: string;
    username: string;
    avatarUrl: string | null;
  };
  lastMessage: {
    content: string | null;
    sharedBlogId: string | null;
    createdAt: string;
  } | null;
  unreadCount: number;
};

const fallbackAvatar = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "now";
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  return `${Math.floor(hrs / 24)}d`;
}

export default function ConversationList({
  conversations,
  activeConversationId,
  onlineUserIds,
  onSelect,
}: {
  conversations: ConversationSummary[];
  activeConversationId: string | null;
  onlineUserIds: Record<string, boolean>;
  onSelect: (conversationId: string) => void;
}) {
  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 px-6 py-14 text-center">
        <p className="text-xs font-bold text-white/30">No conversations yet</p>
        <p className="text-[10px] text-white/15">Search above to start one.</p>
      </div>
    );
  }

  return (
    <div className="space-y-px px-3 py-2">
      {conversations.map((conversation) => {
        const user = conversation.otherUser;
        const isActive = conversation.id === activeConversationId;
        const isOnline = user ? Boolean(onlineUserIds[user.id]) : false;
        const preview =
          conversation.lastMessage?.content ||
          (conversation.lastMessage?.sharedBlogId ? "📎 Shared a post" : "Say hello!");
        const timestamp = conversation.lastMessage?.createdAt
          ? timeAgo(conversation.lastMessage.createdAt)
          : "";

        return (
          <button
            key={conversation.id}
            onClick={() => onSelect(conversation.id)}
            className="flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left transition-all"
            style={
              isActive
                ? {
                    background: "rgba(234,42,51,0.10)",
                    backdropFilter: "blur(8px)",
                    border: "1px solid rgba(234,42,51,0.18)",
                  }
                : {
                    background: "transparent",
                    border: "1px solid transparent",
                  }
            }
            onMouseEnter={(e) => {
              if (!isActive) {
                (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)";
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                (e.currentTarget as HTMLElement).style.background = "transparent";
              }
            }}
          >
            {/* Avatar */}
            <div className="relative shrink-0">
              <img
                src={user?.avatarUrl || fallbackAvatar}
                alt={user?.username || "User"}
                className="size-11 rounded-2xl object-cover"
                style={{ border: isActive ? "1.5px solid rgba(234,42,51,0.3)" : "1.5px solid rgba(255,255,255,0.07)" }}
              />
              {isOnline && (
                <span
                  className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full"
                  style={{ background: "#34d399", border: "2px solid #0a0404" }}
                />
              )}
            </div>

            {/* Text */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-1 mb-0.5">
                <p className={`truncate text-xs font-bold ${isActive ? "text-white" : "text-white/80"}`}>
                  {user?.username || "Unknown"}
                </p>
                <span className="shrink-0 text-[9px] text-white/20">{timestamp}</span>
              </div>
              <div className="flex items-center justify-between gap-1">
                <p className={`truncate text-[10px] ${conversation.unreadCount > 0 ? "font-semibold text-white/60" : "text-white/25"}`}>
                  {preview}
                </p>
                {conversation.unreadCount > 0 && (
                  <span
                    className="flex shrink-0 min-w-[18px] h-[18px] items-center justify-center rounded-full px-1 text-[9px] font-black text-white"
                    style={{ background: "#ea2a33" }}
                  >
                    {conversation.unreadCount > 9 ? "9+" : conversation.unreadCount}
                  </span>
                )}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
