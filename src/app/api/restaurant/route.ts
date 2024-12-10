import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/utils.server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function GET(req: NextRequest) {
  const user = await getUser(req);
  if (user instanceof NextResponse) return user;

  type RestaurantWithItems = Prisma.RestaurantGetPayload<{
    include: { items: true };
  }>;

  const restaurants: RestaurantWithItems[] = await prisma.restaurant.findMany({
    where: { isBlocked: false },
    include: { items: true }
  });

  const filteredRestaurants = restaurants.map((restaurant) => {
    const items = restaurant.items.filter((item) => !item.isBlocked);
    return { ...restaurant, items };
  });

  return NextResponse.json(
    {
      message: "Retrieved restaurants successfully",
      data: filteredRestaurants
    },
    { status: 200 }
  );
}
