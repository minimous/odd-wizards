import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

// Proper typing for auth function
const auth = async (req: Request) => {
  // Add proper auth implementation here
  return { id: "fakeId" };
};

export const ourFileRouter = {
  imageUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })  
    .middleware(async ({ req }) => {
      try {
        const user = await auth(req);
        if (!user) throw new Error("Unauthorized");
        return { userId: user.id };
      } catch (error: any) {
        throw new Error(`Authentication failed: ${error.message}`);
      }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      try {
        console.log("Upload complete for userId:", metadata.userId);
        console.log("file url", file.url);
        
      } catch (error: any) {
        throw new Error(`Upload completion failed: ${error.message}`);
      }
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;