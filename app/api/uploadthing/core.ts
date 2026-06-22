import { createUploadthing, type FileRouter } from "uploadthing/next";
import { getAuthUserServer } from "@/lib/authHelper";

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    .middleware(async () => {
      const user = await getAuthUserServer();
      if (!user) throw new Error("Unauthorized");

      return {
        userId: user.userId,
        username: user.username,
      };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Blog image uploaded by:", metadata.userId);
      console.log("file url:", file.ufsUrl);

      return {
        uploadedBy: metadata.userId,
        url: file.ufsUrl,
      };
    }),

  avatarUploader: f({
    image: {
      maxFileSize: "2MB",
      maxFileCount: 1,
    },
  })
    .middleware(async () => {
      const user = await getAuthUserServer();
      if (!user) throw new Error("Unauthorized");

      return {
        userId: user.userId,
        username: user.username,
      };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Avatar uploaded by:", metadata.userId);
      console.log("avatar url:", file.ufsUrl);

      return {
        uploadedBy: metadata.userId,
        url: file.ufsUrl,
      };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;