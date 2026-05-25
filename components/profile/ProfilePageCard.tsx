"use client";

import { useEffect, useState } from "react";
import ProfileHeader from "./ProfileHeader";
import ProfileStats from "./ProfileStats";
import ProfileTabs from "./ProfileTabs";
import ProfilePostCard from "./ProfilePostCard";
import ProfilePostCardSkeleton from "@/components/skeletons/ProfilePostCardSkeleton";
import { userProfileStore } from "@/store/useProfileStore";
import DeleteConfirmModal from "./DeleteConfirmModal";

const ProfileCardPage = () => {
  const { profile, fetchProfile, isLoadingProfile } = userProfileStore();
  const [blogs,setBlogs]=useState<any[]>([]);
  const [isLoadingBlogs,setIsLoadingBlogs]=useState(true);
  const [blogToDelete, setBlogToDelete] = useState<any | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(()=>{
    const fetchProfileBlogs=async()=>{
      setIsLoadingBlogs(true);
      try {
        const res=await fetch("/api/akaiBlogs/profileBlogs");
        const data=await res.json();
        if(data?.success){
          setBlogs(data.blogs);
          console.log(data.blogs);
        }
        
      } catch (error) {
        console.error("failed to fetch profile blogs",error);
      }finally{
        setIsLoadingBlogs(false);
      }
    }
    fetchProfileBlogs();
  },[])

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleDeleteConfirm = async () => {
    if (!blogToDelete) return;
    try {
      const res = await fetch(`/api/akaiBlogs/delete?id=${blogToDelete.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        // Remove from local state blogs list
        setBlogs((prev) => prev.filter((b) => b.id !== blogToDelete.id));
        // Decrement postsCount in the global Zustand store to update sidebar & header stats
        userProfileStore.setState((state) => {
          if (state.profile) {
            return {
              profile: {
                ...state.profile,
                postsCount: Math.max(0, state.profile.postsCount - 1),
              },
            };
          }
          return {};
        });
      } else {
        alert(data.error || "Failed to delete blog");
      }
    } catch (error) {
      console.error("Error deleting blog:", error);
      alert("An error occurred while deleting the blog");
    } finally {
      setIsDeleteModalOpen(false);
      setBlogToDelete(null);
    }
  };

  if (isLoadingProfile || !profile) {
    return (
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
    );
  }

  // const posts = [
  //   {
  //     id: 1,
  //     title: "Midnight in Shinjuku",
  //     excerpt: "Found this amazing small ramen shop tucked away behind the main station. Best broth I've had this month!",
  //     image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBGqQusKRN51nhQea1nffq_Ca4j_-0PMBC1Kq8Vwk3S6jpo6nwpTYVY9C5t2-Ps7WCl_HN0E_e30iwbpfkb0j4bs6k63XOw7TVhsgAlwIeGTFvT_c1AUkp1dcYxDuM9IWKpJE9cCmcJjFGZmhNgQohmddj93Gwlxi6-sx2YwsqCglBPWx0yGxsya0QQ13S-hfTeEFKPcdM6GaS6YjQmr9ks2qHyAPzxsGcqEZtfsuw_kjHXipNXV2KUmSXhQXSsiLm-zQOqO1WCJg",
  //     likes: "2.4k",
  //     comments: 156,
  //     date: "Oct 24, 2023"
  //   },
  //   {
  //     id: 2,
  //     title: "Finding Zen in the Chaos",
  //     excerpt: "Even in the world's busiest city, silence is only a temple gate away. Spent the morning at Meiji Jingu.",
  //     image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBCsuL_1udSYH8r1Z3LBdxqz8ressHppnxPzzvsEeRzvomxyyWun5CG0A9KvVnH2oIEJ_sv62s9bomWVL6TpNH2f2EOtMgL9wXRmyDBhMRgcP5Sjb7_1A8u8JFwp19u8-jPSvec6zjsVhVxXdIdBuMgPuOBR3Ph38x6CjhPnsVVfwTmQ63iAo0iFkkHh8bT45iRiYKf6QI377SmMuNh0yOp-wfH0U8y8aamo8pa6dM8pl-JSG71lPonCeQaZjR6ocjxdtFGwbF4IQ",
  //     likes: "1.8k",
  //     comments: 89,
  //     date: "Oct 20, 2023"
  //   },
  //   {
  //     id: 3,
  //     title: "Tokyo Coffee Culture",
  //     excerpt: "The attention to detail in these specialty shops is unreal. This pour-over took 10 minutes but was worth every second.",
  //     image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDGFzYQJ-FElA9PXTUc9p53s7iUIm0geLKI-1uCLmgJx3S6gtALpCAm8IC2RzHg0jFwxvj63j4SEUNLYUVuTXeIgRtmBVA2PjK1nuXvIY6X2rOAL9xXet8uB9_RGKIuJEy84eboVy8PNnIyZh-NpbAO_-Dflf3xkmgF6Df7-0mx0MZlhG8H79T2f-9pIvyy4LLxkhcTYxHxYZKW9THXpJ6Miw_e5H1GNdSh2q0WqLZq2wW5R7G6-fL3wflFjjkPsKLIQT-pkRdN5w",
  //     likes: "3.1k",
  //     comments: 243,
  //     date: "Oct 15, 2023"
  //   }
  // ];

  return (
    <main className="flex flex-col justify-center py-5 max-w-[1400px] mx-auto px-4">
      <div className="flex flex-col flex-1 max-w-[800px] w-full mx-auto mt-6 lg:mt-0">

        <ProfileHeader
          name={profile.username}
          username={profile.username}
          bio={profile.bio || "Digital nomad & coffee enthusiast. Sharing my journey through Tokyo's hidden neon streets and quiet temples."}
          avatarUrl={profile.avatarUrl}
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
                date={new Date(blog.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                onDelete={() => {
                  setBlogToDelete(blog);
                  setIsDeleteModalOpen(true);
                }}
              />
            ))
          )}

        </div>

        <div className="h-20 lg:hidden"></div>
      </div>

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setBlogToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        blogTitle={blogToDelete?.title || ""}
      />
    </main>
  );
};

export default ProfileCardPage;
