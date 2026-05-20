"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import SearchInput from "@/components/search/SearchInput";
import SearchTabs from "@/components/search/SearchTabs";
import SearchPostCard, { SearchPost } from "@/components/search/SearchPostCard";
import SearchUserCard, { SearchUser } from "@/components/search/SearchUserCard";
import { ChevronDown } from "lucide-react";

// Mock post results matching the user's template
const mockPosts: SearchPost[] = [
  {
    id: "web3-social-media",
    title: "Exploring the Future of Web3: Decentralized Social Media",
    excerpt: "A deep dive into how decentralized technologies are reshaping our online interactions and data ownership.",
    category: "Technology",
    readTime: "5 min read",
    postImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuASkahNiUob0nBtaC3_XSQHoQ64wwQaCOwZoKsqkjf_SFpj2T3ox_n0V-00oVi7PDDc9HiiIyg2AVaJ8qiVePZJcxFTah_fgIo7G46aVpQDv0VQ2Xcr8m4vXpeHL2SoHLWVi-H7jsU9Jn94IegMwuHV67yvRxZ5B5_uysrwRjE4wQOQgS2V5D0DruQQ-COBphzzlnqr-yZB0v-L5Y9Dx0q2MyUccpy2vfDL7aMbEXtmSwhTcEs84DhMa4o7k4rHuUEDTlksErhQgw",
    author: "Alex River",
    authorImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuAGfqU4445CD-jLmGjSRd_A4nwNy5wt5QMmzY9QDaluz_nwJjQwgbNIcvRxnsCC4Jnhq0WU5j7uvKh1HBqNeqy5YWSQdEUQbV_PgqUfsymZYH9aJIDUUbauG2tXnWStNUNL2spnYIFujaV0_JsvhtlffZQ-SQ22xpSIawpRJkh9aVwRGjoenruHUZf96dFEv8P8aCZ76jMlGpTLHmGEbLJcH8_rA7SEKxC5rfoo4KzHrjiiYXSZ_d_HqiyaQP_6NgjAcG3OBW_pOw"
  },
  {
    id: "web3-governance",
    title: "The Economic Impact of Web3 Governance",
    excerpt: "How DAOs are changing the way we think about organizational structure and collective investment.",
    category: "Economy",
    readTime: "8 min read",
    postImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuA8JWo0Lph_v656vZNZZJwemq5_HA9H7BZv9UI7m5rkX7tW_e-YkcazCg18ifUsLIN0EfVlNNGvCqj6N3fmjZ0nYmajaM1ra-otMmGralQKr0mntGM3zLAnoiiGCcTbugDNqcRWOw7A7v0Fv4ECUxego-VWkQ9NQtT8WxzPoWJ95ookW8jumGhXGIlPZbPFPb4E1rZTmatDOkp451nY7kSrcBcOB_ivMznUeSeeWr9P6DVZaHYHT7_OssMioUaMis81RyFQle937Q",
    author: "Sarah Chen",
    authorImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuB4t-k2flJGl2uMhPB-x6PSOtTN5S3Vy0OOoI3RWJYO9Ro1tP-AVPTZPcZasVs8S7v7dlSUGryRZvM2mBT4QF_sNYJEuAydjhked8dDzPV5VRE24gffeuYelH2hEjZiSVQaAL07ged_Xp4wplEtnXRduiqqM6Zhk5mlUSrLLlM0PTMhZN5D-0NfOrxyZV3YWDr2YnBt8_d_CuySnuOR2WG1GYohI4HQfh88-spYNVALJQX30IoOIm7YsjyNrUKvmPWr8IhDHSe_3Q"
  }
];

// Mock user results matching the user's template
const mockUsers: SearchUser[] = [
  {
    id: "jordan-miles",
    name: "Jordan Miles",
    username: "jmiles_web3",
    avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCdrJgPTOfdwRgFfVp6gYJowZodO1r0LFegXNwhzdvFl6nb7acK2z01J3HxQwJNsNjzwaC7gIwkKu0sdWyR3HWL8BP2EqsDuY-YYXDdErr8fXII4A4v7Dqa9EgZYDQ8FXttnnUoNLucasoAO3yLelW1SW372GOIzH6Z5tiRatO0N1DOJvscI6Qd1lCHNa9KNqPIgrdNOdqQDhMC80MRs7MKvKUNwPzzo6VzS0Em7g_FttkB1gfqaHAN97fQq3meu8wm1HzeMyBaag",
    isFollowing: false
  },
  {
    id: "elena-rodriguez",
    name: "Elena Rodriguez",
    username: "elena_rod",
    avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBUQ7BHdmh-fFEqUNjOeppvN1rHC1InTpqyED78imTmfcy-OhZ_Bo6DqlCTdZnu1KmDmmZLWnLEtGjYikLCSJANbS_aj-3ywjcoeSWwVexJcJ9bwPb_eQw86jkeUz11X4GHGzoLcUkSlgE4jZQzSpIT-ACtzymmAFn9aIqaaoiY1yeLUBBqXAfmgMZ4-C9nmbENq5WrSL27bXGpuq_RXy6yHCmXpS1zAt0GQ58SSAE4NvGwDnh9_pI5tO9kADB3o7KGKNmxLqcRzQ",
    isFollowing: true
  },
  {
    id: "marcus-thorne",
    name: "Marcus Thorne",
    username: "mthorne_dev",
    avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDcku-A2CQq93aCgVF28S-dSulV___h-bz8Kr-Ajl-oiFzIAxKoRHCO7fPbPb-vHPZqtJv3zz4uAxCx8eVfQRDVjiBGGAQ3m3fYmQikRCidxQTvODICdh4jUzbNCGlF2RVbvtK969C4CjHh9gAtbQjs9B7r5pUZIFBL1GKzai7tEQEAgRjqLybIKM9GqWlbY-1-dOsnscKaWaosVmVqERV97w4OmPGtqNy0fupY2kYmIsr64IHeyKcJvZHDw3v_qDUG0w6TWOcZ3g",
    isFollowing: false
  },
  {
    id: "anya-petrova",
    name: "Anya Petrova",
    username: "anya_design",
    avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBzeZZGSg6R4UK9GnEcCKMs71HXv58S1u6OhzdWJtoHqAxQ5BN_YetaNugHBpCg9b5mNvu0BDJjvSxf8B5CbCyMgmiSa0CFaJ1q-EHsSfHXacaIc6Q-WBjhOgGd8UznglLT-3HdTFPG2cBzN9Y3jWjoHWeau_AOooH2dSzpTGNR5rMdFXoKtdv6BO_lxtBNW3rBohJLWftQOCSZlq6pE-StgKVabU0gvcY2BQYNFxTL46-bxWIbrB90jQ-Jrz2eMe9datd-oq4b5Q",
    isFollowing: false
  }
];

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"posts" | "users">("posts");

  const searchQuery = searchParams.get("q") || "";

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
        
        {/* Mobile SearchInput - Visible on screens smaller than lg (hidden on desktop lg) */}
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
          {activeTab === "posts" && (
            <>
              <h3 className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-widest px-1">
                {searchQuery ? `Results for "${searchQuery}"` : "Top Results"}
              </h3>
              <div className="grid grid-cols-1 gap-4">
                {mockPosts.map((post) => (
                  <SearchPostCard key={post.id} post={post} />
                ))}
              </div>
            </>
          )}

          {activeTab === "users" && (
            <>
              <h3 className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-widest px-1">
                People you might follow
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {mockUsers.map((user) => (
                  <SearchUserCard key={user.id} user={user} />
                ))}
              </div>
            </>
          )}

          {/* Show More Actions Button */}
          <button className="flex items-center justify-center gap-2 py-4 text-slate-500 hover:text-primary transition-colors font-medium border-t border-primary/10 mt-2">
            Show more results
            <ChevronDown className="size-4 animate-bounce" />
          </button>
        </div>
      </div>
    </main>
  );
}

// Wrap in Suspense boundary for Next.js build compatibility
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
