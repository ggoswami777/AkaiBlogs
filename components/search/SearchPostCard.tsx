"use client";

import React from "react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export interface SearchPost {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  postImage: string;
  author: string;
  authorImage: string;
}

interface SearchPostCardProps {
  post: SearchPost;
}

export default function SearchPostCard({ post }: SearchPostCardProps) {
  return (
    <Link href={`/akaiBlogs/blog/${post.id}`}>
      <div className="flex flex-col md:flex-row items-stretch justify-start rounded-xl overflow-hidden shadow-md bg-white dark:bg-primary/5 border border-primary/10 hover:border-primary/30 transition-all group cursor-pointer">
        {/* Post Image Container */}
        <div
          className="w-full md:w-72 bg-center bg-no-repeat aspect-video md:aspect-square bg-cover overflow-hidden"
          style={{ backgroundImage: `url("${post.postImage}")` }}
        >
          <div className="w-full h-full bg-primary/10 group-hover:bg-transparent transition-colors"></div>
        </div>

        {/* Content Container */}
        <div className="flex w-full grow flex-col items-stretch justify-center gap-3 p-6">
          <div className="flex flex-col gap-1">
            {/* Meta category and read time details */}
            <div className="flex items-center gap-2 text-primary text-xs font-bold uppercase">
              <span>{post.category}</span>
              <span className="size-1 bg-primary/40 rounded-full"></span>
              <span>{post.readTime}</span>
            </div>

            {/* Title & Excerpt */}
            <p className="text-slate-900 dark:text-slate-100 text-xl md:text-2xl font-bold leading-tight tracking-tight group-hover:text-primary transition-colors">
              {post.title}
            </p>
            <p className="text-slate-500 dark:text-slate-400 text-base font-normal leading-relaxed line-clamp-2">
              {post.excerpt}
            </p>
          </div>

          {/* Footer Card details with Author information */}
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-3">
              <div
                className="size-8 rounded-full bg-cover bg-center border border-primary/10"
                style={{ backgroundImage: `url("${post.authorImage}")` }}
              ></div>
              <p className="text-slate-700 dark:text-slate-300 text-sm font-medium">
                {post.author}
              </p>
            </div>
            <button className="flex items-center gap-1 text-primary font-bold text-sm">
              Read More <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
