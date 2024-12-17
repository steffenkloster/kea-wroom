import { OrderDTO, RestaurantDTO } from "@/types";
import RestaurantPageOrder from "./OrderSummaryPage";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Item, OrderItem } from "@prisma/client";
import { getTokenFromCookies } from "@/lib/utils.server";
import { cookies } from "next/headers";
import OrderSummaryPage from "./OrderSummaryPage";

export async function generateMetadata({
  params
}: {
  params: { id: string };
}): Promise<Metadata> {
  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: { restaurant: true }
  });

  if (!order) {
    return {
      title: "Order not found - Wroom",
      description: "The requested order could not be found."
    };
  }

  return {
    title: `${order.id} - ${order.restaurant.name} - Wroom`,
    description: "Details about your order!"
  };
}

const RestaurantPage = async ({ params }: { params: { id: string } }) => {
  const { id } = await params;
  const cookieStore = await cookies();
  const token = await getTokenFromCookies(cookieStore);
  if (!token) {
    return redirect(`/login?path=${encodeURIComponent(`/order/${id}`)}`);
  }

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: {
        include: { item: true }
      },
      restaurant: true
    }
  });

  if (!order) {
    return redirect(`/dashboard`);
  }

  if (!order.restaurant) {
    return redirect(`/dashboard`);
  }

  if (order.customerId !== token.id) {
    return redirect(`/dashboard`);
  }

  const restaurantDTO = {
    id: order.restaurant.id,
    name: order.restaurant.name,
    description: order.restaurant.description,
    address: order.restaurant.address,
    zipCode: order.restaurant.zipCode,
    city: order.restaurant.city
  } as RestaurantDTO;

  const orderDTO = {
    id: order.id,
    items: order.items.map((orderItem) => ({
      id: orderItem.id,
      quantity: orderItem.quantity,
      createdAt: orderItem.createdAt,
      updatedAt: orderItem.updatedAt,
      order: {
        id: order.id,
        totalPrice: order.totalPrice,
        status: order.status,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt
      },
      item: {
        id: orderItem.item.id,
        restaurantId: orderItem.item.restaurantId,
        createdAt: orderItem.item.createdAt,
        updatedAt: orderItem.item.updatedAt,
        name: orderItem.item.name,
        description: orderItem.item.description,
        isBlocked: orderItem.item.isBlocked,
        price: orderItem.item.price,
        images: orderItem.item.images,
        restaurant: restaurantDTO
      }
    })),
    totalPrice: order.totalPrice,
    status: order.status,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt
  } as OrderDTO;

  return <OrderSummaryPage order={orderDTO} restaurant={restaurantDTO} />;
};

export default RestaurantPage;
