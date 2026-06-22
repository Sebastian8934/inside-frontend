"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { initGuestAuth, restoreSession } from "@/lib/api/auth";
import { isGuestAuthPath } from "@/lib/auth/session-config";
import { useAuthStore } from "@/stores/auth-store";

type AuthProviderProps = {
  children: React.ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const pathname = usePathname();
  const isInitialized = useAuthStore((state) => state.isInitialized);

  useEffect(() => {
    if (isInitialized) return;

    if (isGuestAuthPath(pathname)) {
      initGuestAuth();
      return;
    }

    void restoreSession();
  }, [isInitialized, pathname]);

  return <>{children}</>;
}
