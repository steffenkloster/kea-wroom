import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET
  });

  if (!token) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 403 });
  }

  return new NextResponse(null, {
    status: 204, // No Content
    headers: {
      "Set-Cookie": `next-auth.session-token=; HttpOnly; Secure; Path=/; Max-Age=0`
    }
  });
}
