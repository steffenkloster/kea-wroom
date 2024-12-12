import { Section } from "@/components/Section";
import EditItemForm from "./EditItemForm";

export const metadata = {
  title: "Edit Item - Restaurant Dashboard - Wroom",
  description: "Edit information about a specific item in your restaurant."
};

const EditItemPage = () => {
  return (
    <Section>
      <header>
        <h1>Edit item</h1>
      </header>
      <EditItemForm />
    </Section>
  );
};

export default EditItemPage;
