"use client";

import React from "react";


export function SearchPostSkeleton() {
  return (
    <div className="flex flex-col md:flex-row items-stretch justify-start rounded-xl overflow-hidden shadow-md bg-white dark:bg-primary/5 border border-primary/10 animate-pulse">
      {/* Post Image Container Placeholder */}
      <div className="w-full md:w-72 aspect-video md:aspect-square bg-slate-300 dark:bg-white/10" />

      {/* Content Container Placeholder */}
      <div className="flex w-full grow flex-col justify-center gap-4 p-6">
        <div className="flex flex-col gap-2">
          {/* Meta category details */}
          <div className="flex items-center gap-2">
            <div className="h-3 w-16 bg-slate-300 dark:bg-white/10 rounded" />
            <span className="size-1 bg-slate-300 dark:bg-white/10 rounded-full" />
            <div className="h-3 w-12 bg-slate-300 dark:bg-white/10 rounded" />
          </div>

          {/* Title Placeholder */}
          <div className="h-6 w-3/4 bg-slate-300 dark:bg-white/10 rounded mt-1" />
          <div className="h-6 w-1/2 bg-slate-300 dark:bg-white/10 rounded" />

          {/* Excerpt Placeholder */}
          <div className="h-4 w-full bg-slate-300 dark:bg-white/10 rounded mt-2" />
        </div>

        {/* Footer Details */}
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-3">
            <div className="size-8 rounded-full bg-slate-300 dark:bg-white/10" />
            <div className="h-3 w-20 bg-slate-300 dark:bg-white/10 rounded" />
          </div>
          <div className="h-4 w-16 bg-slate-300 dark:bg-white/10 rounded" />
        </div>
      </div>
    </div>
  );
}

// Skeleton matching the SearchUserCard shape
export function SearchUserSkeleton() {
  return (
    <div className="flex items-center justify-between p-4 bg-white dark:bg-primary/5 border border-primary/10 rounded-xl animate-pulse">
      <div className="flex items-center gap-4">
        {/* User Avatar Circle */}
        <div className="size-12 rounded-full bg-slate-300 dark:bg-white/10" />
        
        {/* User Names */}
        <div className="flex flex-col gap-2">
          <div className="h-4 w-24 bg-slate-300 dark:bg-white/10 rounded" />
          <div className="h-3 w-16 bg-slate-300 dark:bg-white/10 rounded" />
        </div>
      </div>

      {/* Follow Button Placeholder */}
      <div className="h-8 w-20 bg-slate-300 dark:bg-white/10 rounded-full" />
    </div>
  );
}
