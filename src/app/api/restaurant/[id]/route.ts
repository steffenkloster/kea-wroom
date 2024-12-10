import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/utils.server";
import { Item, Restaurant } from "@prisma/client";
import { ItemDTO, RestaurantDTO } from "@/types";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json(
      { error: "Restaurant ID is required" },
      { status: 400 }
    );
  }

  const restaurant = await prisma.restaurant.findUnique({
    where: { id },
    include: { items: true }
  });

  if (!restaurant) {
    return NextResponse.json(
      { error: "Restaurant not found" },
      { status: 404 }
    );
  }

  if (restaurant.isBlocked) {
    return NextResponse.json(
      { error: "Restaurant is blocked" },
      { status: 403 }
    );
  }

  return NextResponse.json(
    {
      message: "Retrieved restaurant successfully",
      data: restaurant
    },
    { status: 200 }
  );
}
