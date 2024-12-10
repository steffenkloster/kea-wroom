import sendMail from "@/lib/mail";
import bcrypt from "bcrypt";
import { generateRandomString } from "@/lib/utils";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  if (!email) {
    return NextResponse.json({ error: "Missing email" }, { status: 400 });
  }

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET
  });

  if (token) {
    return NextResponse.json(
      { error: "Already authenticated" },
      { status: 403 }
    );
  }

  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user) {
    return NextResponse.json(
      { error: "No user associated with this e-mail address." },
      { status: 401 }
    );
  }

  const passwordResetToken = generateRandomString(32);
  await prisma.user.update({
    where: { id: user.id },
    data: { passwordResetToken }
  });

  sendMail(
    user.email,
    "Reset your password",
    `Click here to reset your password: <a href="${process.env.NEXTAUTH_URL}/login/forgot-password/${passwordResetToken}">${process.env.NEXTAUTH_URL}/login/forgot-password/${passwordResetToken}</a>`
  );

  return NextResponse.json(
    { message: "Password reset e-mail sent" },
    { status: 200 }
  );
}

export async function PATCH(req: NextRequest) {
  const { email, password, token } = await req.json();

  if (!email || !password || !token) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const userToken = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET
  });

  if (userToken) {
    return NextResponse.json(
      { error: "Already authenticated" },
      { status: 403 }
    );
  }

  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user) {
    return NextResponse.json(
      { error: "No user associated with this e-mail address." },
      { status: 401 }
    );
  }

  if (user.passwordResetToken !== token) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashedPassword, passwordResetToken: null }
  });

  return NextResponse.json(
    { message: "Password reset successful" },
    { status: 200 }
  );
}
