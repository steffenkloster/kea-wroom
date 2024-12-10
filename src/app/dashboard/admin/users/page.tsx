import { Section } from "@/components/Section";
import { Button } from "@/components/ui/button";
import UsersGrid from "./UsersGrid";

const AdminUsersPage = () => {
  return (
    <Section>
      <header className="flex justify-between">
        <div>
          <h1>Manage users</h1>
          <p>
            Here you can view and manage all users. You can also block or
            unblock users.
          </p>
        </div>

        <Button disabled={true}>Add new user</Button>
        {/* <Button asChild>
          <Link href="/dashboard/restaurant/items/new">Add new user</Link>
        </Button> */}
      </header>

      <UsersGrid />
    </Section>
  );
};

export default AdminUsersPage;
