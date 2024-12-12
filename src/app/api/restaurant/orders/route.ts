import { getUser } from "@/lib/utils.server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const user = await getUser(req, true);
  if (user instanceof NextResponse) return user;

  const restaurantId = user.restaurant?.id;
  if (!restaurantId) {
    return NextResponse.json(
      { error: "User does not own a restaurant" },
      { status: 403 }
    );
  }

  const restaurant = await prisma.restaurant.findUnique({
    where: { id: restaurantId },
    include: { orders: true }
  });

  if (!restaurant) {
    return NextResponse.json(
      { error: "User Restaurant not found" },
      { status: 404 }
    );
  }

  if (restaurant.ownerId !== user.id) {
    return NextResponse.json(
      { error: "User does not own the restaurant" },
      { status: 403 }
    );
  }

  return NextResponse.json(
    { message: "Retrieved orders successfully", data: restaurant.orders },
    { status: 200 }
  );
}
