"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ShopProduct } from "@/lib/typings";
import { Card } from "@/components/ui/card";
import { MoreVertical, Pencil, Trash2, BookmarkIcon } from "lucide-react";
import {
  deleteProduct,
  isProductSaved,
  toggleSaveProduct,
} from "@/lib/firebase-actions";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

const CURRENCY_SYMBOL: Record<string, string> = {
  INR: "₹",
  USD: "$",
  EUR: "€",
  GBP: "£",
};

interface Props {
  product: ShopProduct;
  isOwner?: boolean;
  onDeleted?: (id: string) => void;
}

export default function ProductCard({
  product,
  isOwner = false,
  onDeleted,
}: Props) {
  const { user } = useAuth();
  const router = useRouter();

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [saved, setSaved] = useState(false);
  const [savingLoading, setSavingLoading] = useState(false);

  useEffect(() => {
    if (!user) return;

    isProductSaved(user.uid, product.productId).then((result) => {
      setSaved(result.saved);
    });
  }, [user, product.productId]);

  const symbol = product.currency
    ? (CURRENCY_SYMBOL[product.currency] ?? product.currency + " ")
    : "";

  const handleDelete = async () => {
    setDeleting(true);

    try {
      const result = await deleteProduct(product.productId);

      if (result.success) {
        toast.success("Product deleted");
        onDeleted?.(product.productId);
      } else {
        toast.error(result.error || "Failed to delete product");
      }
    } catch {
      toast.error("An error occurred");
    } finally {
      setDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      router.push("/login");
      toast.error("Please login to save products");
      return;
    }

    setSavingLoading(true);

    try {
      const result = await toggleSaveProduct(user.uid, product.productId);

      if (result.success) {
        setSaved(result.saved!);
        toast.success(result.saved ? "Product saved!" : "Removed from saves");
      } else {
        toast.error("Failed to save product");
      }
    } catch {
      toast.error("An error occurred");
    } finally {
      setSavingLoading(false);
    }
  };

  return (
    <>
      <Card className="relative overflow-visible group cursor-pointer py-0 h-full flex flex-col">
        {/* Image */}
        <Link href={`/product/${product.productId}`} className="block">
          <div className="relative w-full aspect-square bg-muted overflow-hidden rounded-t-xl">
            <img
              src={product.image || "/placeholder.svg?height=300&width=300"}
              alt={product.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />

            {/* {product.platform && (
              <span className="absolute top-2 left-2 text-[10px] font-semibold px-2 py-0.5 bg-black/60 text-white rounded-full capitalize">
                {product.platform}
              </span>
            )} */}

            <Button
              onClick={handleSave}
              disabled={savingLoading}
              variant="outline"
              size="icon"
              className={`rounded-full absolute top-2 right-2 ${
                saved ? "bg-background text-foreground" : "text-foreground"
              }`}
            >
              <BookmarkIcon
                className={`w-4 h-4 ${saved ? "fill-current" : ""}`}
              />
            </Button>
          </div>
        </Link>

        {/* Info */}
        <div className="px-3 pb-3 flex flex-col flex-1 pt-2">
          <div className="flex items-start justify-between gap-1">
            <Link
              href={`/product/${product.productId}`}
              className="flex-1 min-w-0"
            >
              <p className="font-medium text-sm text-foreground line-clamp-2 leading-snug">
                {product.title}
              </p>
            </Link>

            {isOwner ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    className="p-1 hover:bg-muted rounded transition-colors cursor-pointer shrink-0"
                  >
                    <MoreVertical className="w-4 h-4 text-muted-foreground" />
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
                  <DropdownMenuItem asChild>
                    <Link
                      href={`/edit-product/${product.productId}`}
                      className="flex items-center cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      <Pencil className="w-4 h-4 mr-2" />
                      Edit
                    </Link>
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
            ) : (
              <div className="w-2" />
            )}
          </div>

          {product.price && (
            <p className="font-bold text-base mt-auto pt-2">
              {symbol}
              {product.price}
            </p>
          )}
        </div>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
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
