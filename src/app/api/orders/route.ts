import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
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

    if (!user || user.role !== "CUSTOMER") {
      return NextResponse.json(
        { error: "You must be authenticated as a customer to place an order." },
        { status: 403 }
      );
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

    const order = await prisma.order.create({
      data: {
        customerId: user.id,
        restaurantId,
        totalPrice: items.reduce(
          (acc: number, item: { id: string; quantity: number }) => {
            const price = restaurant.items.find((i) => i.id === item.id)?.price;
            return acc + (price || 0) * item.quantity;
          },
          0
        ),
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
