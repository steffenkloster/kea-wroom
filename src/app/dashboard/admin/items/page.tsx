import { Section } from "@/components/Section";
import { buttonVariants } from "@/components/ui/button";
import ItemsGrid from "./ItemsGrid";
import Link from "next/link";

export const metadata = {
  title: "Items - Admin Dashboard - Wroom",
  description: "Manage items in the admin dashboard of Wroom."
};

const RestaurantItemsPage = () => {
  return (
    <Section>
      <header className="flex justify-between">
        <div>
          <h1>Restaurant Items</h1>
          <p>
            Manage the items on your restaurant&apos;s menu. Add, update, or
            remove.
          </p>
        </div>

        <Link
          href="/dashboard/restaurant/items/new"
          className={buttonVariants({ variant: "default" })}
        >
          Add new item
        </Link>
      </header>

      <ItemsGrid />
    </Section>
  );
};

export default RestaurantItemsPage;
