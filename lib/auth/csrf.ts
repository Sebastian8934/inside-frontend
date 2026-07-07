import {
  CSRF_COOKIE_NAME,
  CSRF_HEADER_NAME,
} from "@/lib/auth/session-config";

const UNSAFE_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);

export function getCsrfTokenFromDocument(): string | null {
  if (typeof document === "undefined") {
    return null;
  }

  const match = document.cookie.match(
    new RegExp(`(?:^|; )${CSRF_COOKIE_NAME}=([^;]*)`),
  );

  return match ? decodeURIComponent(match[1]) : null;
}

export function applyCsrfHeader(
  headers: Record<string, string>,
  method?: string,
): Record<string, string> {
  if (!method || !UNSAFE_METHODS.has(method.toUpperCase())) {
    return headers;
  }

  const token = getCsrfTokenFromDocument();

  if (token) {
    headers[CSRF_HEADER_NAME] = token;
  }

  return headers;
}

export { CSRF_HEADER_NAME };
