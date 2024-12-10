import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import fs from "fs/promises";
import { PrismaClient } from "@prisma/client";
import { getUser } from "@/lib/utils.server";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
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

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadDir, { recursive: true });

    const uploadedPaths: string[] = [];
    for (const file of files) {
      const buffer = await file.arrayBuffer();
      const filePath = path.join(uploadDir, `${uuidv4()}-${file.name}`);
      await fs.writeFile(filePath, Buffer.from(buffer));
      uploadedPaths.push(`/uploads/${path.basename(filePath)}`);
    }

    const newItem = await prisma.item.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        images: uploadedPaths,
        restaurant: {
          connect: { id: restaurantId }
        }
      }
    });

    return NextResponse.json(
      { message: "Item created successfully", item: newItem },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error creating item:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const user = await getUser(req, true);
  if (user instanceof NextResponse) return user;

  const restaurantId = user.restaurant?.id;
  if (!restaurantId) {
    return NextResponse.json(
      { error: "User does not own a restaurant" },
      { status: 403 }
    );
  }

  const restaurant = await prisma.restaurant.findUnique({
    where: { id: restaurantId }
  });

  if (!restaurant) {
    return NextResponse.json(
      { error: "User Restaurant not found" },
      { status: 404 }
    );
  }

  if (restaurant.ownerId !== user.id) {
    return NextResponse.json(
      { error: "User does not own the restaurant" },
      { status: 403 }
    );
  }

  const items = await prisma.item.findMany({
    where: { restaurantId }
  });

  return NextResponse.json(
    { message: "Retrieved items successfully", data: items },
    { status: 200 }
  );
}
