import { RestaurantDTO } from "@/types";
import RestaurantPageOrder from "./RestaurantPageOrder";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Item } from "@prisma/client";
import { getTokenFromCookies } from "@/lib/utils.server";
import { cookies } from "next/headers";

export async function generateMetadata({
  params
}: {
  params: { id: string };
}): Promise<Metadata> {
  const { id } = await params;

  const restaurant = await prisma.restaurant.findUnique({
    where: { id }
  });

  if (!restaurant) {
    return {
      title: "Restaurant not found - Wroom",
      description: "The requested restaurant could not be found."
    };
  }

  if (restaurant.isBlocked) {
    return {
      title: "Restaurant blocked - Wroom",
      description: "This restaurant is currently blocked."
    };
  }

  return {
    title: `${restaurant.name} - Order from Restaurant - Wroom`,
    description: restaurant.description || "Details about this restaurant."
  };
}

const RestaurantPage = async ({ params }: { params: { id: string } }) => {
  const { id } = await params;
  const cookieStore = await cookies();
  const token = await getTokenFromCookies(cookieStore);
  const isAuthenticated = !!token;

  const restaurant = await prisma.restaurant.findUnique({
    where: { id },
    include: {
      items: {
        where: { isBlocked: false }
      }
    }
  });

  if (!restaurant) {
    return redirect(`/dashboard`);
  }

  if (restaurant.isBlocked) {
    return redirect(`/dashboard`);
  }

  const restaurantDTO = {
    id: restaurant.id,
    name: restaurant.name,
    description: restaurant.description,
    address: restaurant.address,
    zipCode: restaurant.zipCode,
    city: restaurant.city,
    latitude: restaurant.latitude,
    longitude: restaurant.longitude,
    isBlocked: restaurant.isBlocked,
    createdAt: restaurant.createdAt,
    updatedAt: restaurant.updatedAt,
    items: restaurant.items.map((item: Item) => ({
      id: item.id,
      name: item.name,
      description: item.description,
      price: item.price,
      images: item.images,
      isBlocked: item.isBlocked,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt
    }))
  } as RestaurantDTO;

  return (
    <RestaurantPageOrder
      isAuthenticated={isAuthenticated}
      restaurant={restaurantDTO}
    />
  );
};

export default RestaurantPage;
