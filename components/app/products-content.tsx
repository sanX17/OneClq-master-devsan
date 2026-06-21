"use client";

import { useState, useEffect, useRef } from "react";
import { getProducts } from "@/lib/firebase-actions";
import { ShopProduct } from "@/lib/typings";
import ProductCard from "./product-card";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus, Search, ShoppingBag } from "lucide-react";
import { Input } from "../ui/input";

export default function ProductsContent() {
  const [products, setProducts] = useState<ShopProduct[]>([]);
  const [results, setResults] = useState<ShopProduct[]>([]);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts().then((r) => {
      if (r.success) {
        setProducts(r.products);
        setResults(r.products);
      }
      setLoading(false);
    });
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setResults(products);
      return;
    }
    const lower = query.toLowerCase();
    setResults(
      products.filter(
        (p) =>
          p.title.toLowerCase().includes(lower) ||
          p.platform?.toLowerCase().includes(lower) ||
          p.username.toLowerCase().includes(lower),
      ),
    );
  }, [query, products]);

  if (loading) {
    return (
      <div className="min-h-[90vh] lg:min-h-[80vh] flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="min-h-[90vh] lg:min-h-[80vh] flex flex-col items-center justify-center gap-5">
        <ShoppingBag className="w-12 h-12 text-muted-foreground" />
        <p className="text-muted-foreground font-medium text-lg">
          No products yet
        </p>
        <Link href="/add-product">
          <Button size="lg">
            <Plus className="w-4 h-4 mr-1" /> Add a Product
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col max-w-7xl lg:mx-auto mx-5 gap-6 pt-6 pb-30 lg:pb-10 lg:pt-10">
      <div className="flex justify-between items-center">
        <h1 className="font-semibold text-3xl">Products</h1>

        <div className="flex justify-end items-center gap-5 w-full">
          {/* Search bar */}
          {/* <Button
            variant="secondary"
            size="default"
            onClick={() => router.push("/search")}
            className="hidden lg:flex text-foreground/60"
          >
            <Search className="w-4 h-4" /> Search Products
          </Button> */}
          <div className="hidden lg:flex relative w-100">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              ref={inputRef}
              placeholder="Search products by name, platform, or creator..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10 h-10 text-base"
            />
          </div>
          <Link href="/add-product">
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4" /> Add Product
            </Button>
          </Link>
        </div>
      </div>

      {/* Search bar Mobile */}
      {/* <Button
        variant="secondary"
        size="default"
        onClick={() => router.push("/search")}
        className="lg:hidden text-foreground/60"
      >
        <Search className="w-4 h-4" /> Search Products
      </Button> */}

      <div className="lg:hidden relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          ref={inputRef}
          placeholder="Search products by name, platform, or creator..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10 h-12 text-base"
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Spinner />
        </div>
      ) : results.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-muted-foreground text-lg">
            {query ? `No results for "${query}"` : "No products yet"}
          </p>
        </div>
      ) : (
        <>
          {query && (
            <p className="text-sm text-muted-foreground mb-4">
              {results.length} result{results.length !== 1 ? "s" : ""} for "
              {query}"
            </p>
          )}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {results.map((product) => (
              <ProductCard key={product.productId} product={product} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
