import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/utils.server";

export async function POST(req: NextRequest) {
  try {
    const { restaurantId, items } = await req.json();

    if (
      !restaurantId ||
      !items ||
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return NextResponse.json(
        { error: "Invalid input. Ensure restaurantId and items are provided." },
        { status: 400 }
      );
    }

    const user = await getUser(req);
    if (user instanceof NextResponse) {
      return user;
    }

    const restaurant = await prisma.restaurant.findUnique({
      where: { id: restaurantId },
      include: { owner: true, items: true }
    });

    if (
      !restaurant ||
      restaurant.isBlocked ||
      restaurant.owner?.isDeleted ||
      restaurant.owner?.isBlocked
    ) {
      return NextResponse.json(
        { error: "Restaurant not found or is currently unavailable." },
        { status: 404 }
      );
    }

    const totalPrice = items.reduce(
      (acc: number, item: { itemId: string; quantity: number }) => {
        const price = restaurant.items.find((i) => i.id === item.itemId)?.price;
        return acc + (price || 0) * item.quantity;
      },
      0
    );

    const order = await prisma.order.create({
      data: {
        customerId: user.id,
        restaurantId,
        totalPrice,
        items: {
          create: items.map((item: { itemId: string; quantity: number }) => ({
            itemId: item.itemId,
            quantity: item.quantity
          }))
        }
      },
      include: {
        items: {
          include: { item: true }
        }
      }
    });

    return NextResponse.json(
      {
        message: "Order placed successfully.",
        data: order
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error placing order:", error);
    return NextResponse.json(
      { error: "An error occurred while placing the order." },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const user = await getUser(req);
  if (user instanceof NextResponse) {
    return user;
  }

  const orders = await prisma.order.findMany({
    where: { customerId: user.id },
    include: { restaurant: true, items: { include: { item: true } } }
  });

  return NextResponse.json(
    {
      message: "Retrieved orders successfully.",
      data: orders
    },
    { status: 200 }
  );
}
