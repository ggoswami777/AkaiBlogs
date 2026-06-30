import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getAuthUserServer } from "@/lib/authHelper";
import { scoreBlog } from "@/lib/feed/scoreBlog";

export async function GET(request: NextRequest) {
  try {
    const activeUser = await getAuthUserServer();
    const userId = activeUser?.userId;

    const dbBlogs = await prisma.blog.findMany({
      where: {
        published: true,
      },
      include: {
        author: true,
        ...(userId && {
          likes: {
            where: {
              userId,
            },
          },
        }),
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 100,
    });

    let userInterestsByCategory = new Map<string, number>();
    let followingAuthorIds = new Set<string>();

    if (userId) {
      const [userInterests, following] = await Promise.all([
        prisma.userInterest.findMany({
          where: {
            userId,
          },
          select: {
            category: true,
            weight: true,
          },
        }),

        prisma.follows.findMany({
          where: {
            followerId: userId,
          },
          select: {
            followingId: true,
          },
        }),
      ]);

      userInterestsByCategory = new Map(
        userInterests.map((interest) => [interest.category, interest.weight]),
      );

      followingAuthorIds = new Set(
        following.map((relation) => relation.followingId),
      );
    }

    const scoredBlogs = dbBlogs
      .map((blog) => {
        const userCategoryWeight =
          userInterestsByCategory.get(blog.category) || 0;

        const isFollowingAuthor = followingAuthorIds.has(blog.authorId);

        const score = scoreBlog({
          blog,
          userCategoryWeight,
          isFollowingAuthor,
        });

        return {
          blog,
          score,
        };
      })
      .sort((a, b) => b.score - a.score);

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

    const topBlogs = [...dbBlogs]
      .sort((a, b) => {
        const aScore =
          a.likesCount * 3 +
          a.commentsCount * 5 +
          a.viewsCount * 0.2;

        const bScore =
          b.likesCount * 3 +
          b.commentsCount * 5 +
          b.viewsCount * 0.2;

        return bScore - aScore;
      })
      .slice(0, 3)
      .map((blog) => ({
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

    return NextResponse.json({
      success: true,
      blogs,
      topBlogs,
    });
  } catch (error) {
    console.error("Feed API error:", error);

    return NextResponse.json(
      { success: false, error: "Failed to fetch feed" },
      { status: 500 },
    );
  }
}