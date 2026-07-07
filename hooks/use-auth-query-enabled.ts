"use client";

import { useAuthStore } from "@/stores/auth-store";

/** Solo ejecutar queries cuando hay sesión activa (cookies + store). */
export function useAuthQueryEnabled(extraCondition = true) {
  const status = useAuthStore((state) => state.status);
  return status === "authenticated" && extraCondition;
}
