"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { createProduct, getUserProfile } from "@/lib/firebase-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import BackButton from "./back-button";
import { Search, ShoppingBag } from "lucide-react";

const PLACEHOLDER = "/placeholder.svg?height=300&width=300";
const CURRENCY_SYMBOL: Record<string, string> = {
  INR: "₹",
  USD: "$",
  EUR: "€",
  GBP: "£",
};

interface Scraped {
  title: string;
  image: string;
  price: string;
  currency: string;
  platform: string;
}

export default function AddProductContent() {
  const { user } = useAuth();
  const router = useRouter();
  const [affiliateUrl, setAffiliateUrl] = useState("");
  const [url, setUrl] = useState("");
  const [fetching, setFetching] = useState(false);
  const [saving, setSaving] = useState(false);
  const [scraped, setScraped] = useState<Scraped | null>(null);
  const [title, setTitle] = useState("");

  const handleFetch = async () => {
    if (!url.trim()) {
      toast.error("Please enter a product URL");
      return;
    }
    setFetching(true);
    setScraped(null);
    try {
      const scraperUrl = new URL("/api/image", window.location.origin);
      scraperUrl.searchParams.set("q", url.trim());
      const res = await fetch(scraperUrl.toString());
      const result = await res.json();

      if (result.success) {
        const data = result.data || result;
        const s: Scraped = {
          title: data.product_title || "",
          image: data.image_url || PLACEHOLDER,
          price: data.price || "",
          currency: data.currency || "",
          platform: data.platform || "",
        };
        setScraped(s);
        setTitle(s.title);
      } else {
        toast.error("Could not fetch product. Try a different URL.");
      }
    } catch {
      toast.error("Failed to reach the scraper");
    } finally {
      setFetching(false);
    }
  };

  const handleSave = async () => {
    if (!scraped || !user || !title.trim()) return;
    setSaving(true);
    try {
      const profileResult = await getUserProfile(user.uid);
      if (!profileResult.success) {
        toast.error("Failed to load profile");
        return;
      }

      const result = await createProduct(
        user.uid,
        profileResult.profile!.username,
        profileResult.profile!.avatar,
        affiliateUrl.trim(),
        url.trim(),
        { ...scraped, title: title.trim() },
      );

      if (result.success) {
        toast.success("Product added!");
        router.push("/products");
      } else {
        toast.error(result.error || "Failed to add product");
      }
    } catch {
      toast.error("An error occurred");
    } finally {
      setSaving(false);
    }
  };

  const symbol = scraped?.currency
    ? (CURRENCY_SYMBOL[scraped.currency] ?? scraped.currency + " ")
    : "";

  return (
    <div className="max-w-xl lg:mx-auto mx-5 pt-6 pb-30 lg:pt-10">
      <BackButton />
      <h1 className="text-3xl font-semibold mb-8">Add Product</h1>

      <Card className="p-6 space-y-5">
        {/* URL input */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Affiliate Product URL
          </label>
          <div className="flex gap-2">
            <Input
              placeholder="https://amzn.com/..."
              value={affiliateUrl}
              onChange={(e) => setAffiliateUrl(e.target.value)}
              disabled={fetching || saving}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1.5">
            Paste your affiliate link above.
          </p>
        </div>

        {/* URL input */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Product URL
          </label>
          <div className="flex gap-2">
            <Input
              placeholder="https://amazon.com/... or any product link"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={fetching || saving}
              onKeyDown={(e) => e.key === "Enter" && handleFetch()}
            />
            <Button
              onClick={handleFetch}
              disabled={fetching || !url || saving}
              className="shrink-0"
            >
              {fetching ? (
                <Spinner className="w-4 h-4" />
              ) : (
                <Search className="w-4 h-4" />
              )}
              {fetching ? "" : "Fetch"}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-1.5">
            Paste your product link. Title, Image and Price are auto-fetched
          </p>
        </div>

        {fetching && (
          <div className="flex items-center justify-center py-10">
            <Spinner />
          </div>
        )}

        {scraped && !fetching && (
          <>
            {/* Preview */}
            <div className="border border-border rounded-xl overflow-hidden">
              <div className="aspect-square w-48 mx-auto bg-muted">
                <img
                  src={scraped.image}
                  alt={scraped.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="px-4 py-3 flex items-center gap-3">
                {scraped.platform && (
                  <span className="text-xs font-semibold px-2 py-0.5 bg-primary/10 text-primary rounded-full capitalize">
                    {scraped.platform}
                  </span>
                )}
                {scraped.price && (
                  <span className="font-bold text-lg">
                    {symbol}
                    {scraped.price}
                  </span>
                )}
              </div>
            </div>

            {/* Editable title */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Product Title
              </label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Edit product title if needed"
                disabled={saving}
              />
            </div>

            <Button
              onClick={handleSave}
              disabled={saving || !title.trim()}
              className="w-full"
            >
              <ShoppingBag className="w-4 h-4 mr-2" />
              {saving ? "Adding..." : "Add Product"}
            </Button>
          </>
        )}
      </Card>
    </div>
  );
}
