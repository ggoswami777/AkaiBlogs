import { createUploadthing, type FileRouter } from "uploadthing/next";
import { cookies } from "next/headers";

const f = createUploadthing();

export const ourFileRouter={
  imageUploader:f({
    image:{
      maxFileSize: "4MB",
      maxFileCount: 1,
    }
  }).middleware(async()=>{
      const cookieStore=await cookies();
      const token=cookieStore.get("token");
      if(!token) throw new Error("Unauthorized");
      return {userId:"ronin_user"};
  }).onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);
      console.log("file url", file.ufsUrl);
      return { uploadedBy: metadata.userId };
    }),
}satisfies FileRouter;
export type OurFileRouter = typeof ourFileRouter;
