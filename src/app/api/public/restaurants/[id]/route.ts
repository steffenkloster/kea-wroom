import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(_: never, request: { params: { id: string } }) {
  const { id } = request.params;

  const restaurant = await prisma.restaurant.findUnique({
    where: {
      id: id,
      isBlocked: false,
      owner: {
        isBlocked: false,
        isDeleted: false
      }
    },
    include: { items: true }
  });

  if (!restaurant) {
    return {
      status: 404,
      body: {
        message: "Restaurant not found"
      }
    };
  }

  return NextResponse.json(
    { message: "Retrieved restaurant successfully", data: restaurant },
    { status: 200 }
  );
}
