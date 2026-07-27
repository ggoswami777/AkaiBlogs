import React from "react";

export type HomePageGlassCardType={
    id:string | number;
    title:string;
    data:string;
    icon:React.ReactNode; 
}
export type HomePageGlassCardTypeArray=HomePageGlassCardType[];

export type HomeBlogCardType = {
    id: string | number;
    title: string;
    author: string;
    category: string;
    image: string;
}
export type HomeBlogCardTypeArray = HomeBlogCardType[];

export type FeedBlogType = {
  id: string;
  title: string;
  excerpt?: string | null;
  content: string;
  coverImage?: string | null;
  published: boolean;
  category: string;
  authorId: string;
  createdAt: string;
  updatedAt: string;
  likesCount: number;
  viewsCount: number;
  commentsCount: number;
};