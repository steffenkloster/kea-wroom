import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/utils.server";

export async function GET(req: NextRequest) {
  const user = await getUser(req, true);
  if (user instanceof NextResponse) return user;

  if (!user.restaurant) {
    return NextResponse.json(
      {
        message: "User has no restaurant"
      },
      { status: 403 }
    );
  }

  return NextResponse.json(
    {
      message: "Retrieved restaurants successfully",
      data: user.restaurant
    },
    { status: 200 }
  );
}
