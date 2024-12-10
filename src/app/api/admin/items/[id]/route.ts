import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = await params;

  const item = await prisma.item.findUnique({
    where: { id },
    include: {
      restaurant: true
    }
  });

  if (!item) {
    return NextResponse.json({ message: "Item not found" }, { status: 404 });
  }

  return NextResponse.json(
    { message: "Retrieved item successfully", data: item },
    { status: 200 }
  );
}
