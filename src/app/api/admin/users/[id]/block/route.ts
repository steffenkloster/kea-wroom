import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/utils.server";
import { User } from "@prisma/client";
import sendMail from "@/lib/mail";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = await params;
  const user = await prisma.user.findUnique({
    where: { id }
  });

  const ownUser = await getUser(req);
  if (ownUser instanceof NextResponse) return ownUser;

  if (ownUser.id === id) {
    return NextResponse.json(
      { error: "You cannot block or unblock yourself" },
      { status: 400 }
    );
  }

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const updatedUser = await prisma.user.update({
    where: { id },
    data: {
      isBlocked: !user.isBlocked
    }
  });

  sendMail(
    updatedUser.email,
    `Your account has been ${updatedUser.isBlocked ? "blocked" : "unblocked"}`,
    `Hello ${updatedUser.firstName}. Your account has been ${
      updatedUser.isBlocked ? "blocked" : "unblocked"
    } by administration. If you have questions, feel free to contact us at no-reply@wroom.dk.`
  );

  return NextResponse.json(
    { message: "User block updated", data: updatedUser },
    { status: 200 }
  );
}
