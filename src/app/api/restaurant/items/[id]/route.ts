import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import fs from "fs/promises";
import { getUser } from "@/lib/utils.server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json({ error: "Item ID is required" }, { status: 400 });
  }

  try {
    const user = await getUser(req);
    if (user instanceof NextResponse) return user;

    const item = await prisma.item.findUnique({
      where: { id },
      include: { restaurant: true }
    });

    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    if (item.restaurant.ownerId !== user.id) {
      return NextResponse.json(
        { error: "You are not authorized to delete this item" },
        { status: 403 }
      );
    }

    // Delete the item
    await prisma.item.delete({
      where: { id }
    });

    return NextResponse.json(
      { message: "Item deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting item:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json({ error: "Item ID is required" }, { status: 400 });
  }

  try {
    const user = await getUser(req);
    if (user instanceof NextResponse) return user;

    const item = await prisma.item.findUnique({
      where: { id },
      include: { restaurant: true }
    });

    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    if (item.restaurant.ownerId !== user.id) {
      return NextResponse.json(
        { error: "You are not authorized to get this item" },
        { status: 403 }
      );
    }

    return NextResponse.json({ data: item }, { status: 200 });
  } catch (error) {
    console.error("Error fetching item:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json({ error: "Item ID is required" }, { status: 400 });
  }

  try {
    const formData = await req.formData();

    const name = formData.get("name") as string | null;
    const description = formData.get("description") as string | null;
    const price = formData.get("price") as string | null;
    const files = formData.getAll("images") as File[];

    if (!name || !description || !price) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (files.length > 3) {
      return NextResponse.json(
        { error: "You can upload a maximum of 3 images" },
        { status: 400 }
      );
    }

    // Validate each file
    const validImageMimeTypes = ["image/jpeg", "image/png", "image/webp"];
    const invalidFiles = files.filter(
      (file) => !validImageMimeTypes.includes(file.type)
    );

    if (invalidFiles.length > 0) {
      return NextResponse.json(
        { error: "All uploaded files must be valid images (JPEG, PNG, WebP)" },
        { status: 400 }
      );
    }

    const user = await getUser(req, true);
    if (user instanceof NextResponse) return user;

    const restaurantId = user.restaurant?.id;
    if (!restaurantId) {
      return NextResponse.json(
        { error: "User does not own a restaurant" },
        { status: 403 }
      );
    }

    // Check if the item exists and belongs to the user's restaurant
    const existingItem = await prisma.item.findFirst({
      where: {
        id
      },
      include: { restaurant: true }
    });

    if (!existingItem) {
      return NextResponse.json(
        { error: "Item not found or does not belong to your restaurant" },
        { status: 404 }
      );
    }

    if (existingItem.restaurant.ownerId !== user.id) {
      return NextResponse.json(
        { error: "You are not authorized to get this item" },
        { status: 403 }
      );
    }

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadDir, { recursive: true });

    const uploadedPaths: string[] = [];
    for (const file of files) {
      const buffer = await file.arrayBuffer();
      const filePath = path.join(uploadDir, `${uuidv4()}-${file.name}`);
      await fs.writeFile(filePath, Buffer.from(buffer));
      uploadedPaths.push(`/uploads/${path.basename(filePath)}`);
    }

    const updatedItem = await prisma.item.update({
      where: { id },
      data: {
        name,
        description,
        price: parseFloat(price),
        images: uploadedPaths // existingItem.images
      }
    });

    return NextResponse.json(
      { message: "Item updated successfully", data: updatedItem },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating item:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
function uuidv4() {
  throw new Error("Function not implemented.");
}
