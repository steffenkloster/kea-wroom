import { Section } from "@/components/Section";
import ItemsGrid from "./ItemsGrid";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";

export const metadata = {
  title: "Items - Admin Dashboard - Wroom",
  description: "Manage items in the admin dashboard of Wroom."
};

const RestaurantItemsPage = () => {
  return (
    <Section>
      <Breadcrumb className="mb-3">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard/admin">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Items</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <header className="flex justify-between mb-3">
        <div>
          <h1>Restaurant Items</h1>
          <p>
            Manage the items on your restaurant&apos;s menu. Add, update, or
            remove.
          </p>
        </div>
      </header>

      <ItemsGrid />
    </Section>
  );
};

export default RestaurantItemsPage;
