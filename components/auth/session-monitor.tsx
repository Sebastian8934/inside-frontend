"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { logoutSession } from "@/lib/api/auth";
import { tryRefreshSession } from "@/lib/auth/refresh-session";
import {
  SESSION_CHECK_INTERVAL_MS,
  SESSION_REFRESH_BEFORE_MS,
  SESSION_WARN_BEFORE_MS,
} from "@/lib/auth/session-config";
import { useAuthStore } from "@/stores/auth-store";

function getMsUntilExpiry(expiresAt: string): number {
  return new Date(expiresAt).getTime() - Date.now();
}

function formatMinutes(ms: number): number {
  return Math.max(1, Math.ceil(ms / 60_000));
}

export function SessionMonitor() {
  const router = useRouter();
  const status = useAuthStore((state) => state.status);
  const expiresAt = useAuthStore((state) => state.expiresAt);
  const warnedRef = useRef(false);
  const expiryHandledRef = useRef(false);

  useEffect(() => {
    warnedRef.current = false;
    expiryHandledRef.current = false;
  }, [expiresAt]);

  useEffect(() => {
    if (status !== "authenticated" || !expiresAt) {
      return;
    }

    async function handleExpiry() {
      if (expiryHandledRef.current) return;
      expiryHandledRef.current = true;

      toast.error("Tu sesión ha expirado. Inicia sesión nuevamente.");
      await logoutSession();
      router.replace("/login");
    }

    async function extendSession(manual = false) {
      const renewed = await tryRefreshSession();

      if (renewed) {
        warnedRef.current = false;
        if (manual) {
          toast.success("Sesión extendida correctamente.");
        }
        return;
      }

      await handleExpiry();
    }

    async function checkSession() {
      if (!expiresAt) return;

      const msUntilExpiry = getMsUntilExpiry(expiresAt);

      if (msUntilExpiry <= 0) {
        await handleExpiry();
        return;
      }

      if (msUntilExpiry <= SESSION_WARN_BEFORE_MS && !warnedRef.current) {
        warnedRef.current = true;
        const minutes = formatMinutes(msUntilExpiry);

        toast.warning(`Tu sesión expira en ${minutes} minuto(s).`, {
          duration: Infinity,
          action: {
            label: "Mantener sesión",
            onClick: () => {
              void extendSession(true);
            },
          },
        });
        return;
      }

      if (msUntilExpiry <= SESSION_REFRESH_BEFORE_MS) {
        await extendSession(false);
      }
    }

    void checkSession();
    const intervalId = window.setInterval(() => {
      void checkSession();
    }, SESSION_CHECK_INTERVAL_MS);

    return () => window.clearInterval(intervalId);
  }, [status, expiresAt, router]);

  return null;
}
