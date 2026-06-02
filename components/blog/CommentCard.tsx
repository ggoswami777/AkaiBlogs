import React from "react";

export interface CommentCardProps {
  user: string;
  avatar: string;
  time: string;
  content: string;
}

export default function CommentCard({ user, avatar, time, content }: CommentCardProps) {
  return (
    <div className="flex gap-3 md:gap-4 p-4 md:p-6 rounded-2xl glass-panel border-white/5 transition-all hover:border-primary/20">
      <div className="size-10 md:size-12 rounded-full border-2 border-primary/30 overflow-hidden shrink-0">
        <img src={avatar} alt={user} className="w-full h-full object-cover" />
      </div>
      <div className="space-y-1 md:space-y-2 min-w-0">
        <div className="flex items-center gap-3">
          <h4 className="font-bold text-white text-sm md:text-base truncate">{user}</h4>
          <span className="text-[9px] md:text-xs text-slate-500 font-medium uppercase tracking-tighter shrink-0">{time}</span>
        </div>
        <p className="text-slate-400 text-xs md:text-sm leading-relaxed">
          {content}
        </p>
        <div className="flex items-center gap-4 pt-1">
        
          <button className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline">Reply</button>
          <button className="text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-white transition-colors">Honor</button>
        </div>
      </div>
    </div>
  );
}
