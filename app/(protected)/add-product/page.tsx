import AddProductContent from "@/components/app/add-product-content";
import { Metadata } from "next";
export const metadata: Metadata = { title: "Add Product" };
export default function AddProductPage() {
  return <AddProductContent />;
}
