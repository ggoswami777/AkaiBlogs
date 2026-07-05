"use client";

import React, { useEffect } from 'react';
import { ThumbsUp } from 'lucide-react';
import { useLikeStore } from '@/store/useLikeStore';

export default function BlogLikeButton({
  blogId,
  initialLikesCount,
  initialIsLiked,
}: {
  blogId: string;
  initialLikesCount: number;
  initialIsLiked: boolean;
}) {
  const { likedBlogs, likesCount, toggleLike, setInitialState, isLoading } = useLikeStore();

  useEffect(() => {
    setInitialState(blogId, initialIsLiked, initialLikesCount);
  }, [blogId, initialIsLiked, initialLikesCount, setInitialState]);

  const isLiked = likedBlogs[blogId] ?? initialIsLiked;
  const totalLikes = likesCount[blogId] ?? initialLikesCount;

  return (
    <button
      onClick={() => toggleLike(blogId)}
      disabled={isLoading[blogId]}
      className={`flex items-center gap-3 px-6 md:px-8 py-3 md:py-4 rounded-full font-black transition-all shadow-xl active:scale-95 ${
        isLiked
          ? 'bg-primary text-white shadow-primary/30 hover:bg-primary/90'
          : 'bg-slate-200 dark:bg-[#140a0a] text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-[#1f0f0f] border border-white/5'
      }`}
    >
      <ThumbsUp size={20} className={isLiked ? 'fill-white' : ''} />
      <span>{totalLikes}</span>
    </button>
  );
}
