import { Search, X } from "lucide-react";
import { useState, useEffect } from "react";

type ChatSearchUser = {
  id: string;
  username: string;
  avatarUrl: string | null;
  bio: string | null;
};

const fallbackAvatar = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

export default function ChatUserSearch({
  onStartConversation,
}: {
  onStartConversation: (receiverId: string) => Promise<void>;
}) {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState<ChatSearchUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (query.trim().length < 2) {
      setUsers([]);
      return;
    }
    const delayDebounceFn = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await fetch(
          `/api/chat/users/search?q=${encodeURIComponent(query.trim())}`,
        );
        const data = await res.json();
        setUsers(data.success ? data.users : []);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const handleSearch = (value: string) => {
    setQuery(value);
  };

  const handleClear = () => {
    setQuery("");
    setUsers([]);
  };

  return (
    <div className="px-4 pb-3">
      {/* Input */}
      <div
        className="flex items-center gap-2 rounded-xl px-3 py-2"
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <Search size={13} className="shrink-0 text-white/25" />
        <input
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search people…"
          className="min-w-0 flex-1 bg-transparent text-xs text-white outline-none placeholder:text-white/20"
        />
        {query && (
          <button
            onClick={handleClear}
            className="shrink-0 text-white/25 hover:text-white/60 transition-colors"
          >
            <X size={12} />
          </button>
        )}
      </div>

      {/* Results */}
      {(users.length > 0 || isLoading) && (
        <div className="mt-2 space-y-0.5">
          {isLoading ? (
            <p className="px-2 py-3 text-[10px] font-medium text-white/20 animate-pulse">
              Searching…
            </p>
          ) : (
            users.map((user) => (
              <button
                key={user.id}
                onClick={() => {
                  onStartConversation(user.id);
                  handleClear();
                }}
                className="flex w-full items-center gap-2.5 rounded-xl p-2.5 text-left transition-all hover:bg-white/[0.04]"
              >
                <img
                  src={user.avatarUrl || fallbackAvatar}
                  alt={user.username}
                  className="size-8 rounded-full object-cover shrink-0"
                />
                <div className="min-w-0">
                  <p className="truncate text-xs font-bold text-white/90">
                    {user.username}
                  </p>
                  <p className="truncate text-[10px] text-white/30">
                    {user.bio || "Start a conversation"}
                  </p>
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
