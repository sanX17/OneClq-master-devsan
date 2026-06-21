"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { getPosts } from "@/lib/firebase-actions";
import PostCard from "@/components/app/post-card";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Post } from "@/lib/typings";

export default function DiscoverContent() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPosts = async () => {
      const result = await getPosts();
      if (result.success) {
        setPosts(result.posts);
      }
      setLoading(false);
    };

    loadPosts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[90vh] lg:min-h-[80vh] flex items-center justify-center bg-background">
        <Spinner />
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="min-h-[90vh] lg:min-h-[80vh] flex flex-col items-center justify-center gap-5 bg-background">
        <p className="text-muted-foreground font-medium text-lg">
          No posts yet. Start creating!
        </p>
        <Link href="/create-post">
          <Button size="lg">
            <Plus /> Create a post
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col max-w-7xl lg:mx-auto mx-5 gap-6 pt-6 pb-30 lg:pb-10 lg:pt-10">
      <div className="flex justify-between">
        <h1 className="font-semibold text-3xl">Discover</h1>
        <Link href="/create-post">
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4" />
            Create Post
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
