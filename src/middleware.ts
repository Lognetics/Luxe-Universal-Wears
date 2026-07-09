import { NextResponse, type NextRequest } from "next/server";

/**
 * Gate /admin routes on the presence of the admin cookie. Full signature
 * verification happens in the admin layout + every server action (Node
 * runtime). /admin/login is always reachable.
 */
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname === "/admin/login") return NextResponse.next();

  const hasCookie = Boolean(req.cookies.get("luxe_admin")?.value);
  if (!hasCookie) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
