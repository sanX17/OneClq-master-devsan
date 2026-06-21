"use client";

export const dynamic = "force-dynamic";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { createWardrobe, getUserProfile } from "@/lib/firebase-actions";
import { X, Plus } from "lucide-react";
import { toast } from "sonner";
import { Product } from "@/lib/typings";
import BackButton from "./back-button";

export default function CreateWardrobeContent() {
  const { user } = useAuth();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [newItem, setNewItem] = useState({ productName: "", productUrl: "" });
  const [loading, setLoading] = useState(false);

  const handleAddItem = () => {
    if (!newItem.productName || !newItem.productUrl) {
      toast.error("Please fill in product name and URL");
      return;
    }

    if (products.length >= 10) {
      toast.error("Maximum 10 items allowed");
      return;
    }

    const product: Product = {
      id: Date.now().toString(),
      productName: newItem.productName,
      productUrl: newItem.productUrl,
      productImage: "", // Will be scraped
    };

    setProducts([...products, product]);
    setNewItem({ productName: "", productUrl: "" });
    toast.success("Product added");
  };

  const handleRemoveItem = (id: string) => {
    setProducts(products.filter((product) => product.id !== id));
  };

  const handleCreateWardrobe = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title) {
      toast.error("Please enter a title");
      return;
    }

    if (products.length === 0) {
      toast.error("Please add at least one item");
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

      const result = await createWardrobe(
        user!.uid,
        profile.profile?.username!,
        profile.profile?.avatar!,
        title,
        products,
        description,
      );

      if (result.success) {
        toast.success("Wardrobe created successfully!");
        router.push(`/wardrobe/${result.wardrobeId}`);
      } else {
        toast.error(result.error || "Failed to create wardrobe");
      }
    } catch (error) {
      toast.error("An error occurred");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl lg:mx-auto mx-5 pt-6 pb-30 lg:pt-10">
      <BackButton />
      <h1 className="text-3xl font-semibold mb-8">Create a Wardrobe</h1>

      <form onSubmit={handleCreateWardrobe}>
        <div className="space-y-6">
          {/* Basic Info */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6">Wardrobe Details</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Title
                </label>
                <Input
                  placeholder="e.g., Summer Essentials"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={loading}
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
                  className="w-full p-3 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground text-sm resize-none h-20"
                  disabled={loading}
                />
              </div>
            </div>
          </Card>

          {/* Add Items */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6">Add Items (Max 10)</h2>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Product Name
                </label>
                <Input
                  placeholder="e.g., White T-Shirt"
                  value={newItem.productName}
                  onChange={(e) =>
                    setNewItem({ ...newItem, productName: e.target.value })
                  }
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Product URL
                </label>
                <Input
                  placeholder="https://..."
                  value={newItem.productUrl}
                  onChange={(e) =>
                    setNewItem({ ...newItem, productUrl: e.target.value })
                  }
                  disabled={loading}
                />
              </div>

              <Button
                type="button"
                onClick={handleAddItem}
                disabled={loading}
                className="w-full bg-primary hover:bg-primary/90"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Item
              </Button>
            </div>

            {/* Items List */}
            <div className="space-y-2">
              {products.length === 0 ? (
                <p className="text-muted-foreground text-sm">
                  No items added yet
                </p>
              ) : (
                <>
                  <h3 className="font-semibold text-sm mb-3">
                    Added Items ({products.length}/10)
                  </h3>
                  {products.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3 bg-muted rounded-lg"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">
                          {item.productName}
                        </p>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {item.productUrl}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(item.id)}
                        disabled={loading}
                        className="ml-2 p-1 hover:bg-background rounded transition-colors"
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

        <div className="mt-8 flex gap-4">
          <Button
            type="button"
            onClick={() => router.back()}
            variant="outline"
            className="flex-1"
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading || !title || products.length === 0}
            className="flex-1 bg-primary hover:bg-primary/90"
          >
            {loading ? "Creating..." : "Create Wardrobe"}
          </Button>
        </div>
      </form>
    </div>
  );
}
