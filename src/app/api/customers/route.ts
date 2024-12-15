import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { encode } from "next-auth/jwt";
import sendMail from "@/lib/mail";
import { Prisma } from "@prisma/client";
import { getCoordinatesFromAddress, getUser } from "@/lib/utils.server";
import { sanitizeUser } from "@/lib/sanitize";

export async function GET(req: NextRequest) {
  const user = await getUser(req, true);
  if (user instanceof NextResponse) return user;

  const sanitizedUser = sanitizeUser(user);

  return NextResponse.json({
    message: "User retrieved successfully",
    data: sanitizedUser
  });
}

export async function PATCH(req: NextRequest) {
  try {
    const user = await getUser(req);
    if (user instanceof NextResponse) return user;

    const { password } = await req.json();
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);

      await prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword, passwordResetToken: null }
      });

      return NextResponse.json(
        { message: "Updated password" },
        { status: 200 }
      );
    }

    const { firstName, lastName, phone, address, city, zipCode } =
      await req.json();

    if (!firstName || !lastName || !phone || !address || !city || !zipCode) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        firstName,
        lastName,
        phone,
        address,
        city,
        zipCode
      }
    });

    return NextResponse.json(
      { message: "User updated", data: updatedUser },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
