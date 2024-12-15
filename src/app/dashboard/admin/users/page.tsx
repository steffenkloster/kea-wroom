import { Section } from "@/components/Section";
import { Button } from "@/components/ui/button";
import UsersGrid from "./UsersGrid";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";

export const metadata = {
  title: "Users - Admin Dashboard - Wroom",
  description: "Manage users in the admin dashboard of Wroom."
};

const AdminUsersPage = () => {
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
            <BreadcrumbPage>Users</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <header className="flex justify-between mb-3">
        <div>
          <h1>Manage users</h1>
          <p>
            Here you can view and manage all users. You can also block or
            unblock users.
          </p>
        </div>

        <Button disabled={true}>Add new user</Button>
      </header>

      <UsersGrid />
    </Section>
  );
};

export default AdminUsersPage;
