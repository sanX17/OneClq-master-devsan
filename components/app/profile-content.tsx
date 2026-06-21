"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/lib/auth-context";
import {
  getUserProfile,
  getUserPosts,
  getUserWardrobes,
  logoutUser,
  getUserSavedPosts,
  getUserProducts,
  getUserSavedProducts,
  getUserSavedWardrobes,
} from "@/lib/firebase-actions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  LogOut,
  Edit2,
  Plus,
  Bookmark,
  Settings,
  Share2,
  ShoppingBag,
  Search,
} from "lucide-react";
import { toast } from "sonner";
import PostCard from "@/components/app/post-card";
import { Post, ShopProduct, UserProfile, WardrobeData } from "@/lib/typings";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ProductCard from "./product-card";
import WardrobeCard from "./wardrobe-card";
import { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";

const INITIAL_SHOW = 5;

// Section header with optional See All toggle
function SectionHeader({
  title,
  showAll,
  onToggle,
  hasMore,
}: {
  title: string;
  showAll: boolean;
  onToggle: () => void;
  hasMore: boolean;
}) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-lg font-semibold">{title}</h2>
      {hasMore && (
        <button
          onClick={onToggle}
          className="flex items-center gap-1 text-sm font-medium ml-2 text-blue-500 hover:underline cursor-pointer"
        >
          {showAll ? <>Show less</> : <>Show all</>}
        </button>
      )}
    </div>
  );
}

export default function ProfileContent() {
  const { user } = useAuth();
  const router = useRouter();

  // Main data
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [wardrobes, setWardrobes] = useState<WardrobeData[]>([]);
  const [shopProducts, setShopProducts] = useState<ShopProduct[]>([]);
  const [productTabSearch, setProductTabSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Saved data
  const [savedPosts, setSavedPosts] = useState<Post[]>([]);
  const [savedProducts, setSavedProducts] = useState<ShopProduct[]>([]);
  const [savedWardrobes, setSavedWardrobes] = useState<WardrobeData[]>([]);
  const [savedPostsCursor, setSavedPostsCursor] =
    useState<QueryDocumentSnapshot<DocumentData> | null>(null);

  const [savedProductsCursor, setSavedProductsCursor] =
    useState<QueryDocumentSnapshot<DocumentData> | null>(null);

  const [savedWardrobesCursor, setSavedWardrobesCursor] =
    useState<QueryDocumentSnapshot<DocumentData> | null>(null);

  const [hasMoreSavedPosts, setHasMoreSavedPosts] = useState(false);
  const [hasMoreSavedProducts, setHasMoreSavedProducts] = useState(false);
  const [hasMoreSavedWardrobes, setHasMoreSavedWardrobes] = useState(false);

  const [loadingMoreSavedPosts, setLoadingMoreSavedPosts] = useState(false);
  const [loadingMoreSavedProducts, setLoadingMoreSavedProducts] =
    useState(false);
  const [loadingMoreSavedWardrobes, setLoadingMoreSavedWardrobes] =
    useState(false);

  // UI state
  const [activeTab, setActiveTab] = useState<
    "posts" | "wardrobes" | "saved" | "products"
  >("posts");
  const [productSearch, setProductSearch] = useState("");
  const [showAllProducts, setShowAllProducts] = useState(false);
  const [showAllPosts, setShowAllPosts] = useState(false);
  const [showAllWardrobes, setShowAllWardrobes] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      if (!user) return;

      const [
        profileResult,
        postsResult,
        wardrobesResult,
        productsResult,
        savedPostsResult,
        savedProductsResult,
        savedWardrobesResult,
      ] = await Promise.all([
        getUserProfile(user.uid),
        getUserPosts(user.uid),
        getUserWardrobes(user.uid),
        getUserProducts(user.uid),
        getUserSavedPosts(user.uid, INITIAL_SHOW),
        getUserSavedProducts(user.uid, INITIAL_SHOW),
        getUserSavedWardrobes(user.uid, INITIAL_SHOW),
      ]);

      if (profileResult.success)
        setProfile(profileResult.profile as UserProfile);
      if (postsResult.success) setPosts(postsResult.posts);
      if (productsResult.success) setShopProducts(productsResult.products);
      if (wardrobesResult.success) setWardrobes(wardrobesResult.wardrobes);

      if (savedPostsResult.success) {
        setSavedPosts(savedPostsResult.posts);
        setSavedPostsCursor(savedPostsResult.lastDoc);
        setHasMoreSavedPosts(savedPostsResult.hasMore);
      }

      if (savedProductsResult.success) {
        setSavedProducts(savedProductsResult.products);
        setSavedProductsCursor(savedProductsResult.lastDoc);
        setHasMoreSavedProducts(savedProductsResult.hasMore);
      }

      if (savedWardrobesResult.success) {
        setSavedWardrobes(savedWardrobesResult.wardrobes);
        setSavedWardrobesCursor(savedWardrobesResult.lastDoc);
        setHasMoreSavedWardrobes(savedWardrobesResult.hasMore);
      }

      setLoading(false);
    };

    loadData();
  }, [user]);

  // Derived: filtered + sliced saved lists
  const filteredSavedProducts = useMemo(
    () =>
      savedProducts.filter((p) =>
        p.title.toLowerCase().includes(productSearch.toLowerCase()),
      ),
    [savedProducts, productSearch],
  );

  const displayedSavedProducts =
    productSearch || showAllProducts
      ? filteredSavedProducts
      : filteredSavedProducts.slice(0, INITIAL_SHOW);

  const displayedSavedPosts = showAllPosts
    ? savedPosts
    : savedPosts.slice(0, INITIAL_SHOW);

  const displayedSavedWardrobes = showAllWardrobes
    ? savedWardrobes
    : savedWardrobes.slice(0, INITIAL_SHOW);

  const filteredShopProducts = useMemo(
    () =>
      shopProducts.filter((p) =>
        p.title.toLowerCase().includes(productTabSearch.toLowerCase()),
      ),
    [shopProducts, productTabSearch],
  );

  // Handlers─
  const handleLogout = async () => {
    const result = await logoutUser();
    if (result.success) {
      toast.success("Logged out successfully");
      router.push("/login");
    } else {
      toast.error(result.error || "Logout failed");
    }
  };

  const handleShare = () => {
    const url = "/user/" + profile?.username;
    if (navigator.share) {
      navigator.share({
        title: "Check out my profile",
        text: profile?.bio,
        url,
      });
    } else {
      navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard");
    }
  };

  const handleSeeAllSavedPosts = async () => {
    if (!user || !savedPostsCursor) return;

    if (showAllPosts) {
      setShowAllPosts(false);
      return;
    }

    setShowAllPosts(true);

    if (!hasMoreSavedPosts) return;

    setLoadingMoreSavedPosts(true);

    const result = await getUserSavedPosts(user.uid, 100, savedPostsCursor);

    if (result.success) {
      setSavedPosts((prev) => [...prev, ...result.posts]);
      setSavedPostsCursor(result.lastDoc);
      setHasMoreSavedPosts(result.hasMore);
    }

    setLoadingMoreSavedPosts(false);
  };

  const handleSeeAllSavedProducts = async () => {
    if (!user || !savedProductsCursor) return;

    if (showAllProducts) {
      setShowAllProducts(false);
      return;
    }

    setShowAllProducts(true);

    if (!hasMoreSavedProducts) return;

    setLoadingMoreSavedProducts(true);

    const result = await getUserSavedProducts(
      user.uid,
      100,
      savedProductsCursor,
    );

    if (result.success) {
      setSavedProducts((prev) => [...prev, ...result.products]);
      setSavedProductsCursor(result.lastDoc);
      setHasMoreSavedProducts(result.hasMore);
    }

    setLoadingMoreSavedProducts(false);
  };

  const handleSeeAllSavedWardrobes = async () => {
    if (!user || !savedWardrobesCursor) return;

    if (showAllWardrobes) {
      setShowAllWardrobes(false);
      return;
    }

    setShowAllWardrobes(true);

    if (!hasMoreSavedWardrobes) return;

    setLoadingMoreSavedWardrobes(true);

    const result = await getUserSavedWardrobes(
      user.uid,
      100,
      savedWardrobesCursor,
    );

    if (result.success) {
      setSavedWardrobes((prev) => [...prev, ...result.wardrobes]);
      setSavedWardrobesCursor(result.lastDoc);
      setHasMoreSavedWardrobes(result.hasMore);
    }

    setLoadingMoreSavedWardrobes(false);
  };

  if (loading) {
    return (
      <div className="min-h-[90vh] lg:min-h-[80vh] flex items-center justify-center py-12">
        <Spinner />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[90vh] lg:min-h-[80vh] text-center py-12">
        <p className="text-muted-foreground text-lg">Profile not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl lg:mx-auto pt-6 pb-30 lg:pb-10 lg:pt-10 mx-5">
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
            <div className="flex flex-col items-start justify-between gap-1">
              <h1 className="text-xl lg:text-2xl font-bold text-foreground">
                {profile.username}
              </h1>
              <p className="text-foreground/60 text-sm lg:text-base font-medium max-w-xl">
                {profile.bio || "No bio"}
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-center items-center gap-2 w-full lg:w-xl">
          <Button
            onClick={handleShare}
            variant="outline"
            size="default"
            className="shrink-0 text-foreground flex-1 lg:min-w-40"
          >
            <Share2 className="w-5 h-5" />
            Share
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="default"
                className="shrink-0 text-foreground flex-1 lg:min-w-40"
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
        </div>
      </Card>

      {/* Tabs */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 border-b border-border">
        <div className="flex gap-10 lg:gap-4 overflow-x-auto scrollbar whitespace-nowrap scroll-smooth w-full">
          {(["posts", "wardrobes", "products", "saved"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`lg:px-4 py-3 cursor-pointer font-medium border-b-2 transition-colors capitalize ${
                activeTab === tab
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab === "posts" && "Posts"}
              {tab === "wardrobes" && "Wardrobes"}
              {tab === "products" && "Products"}
              {tab === "saved" && "Saved"}
            </button>
          ))}
        </div>

        {activeTab !== "saved" && (
          <Link
            href={
              activeTab === "posts"
                ? "/create-post"
                : activeTab === "wardrobes"
                  ? "/create-wardrobe"
                  : "/add-product"
            }
            className="w-full md:w-auto mt-5 md:mt-0 pb-3"
          >
            <Button className="w-full md:w-auto">
              <Plus className="w-4 h-4 mr-1" />
              {activeTab === "posts"
                ? "Create Post"
                : activeTab === "wardrobes"
                  ? "Create Wardrobe"
                  : "Add Product"}
            </Button>
          </Link>
        )}
      </div>

      {/* Tab Content */}

      {/* Posts */}
      {activeTab === "posts" && (
        <div>
          {posts.length === 0 ? (
            <Card className="p-12 text-center border-none">
              <p className="text-muted-foreground text-lg mb-4">No posts yet</p>
              <Link href="/create-post">
                <Button className="bg-primary hover:bg-primary/90">
                  Create Your First Post
                </Button>
              </Link>
            </Card>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} isOwner={true} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Wardrobes */}
      {activeTab === "wardrobes" && (
        <div>
          {wardrobes.length === 0 ? (
            <Card className="p-12 text-center border-none">
              <p className="text-muted-foreground text-lg mb-4">
                No wardrobes yet
              </p>
              <Link href="/create-wardrobe">
                <Button className="bg-primary hover:bg-primary/90">
                  Create Your First Wardrobe
                </Button>
              </Link>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {wardrobes.map((wardrobe) => (
                <WardrobeCard
                  key={wardrobe.wardrobeId}
                  wardrobe={wardrobe}
                  isOwner={true}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* My Products */}
      {activeTab === "products" && (
        <div>
          {shopProducts.length === 0 ? (
            <Card className="p-12 text-center border-none">
              <ShoppingBag className="w-10 h-10 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground text-lg mb-4">
                No products yet
              </p>
              <Link href="/add-product">
                <Button className="bg-primary hover:bg-primary/90">
                  Add Your First Product
                </Button>
              </Link>
            </Card>
          ) : (
            <>
              {/* Search bar */}
              <div className="relative w-full sm:w-56 lg:w-64 mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <Input
                  placeholder="Search products…"
                  value={productTabSearch}
                  onChange={(e) => setProductTabSearch(e.target.value)}
                  className="pl-9 h-9 text-sm"
                />
              </div>

              {filteredShopProducts.length === 0 ? (
                <p className="text-muted-foreground text-sm py-4">
                  No products match &ldquo;{productTabSearch}&rdquo;
                </p>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filteredShopProducts.map((product) => (
                    <ProductCard
                      key={product.productId}
                      product={product}
                      isOwner={true}
                      onDeleted={(id) =>
                        setShopProducts((prev) =>
                          prev.filter((p) => p.productId !== id),
                        )
                      }
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Saved Tab */}
      {activeTab === "saved" && (
        <div className="space-y-12">
          {/* Saved Products */}
          <section>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <SectionHeader
                title="Saved Products"
                showAll={showAllProducts}
                onToggle={handleSeeAllSavedProducts}
                hasMore={
                  !productSearch &&
                  (hasMoreSavedProducts || savedProducts.length > INITIAL_SHOW)
                }
              />
              {/* Search - only for products */}
              <div className="relative w-full sm:w-56 lg:w-64 shrink-0">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <Input
                  placeholder="Search saved products…"
                  value={productSearch}
                  onChange={(e) => {
                    setProductSearch(e.target.value);
                    // When the user types, reveal all matches automatically
                    setShowAllProducts(false);
                  }}
                  className="pl-9 h-9 text-sm"
                />
              </div>
            </div>

            {savedProducts.length === 0 ? (
              <Card className="p-8 text-center border-dashed">
                <ShoppingBag className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground text-sm">
                  No saved products yet. Tap the bookmark icon on any product to
                  save it here.
                </p>
              </Card>
            ) : filteredSavedProducts.length === 0 ? (
              <p className="text-muted-foreground text-sm py-4">
                No products match &ldquo;{productSearch}&rdquo;
              </p>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {displayedSavedProducts.map((product) => (
                    <ProductCard
                      key={product.productId}
                      product={product}
                      isOwner={false}
                    />
                  ))}
                </div>
              </>
            )}

            <div className="flex w-full justify-center items-center mt-5">
              {loadingMoreSavedProducts && <Spinner />}
            </div>
          </section>

          {/* Saved Posts */}
          <section>
            <SectionHeader
              title="Saved Posts"
              showAll={showAllPosts}
              onToggle={handleSeeAllSavedPosts}
              hasMore={hasMoreSavedPosts || savedPosts.length > INITIAL_SHOW}
            />

            {savedPosts.length === 0 ? (
              <Card className="p-8 text-center border-dashed">
                <Bookmark className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground text-sm">
                  No saved posts yet. Tap the bookmark icon on any post to save
                  it here.
                </p>
              </Card>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {displayedSavedPosts.map((post) => (
                  <PostCard key={post.id} post={post} isOwner={false} />
                ))}
              </div>
            )}

            <div className="flex w-full justify-center items-center mt-5">
              {loadingMoreSavedPosts && <Spinner />}
            </div>
          </section>

          {/* Saved Wardrobes */}
          <section>
            <SectionHeader
              title="Saved Wardrobes"
              showAll={showAllWardrobes}
              onToggle={handleSeeAllSavedWardrobes}
              hasMore={
                hasMoreSavedWardrobes || savedWardrobes.length > INITIAL_SHOW
              }
            />

            {savedWardrobes.length === 0 ? (
              <Card className="p-8 text-center border-dashed">
                <ShoppingBag className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground text-sm">
                  No saved wardrobes yet. Tap the bookmark icon on any wardrobe
                  to save it here.
                </p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayedSavedWardrobes.map((wardrobe) => (
                  <WardrobeCard
                    key={wardrobe.wardrobeId}
                    wardrobe={wardrobe}
                    isOwner={false}
                  />
                ))}
              </div>
            )}

            <div className="flex w-full justify-center items-center mt-5">
              {loadingMoreSavedWardrobes && <Spinner />}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
