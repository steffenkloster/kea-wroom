import { NextResponse } from "next/server";
import sendMail from "@/lib/mail";
import { prisma } from "@/lib/prisma";

export async function PATCH({ params }: { params: { id: string } }) {
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

  const user = await prisma.user.findUnique({
    where: { id: item.restaurant.ownerId || "" }
  });

  if (!user) {
    return NextResponse.json(
      { error: "Restaurant owner not found" },
      { status: 404 }
    );
  }

  const updatedItem = await prisma.item.update({
    where: { id },
    data: {
      isBlocked: !item.isBlocked
    }
  });

  sendMail(
    user.email,
    `One of your items has been ${
      updatedItem.isBlocked ? "blocked" : "unblocked"
    }`,
    `Hello ${item.restaurant.name}. Your item <strong>"${
      item.name
    }"</strong> has been ${
      updatedItem.isBlocked ? "blocked" : "unblocked"
    } by administration. If you have questions, feel free to contact us at no-reply@wroom.dk.`
  );

  return NextResponse.json(
    { message: "Item block updated", data: updatedItem },
    { status: 200 }
  );
}
