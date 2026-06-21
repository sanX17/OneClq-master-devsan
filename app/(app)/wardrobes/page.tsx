import WardrobesContent from "@/components/app/wardrobes-content";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Wardrobes",
  description: "Explore fashion collections from creators",
};

export default function WardrobesPage() {
  return <WardrobesContent />;
}
