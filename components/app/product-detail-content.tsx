"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { getProductById } from "@/lib/firebase-actions";
import { ShopProduct } from "@/lib/typings";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { ExternalLink, Pencil, Share2 } from "lucide-react";
import Link from "next/link";
import BackButton from "./back-button";
import { toast } from "sonner";

const CURRENCY_SYMBOL: Record<string, string> = {
  INR: "₹",
  USD: "$",
  EUR: "€",
  GBP: "£",
};

export default function ProductDetailContent({
  productId,
}: {
  productId: string;
}) {
  const { user } = useAuth();
  const [product, setProduct] = useState<ShopProduct | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProductById(productId).then((r) => {
      if (r.success) setProduct(r.product!);
      setLoading(false);
    });
  }, [productId]);

  const handleShare = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: "Check out this product",
        text: `Buy ${product?.title}`,
        url,
      });
    } else {
      navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard");
    }
  };

  if (loading) {
    return (
      <div className="min-h-[90vh] flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">Product not found</p>
      </div>
    );
  }

  const symbol = product.currency
    ? (CURRENCY_SYMBOL[product.currency] ?? product.currency + " ")
    : "";
  const isOwner = user?.uid === product.userId;

  return (
    <div className="max-w-4xl lg:mx-auto mx-5 pt-6 pb-30 lg:pb-10 lg:pt-10">
      <BackButton />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Image */}
        <div className="aspect-square bg-muted rounded-2xl overflow-hidden">
          <img
            src={product.image || "/placeholder.svg?height=400&width=400"}
            alt={product.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Info */}
        <div className="flex flex-col gap-4">
          <div className="flex items-start justify-between gap-2">
            <div>
              {product.platform && (
                <span className="text-xs font-semibold px-2 py-0.5 bg-primary/10 text-primary rounded-full capitalize">
                  {product.platform}
                </span>
              )}
              <h1 className="text-2xl font-medium text-foreground mt-2">
                {product.title}
              </h1>
            </div>
            {isOwner && (
              <Link href={`/edit-product/${product.productId}`}>
                <Button variant="outline" size="icon">
                  <Pencil className="w-4 h-4" />
                </Button>
              </Link>
            )}
          </div>

          {product.price && (
            <p className="text-3xl font-semibold">
              {symbol}
              {product.price}
            </p>
          )}

          <Card className="p-4 flex flex-row items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden shrink-0">
              <img
                src={product.userAvatar}
                alt={product.username}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Added by</p>
              <Link
                href={`/user/${product.username}`}
                className="font-semibold text-sm hover:underline"
              >
                {product.username}
              </Link>
            </div>
          </Card>

          <div className="w-full flex flex-col lg:flex-row gap-2">
            <a
              href={product.affiliateUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1"
            >
              <Button size="default" className="flex-1 w-full">
                <ExternalLink className="w-4 h-4 mr-2" />
                Shop Now
              </Button>
            </a>

            <Button
              size="default"
              onClick={handleShare}
              variant="outline"
              className="flex-1"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>

          <p className="text-xs text-muted-foreground">
            Added {product.createdAt.toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
}
