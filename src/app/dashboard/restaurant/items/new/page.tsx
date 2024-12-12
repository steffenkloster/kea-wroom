import { Section } from "@/components/Section";
import AddItemForm from "./AddItemForm";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";

export const metadata = {
  title: "Add New Item - Restaurant Dashboard - Wroom",
  description: "Create and add a new item to your restaurant's menu."
};

const AddItemPage = () => {
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
            <BreadcrumbLink href="/dashboard/restaurant/items">
              Items
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Add new item</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <header>
        <h1>Add new item</h1>
      </header>
      <AddItemForm />
    </Section>
  );
};

export default AddItemPage;
