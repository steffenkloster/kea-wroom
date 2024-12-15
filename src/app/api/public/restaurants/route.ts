import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const restaurants = await prisma.restaurant.findMany({
    where: {
      isBlocked: false,
      owner: {
        isBlocked: false,
        isDeleted: false
      }
    }
    //include: { items: true }
  });

  return NextResponse.json(
    { message: "Retrieved restaurants successfully", data: restaurants },
    { status: 200 }
  );
}
