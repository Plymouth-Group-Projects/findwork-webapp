import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { getServerSession } from "next-auth";
import { authOptions } from '@/lib/auth';

const f = createUploadthing();

// Auth function that verifies the user is logged in
const auth = async (req: Request) => {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return null;
  }
  return { id: session.user.id };
};

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Single image uploader
  imageUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    .middleware(async ({ req }) => {
      const user = await auth(req);
      if (!user) throw new UploadThingError("Unauthorized");
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);
      console.log("file url:", file.url);
      return { uploadedBy: metadata.userId, url: file.url };
    }),
  
  // Portfolio images uploader (multiple)
  portfolioUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 10,
    },
  })
    .middleware(async ({ req }) => {
      const user = await auth(req);
      if (!user) throw new UploadThingError("Unauthorized");
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Portfolio image uploaded for userId:", metadata.userId);
      console.log("file url:", file.url);
      return { uploadedBy: metadata.userId, url: file.url };
    }),
  
  // Video uploader
  videoUploader: f({
    video: {
      maxFileSize: "32MB",
      maxFileCount: 1,
    },
  })
    .middleware(async ({ req }) => {
      const user = await auth(req);
      if (!user) throw new UploadThingError("Unauthorized");
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Video uploaded for userId:", metadata.userId);
      console.log("file url:", file.url);
      return { uploadedBy: metadata.userId, url: file.url };
    }),
  
  // PDF document uploader
  documentUploader: f({
    "application/pdf": {
      maxFileSize: "8MB",
      maxFileCount: 5,
    },
  })
    .middleware(async ({ req }) => {
      const user = await auth(req);
      if (!user) throw new UploadThingError("Unauthorized");
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("PDF document uploaded for userId:", metadata.userId);
      console.log("file url:", file.url);
      return { uploadedBy: metadata.userId, url: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
