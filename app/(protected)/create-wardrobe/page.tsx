import CreateWardrobeContent from "@/components/app/create-wardrobe-content";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Wardrobe",
  description: "Create a new wardrobe",
};

export default function CreateWardrobePage() {
  return <CreateWardrobeContent />;
}
