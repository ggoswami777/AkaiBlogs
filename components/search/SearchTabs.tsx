"use client";

import React from "react";
import { FileText, Users } from "lucide-react";

interface SearchTabsProps {
  activeTab: "posts" | "users";
  setActiveTab: (tab: "posts" | "users") => void;
}

export default function SearchTabs({ activeTab, setActiveTab }: SearchTabsProps) {
  return (
    <div className="flex border-b border-primary/10 px-2 gap-8">
      {/* Posts Tab Button */}
      <button
        onClick={() => setActiveTab("posts")}
        className={`flex flex-col items-center justify-center border-b-4 pb-3 pt-2 group transition-all ${
          activeTab === "posts"
            ? "border-primary text-primary"
            : "border-transparent text-slate-500 dark:text-slate-400 hover:text-primary"
        }`}
      >
        <div className="flex items-center gap-2">
          <FileText className="size-5" />
          <p className="text-sm font-bold leading-normal tracking-wide uppercase">Posts</p>
        </div>
      </button>

      {/* Users Tab Button */}
      <button
        onClick={() => setActiveTab("users")}
        className={`flex flex-col items-center justify-center border-b-4 pb-3 pt-2 group transition-all ${
          activeTab === "users"
            ? "border-primary text-primary"
            : "border-transparent text-slate-500 dark:text-slate-400 hover:text-primary"
        }`}
      >
        <div className="flex items-center gap-2">
          <Users className="size-5" />
          <p className="text-sm font-bold leading-normal tracking-wide uppercase">Users</p>
        </div>
      </button>
    </div>
  );
}
