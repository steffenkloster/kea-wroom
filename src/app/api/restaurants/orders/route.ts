import { getUser } from "@/lib/utils.server";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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

  const orders = await prisma.order.findMany({
    where: { restaurantId, status: { notIn: ["CANCELED", "COMPLETED"] } },
    include: { items: { include: { item: true } } },
    orderBy: { createdAt: "desc" }
  });

  return NextResponse.json(
    { message: "Retrieved orders successfully", data: orders },
    { status: 200 }
  );
}
