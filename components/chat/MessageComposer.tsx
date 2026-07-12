import { SendHorizontal } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function MessageComposer({
  conversationId,
  receiverId,
  onSend,
  onTypingStart,
  onTypingStop,
}: {
  conversationId: string;
  receiverId: string;
  onSend: (content: string) => Promise<void>;
  onTypingStart: (payload: { conversationId: string; receiverId: string }) => void;
  onTypingStop: (payload: { conversationId: string; receiverId: string }) => void;
}) {
  const [content, setContent] = useState("");
  const [isSending, setIsSending] = useState(false);
  const typingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    return () => {
      if (typingTimer.current) clearTimeout(typingTimer.current);
      onTypingStop({ conversationId, receiverId });
    };
  }, [conversationId, receiverId, onTypingStop]);

  const handleChange = (value: string) => {
    setContent(value);
    onTypingStart({ conversationId, receiverId });
    if (typingTimer.current) clearTimeout(typingTimer.current);
    typingTimer.current = setTimeout(() => {
      onTypingStop({ conversationId, receiverId });
    }, 900);

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  };

  const handleSend = async () => {
    const trimmed = content.trim();
    if (!trimmed || isSending) return;
    setIsSending(true);
    try {
      await onSend(trimmed);
      setContent("");
      onTypingStop({ conversationId, receiverId });
      if (textareaRef.current) textareaRef.current.style.height = "auto";
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="px-4 py-3 bg-[#0a0505] md:bg-[#0a0404]/85 md:backdrop-blur-xl border-t border-white/[0.04]">
      <div className="flex items-end gap-2.5 rounded-2xl px-3.5 py-2.5 bg-white/[0.04] md:backdrop-blur-md border border-white/[0.07] shadow-none md:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => handleChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          rows={1}
          maxLength={2000}
          placeholder="Message…"
          className="w-full flex-1 resize-none bg-transparent text-xs text-white/90 outline-none placeholder:text-white/20"
          style={{
            minHeight: "20px",
            maxHeight: "120px",
            lineHeight: "1.6",
            msOverflowStyle: "none",
            scrollbarWidth: "none",
          }}
        />
        <button
          onClick={handleSend}
          disabled={!content.trim() || isSending}
          className="flex shrink-0 size-8 items-center justify-center rounded-xl transition-all active:scale-90"
          style={{ background: content.trim() ? "#ea2a33" : "rgba(255,255,255,0.07)" }}
          aria-label="Send"
        >
          <SendHorizontal
            size={14}
            style={{ color: content.trim() ? "#fff" : "rgba(255,255,255,0.25)" }}
          />
        </button>
      </div>
    </div>
  );
}
