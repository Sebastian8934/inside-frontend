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
  const { isInitialized, status } = useAuthStore();

  useEffect(() => {
    if (isInitialized && status === "authenticated") {
      router.replace("/");
    }
  }, [isInitialized, status, router]);

  if (!isInitialized || status === "loading") {
    return (
      <div className="flex min-h-dvh w-full items-center justify-center bg-inside-content">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  if (status === "authenticated") {
    return null;
  }

  return <>{children}</>;
}
