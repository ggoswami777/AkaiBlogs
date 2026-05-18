import { create } from 'zustand';
import { HomePageGlassCardTypeArray, HomeBlogCardTypeArray } from '@/types';

interface BlogStore {
  stats: HomePageGlassCardTypeArray;
  blogs: any;
  isLoadingBlogs: boolean;
  currentUser: string | null;
  setStats: (stats: HomePageGlassCardTypeArray) => void;
  setBlogs: (blogs: HomeBlogCardTypeArray) => void;
  fetchBlogs: () => Promise<void>;
  fetchCurrentUser: () => Promise<void>;
}

export const useBlogStore = create<BlogStore>((set) => ({
  stats: [],
  blogs: [],
  isLoadingBlogs: false,
  currentUser: null,
  setStats: (stats) => set({ stats }),
  setBlogs: (blogs) => set({ blogs }),
  fetchBlogs: async () => {
    set({ isLoadingBlogs: true });
    try {
      const res = await fetch("/api/akaiBlogs/feed");
      const data = await res.json();
      if (data.success) {
        set({ blogs: data.blogs });
      }
    } catch (error) {
      console.error("Error fetching feed:", error);
    } finally {
      set({ isLoadingBlogs: false });
    }
  },
  fetchCurrentUser: async () => {
    try {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      if (data.success) {
        set({ currentUser: data.username });
      } else {
        set({ currentUser: "Guest" });
      }
    } catch (error) {
      set({ currentUser: "Guest" });
    }
  }
}));

