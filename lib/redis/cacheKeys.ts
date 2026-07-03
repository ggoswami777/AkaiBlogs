export const cacheKeys={
    guestFeed:"feed:guest:v1",
    trendingBlogs:"blogs:trending:v1",

    userFeed(userId:string){
        return `feed:user:${userId}:v1`;
    },

    profileMe(userId:string){
        return `profile:me:${userId}:v1`;
    },

    publicProfile(username:string){
        return `profile:public:${username}:v1`;
    },

    comments(blogId:string){
        return `comments:${blogId}:v1`;
    }
}