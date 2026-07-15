import { prisma } from "../prisma";
import { setCache } from "../redis/cache";
import { cacheKeys } from "../redis/cacheKeys";
import { getTrendingBlogs } from "./getTrendingBlogs";
import { scoreBlog } from "./scoreBlog";

export async function recomputeFeedForUser(userId:string | null) {
    const cacheKey=userId?cacheKeys.userFeed(userId):cacheKeys.guestFeed;
    const dbBlogs=await prisma.blog.findMany({
        where:{
            published:true,
        },
        include:{
            author:true,
            ...(userId &&{
                likes:{
                    where:{
                        userId,
                    },
                },
            }),
        },
        orderBy:{
            createdAt:"desc",
        },
        take:100,
    });

    let userInterestsByCategory=new Map<string,number>();
    let followingAuthorIds=new Set<string>();
    const viewedBlogIds=new Set<string>();
    if(userId){
        const [userInterests,following,viewedBlogs]=await Promise.all([
            prisma.userInterest.findMany({
                where:{
                    userId,
                },
                select:{
                    category:true,
                    weight:true,
                },
            }),
            prisma.follows.findMany({
                where:{
                    followerId:userId,
                },
                select:{
                    followingId:true,
                },
            }),
            prisma.blogView.findMany({
                where:{
                    userId,
                },
                select:{
                    blogId:true,
                },
            }),
        ]);
        userInterestsByCategory=new Map(
            userInterests.map((interest)=>[interest.category,interest.weight]),
        );
        followingAuthorIds=new Set(
            following.map((relation)=>relation.followingId),
        );
        viewedBlogs.forEach((view)=> viewedBlogIds.add(view.blogId))
    }
    const scoredBlogs=dbBlogs.map((blog)=>{
        const userCategoryWeight=userInterestsByCategory.get(blog.category) || 0;
        const isFollowingAuthor=followingAuthorIds.has(blog.authorId);
        const score = scoreBlog({
        blog,
        userCategoryWeight,
        isFollowingAuthor,
        hasViewedBlog: viewedBlogIds.has(blog.id),
        hasLikedBlog: Boolean(blog.likes && blog.likes.length > 0),
      });
      return{
        blog,
        score
      }

    }).sort((a,b)=>b.score-a.score);

    const blogs = scoredBlogs.map(({ blog }) => ({
    id: blog.id,
    author: blog.author.username,
    authorImage:
      blog.author.avatarUrl ||
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDQREzBniPFG2Rv_94OnCxJg4cRDD40044S_MYT3ZXzSs4-9GW-Jv3-nb6sUnnqs2nTb6XE0OcJsPGnJDuMQJZ9QcIcQ_aHE1N7YwlkHcXxTBimzOzoqZ6IzCaH-CeERYMzm06b5vHmwCKTr24X--k89shI3ntfJqHPuc2pmf9UGQ60JwENsEpz0xxzRexZnHPo4N61bX1AIe4QBvRpu7bNUZKwep55iMNKLCoKqkRSQK4tfIUepeZ3C9uu4pIuIbkiT-5nAYtHiQ",
    time: new Date(blog.createdAt).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    category: blog.category || "General",
    postImage:
      blog.coverImage ||
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBGqQusKRN51nhQea1nffq_Ca4j_-0PMBC1Kq8Vwk3S6jpo6nwpTYVY9C5t2-Ps7WCl_HN0E_e30iwbpfkb0j4bs6k63XOw7TVhsgAlwIeGTFvT_c1AUkp1dcYxDuM9IWKpJE9cCmcJjFGZmhNgQohmddj93Gwlxi6-sx2YwsqCglBPWx0yGxsya0QQ13S-hfTeEFKPcdM6GaS6YjQmr9ks2qHyAPzxsGcqEZtfsuw_kjHXipNXV2KUmSXhQXSsiLm-zQOqO1WCJg",
    title: blog.title,
    excerpt: blog.excerpt || "No summary provided.",
    likesCount: blog.likesCount,
    commentsCount: blog.commentsCount,
    viewsCount: blog.viewsCount,
    isLikedByCurrentUser: userId
      ? Boolean(blog.likes && blog.likes.length > 0)
      : false,
  }));
  const topBlogs = await getTrendingBlogs();
  const responsePayload = {
    success: true as const,
    blogs,
    topBlogs
  };
  await setCache(
    cacheKey,
    responsePayload,
    userId ? 25 : 50,
  );
  return responsePayload;
}