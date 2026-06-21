"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import {
  MoreVertical,
  Trash2,
  GalleryVertical,
  Pencil,
  BookmarkIcon,
} from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  deletePost,
  isPostSaved,
  toggleSavePost,
} from "@/lib/firebase-actions";
import { Post } from "@/lib/typings";
import { Button } from "../ui/button";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface PostCardProps {
  post: Post;
  isOwner?: boolean;
  isSaved?: boolean;
}

export default function PostCard({
  post,
  isOwner = false,
  isSaved = false,
}: PostCardProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [saved, setSaved] = useState(false);
  const [savingLoading, setSavingLoading] = useState(false);

  useEffect(() => {
    const getIsSaved = async () => {
      if (user) {
        const savedResult = await isPostSaved(user.uid, post.id);
        setSaved(savedResult.saved);
      }
    };

    getIsSaved();
  });

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const link = `/edit-post/${post.id}`;
    window.location.href = link;
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const result = await deletePost(post.id, post.imageUrl);
      if (result.success) {
        toast.success("Post deleted");
        window.location.reload();
      } else {
        toast.error(result.error || "Failed to delete post");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  const handleSave = async () => {
    if (!user) {
      router.push("/login");
      toast.error("Please login to save posts");
      return;
    }

    setSavingLoading(true);
    try {
      const result = await toggleSavePost(user.uid, post.id);
      if (result.success) {
        setSaved(result.saved!);
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

  return (
    <>
      <Link href={`/post/${post.id}`} className="h-full">
        <Card className="relative overflow-visible group cursor-pointer border-none gap-4 p-0 h-full">
          <div className="relative w-full aspect-9/16 bg-muted overflow-hidden rounded-2xl">
            {/* Image */}
            <Image
              src={post.imageUrl}
              alt="Post"
              fill
              className="object-cover group-hover:scale-105 transition-transform"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
              <GalleryVertical className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity fill-white" />
            </div>

            {/* Products Count */}
            {post.products.length > 0 && (
              <div className="absolute bottom-3 right-3 bg-black/70 text-white px-2 py-1 rounded-full text-xs font-medium">
                {post.products.length} items
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col flex-1">
            <div className="flex items-center gap-3 mb-3">
              {!isOwner && (
                <>
                  <div className="relative w-8 h-8 rounded-full overflow-hidden shrink-0">
                    <img
                      src={post.userAvatar}
                      alt={post.username}
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        window.location.href = `/user/${post.username}`;
                      }}
                      className="text-sm font-bold text-foreground truncate hover:underline cursor-pointer"
                    >
                      {post.username}
                    </button>
                    <p className="text-xs text-muted-foreground">
                      {post.createdAt.toLocaleDateString()}
                    </p>
                  </div>
                </>
              )}

              {isOwner && (
                <div className="absolute top-2 right-2 z-50">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                        className="p-1 hover:bg-muted/10 rounded cursor-pointer transition-colors"
                      >
                        <MoreVertical className="w-4 h-4 text-background" />
                      </button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                      align="end"
                      side="bottom"
                      sideOffset={6}
                      className="z-9999 min-w-32"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                    >
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleEdit(e as unknown as React.MouseEvent);
                        }}
                        disabled={deleting}
                        className="cursor-pointer"
                      >
                        <Pencil className="w-4 h-4 mr-2" />
                        Edit
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setShowDeleteDialog(true);
                        }}
                        disabled={deleting}
                        className="cursor-pointer text-destructive focus:text-destructive"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
            </div>

            {!isOwner && post.caption && (
              <p className="text-xs lg:text-sm text-foreground mb-4 line-clamp-2 flex-1">
                {post.caption}
              </p>
            )}

            <div className="absolute top-2 left-3 flex justify-center items-center gap-1.5 text-sm text-background mt-auto">
              {/* <BookmarkIcon className="w-4 h-4" />
              <span className="pt-0.5">{post.saves}</span> */}

              <Button
                onClick={(e) => {
                  e.preventDefault();
                  handleSave();
                }}
                disabled={savingLoading}
                variant="outline"
                size="icon"
                className={`flex-1 rounded-full ${saved ? "bg-background text-foreground" : "text-foreground"}`}
              >
                <BookmarkIcon
                  className={`w-4 h-4 ${saved ? "fill-current" : ""}`}
                />
              </Button>
            </div>
          </div>
        </Card>
      </Link>

      {/* Delete Confirmation Dialog - rendered outside the Link */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Post?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              post.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-destructive hover:bg-destructive/90"
            >
              {deleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
