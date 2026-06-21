import CreatePostContent from "@/components/app/create-post-content";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Post",
  description: "Create a new post",
};

export default function CreatePostPage() {
  return <CreatePostContent />;
}
