import { getUser } from "@/lib/utils.server";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";
import { sanitizeUser } from "@/lib/sanitize";

interface UpdateData {
  firstName?: string;
  lastName?: string;
  phone?: string;
  password?: string;
  address?: string;
  city?: string;
  zipCode?: string;
}

export const GET = async (req: NextRequest) => {
  const user = await getUser(req, true);
  if (user instanceof NextResponse) return user;

  const sanitizedUser = sanitizeUser(user);

  return NextResponse.json(
    { message: "Retrieved user successfully", data: sanitizedUser },
    { status: 200 }
  );
};

export const PATCH = async (req: NextRequest) => {
  const user = await getUser(req, true);
  if (user instanceof NextResponse) return user;

  const body = await req.json();
  if (!body) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const allowedFields: (keyof UpdateData)[] = [
    "firstName",
    "lastName",
    "phone",
    //"email",
    "password",
    "address",
    "city",
    "zipCode"
  ];

  const updateData: Partial<UpdateData> = {};

  for (const key of Object.keys(body)) {
    if (allowedFields.includes(key as keyof UpdateData)) {
      if (key === "password") {
        updateData[key] = await bcrypt.hash(body[key], 10);
      } else {
        updateData[key as keyof UpdateData] = body[key];
      }
    }
  }

  if (Object.keys(updateData).length === 0) {
    return NextResponse.json(
      { error: "No valid fields to update" },
      { status: 400 }
    );
  }

  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: body
  });

  const sanitizedUser = sanitizeUser(updatedUser);

  return NextResponse.json(
    { message: "User updated successfully", data: sanitizedUser },
    { status: 200 }
  );
};

export async function DELETE(req: NextRequest) {
  try {
    const user = await getUser(req);
    if (user instanceof NextResponse) return user;

    const { password } = await req.json();
    if (!password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ error: "Invalid password" }, { status: 409 });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        isDeleted: true
      }
    });

    return NextResponse.json(
      { message: "User deleted" },
      {
        status: 200,
        headers: {
          "Set-Cookie": `next-auth.session-token=; HttpOnly; Secure; Path=/; Max-Age=0`
        }
      }
    );
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
