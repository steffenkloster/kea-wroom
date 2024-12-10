import { NextResponse } from "next/server";
import { User } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const users = await prisma.user.findMany({});
  const sanitizedUsers = users.map(
    ({
      password: _password,
      verificationToken: _verificationToken,
      passwordResetToken: _passwordResetToken,
      ...rest
    }: User) => rest
  );

  return NextResponse.json(
    { message: "Retrieved users successfully", data: sanitizedUsers },
    { status: 200 }
  );
}
