import { NextResponse, NextRequest } from "next/server";
import { encode, getToken } from "next-auth/jwt";
import prisma from "@/lib/prisma";

export async function PATCH(req: NextRequest) {
  try {
    const { verificationToken } = await req.json();

    if (!verificationToken) {
      return NextResponse.json(
        { error: "Missing verification token" },
        { status: 400 }
      );
    }

    if (process.env.NEXTAUTH_SECRET === undefined) {
      console.error("NEXTAUTH_SECRET is not set");
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 }
      );
    }

    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
      cookieName: "next-auth.session-token",
      secureCookie: process.env.NODE_ENV === "production"
    });

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 403 });
    }

    const user = await prisma.user.findUnique({
      where: { id: token.id }
    });

    if (!user) {
      return NextResponse.json(
        { error: `Couldn't find ${token.id} user ID in Database` },
        { status: 500 }
      );
    }

    if (user.isVerified) {
      return NextResponse.json(
        { error: "User is already verified" },
        { status: 400 }
      );
    }

    if (user.verificationToken !== verificationToken) {
      return NextResponse.json(
        { error: "Invalid verification token" },
        { status: 401 }
      );
    }

    // Update user to be verified
    await prisma.user.update({
      where: { id: user.id },
      data: { isVerified: true, verificationToken: null }
    });

    const newToken = await encode({
      token: {
        ...token,
        isVerified: true
      },
      secret: process.env.NEXTAUTH_SECRET
    });

    const response = NextResponse.json({
      message: "Verification successful",
      data: {
        ...token,
        isVerified: true
      }
    });

    response.cookies.set("next-auth.session-token", newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      sameSite: "lax",
      path: "/"
    });

    return response;
  } catch (error) {
    console.error("Error during verify:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
