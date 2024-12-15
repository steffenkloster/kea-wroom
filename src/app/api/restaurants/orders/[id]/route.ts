import { getUser } from "@/lib/utils.server";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = await params;
  const user = await getUser(req, true);
  if (user instanceof NextResponse) return user;

  const { status } = await req.json();
  if (!status) {
    return NextResponse.json({ error: "Status is required" }, { status: 400 });
  }

  if (
    !["ACCEPTED", "PREPARING", "READY_FOR_PICKUP", "CANCELED"].includes(status)
  ) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const order = await prisma.order.findUnique({
    where: { id }
  });

  if (!order) {
    return NextResponse.json({ message: "Order not found" }, { status: 404 });
  }

  if (order.restaurantId !== user.restaurant?.id) {
    return NextResponse.json(
      { error: "This order doesn't belong to your restaurant" },
      { status: 403 }
    );
  }

  if (
    !["PENDING", "ACCEPTED", "PREPARING", "READY_FOR_PICKUP"].includes(
      order.status
    )
  ) {
    return NextResponse.json(
      { error: "Order status can't be updated" },
      { status: 400 }
    );
  }

  const updatedOrder = await prisma.order.update({
    where: { id },
    data: { status },
    include: { items: { include: { item: true } } }
  });

  return NextResponse.json(
    { message: "Order status updated successfully", data: updatedOrder },
    { status: 200 }
  );
}
