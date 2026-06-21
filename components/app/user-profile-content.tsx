"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { getPublicUserProfile, logoutUser } from "@/lib/firebase-actions";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import Link from "next/link";
import { Post, ShopProduct, WardrobeData } from "@/lib/typings";
import PostCard from "@/components/app/post-card";
import BackButton from "./back-button";
import { toast } from "sonner";
import { Edit2, LogOut, Settings, Share2, ShoppingBag } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useRouter } from "next/navigation";
import WardrobeCard from "./wardrobe-card";
import ProductCard from "./product-card";

interface Props {
  username: string;
}

export default function UserProfileContent({ username }: Props) {
  const { user } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [wardrobes, setWardrobes] = useState<WardrobeData[]>([]);
  const [shopProducts, setShopProducts] = useState<ShopProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "posts" | "wardrobes" | "products"
  >("products");
  const [isOwnProfile, setIsOwnProfile] = useState(false);

  useEffect(() => {
    const load = async () => {
      const result = await getPublicUserProfile(username);
      if (result.success) {
        setProfile(result.profile);
        setPosts(result.posts ?? []);
        setWardrobes(result.wardrobes ?? []);
        setShopProducts(result.products ?? []);
        setIsOwnProfile(user?.uid === result.profile?.uid);
      }
      setLoading(false);
    };
    load();
  }, [username, user]);

  const handleShare = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: `Check out ${username}'s profile`,
        text: profile?.bio,
        url,
      });
    } else {
      navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard");
    }
  };

  const handleLogout = async () => {
    const result = await logoutUser();
    if (result.success) {
      toast.success("Logged out successfully");
      router.push("/login");
    } else {
      toast.error(result.error || "Logout failed");
    }
  };

  if (loading) {
    return (
      <div className="min-h-[90vh] lg:min-h-[80vh] flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[90vh] lg:min-h-[80vh] text-center py-12">
        <p className="text-muted-foreground text-lg">User not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl lg:mx-auto pt-6 pb-30 lg:pb-10 lg:pt-10 mx-5">
      <BackButton />
      {/* Profile Header */}
      <Card className="border-none pt-0">
        <div className="flex items-start md:items-center gap-4 mb-2">
          <div className="relative w-20 h-20 rounded-full overflow-hidden shrink-0">
            <img
              src={profile.avatar}
              alt={profile.username}
              className="object-cover w-full h-full"
            />
          </div>

          <div className="flex-1">
            {/* Name + Share icon on same row */}
            <div className="flex flex-col items-start justify-between gap-1">
              <h1 className="text-xl lg:text-2xl font-bold text-foreground">
                {profile.username}
              </h1>

              {profile.bio && (
                <p className="text-foreground/60 text-sm lg:text-base font-medium max-w-xl">
                  {profile.bio}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-start items-center gap-2 w-full lg:w-xl">
          <Button
            onClick={handleShare}
            variant="outline"
            size="default"
            className="shrink-0 text-foreground flex-1"
          >
            <Share2 className="w-5 h-5" />
            Share
          </Button>

          {!isOwnProfile && <div className="flex-1" />}

          {isOwnProfile && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="default"
                  className="shrink-0 text-foreground flex-1"
                >
                  <Settings className="w-5 h-5" />
                  Settings
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuItem asChild>
                  <Link
                    href="/edit-profile"
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-destructive focus:text-destructive cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </Card>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-border mb-6">
        {(["posts", "wardrobes", "products"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-3 cursor-pointer font-medium border-b-2 transition-colors capitalize ${
              activeTab === tab
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab === "posts" && "Posts"}
            {tab === "wardrobes" && "Wardrobes"}
            {tab === "products" && "Products"}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === "posts" ? (
        <div>
          {posts.length === 0 ? (
            <Card className="p-12 text-center border-none">
              <p className="text-muted-foreground text-lg mb-4">No posts yet</p>
            </Card>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} isOwner={true} />
              ))}
            </div>
          )}
        </div>
      ) : activeTab === "wardrobes" ? (
        <div>
          {wardrobes.length === 0 ? (
            <Card className="p-12 text-center border-none">
              <p className="text-muted-foreground text-lg mb-4">
                No wardrobes yet
              </p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {wardrobes.map((wardrobe) => (
                <WardrobeCard
                  key={wardrobe.wardrobeId}
                  wardrobe={wardrobe}
                  isOwner={isOwnProfile}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div>
          {shopProducts.length === 0 ? (
            <Card className="p-12 text-center border-none">
              <ShoppingBag className="w-10 h-10 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground text-lg mb-4">
                No products yet
              </p>
            </Card>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {shopProducts.map((product) => (
                <ProductCard
                  key={product.productId}
                  product={product}
                  isOwner={isOwnProfile}
                  onDeleted={(id) =>
                    setShopProducts((prev) =>
                      prev.filter((p) => p.productId !== id),
                    )
                  }
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
