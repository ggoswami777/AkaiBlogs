"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import SearchInput from "@/components/search/SearchInput";
import SearchTabs from "@/components/search/SearchTabs";
import SearchPostCard, { SearchPost } from "@/components/search/SearchPostCard";
import SearchUserCard, { SearchUser } from "@/components/search/SearchUserCard";
import { SearchPostSkeleton, SearchUserSkeleton } from "@/components/search/SearchSkeletons";
import { ChevronDown, Trash2, TrendingUp, History } from "lucide-react";

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"posts" | "users">("posts");
  const [posts, setPosts] = useState<SearchPost[]>([]);
  const [users, setUsers] = useState<SearchUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [trendingSearches, setTrendingSearches] = useState<string[]>([]);

  const urlQuery = searchParams.get("q") || "";
  const [localQuery, setLocalQuery] = useState(urlQuery);

  useEffect(() => {
    setLocalQuery(urlQuery);
  }, [urlQuery]);

  useEffect(() => {
    const handler = setTimeout(() => {
      const params = new URLSearchParams(window.location.search);
      if (localQuery.trim()) {
        params.set("q", localQuery);
      } else {
        params.delete("q");
      }
      if (params.get("q") !== searchParams.get("q")) {
        router.push(`/akaiBlogs/search?${params.toString()}`);
      }
    }, 300);

    return () => clearTimeout(handler);
  }, [localQuery, router, searchParams]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const res = await fetch("/api/akaiBlogs/search/suggestions");
        const data = await res.json();
        if (data.success) {
          setRecentSearches(data.recent || []);
          setTrendingSearches(data.trending || []);
        }
      } catch (e) {
        console.error("Failed to fetch suggestions", e);
      }
    };
    fetchSuggestions();
  }, [urlQuery]);

  useEffect(() => {
    const fetchSearchResults = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/akaiBlogs/search?q=${encodeURIComponent(urlQuery)}`);
        const data = await res.json();
        if (data.success) {
          setPosts(data.posts || []);
          setUsers(data.users || []);
        } else {
          setPosts([]);
          setUsers([]);
        }
      } catch (error) {
        console.error("Error fetching search results:", error);
        setPosts([]);
        setUsers([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (urlQuery) {
      fetchSearchResults();
    } else {
      setPosts([]);
      setUsers([]);
    }
  }, [urlQuery]);

  const handleClearHistory = async () => {
    try {
      const res = await fetch("/api/akaiBlogs/search/history", { method: "DELETE" });
      if (res.ok) {
        setRecentSearches([]);
      }
    } catch (e) {
      console.error("Error clearing history", e);
    }
  };

  return (
    <main className="flex flex-1 justify-center py-5 px-4 min-h-screen">
      <div className="layout-content-container flex flex-col max-w-[960px] flex-1 gap-6">
        
        <div className="block lg:hidden">
          <SearchInput
            value={localQuery}
            onChange={setLocalQuery}
            onClear={() => setLocalQuery("")}
          />
        </div>

        {!urlQuery ? (
          <div className="flex flex-col gap-8 py-4">
            {recentSearches.length > 0 && (
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <h3 className="text-white text-xs font-black tracking-widest flex items-center gap-1.5 uppercase">
                    <History className="size-3.5 text-primary" /> Recent Searches
                  </h3>
                  <button onClick={handleClearHistory} className="text-[10px] font-bold text-primary hover:underline flex items-center gap-1">
                    <Trash2 className="size-3" /> Clear History
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((term) => (
                    <button key={term} onClick={() => setLocalQuery(term)} className="bg-white/5 border border-white/10 hover:border-primary/30 rounded-full px-4 py-1.5 text-xs text-white/80 hover:text-white transition-all">
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {trendingSearches.length > 0 && (
              <div className="flex flex-col gap-3">
                <h3 className="text-white text-xs font-black tracking-widest flex items-center gap-1.5 border-b border-white/5 pb-2 uppercase">
                  <TrendingUp className="size-3.5 text-primary" /> Trending Keywords
                </h3>
                <div className="flex flex-wrap gap-2">
                  {trendingSearches.map((term) => (
                    <button key={term} onClick={() => setLocalQuery(term)} className="bg-primary/5 border border-primary/20 hover:border-primary/50 rounded-full px-4 py-1.5 text-xs text-white hover:bg-primary/10 transition-all">
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <>
            <SearchTabs activeTab={activeTab} setActiveTab={setActiveTab} />
            <div className="flex flex-col gap-6">
              {isLoading ? (
                activeTab === "posts" ? (
                  <div className="grid grid-cols-1 gap-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <SearchPostSkeleton key={i} />
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <SearchUserSkeleton key={i} />
                    ))}
                  </div>
                )
              ) : activeTab === "posts" ? (
                <>
                  <h3 className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-widest px-1">
                    {`Results for "${urlQuery}"`}
                  </h3>
                  {posts.length === 0 ? (
                    <div className="text-center py-12 text-slate-500 text-sm font-medium">
                      No scrolls found matching your search.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4">
                      {posts.map((post) => (
                        <SearchPostCard key={post.id} post={post} />
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <>
                  <h3 className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-widest px-1">
                    Ronins found
                  </h3>
                  {users.length === 0 ? (
                    <div className="text-center py-12 text-slate-500 text-sm font-medium">
                      No ronins found matching your search.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {users.map((user) => (
                        <SearchUserCard key={user.id} user={user} />
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </>
        )}
      </div>
    </main>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <main className="flex flex-1 justify-center py-5 px-4 min-h-screen">
        <div className="layout-content-container flex flex-col max-w-[960px] flex-1 gap-6 pt-12">
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 gap-4">
              {[1, 2, 3].map((key) => (
                <SearchPostSkeleton key={key} />
              ))}
            </div>
          </div>
        </div>
      </main>
    }>
      <SearchContent />
    </Suspense>
  );
}
