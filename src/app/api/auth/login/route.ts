import { NextResponse, NextRequest } from "next/server";
import bcrypt from "bcrypt";
import prisma from "@/lib/prisma";
import { encode, getToken } from "next-auth/jwt";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: "Missing email or password" },
        { status: 400 }
      );
    }

    const currentToken = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET
    });

    if (currentToken) {
      return NextResponse.json(
        { error: "Already authenticated" },
        { status: 403 }
      );
    }

    // Fetch user from the database
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Check if the user is active
    if (user.isDeleted) {
      return NextResponse.json(
        { error: "This account has been deactivated" },
        { status: 403 }
      );
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    if (process.env.NEXTAUTH_SECRET === undefined) {
      console.error("NEXTAUTH_SECRET is not set");
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 }
      );
    }

    const token = await encode({
      token: {
        id: user.id,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        firstName: user.firstName,
        lastName: user.lastName
      },
      secret: process.env.NEXTAUTH_SECRET
    });

    const response = NextResponse.json(
      {
        message: "Login successful",
        data: {
          id: user.id,
          email: user.email,
          role: user.role,
          isVerified: user.isVerified,
          firstName: user.firstName,
          lastName: user.lastName
        }
      },
      { status: 200 }
    );

    response.cookies.set("next-auth.session-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/"
    });

    // Respond with the token
    return response;
  } catch (error) {
    console.error("Error during login:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
