import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const origins = searchParams.get("origins");
    const destinations = searchParams.get("destinations");

    if (!origins || !destinations) {
      return NextResponse.json(
        {
          error: "Missing required query parameters: origins and destinations"
        },
        { status: 400 }
      );
    }

    const apiKey = process.env.NEXT_PUBLIC_GEOCODING_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Google Maps API key is not configured" },
        { status: 500 }
      );
    }

    const apiUrl = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(
      origins
    )}&destinations=${encodeURIComponent(destinations)}&key=${apiKey}`;

    const response = await fetch(apiUrl);
    if (!response.ok) {
      console.error("Error fetching distance:", response.statusText);
      return NextResponse.json(
        { error: "Failed to fetch distance information" },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json(
      {
        message: "Distance fetched successfully",
        data
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching distance:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
