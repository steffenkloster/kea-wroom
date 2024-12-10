import { NextResponse } from "next/server";

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
