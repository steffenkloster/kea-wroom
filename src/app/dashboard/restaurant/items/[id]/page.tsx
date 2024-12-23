import { Section } from "@/components/Section";
import EditItemForm from "./EditItemForm";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";

export const metadata = {
  title: "Edit Item - Restaurant Dashboard - Wroom",
  description: "Edit information about a specific item in your restaurant."
};

const EditItemPage = () => {
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
            <BreadcrumbPage>Edit item</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <header>
        <h1>Edit item</h1>
      </header>
      <EditItemForm />
    </Section>
  );
};

export default EditItemPage;
