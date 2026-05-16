import { create } from 'zustand';
import { HomePageGlassCardTypeArray, HomeBlogCardTypeArray } from '@/types';

interface BlogStore {
  stats: HomePageGlassCardTypeArray;
  blogs: HomeBlogCardTypeArray;
  setStats: (stats: HomePageGlassCardTypeArray) => void;
  setBlogs: (blogs: HomeBlogCardTypeArray) => void;
}

export const useBlogStore = create<BlogStore>((set) => ({
  stats: [],
  blogs: [],
  setStats: (stats) => set({ stats }),
  setBlogs: (blogs) => set({ blogs }),
}));
