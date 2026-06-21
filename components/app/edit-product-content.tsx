"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import {
  getProductById,
  updateProduct,
  deleteProduct,
} from "@/lib/firebase-actions";
import { ShopProduct } from "@/lib/typings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import BackButton from "./back-button";
import { RefreshCw, Trash2 } from "lucide-react";
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

const PLACEHOLDER = "/placeholder.svg?height=300&width=300";
const CURRENCY_SYMBOL: Record<string, string> = {
  INR: "₹",
  USD: "$",
  EUR: "€",
  GBP: "£",
};

export default function EditProductContent({
  productId,
}: {
  productId: string;
}) {
  const { user } = useAuth();
  const router = useRouter();
  const [product, setProduct] = useState<ShopProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [affiliateUrl, setAffiliateUrl] = useState("");
  const [previewImage, setPreviewImage] = useState("");
  const [previewPrice, setPreviewPrice] = useState("");
  const [previewCurrency, setPreviewCurrency] = useState("");
  const [previewPlatform, setPreviewPlatform] = useState("");
  const [refetching, setRefetching] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    getProductById(productId).then((r) => {
      if (r.success && r.product) {
        const p = r.product;
        if (p.userId !== user?.uid) {
          toast.error("You don't have permission to edit this product");
          router.push("/profile");
          return;
        }
        setProduct(p);
        setTitle(p.title);
        setAffiliateUrl(p.affiliateUrl);
        setPreviewImage(p.image);
        setPreviewPrice(p.price || "");
        setPreviewCurrency(p.currency || "");
        setPreviewPlatform(p.platform || "");
      } else {
        toast.error("Product not found");
        router.push("/profile");
      }
      setLoading(false);
    });
  }, [productId, user]);

  const handleRefetch = async () => {
    if (!affiliateUrl.trim()) return;
    setRefetching(true);
    try {
      const scraperUrl = new URL("/api/image", window.location.origin);
      scraperUrl.searchParams.set("q", affiliateUrl.trim());
      const res = await fetch(scraperUrl.toString());
      const result = await res.json();
      if (result.success) {
        const data = result.data || result;
        if (data.image_url) setPreviewImage(data.image_url);
        if (data.product_title && !title) setTitle(data.product_title);
        if (data.price) setPreviewPrice(data.price);
        if (data.currency) setPreviewCurrency(data.currency);
        if (data.platform) setPreviewPlatform(data.platform);
        toast.success("Product details refreshed");
      } else {
        toast.error("Could not refetch details");
      }
    } catch {
      toast.error("Refetch failed");
    } finally {
      setRefetching(false);
    }
  };

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }
    setSaving(true);
    try {
      const result = await updateProduct(productId, {
        title: title.trim(),
        affiliateUrl: affiliateUrl.trim(),
        image: previewImage,
        price: previewPrice,
        currency: previewCurrency,
        platform: previewPlatform,
      });
      if (result.success) {
        toast.success("Product updated");
        router.push(`/product/${productId}`);
      } else {
        toast.error(result.error || "Failed to update");
      }
    } catch {
      toast.error("An error occurred");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const result = await deleteProduct(productId);
      if (result.success) {
        toast.success("Product deleted");
        router.push("/profile");
      } else {
        toast.error(result.error || "Failed to delete");
      }
    } catch {
      toast.error("An error occurred");
    } finally {
      setDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-[90vh] flex items-center justify-center">
        <Spinner />
      </div>
    );
  if (!product) return null;

  const symbol = previewCurrency
    ? (CURRENCY_SYMBOL[previewCurrency] ?? previewCurrency + " ")
    : "";

  return (
    <>
      <div className="max-w-xl lg:mx-auto mx-5 pt-6 pb-30 lg:pt-10">
        <BackButton />
        <h1 className="text-3xl font-semibold mb-8">Edit Product</h1>

        <Card className="p-6 space-y-5">
          {/* Preview image */}
          <div className="aspect-square w-40 mx-auto bg-muted rounded-xl overflow-hidden">
            <img
              src={previewImage || PLACEHOLDER}
              alt={title}
              className="w-full h-full object-cover"
            />
          </div>
          {previewPrice && (
            <p className="text-center font-bold text-xl">
              {symbol}
              {previewPrice}
            </p>
          )}

          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Product Title
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={saving}
            />
          </div>

          {/* URL + refetch */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Affiliate URL
            </label>
            <div className="flex gap-2">
              <Input
                value={affiliateUrl}
                onChange={(e) => setAffiliateUrl(e.target.value)}
                disabled={saving || refetching}
              />
              <Button
                variant="outline"
                onClick={handleRefetch}
                disabled={refetching || saving}
                className="shrink-0"
              >
                <RefreshCw
                  className={`w-4 h-4 ${refetching ? "animate-spin" : ""}`}
                />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Click refresh to re-fetch title, image and price
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              onClick={handleSave}
              disabled={saving || !title.trim()}
              className="flex-1 bg-primary hover:bg-primary/90"
            >
              {saving ? "Saving..." : "Save Changes"}
            </Button>
            <Button
              variant="destructive"
              onClick={() => setShowDeleteDialog(true)}
              disabled={saving}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </Card>
      </div>

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
