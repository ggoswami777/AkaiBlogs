export interface AlgoliaBlog {
  objectID: string;       
  title: string;
  excerpt: string;
  content: string;
  category: string;
  coverImage: string | null;
  authorId: string;
  authorUsername: string;
  authorAvatar: string | null;
  likesCount: number;
  viewsCount: number;
  commentsCount: number;
  createdAt: string;      
}

export interface AlgoliaUser {
  objectID: string;       
  username: string;
  bio: string | null;
  avatarUrl: string | null;
}