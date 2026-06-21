import ProductsContent from "@/components/app/products-content";
import { Metadata } from "next";

export const metadata: Metadata = { title: "Products" };

export default function ProductsPage() {
  return <ProductsContent />;
}
