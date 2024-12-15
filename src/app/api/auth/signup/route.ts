import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { encode } from "next-auth/jwt";
import sendMail from "@/lib/mail";
import { Prisma } from "@prisma/client";
import { getCoordinatesFromAddress } from "@/lib/utils.server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      email,
      password,
      firstName,
      lastName,
      role,
      phone,
      address,
      city,
      zipCode,
      restaurantName,
      restaurantAddress,
      restaurantCity,
      restaurantZipCode
    } = body;

    if (
      !email ||
      !password ||
      !firstName ||
      !lastName ||
      !role ||
      !phone ||
      !address ||
      !city ||
      !zipCode
    ) {
      console.error("Missing required fields:", {
        email,
        password,
        firstName,
        lastName,
        role,
        phone,
        address,
        city,
        zipCode
      });
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!["CUSTOMER", "PARTNER", "RESTAURANT"].includes(role)) {
      console.error("Invalid role:", role);
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    if (role === "RESTAURANT") {
      if (
        !restaurantName ||
        !restaurantAddress ||
        !restaurantCity ||
        !restaurantZipCode
      ) {
        return NextResponse.json(
          { error: "Missing required fields for restaurant" },
          { status: 400 }
        );
      }
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        {
          error:
            "User with this email already exists. If you've forgotten your password, you can reset it."
        },
        { status: 409 }
      );
    }

    if (process.env.NEXTAUTH_SECRET === undefined) {
      console.error("NEXTAUTH_SECRET is not set");
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUserData: Prisma.UserCreateInput = {
      email,
      password: hashedPassword,
      firstName,
      lastName,
      role,
      phone,
      address,
      city,
      zipCode,
      isVerified: false,
      verificationToken: Math.random().toString().slice(2, 8).padStart(6, "0")
    };

    if (role === "RESTAURANT") {
      const coordinates = await getCoordinatesFromAddress(
        `${restaurantAddress}, ${restaurantZipCode} ${restaurantCity}`
      );

      newUserData.restaurant = {
        create: {
          name: restaurantName,
          address: restaurantAddress,
          city: restaurantCity,
          zipCode: restaurantZipCode,
          latitude: coordinates?.lat || 0,
          longitude: coordinates?.lng || 0
        }
      };
    }

    console.log("Data being passed to prisma.user.create:", newUserData);

    const newUser = await prisma.user.create({
      data: newUserData
    });

    sendMail(
      newUser.email,
      "Verify your email",
      `Your verification token is: ${newUser.verificationToken}`
    );

    const session = await getServerSession(authOptions);
    if (!session) {
      const token = await encode({
        token: {
          id: newUser.id,
          email: newUser.email,
          role: newUser.role,
          isVerified: newUser.isVerified,
          isBlocked: newUser.isBlocked,
          isDeleted: newUser.isDeleted,
          firstName: newUser.firstName,
          lastName: newUser.lastName
        },
        secret: process.env.NEXTAUTH_SECRET
      });

      const response = NextResponse.json({
        message: "User created and logged in successfully",
        data: {
          id: newUser.id,
          email: newUser.email,
          role: newUser.role,
          isVerified: newUser.isVerified,
          firstName: newUser.firstName,
          lastName: newUser.lastName
        }
      });

      response.cookies.set("next-auth.session-token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        sameSite: "lax",
        path: "/"
      });

      return response;
    }

    return NextResponse.json(
      {
        message: "User created successfully",
        data: {
          id: newUser.id,
          email: newUser.email,
          role: newUser.role,
          isVerified: newUser.isVerified,
          firstName: newUser.firstName,
          lastName: newUser.lastName
        }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
