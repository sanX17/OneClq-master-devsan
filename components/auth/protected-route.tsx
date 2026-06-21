"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Spinner } from "@/components/ui/spinner";

export const dynamic = "force-dynamic";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathName = usePathname();

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.push(`/${pathName.slice(1)}`);
      } else {
        router.push("/login");
      }
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-[90vh] lg:min-h-[80vh] flex items-center justify-center bg-background">
        <Spinner />
      </div>
    );
  }

  return children;
}
