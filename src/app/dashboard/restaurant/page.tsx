import { DashboardGrid, DashboardCard } from "@/components/DashboardGrid";
import { Section } from "@/components/Section";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

const RestaurantDashboardPage = () => {
  return (
    <Section>
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
        />
        <DashboardCard
          header="Items"
          text="Update your restaurant's items."
          link="/dashboard/restaurant/items"
        />
      </DashboardGrid>
    </Section>
  );
};

export default RestaurantDashboardPage;
