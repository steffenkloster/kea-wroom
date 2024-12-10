import { NextRequest, NextResponse } from "next/server";
import { User } from "@prisma/client";

export async function GET(req: NextRequest) {
  const users = await prisma.user.findMany({});
  const sanitizedUsers = users.map(
    ({ password, verificationToken, passwordResetToken, ...rest }: User) => rest
  );

  return NextResponse.json(
    { message: "Retrieved users successfully", data: sanitizedUsers },
    { status: 200 }
  );
}
