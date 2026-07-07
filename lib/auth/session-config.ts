/** Nombres de cookies de sesión (HttpOnly, seteadas por el API). */
export const AUTH_COOKIE_NAMES = {
  access: "inside_access_token",
  refresh: "inside_refresh_token",
} as const;

export const CSRF_COOKIE_NAME = "inside_csrf";
export const CSRF_HEADER_NAME = "X-XSRF-TOKEN";

/** Renovar access token cuando falten estos ms para expirar. */
export const SESSION_REFRESH_BEFORE_MS = 5 * 60 * 1000;

/** Mostrar aviso al usuario cuando falten estos ms. */
export const SESSION_WARN_BEFORE_MS = 2 * 60 * 1000;

/** Intervalo de revisión del monitor de sesión. */
export const SESSION_CHECK_INTERVAL_MS = 30 * 1000;

export const GUEST_AUTH_PATHS = ["/login"] as const;

export function isGuestAuthPath(pathname: string): boolean {
  return GUEST_AUTH_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );
}

/** Indica si la request trae señal de sesión (para middleware Next.js). */
export function hasAuthCookies(cookieHeader: string | null | undefined): boolean {
  if (!cookieHeader) {
    return false;
  }

  // Las cookies JWT (access/refresh) usan Path=/api o /api/auth: el navegador NO las
  // incluye en GET /, /login ni peticiones RSC (?_rsc=). Solo viajan a /api/*.
  // La cookie CSRF (Path=/) se emite en login/logout junto con la sesión.
  if (cookieHeader.includes(`${CSRF_COOKIE_NAME}=`)) {
    return true;
  }

  return (
    cookieHeader.includes(`${AUTH_COOKIE_NAMES.access}=`) ||
    cookieHeader.includes(`${AUTH_COOKIE_NAMES.refresh}=`)
  );
}
