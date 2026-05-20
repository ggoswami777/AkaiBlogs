"use client";

import React, { useState } from "react";
import Link from "next/link";

export interface SearchUser {
  id: string;
  name: string;
  username: string;
  avatarUrl: string;
  isFollowing: boolean;
}

interface SearchUserCardProps {
  user: SearchUser;
}

export default function SearchUserCard({ user }: SearchUserCardProps) {
  // Use state to make follow actions interactive on the UI side
  const [isFollowing, setIsFollowing] = useState(user.isFollowing);

  const handleFollowToggle = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating if wrapped in a link later
    setIsFollowing((prev) => !prev);
  };

  return (
    <div className="flex items-center justify-between p-4 bg-white dark:bg-primary/5 border border-primary/10 rounded-xl hover:border-primary/25 transition-all">
      <div className="flex items-center gap-4">
        {/* User Avatar */}
        <div
          className="size-12 rounded-full border-2 border-primary/20 bg-cover bg-center"
          style={{ backgroundImage: `url('${user.avatarUrl}')` }}
        ></div>
        
        {/* Names */}
        <div className="flex flex-col">
          <p className="font-bold text-slate-900 dark:text-slate-100">{user.name}</p>
          <p className="text-xs text-slate-500">@{user.username}</p>
        </div>
      </div>

      {/* Interactive Follow Button */}
      <button
        onClick={handleFollowToggle}
        className={`text-sm font-bold px-5 py-2 rounded-full transition-all duration-300 ${
          isFollowing
            ? "bg-primary/20 hover:bg-primary/30 text-primary"
            : "bg-primary hover:bg-primary/90 text-white"
        }`}
      >
        {isFollowing ? "Following" : "Follow"}
      </button>
    </div>
  );
}
