import { DashboardGrid, DashboardCard } from "@/components/DashboardGrid";
import { Section } from "@/components/Section";

const AdminDashboardPage = () => {
  return (
    <Section>
      <header>
        <h1>Admin Dashboard</h1>
        <p>Here you can manage all of Wroom! Crazy stuff, right?!</p>
      </header>

      <DashboardGrid>
        <DashboardCard
          header="Users"
          text="View and manage all users."
          link="/dashboard/admin/users"
        />
        {/* <DashboardCard
          header="Restaurants"
          text="View and manage all restaurants."
          link="/dashboard/admin/restaurants"
        /> */}
        <DashboardCard
          header="Items"
          text="View and manage all items."
          link="/dashboard/admin/items"
        />
      </DashboardGrid>
    </Section>
  );
};

export default AdminDashboardPage;
