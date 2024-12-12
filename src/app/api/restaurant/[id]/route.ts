import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/utils.server";

export async function GET(_: never, { params }: { params: { id: string } }) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json(
      { error: "Restaurant ID is required" },
      { status: 400 }
    );
  }

  const restaurant = await prisma.restaurant.findUnique({
    where: { id },
    include: { items: true }
  });

  if (!restaurant) {
    return NextResponse.json(
      { error: "Restaurant not found" },
      { status: 404 }
    );
  }

  if (restaurant.isBlocked) {
    return NextResponse.json(
      { error: "Restaurant is blocked" },
      { status: 403 }
    );
  }

  return NextResponse.json(
    {
      message: "Retrieved restaurant successfully",
      data: restaurant
    },
    { status: 200 }
  );
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json(
      { error: "Restaurant ID is required" },
      { status: 400 }
    );
  }

  const user = await getUser(req, true);
  if (user instanceof NextResponse) return user;

  const { name, description, address, city, zipCode } = await req.json();
  if (!name || !address || !city || !zipCode) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  const restaurant = await prisma.restaurant.findUnique({
    where: { id },
    include: { items: true }
  });

  if (!restaurant) {
    return NextResponse.json(
      { error: "Restaurant not found" },
      { status: 404 }
    );
  }

  if (restaurant.isBlocked) {
    return NextResponse.json(
      { error: "Restaurant is blocked" },
      { status: 403 }
    );
  }

  if (restaurant.ownerId !== user.id) {
    return NextResponse.json(
      { error: "You are not authorized to update this restaurant" },
      { status: 403 }
    );
  }

  const updatedRestaurant = await prisma.restaurant.update({
    where: { id },
    data: { name, description: description || "", address, city, zipCode }
  });

  return NextResponse.json(
    {
      message: "Updated restaurant successfully",
      data: updatedRestaurant
    },
    { status: 200 }
  );
}
