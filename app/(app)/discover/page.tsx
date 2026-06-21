import DiscoverContent from "@/components/app/discover-content";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Discover",
  description: "Discover fashion collections from creators",
};

export default function DiscoverPage() {
  return <DiscoverContent />;
}
