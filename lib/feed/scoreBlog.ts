type ScoreBlogInput = {
    blog: {
        id: string;
        category: string;
        likesCount: number;
        commentsCount: number;
        viewsCount: number;
        createdAt: Date;
        authorId: string;
    };
    userCategoryWeight?: number;
    isFollowingAuthor?: boolean;
    hasViewedBlog?: boolean;
    hasLikedBlog?: boolean;
}

export function scoreBlog({
    blog,
    userCategoryWeight = 0,
    isFollowingAuthor = false,
    hasViewedBlog = false,
    hasLikedBlog = false
}: ScoreBlogInput) {
  
    if (hasViewedBlog || hasLikedBlog) {
        return -9999;
    }

    const engagementScore =
        blog.likesCount * 3 + blog.commentsCount * 5 + blog.viewsCount * 0.15;
        
    const hoursSinceCreated = (Date.now() - new Date(blog.createdAt).getTime()) / (1000 * 60 * 60);
    const recencyBoost = Math.max(0, 30 - hoursSinceCreated);
    const categoryTasteBoost = Math.min(userCategoryWeight, 20) * 3;
    const followingBoost = isFollowingAuthor ? 20 : 0;
    
    return engagementScore + recencyBoost + categoryTasteBoost + followingBoost;
}
