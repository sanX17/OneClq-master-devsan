"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getWardrobes } from "@/lib/firebase-actions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { Eye, Plus } from "lucide-react";
import { WardrobeData } from "@/lib/typings";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import WardrobeCard from "./wardrobe-card";

export default function WardrobesContent() {
  const { user } = useAuth();
  const router = useRouter();
  const [wardrobes, setWardrobes] = useState<WardrobeData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadWardrobes = async () => {
      const result = await getWardrobes();
      if (result.success) {
        setWardrobes(result.wardrobes);
      }
      setLoading(false);
    };

    loadWardrobes();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[90vh] lg:min-h-[80vh] flex items-center justify-center py-12">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-start min-h-[90vh] lg:min-h-[80vh] max-w-6xl lg:mx-auto mx-5 pb-30 lg:pb-10 pt-4">
      <div className="flex flex-col lg:flex-row h-full items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-semibold">Wardrobes</h1>
          <p className="text-muted-foreground mt-2">
            Explore fashion collections from creators
          </p>
        </div>
        <Link href="/create-wardrobe" className="mt-4 lg:mt-0 w-full lg:w-auto">
          <Button className="bg-primary hover:bg-primary/90 w-full lg:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            Create Wardrobe
          </Button>
        </Link>
      </div>

      {wardrobes.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground text-lg mb-4">No wardrobes yet</p>
          <Link href="/create-wardrobe">
            <Button className="bg-primary hover:bg-primary/90">
              Create Your First Wardrobe
            </Button>
          </Link>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {wardrobes.map((wardrobe) => {
            const isOwner = user?.uid === wardrobe?.userId;

            return (
              <WardrobeCard
                key={wardrobe.wardrobeId}
                wardrobe={wardrobe}
                isOwner={isOwner}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
