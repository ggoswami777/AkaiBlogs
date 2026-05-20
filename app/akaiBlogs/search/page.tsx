"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import SearchInput from "@/components/search/SearchInput";
import SearchTabs from "@/components/search/SearchTabs";
import SearchPostCard, { SearchPost } from "@/components/search/SearchPostCard";
import SearchUserCard, { SearchUser } from "@/components/search/SearchUserCard";
import { SearchPostSkeleton, SearchUserSkeleton } from "@/components/search/SearchSkeletons";
import { ChevronDown } from "lucide-react";

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"posts" | "users">("posts");
  const [posts, setPosts] = useState<SearchPost[]>([]);
  const [users, setUsers] = useState<SearchUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const searchQuery = searchParams.get("q") || "";

  // Fetch search results whenever the query string updates
  useEffect(() => {
    const fetchSearchResults = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/akaiBlogs/search?q=${encodeURIComponent(searchQuery)}`);
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

    fetchSearchResults();
  }, [searchQuery]);

  const handleSearchChange = (value: string) => {
    const params = new URLSearchParams(window.location.search);
    if (value) {
      params.set("q", value);
    } else {
      params.delete("q");
    }
    router.push(`/akaiBlogs/search?${params.toString()}`);
  };

  return (
    <main className="flex flex-1 justify-center py-5 px-4 min-h-screen">
      <div className="layout-content-container flex flex-col max-w-[960px] flex-1 gap-6">
      
        <div className="block lg:hidden">
          <SearchInput
            value={searchQuery}
            onChange={handleSearchChange}
            onClear={() => handleSearchChange("")}
          />
        </div>

        {/* Tab Filters */}
        <SearchTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Search Results Display Area */}
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
                {searchQuery ? `Results for "${searchQuery}"` : "Top Results"}
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
                People you might follow
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

          {/* Show More Actions Button (Conditional visibility) */}
          {((activeTab === "posts" && posts.length > 0) || (activeTab === "users" && users.length > 0)) && (
            <button className="flex items-center justify-center gap-2 py-4 text-slate-500 hover:text-primary transition-colors font-medium border-t border-primary/10 mt-2">
              Show more results
              <ChevronDown className="size-4 animate-bounce" />
            </button>
          )}
        </div>
      </div>
    </main>
  );
}


export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center min-h-screen text-slate-500 tracking-widest uppercase text-xs animate-pulse">
        Unrolling scrolls...
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
