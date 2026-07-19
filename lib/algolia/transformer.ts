import type { AlgoliaBlog, AlgoliaUser } from "./type";

export function toAlgoliaBlog(blog: any): AlgoliaBlog {
  return {
    objectID: blog.id,
    title: blog.title,
    excerpt: blog.excerpt || "",
    content: blog.content || "",
    category: blog.category || "General",
    coverImage: blog.coverImage || null,
    authorId: blog.authorId,
    authorUsername: blog.author?.username || "",
    authorAvatar: blog.author?.avatarUrl || null,
    likesCount: blog.likesCount || 0,
    viewsCount: blog.viewsCount || 0,
    commentsCount: blog.commentsCount || 0,
    createdAt: blog.createdAt || new Date().toISOString(),
  };
}

export function toAlgoliaUser(user: any): AlgoliaUser {
  return {
    objectID: user.id,
    username: user.username,
    bio: user.bio || null,
    avatarUrl: user.avatarUrl || null,
  };
}
