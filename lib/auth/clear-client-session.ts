import { getQueryClient } from "@/lib/query/query-client";
import { useAppStore } from "@/stores/app-store";
import { useAuthStore } from "@/stores/auth-store";

/** Limpia todo el estado de cliente tras logout o sesión inválida. */
export function clearClientSession() {
  getQueryClient().clear();
  useAppStore.getState().resetAppState();
  useAuthStore.getState().clearSession();
}
