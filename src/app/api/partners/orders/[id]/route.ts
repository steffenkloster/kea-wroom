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
    !["WAITING_FOR_PICKUP", "IN_TRANSIT", "COMPLETED", "CANCELED"].includes(
      status
    )
  ) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const order = await prisma.order.findUnique({
    where: { id }
  });

  if (!order) {
    return NextResponse.json({ message: "Order not found" }, { status: 404 });
  }

  if (order.courierId && order.courierId !== user.id) {
    return NextResponse.json(
      { error: "This order doesn't belong to you" },
      { status: 403 }
    );
  }

  if (
    !["READY_FOR_PICKUP", "WAITING_FOR_PICKUP", "IN_TRANSIT"].includes(
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
    data: { status, courierId: user.id },
    include: { items: { include: { item: true } } }
  });

  return NextResponse.json(
    { message: "Order status updated successfully", data: updatedOrder },
    { status: 200 }
  );
}
