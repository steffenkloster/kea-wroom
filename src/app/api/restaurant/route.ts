import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/utils.server";
import { ItemDTO, RestaurantDTO } from "@/types";

export async function GET(req: NextRequest) {
  const user = await getUser(req);
  if (user instanceof NextResponse) return user;

  const restaurants = await prisma.restaurant.findMany({
    where: { isBlocked: false },
    include: { items: true }
  });

  const filteredRestaurants = restaurants.map((restaurant: RestaurantDTO) => {
    const items = restaurant.items.filter((item: ItemDTO) => !item.isBlocked);
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
