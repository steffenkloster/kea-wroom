import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/utils.server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json(
      { error: "Order ID is required" },
      { status: 400 }
    );
  }

  try {
    const user = await getUser(req);
    if (user instanceof NextResponse) return user;

    const order = await prisma.order.findUnique({
      where: { id },
      include: { restaurant: true }
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (order.customerId !== user.id) {
      return NextResponse.json(
        { error: "You are not authorized to get this order" },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { message: "Order retrieved successfully", data: order },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
