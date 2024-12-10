import { UserDTO } from "@/types";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const isAuthenticated = !!token;

    if (!isAuthenticated) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 403 });
    }

    const user = await prisma.user.findUnique({
      where: { id: token.id }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userDTO: UserDTO = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      role: user.role,
      address: user.address,
      city: user.city,
      zipCode: user.zipCode,
      isVerified: user.isVerified,
      isBlocked: user.isBlocked,
      restaurant: user.restaurant,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };

    return NextResponse.json(
      { message: "User retrieved", data: userDTO },
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

export async function PATCH(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const isAuthenticated = !!token;

    if (!isAuthenticated) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 403 });
    }

    const user = await prisma.user.findUnique({
      where: { id: token.id }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

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
      where: { id: token.id },
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

export async function DELETE(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const isAuthenticated = !!token;

    if (!isAuthenticated) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 403 });
    }

    const user = await prisma.user.findUnique({
      where: { id: token.id }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { password } = await req.json();
    if (!password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ error: "Invalid password" }, { status: 409 });
    }

    await prisma.user.update({
      where: { id: token.id },
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