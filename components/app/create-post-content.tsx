"use client";

export const dynamic = "force-dynamic";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { createPost, getUserProfile } from "@/lib/firebase-actions";
import { X, Plus } from "lucide-react";
import { toast } from "sonner";
import { Product } from "@/lib/typings";
import BackButton from "./back-button";

export default function CreatePostComponent() {
  const { user } = useAuth();
  const router = useRouter();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [caption, setCaption] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [newProduct, setNewProduct] = useState({
    productName: "",
    productUrl: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);

    const img = new window.Image();
    img.onload = () => {
      const ratio = img.width / img.height;

      if (Math.abs(ratio - 9 / 16) > 0.05) {
        toast.error("Image should be in 9:16 aspect ratio");
        URL.revokeObjectURL(previewUrl);
        e.target.value = ""; // Reset input so the same file can be re-selected
        setImageFile(null); // Clear stale state
        setImagePreview(""); // Clear stale preview
        return;
      }

      setImageFile(file);
      setImagePreview(previewUrl);
    };

    img.onerror = () => {
      toast.error("Failed to load image");
      URL.revokeObjectURL(previewUrl);
      e.target.value = "";
      setImageFile(null);
      setImagePreview("");
    };

    img.src = previewUrl;
  };

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
      productImage: "", // Will be scraped
    };

    setProducts([...products, product]);
    setNewProduct({ productName: "", productUrl: "" });
    toast.success("Product added");
  };

  const handleRemoveProduct = (id: string) => {
    setProducts(products.filter((product) => product.id !== id));
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!imageFile) {
      toast.error("Please select an image");
      return;
    }

    setLoading(true);
    try {
      const profile = await getUserProfile(user!.uid);
      if (!profile.success) {
        toast.error("Failed to load user profile");
        setLoading(false);
        return;
      }

      const result = await createPost(
        user!.uid,
        profile.profile?.username!,
        profile.profile?.avatar!,
        imageFile,
        products,
        caption,
        tags,
      );

      if (result.success) {
        toast.success("Post created successfully!");
        router.push("/discover");
      } else {
        toast.error(result.error || "Failed to create post");
      }
    } catch (error) {
      toast.error("An error occurred");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl lg:mx-auto mx-5 pt-6 pb-30 lg:pt-10">
      <BackButton />
      <h1 className="text-3xl font-semibold mb-8">Create a Post</h1>

      <form onSubmit={handleCreatePost}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Image Upload */}
          <div className="lg:col-span-1">
            <Card className="p-6">
              <label className="block mb-4">
                <span className="block text-sm font-medium text-foreground mb-2">
                  Post Image (9:16)
                </span>
                <div className="flex flex-col items-center justify-center border-2 border-dashed border-border aspect-9/16 rounded-lg cursor-pointer hover:border-primary transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="image-input"
                  />
                  <label
                    htmlFor="image-input"
                    className="cursor-pointer text-center"
                  >
                    {imagePreview ? (
                      <div className="relative w-full bg-muted rounded-lg overflow-hidden">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                    ) : (
                      <div className="text-center">
                        <p className="text-muted-foreground text-sm">
                          Click to upload image
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          9:16 aspect ratio
                        </p>
                      </div>
                    )}
                  </label>
                </div>
              </label>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Caption
                </label>
                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Add a caption..."
                  className="w-full p-3 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground text-sm resize-none h-20"
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
                />
              </div>
            </Card>
          </div>

          {/* Tags Section */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-6">Add Products (Max 10)</h2>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Product Name
                  </label>
                  <Input
                    placeholder="e.g., Blue Jeans"
                    value={newProduct.productName}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        productName: e.target.value,
                      })
                    }
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
                      setNewProduct({
                        ...newProduct,
                        productUrl: e.target.value,
                      })
                    }
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
                    />
                  </div>
                </div> */}

                <Button
                  type="button"
                  onClick={handleAddProduct}
                  className="w-full bg-primary hover:bg-primary/90"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Product
                </Button>
              </div>

              {/* Tags List */}
              <div className="space-y-2">
                {products.length === 0 ? (
                  <p className="text-muted-foreground text-sm">
                    No products added yet
                  </p>
                ) : (
                  <>
                    <h3 className="font-semibold text-sm mb-3">
                      Added Products ({products.length}/10)
                    </h3>
                    {products.map((product) => (
                      <div
                        key={product.id}
                        className="flex items-center justify-between p-3 bg-muted rounded-lg"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm">
                            {product.productName}
                          </p>
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
                          className="ml-2 p-1 hover:bg-background rounded cursor-pointer transition-colors"
                        >
                          <X className="w-4 h-4 text-destructive" />
                        </button>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </Card>
          </div>
        </div>

        <div className="mt-8 flex gap-4">
          <Button
            type="button"
            onClick={() => router.back()}
            variant="outline"
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading || !imageFile}
            className="flex-1 bg-primary hover:bg-primary/90"
          >
            {loading ? "Creating..." : "Create Post"}
          </Button>
        </div>
      </form>
    </div>
  );
}
