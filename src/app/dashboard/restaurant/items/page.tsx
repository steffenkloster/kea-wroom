import { Section } from "@/components/Section";
import { buttonVariants } from "@/components/ui/button";
import ItemsGrid from "./ItemsGrid";
import Link from "next/link";

export const metadata = {
  title: "Items - Restaurant Dashboard - Wroom",
  description:
    "Manage your restaurant details and items in the restaurant dashboard."
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
