import sendMail from "@/lib/mail";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
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

  const newVerificationToken = Math.random()
    .toString()
    .slice(2, 8)
    .padStart(6, "0");

  await prisma.user.update({
    where: { id: user.id },
    data: { verificationToken: newVerificationToken }
  });

  sendMail(
    user.email,
    "Verify your email",
    `Your verification token is: ${newVerificationToken}`
  );

  return NextResponse.json(
    { message: "Verification code sent" },
    { status: 200 }
  );
}
