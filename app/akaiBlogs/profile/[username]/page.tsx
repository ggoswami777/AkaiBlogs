
"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileStats from "@/components/profile/ProfileStats";
import ProfileTabs from "@/components/profile/ProfileTabs";
import ProfilePostCard from "@/components/profile/ProfilePostCard";
import ProfilePostCardSkeleton from "@/components/skeletons/ProfilePostCardSkeleton";

interface PageProps {
  params: Promise<{ username: string }>;
}

export default function UserProfilePage({ params }: PageProps) {
  const { username } = React.use(params);
  const [profile, setProfile] = useState<any>(null);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isLoadingBlogs, setIsLoadingBlogs] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      setIsLoadingProfile(true);
      try {
        const res = await fetch(`/api/profile/${username}`);
        const data = await res.json();
        if (data.success) {
          setProfile(data.profile);
        }
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      } finally {
        setIsLoadingProfile(false);
      }
    };

    const fetchUserBlogs = async () => {
      setIsLoadingBlogs(true);
      try {
        const res = await fetch(`/api/akaiBlogs/profileBlogs?username=${username}`);
        const data = await res.json();
        if (data.success) {
          setBlogs(data.blogs);
        }
      } catch (error) {
        console.error("Failed to fetch user blogs:", error);
      } finally {
        setIsLoadingBlogs(false);
      }
    };

    fetchUserProfile();
    fetchUserBlogs();
  }, [username]);

  if (isLoadingProfile || !profile) {
    return (
      <>
        <Navbar />
        <main className="flex flex-col justify-center py-5 max-w-[1400px] mx-auto px-4">
          <div className="flex flex-col flex-1 max-w-[800px] w-full mx-auto mt-6 animate-pulse space-y-6">
            <div className="flex items-end gap-6">
              <div className="w-32 h-32 rounded-full bg-white/10"></div>
              <div className="space-y-2 flex-1">
                <div className="h-8 w-48 bg-white/10 rounded"></div>
                <div className="h-4 w-24 bg-white/10 rounded"></div>
                <div className="h-4 w-64 bg-white/10 rounded"></div>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="h-6 w-20 bg-white/10 rounded"></div>
              <div className="h-6 w-20 bg-white/10 rounded"></div>
              <div className="h-6 w-20 bg-white/10 rounded"></div>
            </div>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="flex flex-col justify-center py-5 max-w-[1400px] mx-auto px-4">
        <div className="flex flex-col flex-1 max-w-[800px] w-full mx-auto mt-6 lg:mt-0">
          <ProfileHeader
            name={profile.username}
            username={profile.username}
            bio={profile.bio || "Sharing my journey through neon streets and quiet temples."}
            avatarUrl={profile.avatarUrl}
            isOwnProfile={false} 
          />

          <div className="my-6">
            <ProfileStats
              followers={profile.followersCount}
              following={profile.followingCount}
              posts={profile.postsCount}
            />
          </div>

          <ProfileTabs />

          <div className="flex flex-col gap-6">
            {isLoadingBlogs ? (
              <div className="space-y-6">
                <ProfilePostCardSkeleton />
                <ProfilePostCardSkeleton />
              </div>
            ) : blogs.length === 0 ? (
              <p className="text-slate-500 text-sm text-center py-10">No scrolls forged yet.</p>
            ) : (
              blogs.map((blog) => (
                <ProfilePostCard
                  key={blog.id}
                  id={blog.id}
                  title={blog.title}
                  excerpt={blog.excerpt || ""}
                  image={blog.coverImage}
                  likes={blog.likesCount}
                  comments={blog.commentsCount}
                  date={new Date(blog.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                />
              ))
            )}
          </div>

          <div className="h-20 lg:hidden"></div>
        </div>
      </main>
    </>
  );
}
