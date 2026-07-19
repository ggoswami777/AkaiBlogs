import { blogsIndex, usersIndex } from "./client";
import { toAlgoliaBlog, toAlgoliaUser } from "./transformer";

export async function syncBlogToAlgolia(blog:any){
    await blogsIndex.saveObject(toAlgoliaBlog(blog));
}

export async function deleteBlogFromAlgolia(blogId:string){
    await blogsIndex.deleteObject(blogId);
}

export async function syncUserToAlgolia(user:any) {
    await usersIndex.saveObject(toAlgoliaUser(user));
}
export async function deleteUserFromAlgolia(userId:string) {
    await usersIndex.deleteObject(userId);
}