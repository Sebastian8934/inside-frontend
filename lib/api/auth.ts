import type { ApiResponse } from "@/types/api";
import type { LoginResponse, UserInfo } from "@/types/auth";
import { normalizeRoleIds } from "@/config/roles";
import {
  clearSessionMarker,
  markSessionActive,
} from "@/lib/auth/session-marker";
import { useAuthStore } from "@/stores/auth-store";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { API_BASE_URL } from "@/lib/api/constants";
import { ApiError } from "@/lib/api/errors";

async function parseJsonResponse<T>(response: Response): Promise<ApiResponse<T>> {
  try {
    return (await response.json()) as ApiResponse<T>;
  } catch {
    throw new ApiError("Respuesta inválida del servidor.", response.status);
  }
}

export async function loginRequest(
  email: string,
  password: string,
): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.auth.login}`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const payload = await parseJsonResponse<LoginResponse>(response);

  if (!response.ok || !payload.success || !payload.data) {
    throw new ApiError(
      payload.message ?? "No se pudo iniciar sesión.",
      response.status,
      payload.errors ? [...payload.errors] : undefined,
    );
  }

  return payload.data;
}

export async function refreshSessionRequest(): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.auth.refresh}`, {
    method: "POST",
    credentials: "include",
  });

  const payload = await parseJsonResponse<LoginResponse>(response);

  if (!response.ok || !payload.success || !payload.data) {
    throw new ApiError(
      payload.message ?? "No se pudo renovar la sesión.",
      response.status,
      payload.errors ? [...payload.errors] : undefined,
    );
  }

  return payload.data;
}

export async function logoutRequest(): Promise<void> {
  const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.auth.logout}`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    const payload = await parseJsonResponse<null>(response);
    throw new ApiError(
      payload.message ?? "No se pudo cerrar la sesión.",
      response.status,
      payload.errors ? [...payload.errors] : undefined,
    );
  }
}

export async function meRequest(): Promise<UserInfo> {
  const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.auth.me}`, {
    method: "GET",
    credentials: "include",
  });

  const payload = await parseJsonResponse<UserInfo>(response);

  if (!response.ok || !payload.success || !payload.data) {
    throw new ApiError(
      payload.message ?? "No se pudo obtener el usuario.",
      response.status,
      payload.errors ? [...payload.errors] : undefined,
    );
  }

  return payload.data;
}

export function applySession(data: LoginResponse) {
  const user: UserInfo = {
    ...data.user,
    roles: normalizeRoleIds(data.user.roles),
  };

  markSessionActive();
  useAuthStore.getState().setSession(data.expiresAt, user);
}

/** Inicializa la pantalla de login sin intentar refresh. */
export function initGuestAuth(): void {
  const store = useAuthStore.getState();
  store.setStatus("unauthenticated");
  store.setInitialized(true);
}

/**
 * Restaura sesión desde cookies httpOnly (refresh + access token).
 * Solo se invoca en rutas protegidas, nunca en /login.
 */
export async function restoreSession(): Promise<boolean> {
  const store = useAuthStore.getState();
  store.setStatus("loading");

  try {
    const data = await refreshSessionRequest();
    applySession(data);
    return true;
  } catch {
    clearSessionMarker();
    store.clearSession();
    return false;
  } finally {
    store.setInitialized(true);
  }
}

export async function logoutSession(): Promise<void> {
  try {
    await logoutRequest();
  } finally {
    clearSessionMarker();
    useAuthStore.getState().clearSession();
  }
}
