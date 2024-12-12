import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  console.log("Middleware", url.pathname);
  console.log("Cookies in middleware:", req.cookies);
  console.log("Host:", req.headers.get("host"));
  console.log("NEXTAUTH_SECRET", process.env.NEXTAUTH_SECRET);
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  console.log("Token", token);
  const isAuthenticated = !!token;
  console.log("isAuthenticated", isAuthenticated);

  if (!isAuthenticated) {
    if (
      !url.pathname.startsWith("/login") &&
      !url.pathname.startsWith("/signup")
    ) {
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  const isVerified = token?.isVerified || false;

  if (!isVerified) {
    if (!url.pathname.startsWith("/login/verify")) {
      url.pathname = "/login/verify";
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  }

  if (url.pathname.startsWith("/login") || url.pathname.startsWith("/signup")) {
    url.pathname = `/dashboard/${token.role.toLowerCase()}`;
    return NextResponse.redirect(url);
  }

  if (url.pathname.startsWith("/dashboard")) {
    const urlParts = url.pathname.split("/");
    if (urlParts.length >= 3) {
      const role = urlParts[2];
      if (role !== token.role.toLowerCase()) {
        console.log("Role mismatch", role, token.role.toLowerCase());
        url.pathname = `/dashboard/${token.role.toLowerCase()}`;
        return NextResponse.redirect(url);
      }
    }

    return NextResponse.next();
  }

  if (url.pathname.startsWith("/api/admin")) {
    if (token.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/api/admin/:path*",
    "/admin/:path*",
    "/dashboard/:path*",
    "/login/:path*",
    "/signup",
    "/profile"
  ]
};
