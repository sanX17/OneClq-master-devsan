"use client";

import { ArrowLeft } from "lucide-react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

export default function BackButton() {
  const router = useRouter();

  return (
    <Button
      onClick={() => router.back()}
      className="md:hidden flex items-center gap-2 bg-transparent hover:bg-transparent border rounded-full shadow-none text-primary hover:text-purple-600 mb-8"
    >
      <ArrowLeft className="w-4 h-4" />
      Back
    </Button>
  );
}
