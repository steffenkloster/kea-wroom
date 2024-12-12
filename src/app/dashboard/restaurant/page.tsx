import { DashboardGrid, DashboardCard } from "@/components/DashboardGrid";
import { Section } from "@/components/Section";

export const metadata = {
  title: "Restaurant Dashboard - Wroom",
  description:
    "Manage your restaurant orders and items in the restaurant dashboard."
};

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
