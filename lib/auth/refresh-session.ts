import { applySession, refreshSessionRequest } from "@/lib/api/auth";
import { clearClientSession } from "@/lib/auth/clear-client-session";

let refreshPromise: Promise<boolean> | null = null;

/**
 * Renueva la sesión con el refresh token (cookie httpOnly).
 * Serializa llamadas concurrentes (axios 401 + monitor de sesión).
 */
export async function tryRefreshSession(): Promise<boolean> {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      try {
        const data = await refreshSessionRequest();
        applySession(data);
        return true;
      } catch {
        clearClientSession();
        return false;
      } finally {
        refreshPromise = null;
      }
    })();
  }

  return refreshPromise;
}
