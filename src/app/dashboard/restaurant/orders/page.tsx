import { Section } from "@/components/Section";
import OrdersGrid from "./OrdersGrid";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";

export const metadata = {
  title: "Orders - Restaurant Dashboard - Wroom",
  description: "View and manage the orders for your restaurant."
};

const RestaurantOrdersPage = () => {
  return (
    <Section>
      <Breadcrumb className="mb-3">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard/restaurant">
              Dashboard
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Orders</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <header className="flex justify-between">
        <div>
          <h1>Restaurant Orders</h1>
          <p>View and manage the orders for your restaurant.</p>
        </div>
      </header>

      <OrdersGrid />
    </Section>
  );
};

export default RestaurantOrdersPage;
