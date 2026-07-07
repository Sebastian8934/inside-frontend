import type { ApiResponse } from "@/types/api";
import type { LoginResponse, UserInfo } from "@/types/auth";
import { normalizeRoleIds } from "@/config/roles";
import { clearClientSession } from "@/lib/auth/clear-client-session";
import { tryRefreshSession } from "@/lib/auth/refresh-session";
import { useAuthStore } from "@/stores/auth-store";
import { applyCsrfHeader } from "@/lib/auth/csrf";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { API_BASE_URL } from "@/lib/api/constants";
import { ApiError } from "@/lib/api/errors";
import {
  loginResponseSchema,
  parseLoginResponse,
  parseUserInfo,
  userInfoSchema,
} from "@/lib/validation/auth.schema";
import type { z } from "zod";
import { parseApiData } from "@/lib/validation/parse-api-data";

async function parseJsonResponse(response: Response): Promise<ApiResponse<unknown>> {
  try {
    return (await response.json()) as ApiResponse<unknown>;
  } catch {
    throw new ApiError("Respuesta inválida del servidor.", response.status);
  }
}

async function fetchAuthData<T>(
  url: string,
  init: RequestInit,
  schema: z.ZodType<T>,
  errorFallback: string,
): Promise<T> {
  const response = await fetch(url, {
    credentials: "include",
    ...init,
  });

  const payload = await parseJsonResponse(response);

  if (!response.ok || !payload.success || payload.data === undefined) {
    throw new ApiError(
      payload.message ?? errorFallback,
      response.status,
      payload.errors ? [...payload.errors] : undefined,
    );
  }

  return parseApiData(schema, payload.data, errorFallback);
}

export async function loginRequest(
  email: string,
  password: string,
): Promise<LoginResponse> {
  return fetchAuthData(
    `${API_BASE_URL}${API_ENDPOINTS.auth.login}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    },
    loginResponseSchema,
    "No se pudo iniciar sesión.",
  );
}

export async function refreshSessionRequest(): Promise<LoginResponse> {
  return fetchAuthData(
    `${API_BASE_URL}${API_ENDPOINTS.auth.refresh}`,
    { method: "POST" },
    loginResponseSchema,
    "No se pudo renovar la sesión.",
  );
}

export async function logoutRequest(): Promise<void> {
  const headers = applyCsrfHeader(
    { "Content-Type": "application/json" },
    "POST",
  );

  const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.auth.logout}`, {
    method: "POST",
    credentials: "include",
    headers,
  });

  if (!response.ok) {
    const payload = await parseJsonResponse(response);
    throw new ApiError(
      payload.message ?? "No se pudo cerrar la sesión.",
      response.status,
      payload.errors ? [...payload.errors] : undefined,
    );
  }
}

export async function meRequest(): Promise<UserInfo> {
  const user = await fetchAuthData(
    `${API_BASE_URL}${API_ENDPOINTS.auth.me}`,
    { method: "GET" },
    userInfoSchema,
    "No se pudo obtener el usuario.",
  );

  return {
    ...user,
    roles: normalizeRoleIds(user.roles),
  };
}

export function applySession(data: LoginResponse) {
  const user: UserInfo = {
    ...data.user,
    roles: normalizeRoleIds(data.user.roles),
  };

  const store = useAuthStore.getState();
  store.setSession(data.expiresAt, user);
  store.setInitialized(true);
}

/** Inicializa /login sin intentar refresh (evita bucle login ↔ home). */
export function initGuestAuth(): void {
  const store = useAuthStore.getState();

  if (store.status !== "authenticated") {
    store.setStatus("unauthenticated");
  }

  store.setInitialized(true);
}

/**
 * Restaura sesión desde cookies httpOnly. Solo en rutas protegidas.
 */
export async function restoreSession(): Promise<boolean> {
  const store = useAuthStore.getState();

  if (store.status === "authenticated" && store.user) {
    store.setInitialized(true);
    return true;
  }

  store.setStatus("loading");

  try {
    return await tryRefreshSession();
  } finally {
    useAuthStore.getState().setInitialized(true);
  }
}

export async function logoutSession(): Promise<void> {
  try {
    await logoutRequest();
  } finally {
    clearClientSession();
  }
}

// Re-export parsers for tests or external use
export { parseLoginResponse, parseUserInfo };
