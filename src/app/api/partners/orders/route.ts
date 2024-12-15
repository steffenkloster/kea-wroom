import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/utils.server";

export async function GET(req: NextRequest) {
  try {
    const user = await getUser(req);
    if (user instanceof NextResponse) {
      return user;
    }

    const orders = await prisma.order.findMany({
      where: {
        OR: [{ status: "READY_FOR_PICKUP" }, { courierId: user.id }]
      },
      include: {
        items: {
          include: { item: true }
        },
        restaurant: true,
        courier: {
          select: {
            id: true
          }
        },
        customer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            address: true,
            city: true,
            zipCode: true
          }
        }
      }
    });

    return NextResponse.json(
      { message: "Retrieved orders successfully", data: orders },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching orders." },
      { status: 500 }
    );
  }
}
