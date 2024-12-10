import { UserWithRestaurant } from "@/types/prisma";
import { Prisma } from "@prisma/client";
import { getToken } from "next-auth/jwt";
import { NextResponse, NextRequest } from "next/server";
import fetch from "node-fetch";
import { prisma } from "@/lib/prisma";

interface GeocodingResult {
  results: Array<{
    geometry: {
      location: {
        lat: number;
        lng: number;
      };
    };
  }>;
  status: string;
  error_message?: string;
}

export async function getCoordinatesFromAddress(
  address: string
): Promise<{ lat: number; lng: number } | null> {
  const apiKey = process.env.NEXT_PUBLIC_GEOCODING_API_KEY;
  if (!apiKey) {
    throw new Error("Google Maps API key is missing.");
  }

  const encodedAddress = encodeURIComponent(address);
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${apiKey}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.statusText}`);
    }

    const data = (await response.json()) as GeocodingResult;

    if (data.status === "OK" && data.results.length > 0) {
      const location = data.results[0].geometry.location;
      return {
        lat: location.lat,
        lng: location.lng
      };
    } else {
      console.error(
        "Error in Geocoding response:",
        data.status,
        data.error_message
      );
      return null;
    }
  } catch (error) {
    console.error("Error fetching coordinates:", error);
    return null;
  }
}

export async function getUser<IncludeRestaurant extends boolean = false>(
  req: NextRequest,
  includeRestaurant: IncludeRestaurant = false as IncludeRestaurant
): Promise<
  | (IncludeRestaurant extends true
      ? UserWithRestaurant
      : Prisma.UserGetPayload<{}>)
  | NextResponse
> {
  if (process.env.NEXTAUTH_SECRET === undefined) {
    console.error("NEXTAUTH_SECRET is not set");
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET
  });

  if (!token) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 403 });
  }

  const user = await prisma.user.findUnique({
    where: { id: token.id },
    include: includeRestaurant ? { restaurant: true } : undefined
  });

  if (!user) {
    return NextResponse.json(
      { error: `User ID ${token.id} not found in database` },
      { status: 404 }
    );
  }

  return user as IncludeRestaurant extends true
    ? UserWithRestaurant
    : Prisma.UserGetPayload<{}>;
}
