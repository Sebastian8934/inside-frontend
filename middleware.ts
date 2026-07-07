import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  hasAuthCookies,
  isGuestAuthPath,
} from "@/lib/auth/session-config";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  const authenticated = hasAuthCookies(request.headers.get("cookie"));
  const isGuest = isGuestAuthPath(pathname);

  // Solo proteger rutas privadas. No redirigir /login → / por cookies:
  // cookies inválidas causaban bucle login ↔ home y pantalla en blanco.
  if (!isGuest && !authenticated) {
    const loginUrl = new URL("/login", request.url);
    if (pathname !== "/") {
      loginUrl.searchParams.set("from", pathname);
    }
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
