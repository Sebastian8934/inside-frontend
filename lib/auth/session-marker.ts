const SESSION_MARKER_KEY = "inside_session_active";

export function markSessionActive(): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(SESSION_MARKER_KEY, "1");
}

export function clearSessionMarker(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(SESSION_MARKER_KEY);
}

export function hasSessionMarker(): boolean {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(SESSION_MARKER_KEY) === "1";
}
