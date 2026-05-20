"use client";

import React from "react";
import { Search } from "lucide-react";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
}

export default function SearchInput({ value, onChange }: SearchInputProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <form onSubmit={handleSubmit} className="w-full flex items-center">
      <div className="relative w-full group">
       
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="bg-black/40 border border-white/10 rounded-full px-6 py-2.5 text-sm w-full focus:outline-none focus:border-primary transition-all text-slate-100"
          placeholder="Search the scrolls..."
          type="text"
        />
      
        <button type="submit" className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-primary transition-colors">
          <Search size={14} />
        </button>
      </div>
    </form>
  );
}
