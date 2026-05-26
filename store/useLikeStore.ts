import { create } from "zustand";

interface LikeStore {
  likedBlogs: Record<string, boolean>; 
  likesCount: Record<string, number>;  
  isLoading: Record<string, boolean>;  
  setInitialState: (blogId: string, isLiked: boolean, count: number) => void;
  toggleLike: (blogId: string) => Promise<void>;
}

export const useLikeStore = create<LikeStore>((set, get) => ({
 
  likedBlogs: {},
  likesCount: {},
  isLoading: {},
  setInitialState: (blogId, isLiked, count) => {
    set((state) => ({
      likedBlogs: { ...state.likedBlogs, [blogId]: isLiked },
      likesCount: { ...state.likesCount, [blogId]: count },
    }));
  },

  toggleLike: async (blogId) => {
    if (get().isLoading[blogId]) return;
    set((state) => ({
      isLoading: { ...state.isLoading, [blogId]: true },
    }));

    try {
      const res = await fetch("/api/akaiBlogs/likes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ blogId }),
      });
      const data = await res.json();
      if (data.success) {
        set((state) => ({
          likedBlogs: {
            ...state.likedBlogs,
            [blogId]: data.action === "liked", 
          },
          likesCount: {
            ...state.likesCount,
            [blogId]: data.likesCount, 
          },
        }));
      }
    } catch (error) {
      console.error("Failed to toggle like:", error);
    } finally {
      set((state) => ({
        isLoading: { ...state.isLoading, [blogId]: false },
      }));
    }
  },
}));
