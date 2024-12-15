import { Section } from "@/components/Section";
import { getTokenFromCookies } from "@/lib/utils.server";
import { cookies } from "next/headers";
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
