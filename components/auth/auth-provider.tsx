"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { initGuestAuth, restoreSession } from "@/lib/api/auth";
import { isGuestAuthPath } from "@/lib/auth/session-config";
import { useAuthStore } from "@/stores/auth-store";

/** Evita doble bootstrap con React Strict Mode (ref se resetea al remontar). */
let authBootstrapStarted = false;

type AuthProviderProps = {
  children: React.ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const pathname = usePathname();

  useEffect(() => {
    if (authBootstrapStarted || useAuthStore.getState().isInitialized) {
      return;
    }

    authBootstrapStarted = true;

    if (isGuestAuthPath(pathname)) {
      initGuestAuth();
      return;
    }

    void restoreSession();
  }, [pathname]);

  return <>{children}</>;
}
