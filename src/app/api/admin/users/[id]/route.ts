import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/utils.server";
import { User } from "@prisma/client";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = await params;

  const user = await prisma.user.findUnique({
    where: { id }
  });

  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  const { password, ...sanitizedUser } = user;

  return NextResponse.json(
    { message: "Retrieved user successfully", data: sanitizedUser },
    { status: 200 }
  );
}

// export async function PUT(
//   req: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   const { id } = await params;
//   const user = await prisma.user.findUnique({
//     where: { id }
//   });

//   if (!user) {
//     return NextResponse.json({ message: "User not found" }, { status: 404 });
//   }

//   const { body } = req;
//   const { password, ...rest } = body;

//   const updatedUser = await prisma.user.update({
//     where: { id },
//     data: rest
//   });

//   return NextResponse.json(
//     { message: "Updated user successfully", data: updatedUser },
//     { status: 200 }
//   );
// }
