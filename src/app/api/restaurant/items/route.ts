import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { getUser } from "@/lib/utils.server";
import { prisma } from "@/lib/prisma";

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
  }
});

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

    // Upload files to S3
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

      const fileUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
      uploadedPaths.push(fileUrl);
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
