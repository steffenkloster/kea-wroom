import { DashboardGrid, PartnerOrderCard } from "@/components/DashboardGrid";
import { Section } from "@/components/Section";
import prisma from "@/lib/prisma";
import { getTokenFromCookies } from "@/lib/utils.server";
import { cookies } from "next/headers";

import { AlertCircle } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { OrderStatus } from "@prisma/client";
import { OrderDTO } from "@/types";
import PartnerGrid from "./PartnerGrid";

export const metadata = {
  title: "Restaurant Dashboard - Wroom",
  description:
    "Manage your restaurant orders and items in the restaurant dashboard."
};

const RestaurantDashboardPage = async () => {
  const cookieStore = await cookies();
  const token = await getTokenFromCookies(cookieStore);
  if (!token) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: token.id },
    include: {
      deliveries: true
    }
  });

  if (!user || !user.deliveries) {
    return null;
  }

  const activeDelivery = user.deliveries.find(
    (delivery) =>
      !["PENDING", "COMPLETED", "CANCELED"].includes(delivery.status)
  );

  const availableOrders = await prisma.order.findMany({
    where: {
      status: OrderStatus.PENDING
    }
  });

  const availableOrdersDTO = availableOrders.map(
    (order) =>
      ({
        id: order.id,
        totalPrice: order.totalPrice,
        status: order.status,
        pickupTime: order.pickupTime,
        deliveryTime: order.deliveryTime,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt
      } as OrderDTO)
  );

  return (
    <>
      <Section>
        <header>
          <h1>Partner Dashboard</h1>
          <p>
            Here you can see and manage your current delivery, or accept new
            ones.
          </p>
        </header>
      </Section>

      <PartnerGrid userId={token.id} />
    </>
  );
};

export default RestaurantDashboardPage;
