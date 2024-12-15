import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { getUser } from "@/lib/utils.server";
import { prisma } from "@/lib/prisma";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
  }
});

export async function DELETE(
  req: NextRequest,
  { params }: { params: { itemId: string } }
) {
  const { itemId } = await params;

  if (!itemId) {
    return NextResponse.json({ error: "Item ID is required" }, { status: 400 });
  }

  try {
    const user = await getUser(req, true);
    if (user instanceof NextResponse) return user;

    const item = await prisma.item.findUnique({
      where: { id: itemId },
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
      where: { id: itemId }
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
  { params }: { params: { itemId: string } }
) {
  const { itemId } = await params;

  if (!itemId) {
    return NextResponse.json({ error: "Item ID is required" }, { status: 400 });
  }

  try {
    const user = await getUser(req);
    if (user instanceof NextResponse) return user;

    const item = await prisma.item.findUnique({
      where: { id: itemId },
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
  { params }: { params: { itemId: string } }
) {
  const { itemId } = await params;

  if (!itemId) {
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
        id: itemId
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

    // Upload images to S3
    const uploadedPaths: string[] = [];
    for (const file of files) {
      const buffer = await file.arrayBuffer();
      const key = `uploads/${uuidv4()}-${file.name}`;

      await s3.send(
        new PutObjectCommand({
          Bucket: process.env.AWS_S3_BUCKET_NAME!,
          Key: key,
          Body: Buffer.from(buffer),
          ContentType: file.type
        })
      );

      const imageUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
      uploadedPaths.push(imageUrl);
    }

    const updatedItem = await prisma.item.update({
      where: { id: itemId },
      data: {
        name,
        description,
        price: parseFloat(price),
        images: uploadedPaths // Use uploaded image URLs
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
