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
  // const cookieStore = await cookies();
  // const token = await getTokenFromCookies(cookieStore);
  // if (!token) {
  //   return null;
  // }

  // const user = await prisma.user.findUnique({
  //   where: { id: token.id },
  //   include: {
  //     restaurant: true
  //   }
  // });

  // if (!user || !user.restaurant) {
  //   return null;
  // }

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
