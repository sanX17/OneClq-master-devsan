"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  getWardrobeById,
  updateWardrobe,
  deleteWardrobe,
  deleteProduct,
} from "@/lib/firebase-actions";
import { X, Plus, ArrowLeft, Trash2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth-context";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Product } from "@/lib/typings";
import { Spinner } from "@/components/ui/spinner";

export default function EditWardrobePage() {
  const { user } = useAuth();
  const params = useParams();
  const wardrobeId = params.id as string;
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [newProduct, setNewProduct] = useState({
    productName: "",
    productUrl: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [productDeleting, setProductDeleting] = useState(false);

  useEffect(() => {
    if (!user) return;

    const loadWardrobe = async () => {
      const result = await getWardrobeById(wardrobeId);

      if (user.uid !== result.wardrobe?.userId) {
        toast.error("You don't have permission to edit this wardrobe");
        router.push(`/wardrobe/${wardrobeId}`);
        return;
      }

      if (result.success) {
        setTitle(result.wardrobe?.title || "");
        setDescription(result.wardrobe?.description || "");
        setProducts(result.wardrobe?.products || []);
      }
      setLoading(false);
    };

    loadWardrobe();
  }, [wardrobeId]);

  const handleAddItem = () => {
    if (!newProduct.productName || !newProduct.productUrl) {
      toast.error("Please fill in product name and URL");
      return;
    }

    if (products.length >= 10) {
      toast.error("Maximum 10 products allowed");
      return;
    }

    const item: Product = {
      id: Date.now().toString(),
      productName: newProduct.productName,
      productUrl: newProduct.productUrl,
      productImage: "",
    };

    setProducts([...products, item]);
    setNewProduct({ productName: "", productUrl: "" });
    toast.success("Product added");
  };

  const handleRemoveItem = async (id: string) => {
    setProductDeleting(true);
    try {
      const result = await deleteProduct(id);
      if (result.success) {
        toast.success("Product deleted");
        setProducts(products.filter((item) => item.id !== id));
      } else {
        toast.error(result.error || "Failed to delete product");
      }
    } catch {
      toast.error("An error occurred");
    } finally {
      setProductDeleting(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title) {
      toast.error("Please enter a title");
      return;
    }

    if (products.length === 0) {
      toast.error("Please add at least one product");
      return;
    }

    setSaving(true);
    try {
      const result = await updateWardrobe(
        wardrobeId,
        title,
        products,
        description,
      );
      if (result.success) {
        toast.success("Wardrobe updated successfully");
        router.push(`/wardrobe/${wardrobeId}`);
      } else {
        toast.error(result.error || "Failed to update wardrobe");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const result = await deleteWardrobe(wardrobeId);
      if (result.success) {
        toast.success("Wardrobe deleted");
        router.push("/profile");
      } else {
        toast.error(result.error || "Failed to delete wardrobe");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[90vh] lg:min-h-[80vh] flex items-center justify-center py-12">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="max-w-4xl lg:mx-auto mx-5 lg:py-10 py-5">
      <Link
        href="/profile"
        className="flex items-center gap-2 text-primary hover:underline mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Profile
      </Link>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Basic Info */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold lg:mb-6">Wardrobe Details</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Title
              </label>
              <Input
                placeholder="e.g., Summer Essentials"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={saving || deleting}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Description (Optional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your wardrobe..."
                disabled={saving || deleting}
                className="w-full p-3 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground text-sm resize-none h-20"
              />
            </div>
          </div>
        </Card>

        {/* Add Items */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold lg:mb-6">
            Items ({products.length}/10)
          </h2>

          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Product Name
              </label>
              <Input
                placeholder="e.g., White T-Shirt"
                value={newProduct.productName}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, productName: e.target.value })
                }
                disabled={saving || deleting}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Product URL
              </label>
              <Input
                placeholder="https://..."
                value={newProduct.productUrl}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, productUrl: e.target.value })
                }
                disabled={saving || deleting}
              />
            </div>

            <Button
              type="button"
              onClick={handleAddItem}
              disabled={saving || deleting}
              className="w-full bg-primary hover:bg-primary/90"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Item
            </Button>
          </div>

          {/* Items List */}
          <div className="space-y-2">
            {products.length === 0 ? (
              <p className="text-muted-foreground text-sm">No items added</p>
            ) : (
              <>
                {products.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 bg-muted rounded-lg"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{item.productName}</p>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {item.productUrl}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(item.id)}
                      disabled={saving || deleting || productDeleting}
                      className="ml-2 p-1 hover:bg-background rounded transition-colors cursor-pointer"
                    >
                      <X className="w-4 h-4 text-destructive" />
                    </button>
                  </div>
                ))}
              </>
            )}
          </div>
        </Card>

        <div className="flex gap-4">
          <Link href="/profile" className="flex-1">
            <Button
              variant="outline"
              className="w-full"
              disabled={saving || deleting}
            >
              Cancel
            </Button>
          </Link>
          <Button
            type="submit"
            disabled={saving || deleting || !title || products.length === 0}
            className="flex-1 bg-primary hover:bg-primary/90"
          >
            {saving ? "Saving..." : "Save Changes"}
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                type="button"
                disabled={saving || deleting}
                variant="destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </AlertDialogTrigger>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Wardrobe?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  your wardrobe and all its items.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel disabled={deleting}>
                  Cancel
                </AlertDialogCancel>
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
        </div>
      </form>
    </div>
  );
}
