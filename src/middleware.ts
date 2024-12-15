import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

const isAuthorized = (role: string, path: string): boolean => {
  if (path.startsWith("/api/admin") && role !== "ADMIN") return false;
  if (path.startsWith("/api/restaurants") && role !== "RESTAURANT")
    return false;
  if (path.startsWith("/api/customers") && role !== "CUSTOMER") return false;
  if (path.startsWith("/api/partners") && role !== "PARTNER") return false;
  return true;
};

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
    cookieName: "next-auth.session-token",
    secureCookie: process.env.NODE_ENV === "production"
  });

  const isAuthenticated = !!token;

  if (!isAuthenticated) {
    if (
      !url.pathname.startsWith("/login") &&
      !url.pathname.startsWith("/signup")
    ) {
      console.log(`[Middleware] Unauthenticated access to: ${url.pathname}`);
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  const isVerified = token?.isVerified || false;

  if (!isVerified) {
    if (
      !url.pathname.startsWith("/login/verify") ||
      url.pathname.startsWith("/api/auth")
    ) {
      console.log(`[Middleware] Unverified user access to: ${url.pathname}`);
      url.pathname = "/login/verify";
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  }

  if (url.pathname.startsWith("/login") || url.pathname.startsWith("/signup")) {
    url.pathname = `/dashboard/${token.role.toLowerCase()}`;
    return NextResponse.redirect(url);
  }

  if (
    url.pathname.startsWith("/dashboard") &&
    !url.pathname.startsWith(`/dashboard/${token.role.toLowerCase()}`)
  ) {
    console.log(`[Middleware] Role mismatch redirecting to: ${url.pathname}`);
    url.pathname = `/dashboard/${token.role.toLowerCase()}`;
    return NextResponse.redirect(url);
  }

  if (
    url.pathname.startsWith("/api") &&
    !isAuthorized(token.role, url.pathname)
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/api/admin/:path*",
    "/api/restaurants/:path*",
    "/api/customers/:path*",
    "/api/partners/:path*",
    "/admin/:path*",
    "/dashboard/:path*",
    "/login/:path*",
    "/signup/:path*",
    "/profile"
  ]
};
