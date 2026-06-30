type ScoreBlogInput={
    blog:{
        id:string;
        category:string;
        likesCount:number;
        commentsCount:number;
        viewsCount:number;
        createdAt:Date;
        authorId:string;
    };
    userCategoryWeight?:number;
    isFollowingAuthor?:boolean;
}

export function scoreBlog({blog,userCategoryWeight=0,isFollowingAuthor=false}:ScoreBlogInput){
    const engagementScore=
    blog.likesCount * 3 + blog.commentsCount * 5 + blog.viewsCount*0.2;
    const hoursSinceCreated= (Date.now() - new Date(blog.createdAt).getTime()) / (1000 * 60 * 60);
    const recencyBoost=Math.max(0,30-hoursSinceCreated);
    const categoryTasteBoost=userCategoryWeight*4;
    const followingBoost=isFollowingAuthor?25:0;
    return engagementScore+recencyBoost+categoryTasteBoost+followingBoost;
}