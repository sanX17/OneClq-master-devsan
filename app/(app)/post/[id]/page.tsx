"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  getPostById,
  toggleSavePost,
  isPostSaved,
} from "@/lib/firebase-actions";
import { useAuth } from "@/lib/auth-context";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { BookmarkIcon, Share2 } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { PostData } from "@/lib/typings";
import Link from "next/link";
import BackButton from "@/components/app/back-button";

export default function PostDetailPage() {
  const params = useParams();
  const postId = params.id as string;
  const { user } = useAuth();
  const [post, setPost] = useState<PostData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [saveCount, setSaveCount] = useState(0);
  const [savingLoading, setSavingLoading] = useState(false);

  useEffect(() => {
    const loadPost = async () => {
      const result = await getPostById(postId);
      if (result.success && result.post) {
        setPost(result.post);
        setSaveCount(result.post.saves || 0);

        if (user) {
          const savedResult = await isPostSaved(user.uid, postId);
          setSaved(savedResult.saved);
        }
      }
      setLoading(false);
    };

    loadPost();
  }, [postId, user]);

  const handleSave = async () => {
    if (!user) {
      toast.error("Please login to save posts");
      return;
    }

    setSavingLoading(true);
    try {
      const result = await toggleSavePost(user.uid, postId);
      if (result.success) {
        setSaved(result.saved!);
        setSaveCount((prev) => (result.saved ? prev + 1 : prev - 1));
        toast.success(result.saved ? "Post saved!" : "Removed from saves");
      } else {
        toast.error("Failed to save post");
      }
    } catch {
      toast.error("An error occurred");
    } finally {
      setSavingLoading(false);
    }
  };

  const handleShare = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: "Check out this post",
        text: post?.caption,
        url,
      });
    } else {
      navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard");
    }
  };

  if (loading) {
    return (
      <div className="min-h-[90vh] lg:min-h-[80vh] flex items-center justify-center py-12">
        <Spinner />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">Post not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl lg:mx-auto mx-5 pt-6 pb-30 lg:pb-10 lg:pt-10 py-5">
      <BackButton />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Post Image */}
        <div className="md:col-span-1">
          <div className="relative w-full aspect-9/16 bg-muted rounded-xl overflow-hidden">
            <Image
              src={post.imageUrl || "/placeholder.svg"}
              alt="Post"
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Post Info & Tags */}
        <div className="md:col-span-2 space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="relative w-12 h-12 rounded-full overflow-hidden">
                  <img
                    src={post.userAvatar || "/placeholder.svg"}
                    alt={post.username}
                    className="object-cover"
                  />
                </div>
                <div>
                  <Link
                    href={`/user/${post.username}`}
                    className="font-bold text-foreground hover:underline cursor-pointer"
                  >
                    {post.username}
                  </Link>
                  <p className="text-sm text-muted-foreground">
                    {post.createdAt.toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {post.caption && (
              <p className="text-foreground text-sm mb-4">{post.caption}</p>
            )}

            <div className="flex gap-2">
              <Button
                onClick={handleSave}
                disabled={savingLoading}
                variant={saved ? "default" : "outline"}
                className="flex-1"
              >
                <BookmarkIcon
                  className={`w-4 h-4 mr-2 ${saved ? "fill-current" : ""}`}
                />
                {saved ? "Saved" : "Save"} · {saveCount}
              </Button>
              <Button
                onClick={handleShare}
                variant="outline"
                className="flex-1"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </Card>

          {post.products.length > 0 && (
            <Card className="p-6">
              <h2 className="text-xl lg:text-2xl font-semibold lg:mb-4">
                Shop This Post
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {post.products.map((tag) => (
                  <a
                    key={tag.id}
                    href={tag.productUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group"
                  >
                    <div className="relative w-full aspect-square bg-muted rounded-lg overflow-hidden mb-2 group-hover:opacity-80 transition-opacity">
                      <img
                        src={
                          tag.productImage ||
                          "/placeholder.svg?height=300&width=300"
                        }
                        alt={tag.productName}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <p className="font-medium text-xs md:text-sm text-foreground group-hover:text-blue-600">
                      {tag.productName}
                    </p>
                  </a>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
