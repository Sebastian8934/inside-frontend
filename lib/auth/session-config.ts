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
