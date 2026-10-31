import { NextResponse, type NextRequest } from "next/server";
import { isLocale, localeCookieName, negotiateLocale } from "@/i18n/config";

/** Redirects locale-less URLs to the visitor's saved or preferred locale. */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const firstSegment = pathname.split("/")[1];
  if (isLocale(firstSegment)) return;

  const saved = request.cookies.get(localeCookieName)?.value;
  const locale = isLocale(saved) ? saved : negotiateLocale(request.headers.get("accept-language"));

  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    // Skip Next internals, API routes, PWA assets, and any file with an extension.
    "/((?!_next/|api/|pwa-icon/|sw\\.js$|manifest\\.webmanifest$|.*\\.[^/]+$).*)",
  ],
};
