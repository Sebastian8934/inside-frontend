"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";

type GuestGuardProps = {
  children: React.ReactNode;
};

export function GuestGuard({ children }: GuestGuardProps) {
  const router = useRouter();
  const { isInitialized, status, accessToken } = useAuthStore();

  useEffect(() => {
    if (isInitialized && status === "authenticated" && accessToken) {
      router.replace("/");
    }
  }, [isInitialized, status, accessToken, router]);

  if (!isInitialized || status === "loading") {
    return (
      <div className="flex min-h-full items-center justify-center bg-inside-content">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  if (accessToken) {
    return null;
  }

  return <>{children}</>;
}
