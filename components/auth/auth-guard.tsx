"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";

type AuthGuardProps = {
  children: React.ReactNode;
};

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const { isInitialized, status } = useAuthStore();

  useEffect(() => {
    if (isInitialized && status === "unauthenticated") {
      router.replace("/login");
    }
  }, [isInitialized, status, router]);

  if (!isInitialized || status === "loading") {
    return (
      <div className="flex min-h-full items-center justify-center bg-inside-content">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  if (status !== "authenticated") {
    return (
      <div className="flex min-h-full items-center justify-center bg-inside-content">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  return <>{children}</>;
}
