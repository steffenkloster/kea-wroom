import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const items = await prisma.item.findMany({
    include: {
      restaurant: true
    }
  });

  return NextResponse.json(
    { message: "Retrieved items successfully", data: items },
    { status: 200 }
  );
}
