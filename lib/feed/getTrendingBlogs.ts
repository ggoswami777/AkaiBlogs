import { prisma } from "../prisma";
import { getCache, setCache } from "../redis/cache";
import { cacheKeys } from "../redis/cacheKeys";

export async function getTrendingBlogs(){
    const cached=await getCache(cacheKeys.trendingBlogs);
    if(cached){
        return cached;
    }
    const blogs = await prisma.blog.findMany({
    where: {
      published: true,
    },
    include: {
      author: true,
    },
    orderBy: [
      {
        likesCount: "desc",
      },
      {
        commentsCount: "desc",
      },
      {
        viewsCount: "desc",
      },
      {
        createdAt: "desc",
      },
    ],
    take: 3,
  });

  const topBlogs = blogs.map((blog) => ({
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
  }));

  await setCache(cacheKeys.trendingBlogs, topBlogs, 120);

  return topBlogs;
}