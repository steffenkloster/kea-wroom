import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client"; // Import Prisma namespace

export async function GET() {
  const users = await prisma.user.findMany({});
  const sanitizedUsers = users.map(
    ({
      password: _password,
      verificationToken: _verificationToken,
      passwordResetToken: _passwordResetToken,
      ...rest
    }: Prisma.UserGetPayload<object>) => rest
  );

  return NextResponse.json(
    { message: "Retrieved users successfully", data: sanitizedUsers },
    { status: 200 }
  );
}
