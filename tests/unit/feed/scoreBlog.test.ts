import { scoreBlog } from "@/lib/feed/scoreBlog";
import { describe,it,expect } from "vitest";

describe("scoreBlog",()=>{
    const baseBlog={
        id:"1",
        category:"Tech",
        likesCount:0,
        commentsCount:0,
        viewsCount:0,
        createdAt:new Date(Date.now()-1000*60*60),
        authorId:"author-1",
    };

    it("demotes viewed blogs to -9999",()=>{
        expect(scoreBlog({blog:baseBlog,hasViewedBlog:true})).toBe(-9999);
    })

    it("demotes liked blogs to -9999",()=>{
        expect(scoreBlog({blog:baseBlog,hasLikedBlog:true})).toBe(-9999);
    })

    it("ranks high-engagement higher than low-engagement",()=>{
        const high=scoreBlog({blog:{...baseBlog,likesCount:100,commentsCount:50}});
        const low=scoreBlog({blog:{...baseBlog,likesCount:1,commentsCount:0}});
        expect(high).toBeGreaterThan(low);
    })

    it("adds +20 following boost",()=>{
        const withFollow=scoreBlog({blog:baseBlog,isFollowingAuthor:true});
        const without=scoreBlog({blog:baseBlog,isFollowingAuthor:false});
        expect(withFollow-without).toBe(20);
    })

    it("caps category taste boost at 20 * 3 = 60", () => {
    const cap = scoreBlog({ blog: baseBlog, userCategoryWeight: 100 });
    const atMax = scoreBlog({ blog: baseBlog, userCategoryWeight: 20 });
    expect(cap).toBe(atMax);
  });
})