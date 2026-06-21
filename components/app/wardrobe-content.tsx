"use client";

import { useState, useEffect } from "react";
import { getWardrobeById } from "@/lib/firebase-actions";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Eye, Share2 } from "lucide-react";
import { toast } from "sonner";
import { WardrobeData } from "@/lib/typings";
import BackButton from "@/components/app/back-button";
import Link from "next/link";

export default function WardrobeContent({
  wardrobeId,
}: {
  wardrobeId: string;
}) {
  const [wardrobe, setWardrobe] = useState<WardrobeData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadWardrobe = async () => {
      const result = await getWardrobeById(wardrobeId);
      if (result.success) {
        setWardrobe(result.wardrobe!);
      }
      setLoading(false);
    };

    loadWardrobe();
  }, [wardrobeId]);

  const handleShare = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: wardrobe?.title,
        text: wardrobe?.description,
        url: url,
      });
    } else {
      navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard");
    }
  };

  if (loading) {
    return (
      <div className="min-h-[90vh] lg:min-h-[80vh] flex items-center justify-center py-12">
        <Spinner />
      </div>
    );
  }

  if (!wardrobe) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">Wardrobe not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl lg:mx-auto mx-5 pt-6 pb-20 lg:pb-10 lg:pt-10">
      <BackButton />
      {/* Header */}
      <Card className="lg:px-8 mb-8 px-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-3xl font-semibold text-foreground">
              {wardrobe.title}
            </h1>
            <p className="text-muted-foreground hover:text-foreground mt-2">
              By{" "}
              <Link href={`/user/${wardrobe.username}`}>
                {wardrobe.username}
              </Link>
            </p>
            {wardrobe.description && (
              <p className="text-foreground mt-4">{wardrobe.description}</p>
            )}
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2 justify-end text-muted-foreground mb-4">
              <Eye className="w-5 h-5" />
              <span className="text-lg font-semibold">{wardrobe.views}</span>
            </div>
            <Button
              onClick={handleShare}
              className="bg-primary hover:bg-primary/90"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
      </Card>

      {/* Items Grid */}
      {wardrobe.products.length > 0 ? (
        <div>
          <h2 className="text-2xl font-semibold mb-6">
            Items ({wardrobe.products.length})
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {wardrobe.products.map((item) => (
              <a
                key={item.id}
                href={item.productUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group"
              >
                <Card className="h-full overflow-hidden py-0">
                  <div className="relative w-full aspect-square bg-muted overflow-hidden">
                    <img
                      src={
                        item.productImage ||
                        "/placeholder.svg?height=400&width=400"
                      }
                      alt={item.productName}
                      className="object-cover group-hover:scale-105 transition-transform w-full"
                    />
                  </div>
                  <div className="px-4 pb-5">
                    <p className="font-medium text-sm text-foreground group-hover:text-blue-600 line-clamp-2">
                      {item.productName}
                    </p>
                  </div>
                </Card>
              </a>
            ))}
          </div>
        </div>
      ) : (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground text-lg">
            No items in this wardrobe
          </p>
        </Card>
      )}
    </div>
  );
}
