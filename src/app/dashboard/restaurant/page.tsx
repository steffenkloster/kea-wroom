import { DashboardGrid, DashboardCard } from "@/components/DashboardGrid";
import { Section } from "@/components/Section";
import prisma from "@/lib/prisma";
import { getTokenFromCookies } from "@/lib/utils.server";
import { cookies } from "next/headers";

import { AlertCircle } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

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
    include: { restaurant: true }
  });

  if (!user?.restaurant) {
    return null;
  }

  return (
    <Section>
      {user.restaurant.isBlocked && (
        <Alert variant="destructive" className="mb-3">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Your restaurant is blocked</AlertTitle>
          <AlertDescription>
            Your restaurant is currently blocked. Please contact support to
            resolve this issue.
          </AlertDescription>
        </Alert>
      )}

      <header>
        <h1>Restaurant Dashboard</h1>
        <p>
          Here you can manage your restaurant, view orders, and update your
          items.
        </p>
      </header>

      <DashboardGrid>
        <DashboardCard
          header="Orders"
          text="View and manage your orders."
          link="/dashboard/restaurant/orders"
          disabled={user.restaurant.isBlocked}
        />
        <DashboardCard
          header="Items"
          text="Update your restaurant's items."
          link="/dashboard/restaurant/items"
          disabled={user.restaurant.isBlocked}
        />
      </DashboardGrid>
    </Section>
  );
};

export default RestaurantDashboardPage;
