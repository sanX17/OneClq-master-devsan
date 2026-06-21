"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BookmarkIcon, Eye } from "lucide-react";
import { WardrobeData } from "@/lib/typings";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";
import { isWardrobeSaved, toggleSaveWardrobe } from "@/lib/firebase-actions";

export default function WardrobeCard({
  wardrobe,
  isOwner = false,
}: {
  wardrobe: WardrobeData;
  isOwner?: boolean;
}) {
  const router = useRouter();
  const { user } = useAuth();
  const [saved, setSaved] = useState(false);
  const [savingLoading, setSavingLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    isWardrobeSaved(user.uid, wardrobe.wardrobeId).then((result) => {
      setSaved(result.saved);
    });
  }, [user, wardrobe.wardrobeId]);

  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      router.push("/login");
      toast.error("Please login to save wardrobes");
      return;
    }
    setSavingLoading(true);
    try {
      const result = await toggleSaveWardrobe(user.uid, wardrobe.wardrobeId);
      if (result.success) {
        setSaved(result.saved!);
        toast.success(result.saved ? "Wardrobe saved!" : "Removed from saves");
      } else {
        toast.error("Failed to save wardrobe");
      }
    } catch {
      toast.error("An error occurred");
    } finally {
      setSavingLoading(false);
    }
  };

  return (
    <div>
      <Card className="h-full overflow-hidden border-none p-0">
        {/* Preview Grid */}
        <Link href={`/wardrobe/${wardrobe.wardrobeId}`}>
          {wardrobe.products.length > 0 ? (
            <div className="relative grid grid-cols-2 gap-3 bg-muted p-3 rounded-2xl">
              {wardrobe.products.slice(0, 4).map((item, idx) => (
                <div
                  key={idx}
                  className="relative w-full aspect-square bg-muted rounded-xl overflow-hidden"
                >
                  <img
                    src={
                      item.productImage ||
                      "/placeholder.svg?height=300&width=300"
                    }
                    alt={item.productName}
                    className="object-cover w-full h-full"
                  />
                </div>
              ))}

              {/* Save button - overlaid top-right on grid */}
              <Button
                onClick={handleSave}
                disabled={savingLoading}
                variant="outline"
                size="icon"
                className={`flex-1 rounded-full absolute top-4 right-4 ${saved ? "bg-background text-foreground" : "text-foreground"}`}
              >
                <BookmarkIcon
                  className={`w-4 h-4 ${saved ? "fill-current" : ""}`}
                />
              </Button>
            </div>
          ) : (
            /* Empty state placeholder */
            <div className="relative w-full aspect-video bg-muted rounded-2xl flex items-center justify-center">
              <p className="text-xs text-muted-foreground">No items yet</p>
            </div>
          )}
        </Link>

        {/* Info */}
        <div className="pb-4">
          <h3 className="font-bold text-lg text-foreground line-clamp-2">
            {wardrobe.title}
          </h3>
          <p className="text-sm text-muted-foreground hover:text-foreground mt-1">
            By{" "}
            <Link href={`/user/${wardrobe.username}`}>{wardrobe.username}</Link>
          </p>
          {wardrobe.description && (
            <p className="text-sm text-foreground mt-2 line-clamp-2">
              {wardrobe.description}
            </p>
          )}

          <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
            <span className="text-xs text-muted-foreground">
              {wardrobe.products.length} items
            </span>

            {!isOwner ? (
              /* Non-owner: views + save button */
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Eye className="w-3 h-3" />
                  {wardrobe.views}
                </div>
                {/* <button
                  onClick={handleSave}
                  disabled={savingLoading}
                  aria-label={saved ? "Unsave wardrobe" : "Save wardrobe"}
                  className="p-1.5 rounded-full hover:bg-muted transition-colors"
                >
                  <BookmarkIcon
                    className={`w-3.5 h-3.5 transition-colors ${
                      saved
                        ? "fill-foreground text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  />
                </button> */}
              </div>
            ) : (
              /* Owner: view + edit */
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    router.push(`/wardrobe/${wardrobe.wardrobeId}`)
                  }
                >
                  View
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    router.push(`/edit-wardrobe/${wardrobe.wardrobeId}`)
                  }
                >
                  Edit
                </Button>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
