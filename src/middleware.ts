import { getToken, decode } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const sessionToken = req.cookies.get("next-auth.session-token")?.value;

  console.log("Middleware Path:", url.pathname);
  console.log("Session Token:", sessionToken);

  // Check if the token exists in cookies
  if (!sessionToken) {
    console.log("No session token found in cookies.");
  } else {
    try {
      const decodedToken = await decode({
        token: sessionToken,
        secret: process.env.NEXTAUTH_SECRET as string
      });

      console.log("Decoded Token:", decodedToken);
    } catch (error) {
      if (error instanceof Error) {
        console.log("Error decoding token:", error.message);
      } else {
        console.log("Unexpected error:", error);
      }
    }
  }

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  console.log("Token from getToken:", token);

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
