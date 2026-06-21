"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { deleteProduct, getPostById, updatePost } from "@/lib/firebase-actions";
import { X, Plus, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth-context";
import { Product } from "@/lib/typings";
import { Spinner } from "@/components/ui/spinner";

export default function EditPostPage() {
  const { user } = useAuth();
  const params = useParams();
  const postId = params.id as string;
  const router = useRouter();

  const [caption, setCaption] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [newProduct, setNewProduct] = useState({
    productName: "",
    productUrl: "",
  });
  const [productDeleting, setProductDeleting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;

    const loadPost = async () => {
      const result = await getPostById(postId);
      if (result.success) {
        // Guard: only the owner can edit
        if (result.post?.userId !== user.uid) {
          toast.error("You don't have permission to edit this post");
          router.push("/profile");
          return;
        }
        setCaption(result.post?.caption || "");
        setTags(result.post?.tags || []);
        setProducts(result.post?.products || []);
      } else {
        toast.error("Post not found");
        router.push("/profile");
      }
      setLoading(false);
    };

    loadPost();
  }, [postId, user]);

  const handleAddProduct = () => {
    if (!newProduct.productName || !newProduct.productUrl) {
      toast.error("Please fill in product name and URL");
      return;
    }
    if (products.length >= 10) {
      toast.error("Maximum 10 products allowed");
      return;
    }

    const product: Product = {
      id: Date.now().toString(),
      productName: newProduct.productName,
      productUrl: newProduct.productUrl,
      productImage: "",
    };

    setProducts([...products, product]);
    setNewProduct({ productName: "", productUrl: "" });
    toast.success("Product added");
  };

  const handleRemoveProduct = async (id: string) => {
    setProductDeleting(true);
    try {
      const result = await deleteProduct(id);
      if (result.success) {
        toast.success("Product deleted");
        setProducts(products.filter((p) => p.id !== id));
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

    setSaving(true);
    try {
      const result = await updatePost(postId, products, caption, tags);
      if (result.success) {
        toast.success("Post updated successfully");
        router.push(`/post/${postId}`);
      } else {
        toast.error(result.error || "Failed to update post");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setSaving(false);
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

      <h1 className="text-3xl font-semibold mb-8">Edit Post</h1>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Caption & Tags */}
        <Card className="p-6 space-y-4">
          <h2 className="text-xl font-semibold">Post Details</h2>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Caption
            </label>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Add a caption..."
              disabled={saving}
              className="w-full p-3 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground text-sm resize-none h-24"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Tags
            </label>
            <Input
              placeholder="e.g., BlueJeans, WhiteShirt, BlackShoes"
              value={tags.join(",")}
              onChange={(e) => setTags(e.target.value.split(","))}
              disabled={saving}
            />
          </div>
        </Card>

        {/* Products */}
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-6">
            Products ({products.length}/10)
          </h2>

          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Product Name
              </label>
              <Input
                placeholder="e.g., Blue Jeans"
                value={newProduct.productName}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, productName: e.target.value })
                }
                disabled={saving}
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
                disabled={saving}
              />
            </div>

            {/* <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  X Position (%)
                </label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={newProduct.x}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, x: e.target.value })
                  }
                  disabled={saving}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Y Position (%)
                </label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={newProduct.y}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, y: e.target.value })
                  }
                  disabled={saving}
                />
              </div>
            </div> */}

            <Button
              type="button"
              onClick={handleAddProduct}
              disabled={saving}
              className="w-full bg-primary hover:bg-primary/90"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          </div>

          <div className="space-y-2">
            {products.length === 0 ? (
              <p className="text-muted-foreground text-sm">No products added</p>
            ) : (
              products.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-3 bg-muted rounded-lg"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{product.productName}</p>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {product.productUrl}
                    </p>
                    {/* <p className="text-xs text-muted-foreground">
                      Position: {product.x}%, {product.y}%
                    </p> */}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveProduct(product.id)}
                    disabled={saving || productDeleting}
                    className="ml-2 p-1 hover:bg-background rounded transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4 text-destructive" />
                  </button>
                </div>
              ))
            )}
          </div>
        </Card>

        <div className="flex gap-4">
          <Link href="/profile" className="flex-1">
            <Button variant="outline" className="w-full" disabled={saving}>
              Cancel
            </Button>
          </Link>
          <Button
            type="submit"
            disabled={saving}
            className="flex-1 bg-primary hover:bg-primary/90"
          >
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  );
}
